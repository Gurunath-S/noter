import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConvertToProjectModal } from '../../components/features/ideas/ConvertToProjectModal';
import { IdeaCard } from '../../components/features/ideas/IdeaCard';
import { IdeaChecklist } from '../../components/features/ideas/IdeaChecklist';
import { MarkdownPreview } from '../../components/features/notes/MarkdownPreview';
import { VoiceNoteWidget } from '../../components/features/notes/VoiceNoteWidget';
import { GlassCard } from '../../components/shared/GlassCard';
import { StatusChip } from '../../components/shared/StatusChip';
import { TagChip } from '../../components/shared/TagChip';
import { showToast } from '../../components/shared/Toast';
import { TypeBadge } from '../../components/shared/TypeBadge';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';
import { useHaptics } from '../../hooks/useHaptics';
import { useIdeaStore } from '../../store/ideaStore';
import { getPriorityColor } from '../../utils/colors';
import { formatDate, formatRelativeTime } from '../../utils/date';

export default function IdeaDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const haptics = useHaptics();

  const {
    ideas,
    toggleFavorite,
    toggleArchive,
    deleteIdea,
    toggleChecklistItem,
    addChecklistItem,
    convertToProject,
  } = useIdeaStore();

  const [convertModalVisible, setConvertModalVisible] = useState(false);

  const idea = useMemo(() => ideas.find((i) => i.id === id), [ideas, id]);

  // Related ideas with shared tags
  const relatedIdeas = useMemo(() => {
    if (!idea) return [];
    return ideas
      .filter((other) => other.id !== idea.id && other.tags.some((t) => idea.tags.includes(t)))
      .slice(0, 3);
  }, [ideas, idea]);

  if (!idea) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.dark.textMuted} />
          <Text style={styles.notFoundText}>Idea not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavorite = async () => {
    haptics.light();
    await toggleFavorite(idea.id);
    showToast(idea.isFavorite ? 'Removed from favorites' : 'Marked as favorite ❤️');
  };

  const handleArchive = async () => {
    haptics.light();
    await toggleArchive(idea.id);
    showToast(idea.isArchived ? 'Restored idea' : 'Idea archived 📦');
  };

  const handleDelete = () => {
    const doDelete = async () => {
      haptics.medium();
      await deleteIdea(idea.id);
      showToast('Idea deleted', 'info');
      router.back();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this idea?')) {
        doDelete();
      }
    } else {
      Alert.alert('Delete Idea', 'Are you sure you want to permanently delete this idea?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleConfirmConvert = async (projectData: {
    title: string;
    tagline: string;
    techStack: string[];
  }) => {
    haptics.success();
    const proj = await convertToProject(idea.id);
    showToast('Project initialized! 🚀', 'success');
    router.replace(`/project/${proj.id}`);
  };

  const moodEmojis: Record<string, string> = {
    inspired: '🚀',
    energized: '⚡',
    curious: '🧐',
    calm: '🧘',
    creative: '💡',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Meta Bar: Type, Status, Priority, Mood */}
        <View style={styles.metaRow}>
          <View style={styles.metaBadges}>
            <TypeBadge type={idea.type} />
            <StatusChip status={idea.status} />
            <View
              style={[
                styles.priorityBadge,
                { borderColor: getPriorityColor(idea.priority) },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(idea.priority) },
                ]}
              >
                {idea.priority.toUpperCase()}
              </Text>
            </View>
            <View style={styles.moodPill}>
              <Text style={{ fontSize: 13 }}>{idea.mood && moodEmojis[idea.mood] ? moodEmojis[idea.mood] : '💡'}</Text>
            </View>
          </View>

          {/* Action Toolbar */}
          <View style={styles.toolbarIcons}>
            <TouchableOpacity onPress={handleFavorite} style={styles.iconBtn}>
              <Ionicons
                name={idea.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={idea.isFavorite ? Colors.dark.accentRose : Colors.dark.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleArchive} style={styles.iconBtn}>
              <Ionicons
                name={idea.isArchived ? 'archive' : 'archive-outline'}
                size={20}
                color={idea.isArchived ? Colors.dark.primaryLight : Colors.dark.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color={Colors.dark.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Animated.Text sharedTransitionTag={`idea-title-${idea.id}`} style={styles.title}>
          {idea.title}
        </Animated.Text>

        {/* Timestamps */}
        <Text style={styles.dateMeta}>
          Captured {formatRelativeTime(idea.createdAt)} ({formatDate(idea.createdAt)})
        </Text>

        {/* Promote to Project Callout Banner */}
        {!idea.convertedToProjectId ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setConvertModalVisible(true)}
            style={styles.convertBanner}
          >
            <View style={styles.convertBannerLeft}>
              <View style={styles.rocketCircle}>
                <Ionicons name="rocket" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.convertBannerTitle}>Ready to build this?</Text>
                <Text style={styles.convertBannerSub}>
                  Promote to an active project with sprint tasks & progress tracking
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.primaryLight} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/project/${idea.convertedToProjectId}`)}
            style={styles.linkedProjectBanner}
          >
            <Ionicons name="link" size={16} color={Colors.dark.accentEmerald} />
            <Text style={styles.linkedProjectText}>Active Project Linked • View Dashboard</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.dark.accentEmerald} />
          </TouchableOpacity>
        )}

        {/* Tags */}
        {idea.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {idea.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
        )}

        {/* Description / Markdown Preview */}
        <GlassCard style={styles.contentCard}>
          <Text style={styles.sectionHeader}>NOTES & DETAILS</Text>
          <MarkdownPreview content={idea.description} />
        </GlassCard>

        {/* Voice Note Player if present */}
        {idea.voiceNoteDuration ? (
          <GlassCard style={styles.voiceCard}>
            <Text style={styles.sectionHeader}>RECORDED VOICE MEMO</Text>
            <VoiceNoteWidget initialDuration={idea.voiceNoteDuration} />
          </GlassCard>
        ) : null}

        {/* Interactive Checklist */}
        <GlassCard style={styles.checklistCard}>
          <IdeaChecklist
            items={idea.checklist}
            onToggle={(checkId) => toggleChecklistItem(idea.id, checkId)}
            onAdd={(text) => addChecklistItem(idea.id, text)}
          />
        </GlassCard>

        {/* AI Assistant Brainstorm Shortcut */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/ai-assist')}
          style={styles.aiAssistBanner}
        >
          <Ionicons name="sparkles" size={20} color="#FBBF24" />
          <View style={{ flex: 1 }}>
            <Text style={styles.aiAssistTitle}>AI Second Brain Assistant</Text>
            <Text style={styles.aiAssistSub}>
              Generate MVP specs, brainstorm features, and analyze pitfalls
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.dark.textMuted} />
        </TouchableOpacity>

        {/* Related Ideas */}
        {relatedIdeas.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionHeader}>RELATED THOUGHTS & IDEAS</Text>
            {relatedIdeas.map((rel) => (
              <IdeaCard key={rel.id} idea={rel} />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Convert to Project Modal */}
      <ConvertToProjectModal
        visible={convertModalVisible}
        idea={idea}
        onClose={() => setConvertModalVisible(false)}
        onConfirm={handleConfirmConvert}
      />
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  metaBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  moodPill: {
    paddingHorizontal: 4,
  },
  toolbarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: Spacing.xs,
  },
  dateMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textDim,
    marginBottom: Spacing.md,
  },
  convertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  convertBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  rocketCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertBannerTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  convertBannerSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  linkedProjectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  linkedProjectText: {
    color: Colors.dark.accentEmerald,
    fontSize: Typography.sizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  contentCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  voiceCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  checklistCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  aiAssistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#161B2A',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: Spacing.lg,
  },
  aiAssistTitle: {
    fontSize: Typography.sizes.sm + 1,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  aiAssistSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  relatedSection: {
    marginTop: Spacing.md,
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
