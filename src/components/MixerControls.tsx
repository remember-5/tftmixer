import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext';
import { selectMixerControlsViewModel } from './mixerControls.selectors';
import MixerControlsView from './MixerControlsView';

export default function MixerControls() {
  const viewModel = useMixerStore(useShallow(selectMixerControlsViewModel));

  return <MixerControlsView {...viewModel} />;
}
