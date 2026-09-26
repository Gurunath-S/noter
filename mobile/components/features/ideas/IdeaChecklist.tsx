import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, LinearTransition, FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { ChecklistItem } from '../../../types/idea';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { useHaptics } from '../../../hooks/useHaptics';

export interface IdeaChecklistProps {
  items: Array<ChecklistItem | { id: string; text: string; completed: boolean; createdAt?: string }>;
  onToggleItem?: (id: string) => void;
  onAddItem?: (text: string) => void;
  onToggle?: (id: string) => void;
  onAdd?: (text: string) => void;
  readOnly?: boolean;
}

export const IdeaChecklist: React.FC<IdeaChecklistProps> = ({
  items = [],
  onToggleItem,
  onAddItem,
  onToggle,
  onAdd,
  readOnly = false,
}) => {
  const haptics = useHaptics();
  const [newText, setNewText] = useState('');

  const toggleHandler = onToggleItem || onToggle;
  const addHandler = onAddItem || onAdd;

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progressPercent}%`, { damping: 20, stiffness: 120 }),
    };
  }, [progressPercent]);

  const handleToggle = (id: string) => {
    if (readOnly || !toggleHandler) return;
    haptics.selection();
    toggleHandler(id);
  };

  const handleAdd = () => {
    if (!newText.trim() || !addHandler) return;
    haptics.light();
    addHandler(newText.trim());
    setNewText('');
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Checklist & Action Items</Text>
        <Text style={styles.progressText}>
          {completedCount}/{totalCount} ({Math.round(progressPercent)}%)
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, progressStyle]} />
      </View>

      {/* List items */}
      <View style={styles.list}>
        {items.map((item) => (
          <Animated.View
            key={item.id}
            layout={LinearTransition.springify().damping(16).stiffness(120)}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggle(item.id)}
              disabled={readOnly}
              style={styles.itemRow}
            >
              <View
                style={[
                  styles.checkbox,
                  item.completed && styles.checkboxCompleted,
                ]}
              >
                {item.completed && (
                  <Animated.Text entering={ZoomIn.duration(250)} style={styles.checkmark}>
                    ✓
                  </Animated.Text>
                )}
              </View>

              <Text
                style={[
                  styles.itemText,
                  item.completed && styles.itemTextCompleted,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Inline Add Input */}
      {!readOnly && addHandler && (
        <View style={styles.addInputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add action item..."
            placeholderTextColor={palette.textMuted}
            value={newText}
            onChangeText={setNewText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAdd}
            disabled={!newText.trim()}
            style={[styles.addButton, !newText.trim() && styles.addButtonDisabled]}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.emerald,
    borderRadius: 3,
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: palette.borderActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  itemText: {
    fontSize: 14,
    color: palette.text,
    flex: 1,
    lineHeight: 20,
  },
  itemTextCompleted: {
    color: palette.textMuted,
    textDecorationLine: 'line-through',
  },
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: palette.text,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.sm,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
