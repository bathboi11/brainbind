'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-3 rounded-full bg-white/10 hover:bg-white/20">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}