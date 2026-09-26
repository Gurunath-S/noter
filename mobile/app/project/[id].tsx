import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../../components/features/projects/ProgressRing';
import { GlassCard } from '../../components/shared/GlassCard';
import { TagChip } from '../../components/shared/TagChip';
import { showToast } from '../../components/shared/Toast';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';
import { useHaptics } from '../../hooks/useHaptics';
import { useProjectStore } from '../../store/projectStore';

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const haptics = useHaptics();

  const {
    projects,
    toggleTask,
    addTask,
    removeTask,
    toggleMilestone,
    deleteProject,
  } = useProjectStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTech, setNewTech] = useState('');
  const [showAddTech, setShowAddTech] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

  if (!project) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.dark.textMuted} />
          <Text style={styles.notFoundText}>Project not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;

  const handleToggleTask = (taskId: string) => {
    haptics.light();
    toggleTask(project.id, taskId);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    haptics.medium();
    addTask(project.id, newTaskTitle.trim());
    setNewTaskTitle('');
    showToast('Task added to sprint!', 'success');
  };

  const handleDeleteTask = (taskId: string) => {
    haptics.light();
    removeTask(project.id, taskId);
  };

  const handleDeleteProject = () => {
    const doDelete = async () => {
      haptics.medium();
      await deleteProject(project.id);
      showToast('Project deleted', 'info');
      router.back();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this project?')) {
        doDelete();
      }
    } else {
      Alert.alert('Delete Project', 'Are you sure you want to delete this project?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const ringColor =
    project.progress >= 100
      ? Colors.dark.success
      : project.progress >= 50
      ? Colors.dark.primaryLight
      : Colors.dark.accentAmber;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header card with Progress Gauge */}
        <GlassCard elevated style={styles.headerCard}>
          <View style={styles.topRow}>
            <View style={{ flex: 1, paddingRight: Spacing.md }}>
              <Text style={styles.title}>{project.title}</Text>
              <Text style={styles.tagline}>{project.tagline}</Text>
            </View>
            <ProgressRing progress={project.progress} size={72} strokeWidth={7} color={ringColor} />
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>TASKS</Text>
              <Text style={styles.metricValue}>
                {completedTasks}/{totalTasks}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>STATUS</Text>
              <Text style={[styles.metricValue, { color: Colors.dark.accentAmber }]}>
                {project.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>DEADLINE</Text>
              <Text style={styles.metricValue}>
                {project.targetDeadline || 'None set'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Source Idea Link if created from Idea */}
        {project.sourceIdeaId && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/idea/${project.sourceIdeaId}`)}
            style={styles.sourceIdeaBanner}
          >
            <Ionicons name="bulb-outline" size={16} color={Colors.dark.accentViolet} />
            <Text style={styles.sourceIdeaText}>Originated from Idea • View Original Concept</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.dark.accentViolet} />
          </TouchableOpacity>
        )}

        {/* Tech Stack Pills */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TECH STACK & TOOLS</Text>
            <TouchableOpacity onPress={() => setShowAddTech(!showAddTech)}>
              <Text style={styles.actionText}>{showAddTech ? 'Cancel' : '+ Add Tech'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.techPills}>
            {project.techStack.map((tech) => (
              <TagChip key={tech} label={tech} />
            ))}
          </View>

          {showAddTech && (
            <View style={styles.addTechRow}>
              <TextInput
                value={newTech}
                onChangeText={setNewTech}
                placeholder="e.g. Redis, Docker, Tailwind"
                placeholderTextColor={Colors.dark.textDim}
                style={styles.techInput}
              />
              <TouchableOpacity
                onPress={() => {
                  if (newTech.trim()) {
                    project.techStack.push(newTech.trim());
                    setNewTech('');
                    setShowAddTech(false);
                    showToast('Tech badge added!');
                  }
                }}
                style={styles.techAddBtn}
              >
                <Text style={styles.techAddBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>

        {/* Sprint Tasks Checklist */}
        <GlassCard style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              ROADMAP TASKS ({completedTasks}/{totalTasks})
            </Text>
          </View>

          {project.tasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleTask(task.id)}
                style={styles.taskCheckWrapper}
              >
                <Ionicons
                  name={task.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={task.completed ? Colors.dark.success : Colors.dark.textMuted}
                />
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleDone,
                  ]}
                >
                  {task.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(task.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={16} color={Colors.dark.textDim} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Inline Add Task */}
          <View style={styles.addTaskRow}>
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              onSubmitEditing={handleAddTask}
              placeholder="Add next roadmap task..."
              placeholderTextColor={Colors.dark.textDim}
              style={styles.addTaskInput}
            />
            <TouchableOpacity
              onPress={handleAddTask}
              disabled={!newTaskTitle.trim()}
              style={[
                styles.addTaskBtn,
                { opacity: newTaskTitle.trim() ? 1 : 0.4 },
              ]}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Milestones */}
        {project.milestones && project.milestones.length > 0 && (
          <GlassCard style={styles.card}>
            <Text style={styles.sectionTitle}>MILESTONES & RELEASES</Text>
            {project.milestones.map((ms) => (
              <TouchableOpacity
                key={ms.id}
                activeOpacity={0.7}
                onPress={() => {
                  haptics.light();
                  toggleMilestone(project.id, ms.id);
                }}
                style={styles.milestoneRow}
              >
                <Ionicons
                  name={ms.achieved ? 'trophy' : 'flag-outline'}
                  size={18}
                  color={ms.achieved ? '#FBBF24' : Colors.dark.textMuted}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.milestoneTitle,
                      ms.achieved && styles.milestoneTitleAchieved,
                    ]}
                  >
                    {ms.title}
                  </Text>
                  {ms.date && <Text style={styles.milestoneDate}>{ms.date}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </GlassCard>
        )}

        {/* Danger zone delete */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDeleteProject}
          style={styles.deleteProjectBtn}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.dark.danger} />
          <Text style={styles.deleteProjectText}>Delete Project</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingTop: Spacing.md,
  },
  headerCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  tagline: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    lineHeight: 18,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: Spacing.md,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  sourceIdeaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sourceIdeaText: {
    fontSize: Typography.sizes.xs + 1,
    color: '#A78BFA',
    fontWeight: Typography.weights.semibold,
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
  },
  actionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  techPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  addTechRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  techInput: {
    flex: 1,
    backgroundColor: Colors.dark.inputBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    color: Colors.dark.text,
    paddingHorizontal: Spacing.md,
    height: 38,
    fontSize: Typography.sizes.sm,
  },
  techAddBtn: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAddBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Typography.sizes.sm,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  taskCheckWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  taskTitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.dark.text,
    flex: 1,
    lineHeight: 20,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.dark.textDim,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.dark.inputBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingHorizontal: Spacing.md,
  },
  addTaskInput: {
    flex: 1,
    height: 40,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  addTaskBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  milestoneTitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.dark.text,
    fontWeight: Typography.weights.medium,
  },
  milestoneTitleAchieved: {
    color: '#FBBF24',
    fontWeight: Typography.weights.bold,
  },
  milestoneDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textDim,
    marginTop: 2,
  },
  deleteProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  deleteProjectText: {
    color: Colors.dark.danger,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  notFoundText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  backBtn: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
  },
});
