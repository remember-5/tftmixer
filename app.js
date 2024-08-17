/**
 * Copyright [2022] [remember5]
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {createApp} = Vue;
const {createI18n} = VueI18n;
// 导入语言包
import messagesZh from './locales/zh.js';
import messagesEn from './locales/en.js';
// 定义语言包
const messages = {
  zh: messagesZh, en: messagesEn
};

// 创建 i18n 实例
const i18n = createI18n({
  locale: 'zh', // 默认语言
  messages,
});

createApp({
  data() {
    return {
      message: '这是默认消息!',
      globalVolume: 100,
      presets: [
        {
          name: 'Developer Preset',
          data: ['kda_late_secondary', 'punk_late_main', 'edm_late_drums', 'pentakill_late_main', 'pentakill_late_secondary'],
        },
        {
          name: 'u/Drwyz',
          data: ['edm_late_main', 'hyperpop_late_drums', 'illbeats_late', 'truedamage_late_secondary'],
        },
        {
          name: 'u/rishkebab',
          data: ['kda_late_main', 'kda_late_secondary', 'punk_late_main', 'maestro_late', '8bit_late_main', 'country_late_main', 'disco_late_main', 'edm_late_drums', 'edm_late_main', 'emo_late_main', 'heartsteel_late_main', 'hyperpop_late', 'illbeats_late', 'jazz_late_main', 'pentakill_late_main', 'pentakill_late_secondary', 'truedamage_late_main', 'truedamage_late_secondary'],
        },
        {name: 'u/sevenaya', data: ['maestro_late', 'country_late_main', 'edm_late_drums', 'edm_late_main'],},
        {name: 'u/ReasonableZone2978', data: ['maestro_early', 'mixmaster_early'],},
        {
          name: 'u/bahaahamza_',
          data: ['disco_late_drums', 'heartsteel_late_secondary', 'hyperpop_late_drums', 'jazz_late_main'],
        },
        {name: 'u/Alunze', data: ['punk_early_drums', 'pentakill_early_main', 'pentakill_early_secondary'],},
        {
          name: 'u/Visible_Tangelo_2731',
          data: ['kda_late_secondary', 'edm_late_main', 'hyperpop_late_drums', 'illbeats_late'],
        },
        {name: 'u/weissclimbers', data: ['punk_late_main', 'maestro_late', 'emo_late_drums', 'emo_late_main'],},
        {name: 'u/Dr_Mr_G', data: ['punk_late_main', 'maestro_late', 'emo_late_drums', 'emo_late_main'],},
        {name: 'u/deleted', data: ['kda_late_main', 'hyperpop_late', 'hyperpop_late_drums'],},
        {
          name: 'u/liquidrekto 1',
          data: ['punk_late_main', 'country_late_main', 'emo_late_main', 'pentakill_late_drums'],
        },
        {
          name: 'u/liquidrekto 2',
          data: ['punk_early_main', 'maestro_early', 'country_early_drums', 'disco_early_drums', 'pentakill_early_drums'],
        },
        {name: 'u/liquidrekto 3', data: ['maestro_late', 'country_late_main', 'emo_late_drums', 'piano_late'],},
        {
          name: 'u/liquidrekto 4',
          data: ['disco_early_drums', 'disco_early_main', 'edm_early_main', 'jazz_early_main', 'mixmaster_early'],
        },
        {
          name: 'u/liquidrekto 5',
          data: ['8bit_early_drums', '8bit_early_main', 'edm_early_main', 'hyperpop_early', 'truedamage_early_drums'],
        },
        {
          name: 'u/liquidrekto 6',
          data: ['kda_late_drums', 'kda_late_secondary', 'kda_late_main', 'emo_late_main', 'heartsteel_late_drums', 'hyperpop_late']
        },
      ],
      tracks: ['8bit_early_drums', '8bit_early_main', '8bit_late_drums', '8bit_late_main', 'country_early_drums', 'country_early_main', 'country_late_drums', 'country_late_main', 'death1', 'death2', 'death3', 'death4', 'death5', 'death6', 'disco_early_drums', 'disco_early_main', 'disco_late_drums', 'disco_late_main', 'edm_early_drums', 'edm_early_main', 'edm_late_drums', 'edm_late_main', 'emo_early_drums', 'emo_early_main', 'emo_late_drums', 'emo_late_main', 'heartsteel_early_drums', 'heartsteel_early_main', 'heartsteel_early_secondary', 'heartsteel_late_drums', 'heartsteel_late_main', 'heartsteel_late_secondary', 'hyperpop_early', 'hyperpop_late', 'hyperpop_late_drums', 'illbeats_early', 'illbeats_late', 'jazz_early_main', 'jazz_late_main', 'kda_early_drums', 'kda_early_main', 'kda_early_secondary', 'kda_late_drums', 'kda_late_main', 'kda_late_secondary', 'maestro_early', 'maestro_late', 'mixmaster_early', 'mixmaster_late', 'pentakill_early_drums', 'pentakill_early_main', 'pentakill_early_secondary', 'pentakill_late_drums', 'pentakill_late_main', 'pentakill_late_secondary', 'piano_early', 'piano_late', 'punk_early_drums', 'punk_early_main', 'punk_late_drums', 'punk_late_main', 'starting_carousel', 'truedamage_early_drums', 'truedamage_early_main', 'truedamage_early_secondary', 'truedamage_late_drums', 'truedamage_late_main', 'truedamage_late_secondary'],
      context: new (window.AudioContext || window.webkitAudioContext)(),
      sourceArray: [],
      audioGainArray: [],
      activeTrackElements: [],
      masterGainNode: null,
      initial: true,
      audio_buffers: [],
      startCallback: null,
      endedArray: [],
      playingArray: [],
      endedCallbackArray: [],
      isRealTimeEnabled: false, // 开启实时模式
      isRepeatEnabled: false, // 开启重复播放
      traits: [
        {
        name: "KDA", icon: "icon/kda.png", tracks: [{
          id: "kda_early_drums", label: "early_drums", src: "tracks/kda_early_drums.ogg", class: "early", checked: false
        }, {
          id: "kda_early_main", label: "early_main", src: "tracks/kda_early_main.ogg", class: "early", checked: false
        }, {
          id: "kda_early_secondary",
          label: "early_secondary",
          src: "tracks/kda_early_secondary.ogg",
          class: "early",
          checked: false
        }, {
          id: "kda_late_drums", label: "late_drums", src: "tracks/kda_late_drums.ogg", class: "late", checked: false
        }, {id: "kda_late_main", label: "late_main", src: "tracks/kda_late_main.ogg", class: "late", checked: false}, {
          id: "kda_late_secondary",
          label: "late_secondary",
          src: "tracks/kda_late_secondary.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "Punk", icon: "icon/punk.png", tracks: [{
          id: "punk_early_drums",
          label: "early_drums",
          src: "tracks/punk_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "punk_early_main", label: "early_main", src: "tracks/punk_early_main.ogg", class: "early", checked: false
        }, {
          id: "punk_late_drums", label: "late_drums", src: "tracks/punk_late_drums.ogg", class: "late", checked: false
        }, {
          id: "punk_late_main",
          label: "late_main",
          src: "tracks/punk_late_main.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "Maestro",
        icon: "icon/maestro.png",
        tracks: [{
          id: "maestro_early",
          label: "early",
          src: "tracks/maestro_early.ogg",
          class: "early",
          checked: false
        }, {id: "maestro_late", label: "late", src: "tracks/maestro_late.ogg", class: "late", checked: false},],
      }, {
        name: "8 Bit", icon: "icon/8bit.png", tracks: [{
          id: "8bit_early_drums",
          label: "early_drums",
          src: "tracks/8bit_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "8bit_early_main", label: "early_main", src: "tracks/8bit_early_main.ogg", class: "early", checked: false
        }, {
          id: "8bit_late_drums", label: "late_drums", src: "tracks/8bit_late_drums.ogg", class: "late", checked: false
        }, {
          id: "8bit_late_main",
          label: "late_main",
          src: "tracks/8bit_late_main.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "Country", icon: "icon/country.png", tracks: [{
          id: "country_early_drums",
          label: "early_drums",
          src: "tracks/country_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "country_early_main",
          label: "early_main",
          src: "tracks/country_early_main.ogg",
          class: "early",
          checked: false
        }, {
          id: "country_late_drums",
          label: "late_drums",
          src: "tracks/country_late_drums.ogg",
          class: "late",
          checked: false
        }, {
          id: "country_late_main",
          label: "late_main",
          src: "tracks/country_late_main.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "Disco", icon: "icon/disco.png", tracks: [{
          id: "disco_early_drums",
          label: "early_drums",
          src: "tracks/disco_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "disco_early_main",
          label: "early_main",
          src: "tracks/disco_early_main.ogg",
          class: "early",
          checked: false
        }, {
          id: "disco_late_drums", label: "late_drums", src: "tracks/disco_late_drums.ogg", class: "late", checked: false
        }, {
          id: "disco_late_main", label: "late_main", src: "tracks/disco_late_main.ogg", class: "late", checked: false
        },],
      }, {
        name: "EDM", icon: "icon/edm.png", tracks: [{
          id: "edm_early_drums", label: "early_drums", src: "tracks/edm_early_drums.ogg", class: "early", checked: false
        }, {
          id: "edm_early_main", label: "early_main", src: "tracks/edm_early_main.ogg", class: "early", checked: false
        }, {
          id: "edm_late_drums", label: "late_drums", src: "tracks/edm_late_drums.ogg", class: "late", checked: false
        }, {id: "edm_late_main", label: "late_main", src: "tracks/edm_late_main.ogg", class: "late", checked: false},],
      }, {
        name: "Emo", icon: "icon/emo.png", tracks: [{
          id: "emo_early_drums", label: "early_drums", src: "tracks/emo_early_drums.ogg", class: "early", checked: false
        }, {
          id: "emo_early_main", label: "early_main", src: "tracks/emo_early_main.ogg", class: "early", checked: false
        }, {
          id: "emo_late_drums", label: "late_drums", src: "tracks/emo_late_drums.ogg", class: "late", checked: false
        }, {id: "emo_late_main", label: "late_main", src: "tracks/emo_late_main.ogg", class: "late", checked: false},],
      }, {
        name: "Heartsteel", icon: "icon/heartsteel.png", tracks: [{
          id: "heartsteel_early_drums",
          label: "early_drums",
          src: "tracks/heartsteel_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "heartsteel_early_main",
          label: "early_main",
          src: "tracks/heartsteel_early_main.ogg",
          class: "early",
          checked: false
        }, {
          id: "heartsteel_early_secondary",
          label: "early_secondary",
          src: "tracks/heartsteel_early_secondary.ogg",
          class: "early",
          checked: false
        }, {
          id: "heartsteel_late_drums",
          label: "late_drums",
          src: "tracks/illbeats_late.ogg",
          class: "late",
          checked: false
        }, {
          id: "heartsteel_late_main",
          label: "late_main",
          src: "tracks/heartsteel_late_main.ogg",
          class: "late",
          checked: false
        }, {
          id: "heartsteel_late_secondary",
          label: "late_secondary",
          src: "tracks/heartsteel_late_secondary.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "Hyperpop",
        icon: "icon/hyperpop.png",
        tracks: [{
          id: "hyperpop_early",
          label: "early",
          src: "tracks/hyperpop_early.ogg",
          class: "early",
          checked: false
        }, {id: "hyperpop_late", label: "late", src: "tracks/hyperpop_late.ogg", class: "late", checked: false}, {
          id: "hyperpop_late_drums",
          label: "late_drums",
          src: "tracks/hyperpop_late_drums.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "ILLBEATS",
        icon: "icon/illbeats.png",
        tracks: [{
          id: "illbeats_early",
          label: "early",
          src: "tracks/illbeats_early.ogg",
          class: "early",
          checked: false
        }, {id: "illbeats_late", label: "late", src: "tracks/illbeats_late.ogg", class: "late", checked: false},],
      }, {
        name: "Jazz", icon: "icon/jazz.png", tracks: [{
          id: "jazz_early_main", label: "early_main", src: "tracks/jazz_early_main.ogg", class: "early", checked: false
        }, {
          id: "jazz_late_main",
          label: "late_main",
          src: "tracks/jazz_late_main.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "MixMaster",
        icon: "icon/mixmaster.png",
        tracks: [{
          id: "mixmaster_early",
          label: "early",
          src: "tracks/mixmaster_early.ogg",
          class: "early",
          checked: false
        }, {id: "mixmaster_late", label: "late", src: "tracks/mixmaster_late.ogg", class: "late", checked: false},],
      }, {
        name: "Pentakill", icon: "icon/pentakill.png", tracks: [{
          id: "pentakill_early_drums",
          label: "early_drums",
          src: "tracks/pentakill_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "pentakill_early_main",
          label: "early_main",
          src: "tracks/pentakill_early_main.ogg",
          class: "early",
          checked: false
        }, {
          id: "pentakill_early_secondary",
          label: "early_secondary",
          src: "tracks/pentakill_early_secondary.ogg",
          class: "early",
          checked: false
        }, {
          id: "pentakill_late_drums",
          label: "late_drums",
          src: "tracks/pentakill_late_drums.ogg",
          class: "late",
          checked: false
        }, {
          id: "pentakill_late_main",
          label: "late_main",
          src: "tracks/pentakill_late_main.ogg",
          class: "late",
          checked: false
        }, {
          id: "pentakill_late_secondary",
          label: "late_secondary",
          src: "tracks/pentakill_late_secondary.ogg",
          class: "late",
          checked: false
        },],
      }, {
        name: "True Damage", icon: "icon/truedmg.png", tracks: [{
          id: "truedamage_early_drums",
          label: "early_drums",
          src: "tracks/truedamage_early_drums.ogg",
          class: "early",
          checked: false
        }, {
          id: "truedamage_early_main",
          label: "early_main",
          src: "tracks/truedamage_early_main.ogg",
          class: "early",
          checked: false
        }, {
          id: "truedamage_early_secondary",
          label: "early_secondary",
          src: "tracks/truedamage_early_secondary.ogg",
          class: "early",
          checked: false
        }, {
          id: "truedamage_late_drums",
          label: "late_drums",
          src: "tracks/truedamage_late_drums.ogg",
          class: "late",
          checked: false
        }, {
          id: "truedamage_late_main",
          label: "late_main",
          src: "tracks/truedamage_late_main.ogg",
          class: "late",
          checked: false
        }, {
          id: "truedamage_late_secondary",
          label: "late_secondary",
          src: "tracks/truedamage_late_secondary.ogg",
          class: "late",
          checked: false
        },],
      },],
      otherTracks: [
        {
          id: "starting_carousel",
          label: "Starting Carousel",
          src: "tracks/starting_carousel.ogg",
        },
        {
          id: "piano_early",
          label: "No Traits Early",
          src: "tracks/piano_early.ogg",
          class: "early",
        },
        {
          id: "piano_late",
          label: "No Traits Late",
          src: "tracks/piano_late.ogg",
          class: "late",
        },
        {
          id: "death1",
          label: "Death 1",
          src: "tracks/death1.ogg",
        },
        {
          id: "death2",
          label: "Death 2",
          src: "tracks/death2.ogg",
        },
        {
          id: "death3",
          label: "Death 3",
          src: "tracks/death3.ogg",
        },
        {
          id: "death4",
          label: "Death 4",
          src: "tracks/death4.ogg",
        },
        {
          id: "death5",
          label: "Death 5",
          src: "tracks/death5.ogg",
        },
        {
          id: "death6",
          label: "Death 6",
          src: "tracks/death6.ogg",
        },
      ]
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'zh' ? 'en' : 'zh';
    },
    changeMessage() {
      this.message = this.$i18n.locale === 'zh' ? '你点击了按钮!' : 'You clicked the button!';
    },
    playSelectedTracks() {
      this.stopAllTracks();

      // reuse loaded AudioBuffer in real time mode
      if (this.isRealTimeEnabled && this.audio_buffers && this.startCallback) {
        this.audio_buffers.forEach(this.startCallback);
        return;
      }

      // Show loading indicator
      document.getElementById('loadingIndicator').style.display = 'block';
      var playlist = [];
      this.activeTrackElements = [];

      var currentGlobalVolume = this.globalVolume / 100; // Get the current global volume
      for (var i = 0; i < this.tracks.length; i++) {
        // Hacky way to only add the listeners once bc they are annoying to remove
        // when using an anon func (but anon func makes indexing the tracks easy)
        const trackElement = document.getElementById(this.tracks[i])
        if (this.initial) {
          const trackIndex = i;
          trackElement.addEventListener('change', () => this.toggleTrackRealTime(trackIndex));
        }
        // Collect tracks to load (all if real time mode)
        if (this.isRealTimeEnabled || trackElement.checked) {
          this.activeTrackElements.push(trackElement);
          playlist.push("tracks/" + this.tracks[i] + ".aac");
        }
      }
      this.initial = false;

      (async () => {
        const urls = playlist;
        // first, fetch each file's data
        const data_buffers = await Promise.all(urls.map((url) => fetch(url).then((res) => res.arrayBuffer())));
        // get our AudioContext
        // decode the data
        this.audio_buffers = await Promise.all(data_buffers.map((buf) => this.context.decodeAudioData(buf)));
        // to enable the AudioContext we need to handle a user gesture
        const current_time = this.context.currentTime;
        this.masterGainNode = this.context.createGain();
        this.masterGainNode.connect(this.context.destination);
        this.masterGainNode.gain.setValueAtTime(currentGlobalVolume, this.context.currentTime);

        this.startCallback = (buf, i) => {
          // a buffer source is a really small object
          // don't be afraid of creating and throwing it
          const source = this.context.createBufferSource();
          // we only connect the decoded data, it's not copied
          source.buffer = buf;
          // make it loop?
          //source.loop = true;
          // start them all 0.25s after we began, so we're sure they're in sync
          const gainNode = this.context.createGain();
          source.start(current_time + 0.25);
          source.connect(gainNode);
          gainNode.connect(this.masterGainNode);
          this.sourceArray.push(source);
          this.audioGainArray.push(gainNode);
          const trackChecked = !document.getElementById('realTime').checked || this.activeTrackElements[i].checked;
          gainNode.gain.setValueAtTime(trackChecked ? 1 : 0, this.context.currentTime);
          // prepare for repeat play
          this.endedArray.push(false);
          if (trackChecked) {
            this.playingArray[i] = true;
          }
          this.endedCallbackArray[i] = () => {
            this.endedArray[i] = true;
            if (this.playingArray[i]) {
              this.playingArray[i] = false;
              // only the last track triggers restart
              if (this.areAllCheckedTracksDone()) {
                if (this.isRepeatEnabled) {
                  this.stopAllTracks();
                  this.audio_buffers.forEach(this.startCallback);
                }
              }
            }
          };
          source.addEventListener('ended', this.endedCallbackArray[i]);
        };
        this.audio_buffers.forEach(this.startCallback);

        // Avoid appearing to infinite load when playing with no tracks selected
        if (this.audio_buffers.length == 0) {
          this.stopAllTracks();
        }

        document.getElementById('loadingIndicator').style.display = 'none';
      })();
    },

    areAllCheckedTracksDone() {
      return this.playingArray.some((playing) => playing === false) && this.playingArray.every((playing) => playing === false);
    },

    stopAllTracks() {
      document.getElementById('loadingIndicator').style.display = 'none';
      for (let i = 0; i < this.sourceArray.length; i++) {
        this.sourceArray[i].stop();
        if (this.endedCallbackArray[i] !== undefined) {
          this.sourceArray[i].removeEventListener('ended', this.endedCallbackArray[i]);
          delete this.endedCallbackArray[i];
        }
      }
      // clear array contents made in startCallback()
      this.sourceArray = [];
      this.audioGainArray = [];
      this.endedArray = [];
      this.playingArray = [];
      this.endedCallbackArray = [];
    },

    getGlobalVolume() {
      return document.getElementById('globalVolume').valueAsNumber || 1; // Default to 1 if not set
    },

    setGlobalVolume(value) {
      if (this.masterGainNode != null) {
        this.masterGainNode.gain.setValueAtTime(value / 100, this.context.currentTime);
      }
    },

    toggleRealTime() {
      this.isRealTimeEnabled = !this.isRealTimeEnabled;
      this.stopAllTracks();
      this.audio_buffers = [];
      this.startCallback = null;
    }, toggleRepeat() {
      this.isRepeatEnabled = !this.isRepeatEnabled;
    }, toggleTrackRealTime(trackIndex) {
      if (this.isRealTimeEnabled) {
        const gainNode = this.audioGainArray[trackIndex];
        if (gainNode != null) {
          const track = this.activeTrackElements[trackIndex];
          gainNode.gain.setValueAtTime(track.checked ? 1 : 0, this.context.currentTime);

          if (this.endedArray[trackIndex] !== true) {
            if (track.checked) {
              this.playingArray[trackIndex] = true;
            } else if (this.playingArray[trackIndex] != undefined) {
              delete this.playingArray[trackIndex];
            }
          }
        }
      }
    },

    randomSelectTracks(trackSelector = '') {
      this.clearAllSelections();
      var checkboxes = document.querySelectorAll('.trait input[type="checkbox"]' + trackSelector);
      var maxSelect = Math.min(5, checkboxes.length);

      for (var i = 0; i < maxSelect; i++) {
        var randomIndex = Math.floor(Math.random() * checkboxes.length);
        checkboxes[randomIndex].checked = true;
        checkboxes[randomIndex].dispatchEvent(new Event('change'))
      }

      if (this.isRealTimeEnabled && this.audio_buffers && this.startCallback && this.isRepeatEnabled && this.areAllCheckedTracksDone()) {
        this.stopAllTracks();
        this.audio_buffers.forEach(this.startCallback);
      }
    },

    randomSelectEarlyTracks() {
      randomSelectTracks('.early')
    },

    randomSelectLateTracks() {
      randomSelectTracks('.late')
    },

    clearAllSelections() {
      var checkboxes = document.querySelectorAll('.trait input[type="checkbox"]');
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        checkboxes[i].dispatchEvent(new Event('change'))
      }
    },

    generateShareableLink() {
      var checkboxes = document.querySelectorAll('.trait input[type="checkbox"]');
      var selectedTracks = [];

      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          selectedTracks.push(encodeURIComponent(checkbox.id));
        }
      });

      var url = window.location.href.split('?')[0];
      var params = selectedTracks.join('%2C'); // Encoding comma

      // Add the parameters to the URL
      url += '?selectedTracks=' + params;

      // Remove any trailing dot or comma for legacy URLs
      url = url.replace(/[.,]$/, '');

      navigator.clipboard.writeText(url).then(function () {
        alert("Mix URL copied to clipboard!");
      })
        .catch(function (error) {
          console.error("Error copying URL: ", error);
        });
    },

    tweetMix() {
      var checkboxes = document.querySelectorAll('.trait input[type="checkbox"]');
      var selectedTracks = [];

      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          selectedTracks.push(checkbox.id);
        }
      });

      var url = window.location.href.split('?')[0];
      url += '?selectedTracks=' + selectedTracks.join(',');

      var twitterUrl = 'https://twitter.com/intent/tweet?text=Check out my TFT remix rumble music mix!: ' + encodeURIComponent(url) + '&hashtags=TFT,TFTRemixRumble';
      window.open(twitterUrl, '_blank').focus();
    },

    applyPreset(presetData) {
      // First, clear all selections
      const checkboxes = document.querySelectorAll('input[type=checkbox]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });

      // Apply the preset selections
      presetData.forEach(selectionId => {
        const checkbox = document.getElementById(selectionId);
        if (checkbox) {
          checkbox.checked = true;
        }
      });

      // Update any UI elements or states as necessary
    },

    setTracksFromURL() {
      var params = new URLSearchParams(window.location.search);
      var selectedTracks = params.get('selectedTracks');

      if (selectedTracks) {
        selectedTracks.split(',').forEach(function (trackId) {
          // Remove any trailing dot for legacy URLs
          trackId = trackId.replace(/\.+$/, '');
          var checkbox = document.getElementById(trackId);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }
    }
  }
}).use(i18n) // 使用 i18n 插件
  .use(ElementPlus) // 使用 element-plus 插件
  .mount('#app');
