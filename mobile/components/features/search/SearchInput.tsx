import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search ideas, projects, notes...',
  onFilterPress,
  hasActiveFilters = false,
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {value.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChangeText('')}
            style={styles.clearBtn}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onFilterPress}
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {hasActiveFilters && <View style={styles.activeDot} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    color: palette.textMuted,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: Radii.card,
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  filterIcon: {
    fontSize: 18,
  },
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
});
