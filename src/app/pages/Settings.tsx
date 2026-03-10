import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sun, Moon, Type, Shuffle, Eye, Zap } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize: size });
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    htmlElement.classList.add(`font-size-${size}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
          </Button>
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">Einstellungen</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Passen Sie die App nach Ihren Wünschen an
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Erscheinungsbild
            </h2>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-900 dark:text-gray-100">Dunkler Modus</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktivieren Sie den dunklen Modus für bessere Lesbarkeit bei Nacht
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <p className="text-gray-900 dark:text-gray-100">Schriftgröße</p>
                </div>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        settings.fontSize === size
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {size === 'small' && 'Klein'}
                      {size === 'medium' && 'Mittel'}
                      {size === 'large' && 'Groß'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Learning Settings */}
          <Card>
            <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Lerneinstellungen
            </h2>

            <div className="space-y-4">
              {/* Auto Recognition */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-900 dark:text-gray-100">Automatische Antworterkennung</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ihre Antwort wird automatisch mit der richtigen Antwort verglichen
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ autoRecognition: !settings.autoRecognition })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.autoRecognition ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.autoRecognition ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Hint Button */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-900 dark:text-gray-100">Hinweis-Button anzeigen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Zeigt einen Button zum Anzeigen von Hinweisen während des Lernens
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ showHintButton: !settings.showHintButton })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.showHintButton ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showHintButton ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Shuffle Mode */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shuffle className="w-4 h-4" />
                    Shuffle-Modus
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Karten werden in zufälliger Reihenfolge angezeigt
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ shuffleMode: !settings.shuffleMode })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.shuffleMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.shuffleMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Random Side */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Zufällige Seite
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Zeigt zufällig entweder die Vorder- oder Rückseite zuerst an
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ randomSide: !settings.randomSide })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.randomSide ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.randomSide ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card>
            <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-4">Über die App</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>FlashCards - Intelligentes Lernen mit Karteikarten</p>
              <p>Version 2.0.0</p>
              <p className="pt-2">
                Diese App verwendet ein Spaced-Repetition-System (SM-2), um Ihnen beim
                effektiven Lernen zu helfen.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}