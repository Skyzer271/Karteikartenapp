import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@/model/types/types';
import { indexedDBStorage } from '@/model/storage/indexedDB';
import { DEFAULT_INTERVALS } from '@/model/services/spaced-repetition';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    fontSize: 'medium',
    autoRecognition: true,
    showHintButton: true,
    shuffleMode: false,
    randomSide: false,
    intervals: DEFAULT_INTERVALS,
  });

  useEffect(() => {
    indexedDBStorage.getSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
    });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await indexedDBStorage.saveSettings(newSettings);
  }, [settings]);

  return { settings, updateSettings };
}