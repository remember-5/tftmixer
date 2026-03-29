import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext.jsx';
import { selectMixerControlsViewModel } from './mixerControls.selectors.js';
import MixerControlsView from './MixerControlsView.jsx';

export default function MixerControls() {
  const viewModel = useMixerStore(useShallow(selectMixerControlsViewModel));

  return <MixerControlsView {...viewModel} />;
}
