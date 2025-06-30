import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

export const Button = ({ title, onPress, variant = 'primary', size = 'medium', style, textStyle }) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondary, { borderColor: colors.primary }, style];
      case 'outline':
        return [...baseStyle, styles.outline, { borderColor: colors.primary }, style];
      default:
        return [...baseStyle, { backgroundColor: colors.primary }, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
        return [styles.text, { color: colors.primary }, textStyle];
      default:
        return [styles.text, { color: colors.onPrimary }, textStyle];
    }
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

