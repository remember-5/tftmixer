import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext.jsx';
import { buildPresetItems } from './presetList.helpers.js';
import PresetListView from './PresetListView.jsx';

export default function PresetList({ presets }) {
  const { applySelection, selectedTrackIds } = useMixerStore(
    useShallow((state) => ({
      applySelection: state.applySelection,
      selectedTrackIds: state.selectedTrackIds
    }))
  );
  const presetItems = buildPresetItems(presets, selectedTrackIds);

  return <PresetListView onSelectPreset={applySelection} presetItems={presetItems} />;
}
