import { useCallback } from 'react';
import { soundManager } from '../utils/soundEffects';

export function useAudio(enabled = true) {
  const playKiss = useCallback(() => {
    if (enabled) soundManager.playKiss();
  }, [enabled]);

  const playPop = useCallback(() => {
    if (enabled) soundManager.playPop();
  }, [enabled]);

  const playCelebrate = useCallback(() => {
    if (enabled) soundManager.playCelebrate();
  }, [enabled]);

  const playReminder = useCallback(() => {
    if (enabled) soundManager.playReminder();
  }, [enabled]);

  return {
    playKiss,
    playPop,
    playCelebrate,
    playReminder,
  };
}
