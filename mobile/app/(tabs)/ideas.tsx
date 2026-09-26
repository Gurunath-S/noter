import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaCard } from '../../components/features/ideas/IdeaCard';
import { IdeaMasonryCard } from '../../components/features/ideas/IdeaMasonryCard';
import { FilterSheet } from '../../components/features/search/FilterSheet';
import { EmptyState } from '../../components/shared/EmptyState';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';
import { useIdeaStore } from '../../store/ideaStore';
import { useSearchStore } from '../../store/searchStore';
import { IdeaType } from '../../types/common';

const TYPE_PILLS: Array<{ id: IdeaType | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'idea', label: '💡 Ideas' },
  { id: 'note', label: '📝 Notes' },
  { id: 'goal', label: '🎯 Goals' },
  { id: 'experiment', label: '🧪 Experiments' },
  { id: 'problem', label: '🐛 Problems' },
  { id: 'thought', label: '💭 Thoughts' },
  { id: 'learning', label: '📚 Learnings' },
];

export default function IdeasScreen() {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const {
    searchQuery,
    setSearchQuery,
    activeType,
    setActiveType,
    activeStatus,
    sortBy,
  } = useSearchStore();

  const [viewMode, setViewMode] = useState<'masonry' | 'list'>('masonry');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter & Sort logic
  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((idea) => {
        if (idea.isArchived && activeStatus !== 'archived') return false;
        if (!idea.isArchived && activeStatus === 'archived') return false;

        // Type filter
        if (activeType !== 'all' && idea.type !== activeType) return false;

        // Status filter
        if (activeStatus !== 'all' && idea.status !== activeStatus) return false;

        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = idea.title.toLowerCase().includes(q);
          const matchDesc = idea.description.toLowerCase().includes(q);
          const matchTag = idea.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'favorites') {
          if (a.isFavorite === b.isFavorite) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.isFavorite ? -1 : 1;
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority') {
          const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        // Newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [ideas, activeType, activeStatus, sortBy, searchQuery]);

  // Split items for 2-column Pinterest Masonry layout
  const [leftCol, rightCol] = useMemo(() => {
    const left: typeof filteredIdeas = [];
    const right: typeof filteredIdeas = [];
    filteredIdeas.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    return [left, right];
  }, [filteredIdeas]);

  const activeFiltersCount =
    (activeType !== 'all' ? 1 : 0) +
    (activeStatus !== 'all' ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Sticky Top Header with Search and Filter Button */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.dark.textDim} style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search ideas, notes, tags..."
            placeholderTextColor={Colors.dark.textDim}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.dark.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Sheet Trigger */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterModalVisible(true)}
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFiltersCount > 0 ? '#FFFFFF' : Colors.dark.text}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* View Mode Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewMode(viewMode === 'masonry' ? 'list' : 'masonry')}
          style={styles.viewToggleBtn}
        >
          <Ionicons
            name={viewMode === 'masonry' ? 'list' : 'grid'}
            size={18}
            color={Colors.dark.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal Type Filter Pills */}
      <View style={styles.pillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          {TYPE_PILLS.map((pill) => {
            const isSelected = activeType === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setActiveType(pill.id)}
                style={[styles.pill, isSelected && styles.pillSelected]}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Count Header */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing {filteredIdeas.length} {filteredIdeas.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Content Feed: Masonry vs List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredIdeas.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No ideas match your filters"
            description="Try changing the type, status, or search query to find what you're looking for."
            actionText="Quick Capture Idea"
            onAction={() => router.push('/capture')}
          />
        ) : viewMode === 'masonry' ? (
          <View style={styles.masonryRow}>
            {/* Left Column */}
            <View style={styles.masonryColumn}>
              {leftCol.map((idea) => (
                <IdeaMasonryCard key={idea.id} idea={idea} />
              ))}
            </View>
            {/* Right Column */}
            <View style={styles.masonryColumn}>
              {rightCol.map((idea) => (
                <IdeaMasonryCard key={idea.id} idea={idea} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredIdeas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal Sheet */}
      <FilterSheet
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryLight,
  },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.dark.accentPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  pillsContainer: {
    marginVertical: Spacing.sm,
  },
  pillsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs + 2,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryLight,
  },
  pillText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  countRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textDim,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  masonryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  masonryColumn: {
    flex: 1,
  },
  listContainer: {
    gap: Spacing.xs,
  },
});
