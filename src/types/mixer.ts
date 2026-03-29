export type TrackPhase = 'early' | 'late' | null;

export type RandomizeSelectionPhase = Exclude<TrackPhase, null>;

export interface Track {
  id: string;
  label: string;
  phase: TrackPhase;
  src: string;
  traitId?: string;
  traitName?: string;
}

export interface Trait {
  id: string;
  icon: string | null;
  name: string;
  tracks: Track[];
}

export interface Preset {
  id: string;
  name: string;
  trackIds: string[];
}

export interface PresetItem extends Preset {
  active: boolean;
}

export type TrackLookup = Record<string, Track>;

export interface PlaybackOptions {
  isRealtimeEnabled: boolean;
  isRepeatEnabled: boolean;
  selectedTrackIds: string[];
  volume: number;
}

export interface AudioMixerPlayer {
  play(options: PlaybackOptions): Promise<void>;
  resetSession(): void;
  setRepeatEnabled(isRepeatEnabled: boolean): void;
  setVolume(volume: number): void;
  stop(): void;
  syncSelection(selectedTrackIds?: string[]): void;
}
