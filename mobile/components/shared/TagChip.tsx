import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getTagColor } from '../../utils/colors';

export interface TagChipProps {
  tag?: string;
  label?: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  label,
  selected = false,
  onPress,
  onRemove,
  onDelete,
  size = 'md',
}) => {
  const effectiveTag = tag || label || '';
  const color = getTagColor(effectiveTag);
  const cleanTag = effectiveTag.startsWith('#') ? effectiveTag.slice(1) : effectiveTag;
  const handleRemove = onRemove || onDelete;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        size === 'sm' ? styles.chipSm : styles.chipMd,
        {
          backgroundColor: selected ? color.text : color.bg,
          borderColor: color.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: selected ? '#0B0D13' : color.text },
        ]}
      >
        #{cleanTag}
      </Text>
      {handleRemove && (
        <TouchableOpacity
          onPress={handleRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.removeButton}
        >
          <Text style={[styles.removeText, { color: selected ? '#0B0D13' : color.text }]}>
            ×
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
  removeButton: {
    marginLeft: 4,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
});
