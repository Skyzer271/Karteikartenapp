import { createBrowserRouter } from 'react-router';
import { Layout } from '@/Layout';
import { Dashboard } from '@/view/pages/Dashboard';
import { DeckDetail } from '@/view/pages/DeckDetail';
import { StudyMode } from '@/view/pages/StudyMode';
import { CreateCard } from '@/view/pages/CreateCard';
import { Settings } from '@/view/pages/Settings';
import { NotFound } from '@/view/pages/NotFound';

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
