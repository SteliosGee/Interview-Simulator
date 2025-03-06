import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './components/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

