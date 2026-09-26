import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { Idea } from '../../../types/idea';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { useHaptics } from '../../../hooks/useHaptics';
import { useToast } from '../../shared/Toast';
import { useIdeaStore } from '../../../store/ideaStore';

interface IdeaResurfacingCardProps {
  idea: Idea;
  daysAgo: number;
  onViewAgain?: () => void;
  onStillInteresting?: () => void;
  onTurnIntoProject?: () => void;
  onArchive?: () => void;
}

export const IdeaResurfacingCard: React.FC<IdeaResurfacingCardProps> = ({
  idea,
  daysAgo,
  onViewAgain,
  onStillInteresting,
  onTurnIntoProject,
  onArchive,
}) => {
  const haptics = useHaptics();
  const { showToast } = useToast();
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleViewAgain = () => {
    haptics.impact();
    if (onViewAgain) {
      onViewAgain();
    } else {
      router.push(`/idea/${idea.id}`);
    }
  };

  const handleStillInteresting = () => {
    haptics.success();
    showToast('Kept in your active brain rotation! 🧠', 'success');
    if (onStillInteresting) {
      onStillInteresting();
    }
  };

  const handleTurnIntoProject = () => {
    haptics.impact();
    if (onTurnIntoProject) {
      onTurnIntoProject();
    } else {
      router.push(`/idea/${idea.id}`);
    }
  };

  const handleArchive = () => {
    haptics.warning();
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      showToast('Archived idea to vault 🗂️', 'info');
      if (onArchive) {
        onArchive();
      } else {
        useIdeaStore.getState().archiveIdea(idea.id);
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Resurfacing Badge */}
      <View style={styles.topRow}>
        <View style={styles.resurfaceBadge}>
          <Text style={styles.sparkleIcon}>⚡</Text>
          <Text style={styles.resurfaceText}>
            You captured this {daysAgo > 0 ? `${daysAgo} days ago` : 'previously'}
          </Text>
        </View>
        <Text style={styles.memoryIcon}>🕰️</Text>
      </View>

      {/* Title & Preview */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleViewAgain}>
        <Text style={styles.title}>{idea.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {idea.description}
        </Text>
      </TouchableOpacity>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleViewAgain}
          style={[styles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>View Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleTurnIntoProject}
          style={[styles.btn, styles.btnAccent]}
        >
          <Text style={styles.btnAccentText}>Turn Into Project 🔨</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleStillInteresting}
          style={[styles.btn, styles.btnOutline]}
        >
          <Text style={styles.btnOutlineText}>Still Good ✨</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleArchive}
          style={[styles.btn, styles.btnGhost]}
        >
          <Text style={styles.btnGhostText}>Archive</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderRadius: Radii.cardLg,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    padding: 18,
    marginVertical: 10,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resurfaceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  sparkleIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  resurfaceText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primaryLight,
  },
  memoryIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: palette.primary,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnAccent: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  btnAccentText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
  },
  btnOutline: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: palette.border,
  },
  btnOutlineText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnGhostText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});
