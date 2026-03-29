import { createContext, type ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createMixerStore } from './createMixerStore';
import type { AudioMixerPlayer } from '@/types/mixer';
import type { MixerState, MixerStore } from './createMixerStore';

const MixerStoreContext = createContext<MixerStore | null>(null);

export function MixerStoreProvider({
  children,
  player,
  store
}: {
  children: ReactNode;
  player?: AudioMixerPlayer;
  store?: MixerStore;
}) {
  const storeRef = useRef(store ?? null);

  if (storeRef.current === null) {
    storeRef.current = createMixerStore({ player });
  }

  return <MixerStoreContext.Provider value={storeRef.current}>{children}</MixerStoreContext.Provider>;
}

export function useMixerStore<T>(selector: (state: MixerState) => T): T {
  const store = useContext(MixerStoreContext);

  if (store === null) {
    throw new Error('useMixerStore must be used within a MixerStoreProvider.');
  }

  return useStore(store, selector);
}

export function useMixerStoreApi(): MixerStore {
  const store = useContext(MixerStoreContext);

  if (store === null) {
    throw new Error('useMixerStoreApi must be used within a MixerStoreProvider.');
  }

  return store;
}
