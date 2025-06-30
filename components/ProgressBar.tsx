import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from './ThemeProvider';

export const ProgressBar = ({ progress, height = 8, animated = true, style }) => {
  const { colors } = useTheme();
  const [progressAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated]);

  const progressWidth = animated ? progressAnim : progress;

  return (
    <View style={[styles.container, { height, backgroundColor: colors.textMuted + '30' }, style]}>
      <Animated.View 
        style={[
          styles.bar, 
          { 
            backgroundColor: getProgressColor(progress * 100, colors),
            height,
            width: progressWidth.interpolate ? 
              progressWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }) : `${progress * 100}%`,
          }
        ]} 
      />
    </View>
  );
};

const getProgressColor = (percentage, colors) => {
  if (percentage >= 80) return '#4CAF50'; // Green
  if (percentage >= 60) return '#FF9800'; // Orange
  if (percentage >= 40) return '#FFC107'; // Yellow
  return '#F44336'; // Red
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 10,
    minWidth: 2,
  },
});

