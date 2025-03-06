import React, { createContext, useContext, useState } from 'react';

const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  textMuted: '#666666',
  primary: '#007AFF',
  onPrimary: '#FFFFFF',
  card: '#F0F0F0',
};

const darkTheme = {
  background: '#1C1C1E',
  text: '#FFFFFF',
  textMuted: '#888888',
  primary: '#0A84FF',
  onPrimary: '#FFFFFF',
  card: '#2C2C2E',
};

const ThemeContext = createContext({
  colors: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colors: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

