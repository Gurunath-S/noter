import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../../components/features/projects/ProgressRing';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { GlassCard } from '../../components/shared/GlassCard';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';
import { useProjectStore } from '../../store/projectStore';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects } = useProjectStore();
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === 'in_progress' || p.status === 'planning'),
    [projects]
  );

  const completedProjects = useMemo(
    () => projects.filter((p) => p.status === 'completed' || p.progress >= 100),
    [projects]
  );

  const currentList = tab === 'active' ? activeProjects : completedProjects;

  // Overall sprint progress calculation
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const doneTasks = projects.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );
  const sprintProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Active Projects</Text>
          <Text style={styles.pageSubtitle}>Ideas turned into execution pipelines</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/capture')}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sprint Overview Summary Card */}
        <GlassCard elevated style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>TOTAL SPRINT VELOCITY</Text>
              <Text style={styles.summaryTitle}>Active Pipelines</Text>
              <Text style={styles.summaryStats}>
                {doneTasks} of {totalTasks} roadmap tasks shipped across {projects.length} projects
              </Text>
            </View>
            <View style={styles.ringWrapper}>
              <ProgressRing
                progress={sprintProgress}
                size={68}
                strokeWidth={7}
                color={Colors.dark.accentEmerald}
              />
            </View>
          </View>
        </GlassCard>

        {/* Tab Segment Selector */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTab('active')}
            style={[styles.segmentBtn, tab === 'active' && styles.segmentBtnActive]}
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'active' && styles.segmentTextActive,
              ]}
            >
              In Progress ({activeProjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTab('completed')}
            style={[styles.segmentBtn, tab === 'completed' && styles.segmentBtnActive]}
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'completed' && styles.segmentTextActive,
              ]}
            >
              Shipped ({completedProjects.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Projects List */}
        {currentList.length === 0 ? (
          <EmptyState
            icon="rocket-outline"
            title={tab === 'active' ? 'No active projects' : 'No completed projects yet'}
            description={
              tab === 'active'
                ? 'Convert any captured idea into a project to start tracking tasks and milestones.'
                : 'Complete all checklist tasks in a project to see it shipped here!'
            }
            actionText={tab === 'active' ? 'Browse Ideas to Convert' : undefined}
            onAction={tab === 'active' ? () => router.push('/(tabs)/ideas') : undefined}
          />
        ) : (
          currentList.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pageTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  summaryCard: {
    marginVertical: Spacing.md,
    padding: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  summaryStats: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    lineHeight: 18,
  },
  ringWrapper: {
    paddingLeft: Spacing.sm,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    marginBottom: Spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  segmentBtnActive: {
    backgroundColor: Colors.dark.primary,
  },
  segmentText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
});
