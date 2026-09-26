import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaCard } from '../../components/features/ideas/IdeaCard';
import { IdeaResurfacingCard } from '../../components/features/ideas/IdeaResurfacingCard';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../constants/Theme';
import { useResurfacedIdea } from '../../hooks/useResurfacedIdea';
import { useIdeaStore } from '../../store/ideaStore';
import { useProjectStore } from '../../store/projectStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function HomeScreen() {
  const router = useRouter();
  const { ideas, fetchIdeas, isLoading: ideasLoading } = useIdeaStore();
  const { projects, fetchProjects, isLoading: projLoading } = useProjectStore();
  const { streakDays, userName } = useSettingsStore();
  const { resurfacedIdea, daysAgo } = useResurfacedIdea();

  // Metrics calculation
  const totalIdeas = ideas.filter((i) => !i.isArchived).length;
  const activeProjects = projects.filter((p) => p.status === 'in_progress').length;
  const buildingIdeas = ideas.filter((i) => i.status === 'building').length;
  const totalNotes = ideas.filter((i) => i.type === 'note').length;

  const recentIdeas = ideas
    .filter((i) => !i.isArchived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = () => {
    fetchIdeas();
    fetchProjects();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={ideasLoading || projLoading}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primaryLight}
          />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Streak Pill */}
            <View style={styles.streakPill}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{streakDays}d streak</Text>
            </View>

            {/* AI Assist shortcut button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/ai-assist')}
              style={styles.aiButton}
            >
              <Ionicons name="sparkles" size={16} color="#F59E0B" />
              <Text style={styles.aiButtonText}>AI Brain</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Capture Tap Target Bar (< 3s capture flow) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/capture')}
          style={styles.quickCaptureBar}
        >
          <View style={styles.quickCaptureLeft}>
            <View style={styles.quickCaptureIcon}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickCapturePlaceholder}>
              Capture an idea or note in seconds...
            </Text>
          </View>
          <View style={styles.quickCaptureBadge}>
            <Text style={styles.quickCaptureBadgeText}>⚡ &lt;3s</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Ideas"
            value={totalIdeas}
            icon="bulb"
            accentColor={Colors.dark.accentViolet}
          />
          <StatCard
            label="Projects"
            value={activeProjects}
            icon="rocket"
            accentColor={Colors.dark.primaryLight}
          />
          <StatCard
            label="In Building"
            value={buildingIdeas}
            icon="construct"
            accentColor={Colors.dark.accentAmber}
          />
          <StatCard
            label="Notes"
            value={totalNotes}
            icon="document-text"
            accentColor={Colors.dark.accentCyan}
          />
        </View>

        {/* Idea Resurfacing Hero Widget */}
        {resurfacedIdea && (
          <View style={styles.resurfacingSection}>
            <IdeaResurfacingCard idea={resurfacedIdea} daysAgo={daysAgo} />
          </View>
        )}

        {/* Continue Building / Active Projects Carousel */}
        {projects.length > 0 && (
          <View style={styles.projectsSection}>
            <SectionHeader
              title="Continue Building"
              subtitle="Your active pipeline"
              actionText="View All"
              actionIcon="chevron-forward"
              onActionPress={() => router.push('/(tabs)/projects')}
            />
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </View>
        )}

        {/* Recent Captures Feed */}
        <View style={styles.recentSection}>
          <SectionHeader
            title="Recent Captures"
            subtitle="Latest thoughts & inspirations"
            actionText="Library"
            actionIcon="chevron-forward"
            onActionPress={() => router.push('/(tabs)/ideas')}
          />
          {recentIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </View>

        {/* Daily Second Brain Quote */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="rgba(99, 102, 241, 0.35)" style={styles.quoteIcon} />
          <Text style={styles.quoteText}>
            "Your mind is for having ideas, not holding them."
          </Text>
          <Text style={styles.quoteAuthor}>— David Allen, Getting Things Done</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#FBBF24',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    gap: 4,
  },
  aiButtonText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.primaryLight,
  },
  quickCaptureBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorderHover,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  quickCaptureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickCaptureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  quickCapturePlaceholder: {
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  quickCaptureBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  quickCaptureBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.accentEmerald,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  resurfacingSection: {
    marginVertical: Spacing.xs,
  },
  projectsSection: {
    marginVertical: Spacing.xs,
  },
  recentSection: {
    marginVertical: Spacing.xs,
  },
  quoteCard: {
    backgroundColor: 'rgba(18, 22, 34, 0.6)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  quoteText: {
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    color: Colors.dark.textMuted,
    lineHeight: 20,
    marginBottom: 6,
    paddingRight: 24,
  },
  quoteAuthor: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textDim,
    fontWeight: Typography.weights.semibold,
  },
});
