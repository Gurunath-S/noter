import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Project } from '../../../types/project';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { ProgressRing } from './ProgressRing';
import { StatusChip } from '../../shared/StatusChip';
import { TagChip } from '../../shared/TagChip';
import { formatDate } from '../../../utils/date';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

export interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress, index = 0 }) => {
  const completedTasks = (project.tasks || []).filter((t) => t.completed).length;
  const totalTasks = (project.tasks || []).length;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/project/${project.id}` as any);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      exiting={FadeOutUp}
      layout={LinearTransition.springify()}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.titleArea}>
            <View style={styles.statusRow}>
              <StatusChip status={project.status} size="sm" />
              {(project.deadline || project.targetDeadline) && (
                <View style={styles.deadlineContainer}>
                  <Text style={styles.calendarIcon}>📅</Text>
                  <Text style={styles.deadlineText}>
                    {formatDate(project.deadline || project.targetDeadline || '')}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {project.title}
            </Text>
            {project.tagline && (
              <Text style={styles.tagline} numberOfLines={1}>
                {project.tagline}
              </Text>
            )}
          </View>

          {/* Circular progress gauge */}
          <ProgressRing progress={project.progress} size={52} strokeWidth={5} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>

        {/* Next Action Callout */}
        {project.nextAction ? (
          <View style={styles.nextActionBox}>
            <Text style={styles.nextActionLabel}>NEXT ACTION</Text>
            <Text style={styles.nextActionText} numberOfLines={1}>
              {project.nextAction}
            </Text>
          </View>
        ) : null}

        {/* Footer: Tasks count & Tech Stack badges */}
        <View style={styles.footerRow}>
          <View style={styles.tasksBadge}>
            <Text style={styles.tasksIcon}>⚡</Text>
            <Text style={styles.tasksText}>
              {completedTasks}/{totalTasks} tasks
            </Text>
          </View>

          <View style={styles.techStackContainer}>
            {(project.techStack || []).slice(0, 3).map((tech) => (
              <TagChip key={tech} tag={tech} size="sm" />
            ))}
            {(project.techStack || []).length > 3 && (
              <Text style={styles.moreTech}>+{(project.techStack || []).length - 3}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderRadius: Radii.cardLg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleArea: {
    flex: 1,
    marginRight: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  calendarIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  deadlineText: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 12,
    color: palette.textMuted,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  nextActionBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  nextActionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: palette.primaryLight,
    letterSpacing: 0.5,
  },
  nextActionText: {
    fontSize: 12,
    color: palette.text,
    fontWeight: '500',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
  tasksBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tasksIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  tasksText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  techStackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreTech: {
    fontSize: 11,
    color: palette.textMuted,
    fontWeight: '600',
  },
});
