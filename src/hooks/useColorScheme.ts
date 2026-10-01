import { useSyncExternalStore } from 'react';
import type { ColorMode } from '../themes/tokens';

const QUERY = '(prefers-color-scheme: dark)';

function canMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function subscribe(callback: () => void): () => void {
  if (!canMatchMedia()) return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

const getSnapshot = () => canMatchMedia() && window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** Resolve `"system"` to the user's OS preference, live. */
export function useColorScheme(mode: ColorMode): 'light' | 'dark' {
  const prefersDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}
