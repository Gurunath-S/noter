import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette } from '../../theme/colors';
import { Radii } from '../../constants/Theme';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  accentColor?: string;
  onPress?: () => void;
  sublabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accentColor = palette.primary,
  onPress,
  sublabel,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.card,
        {
          borderColor: `${accentColor}33`, // 20% opacity border
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(21, 27, 40, 0.85)',
    borderRadius: Radii.card,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minWidth: 105,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  sublabel: {
    fontSize: 10,
    color: palette.textMuted,
    marginTop: 2,
  },
});
