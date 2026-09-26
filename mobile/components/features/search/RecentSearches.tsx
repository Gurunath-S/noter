import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelect,
  onRemove,
  onClear,
}) => {
  if (!searches || searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsCloud}>
        {searches.map((term) => (
          <TouchableOpacity
            key={term}
            activeOpacity={0.75}
            onPress={() => onSelect(term)}
            style={styles.chip}
          >
            <Text style={styles.clockIcon}>🕒</Text>
            <Text style={styles.termText}>{term}</Text>
            <TouchableOpacity
              onPress={() => onRemove(term)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.textSecondary,
    letterSpacing: -0.2,
  },
  clearText: {
    fontSize: 12,
    color: palette.textMuted,
    fontWeight: '600',
  },
  tagsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clockIcon: {
    fontSize: 11,
    marginRight: 6,
    opacity: 0.6,
  },
  termText: {
    fontSize: 12,
    color: palette.text,
    fontWeight: '500',
  },
  closeBtn: {
    marginLeft: 6,
    padding: 2,
  },
  closeText: {
    fontSize: 14,
    color: palette.textMuted,
    fontWeight: '700',
    lineHeight: 14,
  },
});
