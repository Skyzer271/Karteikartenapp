import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Loader2 } from 'lucide-react';
import { Button } from '@/view/components/Button';

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect to dashboard after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl mb-2">Seite wird geladen...</h2>
        <p className="text-muted-foreground mb-6">
          Sie werden automatisch zum Dashboard weitergeleitet.
        </p>
        <Button onClick={() => navigate('/', { replace: true })}>
          <Home className="w-5 h-5 mr-2" />
          Zum Dashboard
        </Button>
      </div>
    </div>
  );
}
