import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './routes';
import { indexedDBStorage } from './lib/indexedDB';

function AppContent() {
  // Apply font size class to html element
  useEffect(() => {
    indexedDBStorage.getSettings().then((settings) => {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
      htmlElement.classList.add(`font-size-${settings.fontSize}`);
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}