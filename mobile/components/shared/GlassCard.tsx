import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { palette } from '../../theme/colors';
import { Radii } from '../../constants/Theme';

interface GlassCardProps extends ViewProps {
  elevated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  elevated = false,
  intensity = 'medium',
  style,
  children,
  ...rest
}) => {
  const bgOpacity = intensity === 'low' ? 0.6 : intensity === 'high' ? 0.9 : 0.75;
  const backgroundColor = elevated
    ? `rgba(26, 33, 50, ${bgOpacity})`
    : `rgba(21, 27, 40, ${bgOpacity})`;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        elevated && styles.elevated,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: palette.borderLight,
    padding: 16,
    overflow: 'hidden',
  },
  elevated: {
    borderColor: 'rgba(99, 102, 241, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
});
