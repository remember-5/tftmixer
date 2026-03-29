import { useShallow } from 'zustand/react/shallow';
import { useMixerStore } from '../store/MixerStoreContext';
import { createSelectedTrackIdSet } from './traitGrid.helpers';
import TraitGridView from './TraitGridView';
import type { Trait } from '@/types/mixer';

export default function TraitGrid({ traits }: { traits: Trait[] }) {
  const { selectedTrackIds, toggleTrack } = useMixerStore(
    useShallow((state) => ({
      selectedTrackIds: state.selectedTrackIds,
      toggleTrack: state.toggleTrack
    }))
  );
  const selectedTrackIdSet = createSelectedTrackIdSet(selectedTrackIds);

  return <TraitGridView onToggleTrack={toggleTrack} selectedTrackIdSet={selectedTrackIdSet} traits={traits} />;
}
