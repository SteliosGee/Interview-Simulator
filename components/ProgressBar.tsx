import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

export const ProgressBar = ({ progress }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View 
        style={[
          styles.bar, 
          { 
            backgroundColor: colors.primary,
            width: `${progress * 100}%`,
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
});

