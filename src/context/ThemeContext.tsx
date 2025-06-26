import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    const useDark = stored ? stored === 'true' : prefersDark;
    setDark(useDark);
    document.documentElement.classList.toggle('dark', useDark);
  }, []);
  const toggle = () => {
    setDark(d => {
      const newD = !d;
      document.documentElement.classList.toggle('dark', newD);
      localStorage.setItem('dark', newD.toString());
      return newD;
    });
  };
  return (<ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>);
};

export const useTheme = () => useContext(ThemeContext);
