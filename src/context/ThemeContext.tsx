// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {}
});

export const ThemeProvider: React.FC<{
  defaultTheme?: Theme;
  storageKey?: string;
  children: React.ReactNode;
}> = ({
  defaultTheme = 'system',
  storageKey = 'my-app-theme',
  children
}) => {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (localStorage.getItem(storageKey) as Theme) ||
      defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(sys);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () =>
          setTheme((t) =>
            t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'
          )
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
