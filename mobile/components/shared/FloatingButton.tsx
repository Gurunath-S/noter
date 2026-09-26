import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { palette } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export interface FloatingButtonProps {
  onPress?: () => void;
  icon?: string;
  label?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = '+',
  label,
}) => {
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.impact();
    if (onPress) {
      onPress();
    } else {
      router.push('/capture' as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.fab, label ? styles.fabExtended : styles.fabCircle]}
    >
      <View style={styles.glow} />
      <Text style={styles.icon}>{icon}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 100,
  },
  fabCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fabExtended: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: palette.primaryLight,
    opacity: 0.2,
  },
  icon: {
    fontSize: 28,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
