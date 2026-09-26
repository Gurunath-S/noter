import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FilterOptions, IdeaType, SortOption, Status } from '../../../types/common';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters?: FilterOptions;
  onApplyFilters?: (filters: Partial<FilterOptions>) => void;
  onReset?: () => void;
}

const TYPES: { label: string; value: IdeaType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: '💡 Idea', value: 'idea' },
  { label: '📝 Note', value: 'note' },
  { label: '🎯 Goal', value: 'goal' },
  { label: '🧪 Experiment', value: 'experiment' },
  { label: '🐛 Problem', value: 'problem' },
  { label: '💭 Thought', value: 'thought' },
  { label: '📚 Learning', value: 'learning' },
];

const STATUSES: { label: string; value: Status | 'all' }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: '💡 Idea', value: 'idea' },
  { label: '🔨 Building', value: 'building' },
  { label: '⏸️ Parked', value: 'parked' },
  { label: '✅ Completed', value: 'completed' },
  { label: '🗂️ Archived', value: 'archived' },
];

const SORTS: { label: string; value: SortOption }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Priority', value: 'priority' },
  { label: 'Alphabetical (A-Z)', value: 'alphabetical' },
  { label: 'Favorites First', value: 'favorites' },
];

export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  filters = { type: 'all', status: 'all', sortBy: 'newest', favoritesOnly: false },
  onApplyFilters,
  onReset,
}) => {
  const [selectedType, setSelectedType] = React.useState<IdeaType | 'all'>(filters?.type || 'all');
  const [selectedStatus, setSelectedStatus] = React.useState<Status | 'all'>(filters?.status || 'all');
  const [selectedSort, setSelectedSort] = React.useState<SortOption>(filters?.sortBy || 'newest');
  const [favoritesOnly, setFavoritesOnly] = React.useState<boolean>(filters?.favoritesOnly || false);

  React.useEffect(() => {
    setSelectedType(filters?.type || 'all');
    setSelectedStatus(filters?.status || 'all');
    setSelectedSort(filters?.sortBy || 'newest');
    setFavoritesOnly(filters?.favoritesOnly || false);
  }, [filters, visible]);

  const handleApply = () => {
    onApplyFilters?.({
      type: selectedType,
      status: selectedStatus,
      sortBy: selectedSort,
      favoritesOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedSort('newest');
    setFavoritesOnly(false);
    onReset?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters & Sorting</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sort Options */}
            <Text style={styles.sectionTitle}>SORT BY</Text>
            <View style={styles.optionsWrap}>
              {SORTS.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  onPress={() => setSelectedSort(s.value)}
                  style={[styles.pill, selectedSort === s.value && styles.pillActive]}
                >
                  <Text style={[styles.pillText, selectedSort === s.value && styles.pillTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Type Options */}
            <Text style={styles.sectionTitle}>ENTRY TYPE</Text>
            <View style={styles.optionsWrap}>
              {TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setSelectedType(t.value)}
                  style={[styles.pill, selectedType === t.value && styles.pillActive]}
                >
                  <Text style={[styles.pillText, selectedType === t.value && styles.pillTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Options */}
            <Text style={styles.sectionTitle}>STATUS</Text>
            <View style={styles.optionsWrap}>
              {STATUSES.map((st) => (
                <TouchableOpacity
                  key={st.value}
                  onPress={() => setSelectedStatus(st.value)}
                  style={[styles.pill, selectedStatus === st.value && styles.pillActive]}
                >
                  <Text style={[styles.pillText, selectedStatus === st.value && styles.pillTextActive]}>
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Favorites Toggle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setFavoritesOnly(!favoritesOnly)}
              style={styles.favRow}
            >
              <Text style={styles.favLabel}>Only Show Favorites ❤️</Text>
              <View style={[styles.toggle, favoritesOnly && styles.toggleActive]}>
                <View style={[styles.toggleKnob, favoritesOnly && styles.toggleKnobActive]} />
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'rgba(21, 27, 40, 0.98)',
    borderTopLeftRadius: Radii.cardLg,
    borderTopRightRadius: Radii.cardLg,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  closeIcon: {
    color: palette.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.textMuted,
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  pillText: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  favRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  favLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: palette.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  resetBtnText: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: palette.primary,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
