import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../../../theme/colors';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 54,
  strokeWidth = 5,
  color = palette.emerald,
  showPercentage = true,
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  // Cross-platform radial representation
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer border track */}
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
        ]}
      />

      {/* Dynamic colored arc / indicator */}
      <View
        style={[
          styles.indicator,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: clamped > 0 ? color : 'transparent',
            borderRightColor: clamped >= 25 ? color : 'transparent',
            borderBottomColor: clamped >= 50 ? color : 'transparent',
            borderLeftColor: clamped >= 75 ? color : 'transparent',
          },
        ]}
      />

      {/* Center percentage label */}
      {showPercentage && (
        <View style={styles.centerContent}>
          <Text style={[styles.percentageText, { fontSize: size > 50 ? 12 : 10 }]}>
            {clamped}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
  },
  indicator: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    color: palette.text,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
