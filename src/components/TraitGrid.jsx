import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext.jsx';
import { createSelectedTrackIdSet } from './traitGrid.helpers.js';
import TraitGridView from './TraitGridView.jsx';

export default function TraitGrid({ traits }) {
  const { selectedTrackIds, toggleTrack } = useMixerStore(
    useShallow((state) => ({
      selectedTrackIds: state.selectedTrackIds,
      toggleTrack: state.toggleTrack
    }))
  );
  const selectedTrackIdSet = createSelectedTrackIdSet(selectedTrackIds);

  return <TraitGridView onToggleTrack={toggleTrack} selectedTrackIdSet={selectedTrackIdSet} traits={traits} />;
}
