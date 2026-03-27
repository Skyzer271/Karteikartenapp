import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../../model/types/types';
import { indexedDBStorage } from '../../model/storage/indexedDB';

const defaultSettings: Settings = {
  darkMode: false,
  fontSize: 'medium',
  autoRecognition: true,
  showHintButton: true,
  shuffleMode: false,
  randomSide: false,
  intervals: {
    again: 1,
    hard: 1,
    good: 6,
    easy: 10,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

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
