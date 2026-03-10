import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';
import { indexedDBStorage } from '../lib/indexedDB';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    fontSize: 'medium',
    autoRecognition: true,
    showHintButton: true,
    shuffleMode: false,
    randomSide: false,
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