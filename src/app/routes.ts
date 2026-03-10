import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { DeckDetail } from './pages/DeckDetail';
import { StudyMode } from './pages/StudyMode';
import { CreateCard } from './pages/CreateCard';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'deck/:deckId', Component: DeckDetail },
      { path: 'study/:deckId', Component: StudyMode },
      { path: 'create', Component: CreateCard },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);
