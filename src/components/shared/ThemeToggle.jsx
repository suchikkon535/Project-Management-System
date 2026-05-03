'use client';

import { useApp } from '@/context/AppContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="relative h-9 w-9 rounded-xl hover:bg-accent transition-colors"
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } absolute`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } absolute`}
      />
    </Button>
  );
}
