import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actionText?: string;
  actionIcon?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  count,
  actionText,
  actionIcon,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {count !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {(actionText || actionIcon) && onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7} style={styles.actionBtn}>
          {actionText && <Text style={styles.actionText}>{actionText}</Text>}
          {actionIcon && (
            <Ionicons
              name={actionIcon as any}
              size={15}
              color={palette.primaryLight}
              style={actionText ? { marginLeft: 4 } : undefined}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primaryLight,
  },
  subtitle: {
    fontSize: 12,
    color: palette.textMuted,
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.primaryLight,
  },
});
