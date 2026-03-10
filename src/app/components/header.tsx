import { Menu, Moon, Sun, LayoutDashboard, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { Page } from '@/app/App';
import { useState } from 'react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ currentPage, onNavigate, darkMode, onToggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8" style={{ color: '#007BFF' }} />
            <h1 className="font-bold text-xl">Karteikarten-App</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
              className={currentPage === 'dashboard' ? 'bg-[#007BFF] hover:bg-[#0056b3]' : ''}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'create' ? 'default' : 'ghost'}
              onClick={() => onNavigate('create')}
              className={currentPage === 'create' ? 'bg-[#007BFF] hover:bg-[#0056b3]' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Karte
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="ml-4"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`justify-start ${currentPage === 'dashboard' ? 'bg-[#007BFF] hover:bg-[#0056b3]' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'create' ? 'default' : 'ghost'}
              onClick={() => {
                onNavigate('create');
                setMobileMenuOpen(false);
              }}
              className={`justify-start ${currentPage === 'create' ? 'bg-[#007BFF] hover:bg-[#0056b3]' : ''}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Karte
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
