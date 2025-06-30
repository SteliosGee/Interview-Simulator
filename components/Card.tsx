import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

export const Card = ({ children, style, variant = 'default', padding = 'medium' }) => {
  const { colors } = useTheme();

  const getCardStyle = () => {
    const baseStyle = [
      styles.card, 
      styles[padding],
      { backgroundColor: colors.card }
    ];

    switch (variant) {
      case 'elevated':
        return [...baseStyle, styles.elevated, style];
      case 'outlined':
        return [...baseStyle, styles.outlined, { borderColor: colors.textMuted }, style];
      case 'flat':
        return [...baseStyle, styles.flat, style];
      default:
        return [...baseStyle, styles.default, style];
    }
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 6,
  },
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 24,
  },
  elevated: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  outlined: {
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  flat: {
    elevation: 0,
    shadowOpacity: 0,
  },
  default: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  }
});

