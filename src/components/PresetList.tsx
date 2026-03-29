import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext';
import { buildPresetItems } from './presetList.helpers';
import PresetListView from './PresetListView';
import type { Preset } from '@/types/mixer';

export default function PresetList({ presets }: { presets: Preset[] }) {
  const { applySelection, selectedTrackIds } = useMixerStore(
    useShallow((state) => ({
      applySelection: state.applySelection,
      selectedTrackIds: state.selectedTrackIds
    }))
  );
  const presetItems = buildPresetItems(presets, selectedTrackIds);

  return <PresetListView onSelectPreset={applySelection} presetItems={presetItems} />;
}
