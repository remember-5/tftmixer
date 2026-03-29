import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createMixerStore } from './createMixerStore.js';

const MixerStoreContext = createContext(null);

export function MixerStoreProvider({ children, player, store }) {
  const storeRef = useRef(store ?? null);

  if (storeRef.current === null) {
    storeRef.current = createMixerStore({ player });
  }

  return <MixerStoreContext.Provider value={storeRef.current}>{children}</MixerStoreContext.Provider>;
}

export function useMixerStore(selector) {
  const store = useContext(MixerStoreContext);

  if (store === null) {
    throw new Error('useMixerStore must be used within a MixerStoreProvider.');
  }

  return useStore(store, selector);
}

export function useMixerStoreApi() {
  const store = useContext(MixerStoreContext);

  if (store === null) {
    throw new Error('useMixerStoreApi must be used within a MixerStoreProvider.');
  }

  return store;
}
