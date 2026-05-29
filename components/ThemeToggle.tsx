'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'dark' | 'light';

function apply(theme: Theme) {
  const d = document.documentElement;
  d.dataset.theme = theme;
  d.classList.remove('va-dark', 'va-light');
  d.classList.add('va-' + theme);
  try {
    localStorage.setItem('va-theme', theme);
  } catch {}
  document.cookie = `va-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || 'dark';
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    apply(next);
  }

  const isDark = !mounted || theme === 'dark';

  return (
    <button
      type="button"
      className="va-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <Sun size={15} />
      <span className={isDark ? 'va-toggle-track is-dark' : 'va-toggle-track'} aria-hidden="true" />
      <Moon size={15} />
    </button>
  );
}
