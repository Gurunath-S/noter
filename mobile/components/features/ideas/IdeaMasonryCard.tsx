import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Idea } from '../../../types/idea';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { TypeBadge } from '../../shared/TypeBadge';
import { TagChip } from '../../shared/TagChip';
import { formatTimeAgo } from '../../../utils/date';
import { useHaptics } from '../../../hooks/useHaptics';

import { router } from 'expo-router';

export interface IdeaMasonryCardProps {
  idea: Idea;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

export const IdeaMasonryCard: React.FC<IdeaMasonryCardProps> = ({
  idea,
  onPress,
  onToggleFavorite,
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

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <TypeBadge type={idea.type} size="sm" />
        <TouchableOpacity
          onPress={handleFavorite}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.favIcon}>{idea.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <Animated.Text 
        sharedTransitionTag={`idea-title-${idea.id}`} 
        style={styles.title} 
        numberOfLines={3}
      >
        {idea.title}
      </Animated.Text>

      <Text style={styles.description} numberOfLines={4}>
        {idea.description}
      </Text>

      {/* Tags */}
      {idea.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {idea.tags.slice(0, 2).map((t) => (
            <TagChip key={t} tag={t} size="sm" />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.statusDot}>
          {idea.status === 'building' ? '🔨 Building' : idea.status === 'completed' ? '✅ Done' : '💡 Idea'}
        </Text>
        <Text style={styles.timeText}>{formatTimeAgo(idea.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favIcon: {
    fontSize: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: palette.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
    marginTop: 2,
  },
  statusDot: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.textMuted,
  },
  timeText: {
    fontSize: 10,
    color: palette.textMuted,
  },
});
