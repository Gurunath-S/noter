import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectTimelineEvent } from '../../../types/project';
import { palette } from '../../../theme/colors';

interface ProjectTimelineProps {
  events: ProjectTimelineEvent[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Project Timeline</Text>
      <View style={styles.timelineList}>
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          return (
            <View key={event.id} style={styles.eventRow}>
              {/* Vertical line and dot */}
              <View style={styles.lineContainer}>
                <View style={styles.dot} />
                {!isLast && <View style={styles.verticalLine} />}
              </View>

              {/* Event Content */}
              <View style={styles.contentBox}>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && (
                  <Text style={styles.eventDesc}>{event.description}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  timelineList: {
    paddingLeft: 4,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  lineContainer: {
    alignItems: 'center',
    marginRight: 14,
    width: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
    borderWidth: 2,
    borderColor: palette.primaryLight,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    marginTop: 4,
  },
  contentBox: {
    flex: 1,
  },
  eventDate: {
    fontSize: 11,
    color: palette.textMuted,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginTop: 2,
  },
  eventDesc: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
