import React from 'react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '../components/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-2xl mb-2">Seite nicht gefunden</h2>
        <p className="text-muted-foreground mb-6">
          Die gesuchte Seite existiert nicht.
        </p>
        <Button onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" />
          Zum Dashboard
        </Button>
      </div>
    </div>
  );
}