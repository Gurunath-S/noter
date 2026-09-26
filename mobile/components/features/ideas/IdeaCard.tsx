import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Idea } from '../../../types/idea';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { TypeBadge } from '../../shared/TypeBadge';
import { StatusChip } from '../../shared/StatusChip';
import { TagChip } from '../../shared/TagChip';
import { formatTimeAgo } from '../../../utils/date';
import { useHaptics } from '../../../hooks/useHaptics';

import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

export interface IdeaCardProps {
  idea: Idea;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  index?: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onPress,
  onToggleFavorite,
  index = 0,
}) => {
  const haptics = useHaptics();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/idea/${idea.id}` as any);
    }
  };

  const handleFavorite = (e: any) => {
    e.stopPropagation?.();
    haptics.selection();
    onToggleFavorite?.();
  };

  const completedCount = idea.checklist.filter((c) => c.completed).length;
  const totalCount = idea.checklist.length;

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
        {/* Top row: Type badge, status, favorite */}
        <View style={styles.headerRow}>
          <View style={styles.badges}>
            <TypeBadge type={idea.type} size="sm" />
            <View style={{ width: 6 }} />
            <StatusChip status={idea.status} size="sm" />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.favoriteBtn}
          >
            <Text style={styles.favoriteIcon}>
              {idea.isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {idea.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {idea.description}
        </Text>

        {/* Checklist Preview if any */}
        {totalCount > 0 && (
          <View style={styles.checklistBadge}>
            <Text style={styles.checklistIcon}>☑️</Text>
            <Text style={styles.checklistText}>
              {completedCount}/{totalCount} tasks
            </Text>
          </View>
        )}

        {/* Bottom row: Tags and relative time */}
        <View style={styles.footerRow}>
          <View style={styles.tagsContainer}>
            {idea.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} tag={tag} size="sm" />
            ))}
            {idea.tags.length > 3 && (
              <Text style={styles.moreTags}>+{idea.tags.length - 3}</Text>
            )}
          </View>

          <Text style={styles.timeAgo}>{formatTimeAgo(idea.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(21, 27, 40, 0.9)',
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteBtn: {
    padding: 2,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  checklistBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 12,
  },
  checklistIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  checklistText: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  moreTags: {
    fontSize: 11,
    color: palette.textMuted,
    fontWeight: '600',
    marginLeft: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: palette.textMuted,
    marginLeft: 8,
  },
});
