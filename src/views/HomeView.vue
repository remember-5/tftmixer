<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { presets as presetsData } from '@/data/presets'
import { tracks as tracksData } from '@/data/tracks'
import { traits as traitsData } from '@/data/traits'
import { otherTracks as otherTracksData } from '@/data/otherTracks'
import type { Track, Trait } from '@/data/traits'
import type { Preset } from '@/data/presets'

/**
 * 音频状态
 */
interface AudioState {
  context: AudioContext | null
  masterGainNode: GainNode | null
  sourceArray: AudioBufferSourceNode[]
  audioGainArray: GainNode[]
  audio_buffers: AudioBuffer[]
  playingArray: boolean[]
  endedArray: boolean[]
  endedCallbackArray: (() => void)[]
}

/**
 * 初始化音频状态
 */
const audioState = ref<AudioState>({
  context: null,
  masterGainNode: null,
  sourceArray: [],
  audioGainArray: [],
  audio_buffers: [],
  playingArray: [],
  endedArray: [],
  endedCallbackArray: [],
})

const loading = ref<ReturnType<typeof ElLoading.service> | null>(null)
const globalVolume = ref(100) // components default to 100 if not set (use value must between 0-1)
const isRealTimeEnabled = ref(false) // 开启实时模式
const isRepeatEnabled = ref(false) // 开启重复播放
const exportDialogVisible = ref(false)
const importDialogVisible = ref(false)
const importText = ref('')
const selectedTracks = ref<string[]>([]) // 选中的轨道

/**
 * 使用导入的数据
 */
const presets = ref<Preset[]>(presetsData)
const tracks = ref<string[]>(tracksData)
const traits = ref<Trait[]>(traitsData)
const otherTracks = ref<Track[]>(otherTracksData)
const selectedOtherTracks = ref<string[]>([])

/**
 * 早期音轨
 */
const earlyTracks = computed(() => {
  const trackSet = new Set()
  traits.value.forEach((trait) => {
    trait.tracks.forEach((track) => {
      if (track.class === 'early') {
        trackSet.add(track.id)
      }
    })
  })
  return Array.from(trackSet)
})

/**
 * 晚期音轨
 */
const lateTracks = computed(() => {
  const trackSet = new Set()
  traits.value.forEach((trait) => {
    trait.tracks.forEach((track) => {
      if (track.class === 'late') {
        trackSet.add(track.id)
      }
    })
  })
  return Array.from(trackSet)
})

/**
 * 播放选中的音轨
 */
const playSelectedTracks = async () => {
  // 先停止当前正在播放的音轨
  stopAllTracks()

  loading.value = ElLoading.service({
    text: '加载音轨中...',
  })

  // 重置音频上下文
  audioState.value.context = new AudioContext()
  audioState.value.masterGainNode = audioState.value.context.createGain()
  audioState.value.masterGainNode.connect(audioState.value.context.destination)
  audioState.value.masterGainNode.gain.value = globalVolume.value / 100

  // 获取所有选中的音轨
  const playlist = [...selectedTracks.value]
  const loadPromises = []

  // 加载音频文件
  for (let i = 0; i < playlist.length; i++) {
    const trackId = playlist[i]
    const track = traits.value.flatMap((t) => t.tracks).find((t) => t.id === trackId)

    if (!track) continue

    const response = await fetch(track.src)
    const arrayBuffer = await response.arrayBuffer()

    loadPromises.push(
      audioState.value.context.decodeAudioData(arrayBuffer).then((audioBuffer) => {
        audioState.value.audio_buffers[i] = audioBuffer
        audioState.value.sourceArray[i] = audioState.value.context!.createBufferSource()
        audioState.value.sourceArray[i].buffer = audioBuffer
        audioState.value.audioGainArray[i] = audioState.value.context!.createGain()
        audioState.value.sourceArray[i].connect(audioState.value.audioGainArray[i])
        audioState.value.audioGainArray[i].connect(audioState.value.masterGainNode!)
        audioState.value.audioGainArray[i].gain.value = 1
        audioState.value.sourceArray[i].loop = isRepeatEnabled.value

        audioState.value.endedArray[i] = false
        audioState.value.playingArray[i] = false

        audioState.value.sourceArray[i].onended = () => {
          audioState.value.endedArray[i] = true
          audioState.value.playingArray[i] = false
          if (audioState.value.endedCallbackArray[i]) {
            audioState.value.endedCallbackArray[i]()
          }
        }
      }),
    )
  }

  try {
    await Promise.all(loadPromises)
    startPlayback()
  } catch (error) {
    ElMessage.error('加载音频时出错：' + (error as Error).message)
  } finally {
    loading.value?.close()
  }
}

/**
 * 开始播放
 */
const startPlayback = () => {
  audioState.value.sourceArray.forEach((source, i) => {
    if (source && !audioState.value.playingArray[i]) {
      source.start(0)
      audioState.value.playingArray[i] = true
    }
  })
}

/**
 * 停止所有音轨
 */
const stopAllTracks = () => {
  if (audioState.value.sourceArray) {
    audioState.value.sourceArray.forEach((source) => {
      if (source) {
        try {
          source.stop()
        } catch {
          // 忽略已经停止的音轨
        }
      }
    })
  }
  audioState.value.sourceArray = []
  audioState.value.audioGainArray = []
  audioState.value.playingArray = []
  audioState.value.endedArray = []
  if (audioState.value.context) {
    audioState.value.context.close()
  }
}

/**
 * 设置全局音量
 */
const setGlobalVolume = (value: number) => {
  if (audioState.value.masterGainNode) {
    audioState.value.masterGainNode.gain.value = value / 100
  }
}

/**
 * 设置实时模式
 */
const setRealTime = () => {
  isRealTimeEnabled.value = !isRealTimeEnabled.value
}

/**
 * 设置重复播放
 */
const setRepeat = () => {
  isRepeatEnabled.value = !isRepeatEnabled.value
  if (audioState.value.sourceArray) {
    audioState.value.sourceArray.forEach((source) => {
      if (source) {
        source.loop = isRepeatEnabled.value
      }
    })
  }
}

/**
 * 随机选择音轨
 */
const randomSelectTracks = (trackSelector = '') => {
  // 清除现有选择
  traits.value.forEach((trait) => {
    trait.selectedId = []
  })
  selectedOtherTracks.value = []

  let availableTracks
  if (trackSelector === 'early') {
    availableTracks = earlyTracks.value
  } else if (trackSelector === 'late') {
    availableTracks = lateTracks.value
  } else {
    availableTracks = tracks.value
  }

  // 随机选择1-5个音轨
  const numTracks = Math.floor(Math.random() * 5) + 1
  const selectedIndices = new Set<number>()

  while (selectedIndices.size < numTracks) {
    const randomIndex = Math.floor(Math.random() * availableTracks.length)
    selectedIndices.add(randomIndex)
  }

  selectedIndices.forEach((index) => {
    const trackId = availableTracks[index] as string
    // 查找音轨所属的特质
    for (const trait of traits.value) {
      const track = trait.tracks.find((t) => t.id === trackId)
      if (track) {
        trait.selectedId.push(trackId)
        return
      }
    }
    // 如果是其他音轨
    const otherTrack = otherTracks.value.find((t) => t.id === trackId)
    if (otherTrack) {
      selectedOtherTracks.value.push(trackId)
    }
  })
}

/**
 * 随机选择早期音轨
 */
const randomSelectEarlyTracks = () => {
  randomSelectTracks('early')
}

/**
 * 随机选择晚期音轨
 */
const randomSelectLateTracks = () => {
  randomSelectTracks('late')
}

/**
 * 清除所有选择
 */
const clearAllSelections = () => {
  traits.value.forEach((trait) => {
    trait.selectedId = []
  })
  selectedOtherTracks.value = []
}

/**
 * 生成分享链接
 */
const generateShareableLink = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('tracks', JSON.stringify(selectedTracks.value))
  navigator.clipboard.writeText(url.toString())
  const notification = document.getElementById('copyNotification')
  if (notification) {
    notification.style.display = 'block'
    setTimeout(() => {
      notification.style.display = 'none'
    }, 2000)
  }
}

/**
 * 应用预设
 * @param presetData
 */
const applyPreset = (presetData: string[]) => {
  clearAllSelections()
  presetData.forEach((trackId) => {
    for (const trait of traits.value) {
      const track = trait.tracks.find((t) => t.id === trackId)
      if (track) {
        trait.selectedId.push(trackId)
        return
      }
    }
    const otherTrack = otherTracks.value.find((t) => t.id === trackId)
    if (otherTrack) {
      selectedOtherTracks.value.push(trackId)
    }
  })
}

/**
 * 从 URL 设置音轨
 */
const setTracksFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tracksParam = urlParams.get('tracks')
  if (tracksParam) {
    try {
      const tracks = JSON.parse(tracksParam)
      if (Array.isArray(tracks)) {
        applyPreset(tracks)
      }
    } catch {
      console.error('无法解析 URL 中的音轨数据')
    }
  }
}

/**
 * 更改音轨选择
 */
const changeTrack = () => {
  if (isRealTimeEnabled.value && audioState.value.sourceArray.length > 0) {
    void playSelectedTracks()
  }
}

/**
 * 导入音轨选择
 */
const doImport = () => {
  try {
    const importData = JSON.parse(importText.value)
    if (Array.isArray(importData)) {
      applyPreset(importData)
      importDialogVisible.value = false
      importText.value = ''
    } else {
      ElMessage.error('导入数据格式不正确')
    }
  } catch {
    ElMessage.error('导入数据格式不正确')
  }
}

/**
 * 处理对话框关闭
 */
const handleClose = () => {
  exportDialogVisible.value = false
}

/**
 * 监听音轨选择变化
 */
watch(
  [() => traits.value.map((t) => t.selectedId), selectedOtherTracks],
  () => {
    const selected = [...traits.value.flatMap((t) => t.selectedId), ...selectedOtherTracks.value]
    selectedTracks.value = selected
  },
  { deep: true },
)

/**
 * 组件挂载时从 URL 加载音轨
 */
onMounted(() => {
  setTracksFromURL()
})
</script>

<template>
  <div class="background-image"></div>
  <div class="background-darken"></div>
  <h1>{{ $t('title') }}</h1>
  <h2>{{ $t('description') }}</h2>
  <div>
    <label
      ><strong
        ><h4>{{ $t('volume') }}:</h4></strong
      ></label
    >
    <div class="slider-demo-block" style="width: 300px">
      <el-slider v-model="globalVolume" show-input @change="setGlobalVolume"></el-slider>
    </div>
  </div>
  <div class="toggle">
    <input type="checkbox" id="realTime" @click="setRealTime()" />
    <label for="realTime">{{ $t('realTime') }} </label>
  </div>
  <div class="toggle">
    <input type="checkbox" id="repeat" @click="setRepeat()" />
    <label for="repeat">{{ $t('repeat') }}</label>
  </div>
  <button class="btn btn-success" @click="playSelectedTracks()">
    {{ $t('playSelectedTracks') }}
  </button>
  <button class="btn btn-secondary" @click="stopAllTracks()">{{ $t('stopAllTracks') }}</button>
  <button class="btn btn-warning" @click="randomSelectTracks()">
    {{ $t('randomSelectTracks') }}
  </button>
  <button class="btn btn-warning" @click="randomSelectEarlyTracks()">
    {{ $t('randomSelectEarlyTracks') }}
  </button>
  <button class="btn btn-warning" @click="randomSelectLateTracks()">
    {{ $t('randomSelectLateTracks') }}
  </button>
  <button class="btn btn-danger" @click="clearAllSelections()">
    {{ $t('clearAllSelections') }}
  </button>
  <button class="btn btn-info" @click="generateShareableLink()">
    {{ $t('generateShareableLink') }}
  </button>
  <button class="btn btn-info" @click="exportDialogVisible = true">
    {{ $t('exportSelections') }}
  </button>
  <button class="btn btn-info" @click="importDialogVisible = true">
    {{ $t('importSelections') }}
  </button>
  <!--	<button @click="tweetMix()" class="btn btn-primary"><i class="fab fa-twitter"></i> Tweet Mix</button>-->
  <div
    class="alert alert-success"
    id="copyNotification"
    style="display: none; position: fixed; bottom: 20px; right: 20px"
  >
    <strong>URL Copied to Clipboard</strong>
  </div>
  <hr />
  <div class="container">
    <div class="main-content">
      <div class="trait-container">
        <div class="trait" v-for="(trait, index) in traits" :key="index">
          <img :src="trait.icon" :alt="trait.name" />
          <h3>{{ $t(trait.name) }}</h3>
          <el-checkbox-group v-model="trait.selectedId">
            <el-checkbox
              v-for="track in trait.tracks"
              :key="track.id"
              :value="track.id"
              @change="changeTrack"
            >
              {{ track.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="community-presets">
      <h3>Reddit Community Presets</h3>
      <ul>
        <li v-for="(preset, index) in presets" :key="index">
          <button type="button" @click="applyPreset(preset.data)">{{ preset.name }}</button>
        </li>
      </ul>
    </div>
  </div>
  <hr />
  <div class="trait">
    <h3>Other Tracks</h3>
    <el-checkbox-group
      v-for="(track, index) in otherTracks"
      :key="index"
      v-model="selectedOtherTracks"
    >
      <el-checkbox
        :class="track.class"
        :id="track.id"
        :value="track.id"
        :name="track.id"
        style="color: white"
        @change="changeTrack"
      >
        {{ track.label }}
      </el-checkbox>
      <audio :id="'audio' + track.id" :src="track.src" preload="none" loop></audio>
    </el-checkbox-group>
    <br />
  </div>
  <hr />
  <el-dialog
    v-model="exportDialogVisible"
    :title="$t('exportSelections')"
    width="500"
    :before-close="handleClose"
  >
    <span>{{ selectedTracks }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="exportDialogVisible = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="importDialogVisible" :title="$t('importSelections')" width="500">
    <el-input v-model="importText"></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="importDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="doImport"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
body {
  font-family: Arial, sans-serif;
}

h1,
h2,
h3,
h4 {
  color: #e0e0e0;
}

label {
  color: #ffffff;
  display: flex;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: -1;
}

.background-darken {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: -1;
}

.trait-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.trait {
  text-align: left;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 5px 1px #ebebeb;
  padding: 5px;
}

.trait label,
.toggle label {
  display: inline-flex;
}

.container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 50px auto;
}

.main-content {
  flex-grow: 1;
}

.community-presets {
  width: 300px; /* Adjust the width as needed */
  margin-left: 20px; /* Space between main content and presets */
  border: 1px solid #ccc;
  padding: 10px;
}

.community-presets h3 {
  margin-top: 0;
}

.community-presets ul {
  list-style: none;
  padding: 0;
}

.community-presets li {
  margin-bottom: 5px;
}
</style>
