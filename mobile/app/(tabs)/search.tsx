import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaCard } from '../../components/features/ideas/IdeaCard';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { TagChip } from '../../components/shared/TagChip';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';
import { useDebounce } from '../../hooks/useDebounce';
import { useHaptics } from '../../hooks/useHaptics';
import { useIdeaStore } from '../../store/ideaStore';
import { useProjectStore } from '../../store/projectStore';
import { useSearchStore } from '../../store/searchStore';

type EntityFilter = 'all' | 'ideas' | 'projects' | 'notes';

export default function SearchScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { ideas } = useIdeaStore();
  const { projects } = useProjectStore();
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useSearchStore();

  const [inputQuery, setInputQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [isAiSemantic, setIsAiSemantic] = useState(false);

  const debouncedQuery = useDebounce(inputQuery, 250);

  // Suggested tags cloud aggregated from all ideas and projects
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach((i) => i.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    projects.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [ideas, projects]);

  // Execute multi-entity search
  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) {
      return { matchedIdeas: [], matchedProjects: [] };
    }

    // AI Semantic simulation: matches loosely or synonym terms if toggled
    const matchedIdeas = ideas.filter((idea) => {
      if (idea.isArchived) return false;
      if (entityFilter === 'projects') return false;
      if (entityFilter === 'notes' && idea.type !== 'note') return false;
      if (entityFilter === 'ideas' && idea.type !== 'idea') return false;

      const titleMatch = idea.title.toLowerCase().includes(q);
      const descMatch = idea.description.toLowerCase().includes(q);
      const tagMatch = idea.tags.some((t) => t.toLowerCase().includes(q));

      // If AI Semantic is active, also match terms loosely or keywords
      const semanticMatch =
        isAiSemantic &&
        (idea.description.toLowerCase().split(' ').some((w) => q.includes(w) && w.length > 4) ||
          idea.tags.some((t) => q.includes(t.toLowerCase())));

      return titleMatch || descMatch || tagMatch || semanticMatch;
    });

    const matchedProjects = projects.filter((project) => {
      if (entityFilter === 'notes' || entityFilter === 'ideas') return false;

      const titleMatch = project.title.toLowerCase().includes(q);
      const descMatch = project.description.toLowerCase().includes(q);
      const taglineMatch = (project.tagline || '').toLowerCase().includes(q);
      const tagMatch = project.tags.some((t) => t.toLowerCase().includes(q));
      const techMatch = project.techStack.some((t) => t.toLowerCase().includes(q));

      const semanticMatch =
        isAiSemantic &&
        (project.techStack.some((t) => q.includes(t.toLowerCase())) ||
          project.description.toLowerCase().split(' ').some((w) => q.includes(w) && w.length > 4));

      return titleMatch || descMatch || taglineMatch || tagMatch || techMatch || semanticMatch;
    });

    return { matchedIdeas, matchedProjects };
  }, [debouncedQuery, entityFilter, isAiSemantic, ideas, projects]);

  const handleSubmit = () => {
    if (inputQuery.trim()) {
      addRecentSearch(inputQuery.trim());
    }
  };

  const handleSelectRecent = (q: string) => {
    haptics.light();
    setInputQuery(q);
  };

  const handleTagClick = (tag: string) => {
    haptics.light();
    setInputQuery(tag);
    addRecentSearch(tag);
  };

  const totalResults = results.matchedIdeas.length + results.matchedProjects.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.dark.textDim} style={styles.searchIcon} />
          <TextInput
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            placeholder="Search across all ideas, projects, tags..."
            placeholderTextColor={Colors.dark.textDim}
            style={styles.searchInput}
            autoFocus={false}
          />
          {inputQuery ? (
            <TouchableOpacity onPress={() => setInputQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.dark.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* AI Semantic Search Mode Bar */}
        <View style={styles.aiSemanticBar}>
          <View style={styles.aiSemanticLeft}>
            <Ionicons
              name="sparkles"
              size={15}
              color={isAiSemantic ? '#F59E0B' : Colors.dark.textDim}
            />
            <Text style={[styles.aiSemanticLabel, isAiSemantic && styles.aiSemanticLabelActive]}>
              AI Semantic Vector Search
            </Text>
          </View>
          <Switch
            value={isAiSemantic}
            onValueChange={(val) => {
              haptics.light();
              setIsAiSemantic(val);
            }}
            trackColor={{ false: '#263048', true: Colors.dark.primary }}
            thumbColor={isAiSemantic ? '#FFFFFF' : '#94A3B8'}
          />
        </View>

        {/* Entity Filters: All, Ideas, Projects, Notes */}
        <View style={styles.entityFiltersRow}>
          {(['all', 'ideas', 'projects', 'notes'] as EntityFilter[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setEntityFilter(f)}
              style={[
                styles.entityBtn,
                entityFilter === f && styles.entityBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.entityBtnText,
                  entityFilter === f && styles.entityBtnTextActive,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* If no query, show Recent Searches and Tag Cloud */}
        {!inputQuery.trim() ? (
          <View>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.recentList}>
                  {recentSearches.map((term) => (
                    <View key={term} style={styles.recentItem}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelectRecent(term)}
                        style={styles.recentTextBtn}
                      >
                        <Ionicons name="time-outline" size={15} color={Colors.dark.textDim} />
                        <Text style={styles.recentText}>{term}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeRecentSearch(term)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="close" size={14} color={Colors.dark.textDim} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Tags Exploration Cloud */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EXPLORE TOPICS & TAGS</Text>
              <View style={styles.tagCloud}>
                {popularTags.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    onPress={() => handleTagClick(tag)}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : (
          /* Search Results */
          <View>
            <View style={styles.resultMetaRow}>
              <Text style={styles.resultMetaText}>
                Found {totalResults} {totalResults === 1 ? 'match' : 'matches'} for "{debouncedQuery}"
              </Text>
              {isAiSemantic && (
                <View style={styles.semanticBadge}>
                  <Ionicons name="sparkles" size={11} color="#FBBF24" />
                  <Text style={styles.semanticBadgeText}>Semantic</Text>
                </View>
              )}
            </View>

            {/* Matched Projects */}
            {results.matchedProjects.length > 0 && (
              <View style={styles.resultBlock}>
                <Text style={styles.subBlockTitle}>PROJECTS ({results.matchedProjects.length})</Text>
                {results.matchedProjects.map((proj, i) => (
                  <ProjectCard key={proj.id} project={proj} index={i} />
                ))}
              </View>
            )}

            {/* Matched Ideas */}
            {results.matchedIdeas.length > 0 && (
              <View style={styles.resultBlock}>
                <Text style={styles.subBlockTitle}>IDEAS & NOTES ({results.matchedIdeas.length})</Text>
                {results.matchedIdeas.map((idea, i) => (
                  <IdeaCard key={idea.id} idea={idea} index={i} />
                ))}
              </View>
            )}

            {totalResults === 0 && (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={40} color={Colors.dark.textDim} />
                <Text style={styles.noResultsTitle}>No exact results found</Text>
                <Text style={styles.noResultsSub}>
                  Try enabling AI Semantic Search above or searching with different keywords.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm + 1,
  },
  aiSemanticBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  aiSemanticLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiSemanticLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  aiSemanticLabelActive: {
    color: '#FBBF24',
    fontWeight: Typography.weights.bold,
  },
  entityFiltersRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  entityBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  entityBtnActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryLight,
  },
  entityBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  entityBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  clearText: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.primaryLight,
  },
  recentList: {
    gap: Spacing.xs,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  recentTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  recentText: {
    fontSize: Typography.sizes.sm,
    color: Colors.dark.text,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  resultMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultMetaText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
  },
  semanticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  semanticBadgeText: {
    fontSize: 10,
    color: '#FBBF24',
    fontWeight: 'bold',
  },
  resultBlock: {
    marginBottom: Spacing.lg,
  },
  subBlockTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.xs,
  },
  noResultsTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    marginTop: Spacing.sm,
  },
  noResultsSub: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
});
