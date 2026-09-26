import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaChecklist } from '../components/features/ideas/IdeaChecklist';
import { VoiceNoteWidget } from '../components/features/notes/VoiceNoteWidget';
import { TagChip } from '../components/shared/TagChip';
import { showToast } from '../components/shared/Toast';
import { Colors } from '../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../constants/Theme';
import { useHaptics } from '../hooks/useHaptics';
import { useDraftStore } from '../store/draftStore';
import { useIdeaStore } from '../store/ideaStore';
import { useSettingsStore } from '../store/settingsStore';
import { IdeaType, Mood, Priority } from '../types/common';

const TYPE_OPTIONS: Array<{ id: IdeaType; label: string; icon: string }> = [
  { id: 'idea', label: 'Idea', icon: 'bulb' },
  { id: 'note', label: 'Note', icon: 'document-text' },
  { id: 'goal', label: 'Goal', icon: 'flag' },
  { id: 'experiment', label: 'Experiment', icon: 'flask' },
  { id: 'problem', label: 'Problem', icon: 'alert-circle' },
  { id: 'thought', label: 'Thought', icon: 'sparkles' },
  { id: 'learning', label: 'Learning', icon: 'book' },
];

const MOOD_OPTIONS: Array<{ id: Mood; emoji: string; label: string }> = [
  { id: 'inspired', emoji: '🚀', label: 'Inspired' },
  { id: 'energized', emoji: '⚡', label: 'Energized' },
  { id: 'curious', emoji: '🧐', label: 'Curious' },
  { id: 'calm', emoji: '🧘', label: 'Calm' },
  { id: 'creative', emoji: '💡', label: 'Creative' },
];

const PRIORITY_OPTIONS: Array<{ id: Priority; label: string; color: string }> = [
  { id: 'low', label: 'Low', color: Colors.priorityColors.low },
  { id: 'medium', label: 'Medium', color: Colors.priorityColors.medium },
  { id: 'high', label: 'High', color: Colors.priorityColors.high },
  { id: 'urgent', label: 'Urgent', color: Colors.priorityColors.urgent },
];

const SUGGESTED_TAGS = ['AI', 'React Native', 'SaaS', 'Fintech', 'Design', 'Mobile', 'Next.js', 'Architecture'];

export default function CaptureScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const addIdea = useIdeaStore((s) => s.addIdea);
  const recordCapture = useSettingsStore((s) => s.recordCaptureForStreak);
  const autoSaveDrafts = useSettingsStore((s) => s.autoSaveDrafts);

  const clearDraft = useDraftStore((s) => s.clearDraft);
  const saveDraft = useDraftStore((s) => s.saveDraft);

  // Read draft once at mount time without creating a reactive dependency on the whole store
  const [initialState] = useState(() => useDraftStore.getState());

  const [title, setTitle] = useState(initialState.title || '');
  const [description, setDescription] = useState(initialState.description || '');
  const [type, setType] = useState<IdeaType>(initialState.type || 'idea');
  const [priority, setPriority] = useState<Priority>(initialState.priority || 'medium');
  const [mood, setMood] = useState<Mood>(initialState.mood || 'inspired');
  const [tags, setTags] = useState<string[]>(initialState.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [checklist, setChecklist] = useState<Array<{ id: string; text: string; completed: boolean; createdAt: string }>>(
    (initialState.checklist || []).map((c, i) => ({
      id: String(i),
      text: c.text,
      completed: !!c.completed,
      createdAt: new Date().toISOString(),
    }))
  );
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced autosave to draft store
  useEffect(() => {
    if (!autoSaveDrafts) return;
    const timer = setTimeout(() => {
      saveDraft({
        title,
        description,
        type,
        priority,
        mood,
        tags,
        checklist: checklist.map((c) => ({ id: c.id, text: c.text, completed: c.completed })),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [title, description, type, priority, mood, tags, checklist, autoSaveDrafts, saveDraft]);

  const handleAddTag = (newTag: string) => {
    const trimmed = newTag.trim().replace(/^#/, '');
    if (!trimmed || tags.includes(trimmed)) return;
    haptics.light();
    setTags([...tags, trimmed]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    haptics.light();
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddChecklistItem = (text: string) => {
    setChecklist([
      ...checklist,
      {
        id: `c-${Date.now()}`,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      haptics.error();
      showToast('Please enter an idea title', 'warning');
      return;
    }

    try {
      setIsSaving(true);
      haptics.success();

      await addIdea({
        title: title.trim(),
        description: description.trim(),
        type,
        priority,
        mood,
        tags,
        checklist: checklist.map((c) => ({ text: c.text, completed: c.completed })),
        voiceNoteDuration: voiceDuration > 0 ? voiceDuration : undefined,
      });

      await recordCapture();
      await clearDraft();

      showToast('Idea captured into Vault! 🚀', 'success');
      router.back();
    } catch (e: any) {
      showToast(e.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Quick Bar: Close & Save Button */}
          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} color={Colors.dark.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving || !title.trim()}
              activeOpacity={0.8}
              style={[
                styles.saveBtn,
                { opacity: !title.trim() ? 0.5 : 1 },
              ]}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Capture Idea</Text>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What's the core idea?..."
            placeholderTextColor={Colors.dark.textDim}
            style={styles.titleInput}
            autoFocus
            multiline
          />

          {/* Type Selector Horizontal Pills */}
          <Text style={styles.label}>TYPE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesRow}>
            {TYPE_OPTIONS.map((item) => {
              const isSelected = type === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    haptics.light();
                    setType(item.id);
                  }}
                  style={[styles.typePill, isSelected && styles.typePillActive]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={14}
                    color={isSelected ? '#FFFFFF' : Colors.dark.textMuted}
                  />
                  <Text style={[styles.typePillText, isSelected && styles.typePillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Description Markdown Notes Area */}
          <Text style={styles.label}>DETAILS & THOUGHTS (MARKDOWN)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Explain the problem, proposed solution, target audience, or technical architecture..."
            placeholderTextColor={Colors.dark.textDim}
            style={styles.descInput}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Mood & Priority Row */}
          <View style={styles.row}>
            {/* Priority */}
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text style={styles.label}>PRIORITY</Text>
              <View style={styles.priorityGroup}>
                {PRIORITY_OPTIONS.map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => {
                        haptics.light();
                        setPriority(p.id);
                      }}
                      style={[
                        styles.priorityPill,
                        isSelected && {
                          backgroundColor: `${p.color}30`,
                          borderColor: p.color,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          isSelected && { color: p.color, fontWeight: 'bold' },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Mood */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CREATIVE MOOD</Text>
              <View style={styles.moodGroup}>
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => {
                        haptics.light();
                        setMood(m.id);
                      }}
                      style={[
                        styles.moodPill,
                        isSelected && styles.moodPillActive,
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Tags Section */}
          <Text style={styles.label}>TAGS & TOPICS</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TagChip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
            ))}
            <View style={styles.tagInputWrapper}>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={() => handleAddTag(tagInput)}
                placeholder="Add tag..."
                placeholderTextColor={Colors.dark.textDim}
                style={styles.tagInput}
              />
              {tagInput.trim() ? (
                <TouchableOpacity onPress={() => handleAddTag(tagInput)}>
                  <Ionicons name="add-circle" size={20} color={Colors.dark.primaryLight} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Quick Suggested Tags */}
          <View style={styles.suggestedTagsRow}>
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 5).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleAddTag(s)}
                style={styles.suggestedTagPill}
              >
                <Text style={styles.suggestedTagText}>+{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Checklist Tasks Builder */}
          <IdeaChecklist
            items={checklist}
            onToggle={handleToggleChecklist}
            onAdd={handleAddChecklistItem}
          />

          {/* Audio Voice Note Simulator */}
          <Text style={styles.label}>VOICE MEMO</Text>
          <VoiceNoteWidget onRecorded={(sec) => setVoiceDuration(sec)} />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121622',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  closeBtn: {
    padding: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
  },
  titleInput: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    minHeight: 48,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.textDim,
    letterSpacing: 0.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  typesRow: {
    marginBottom: Spacing.sm,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  typePillActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryLight,
  },
  typePillText: {
    fontSize: Typography.sizes.xs + 1,
    color: Colors.dark.textMuted,
    fontWeight: Typography.weights.medium,
  },
  typePillTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  descInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    padding: Spacing.md,
    minHeight: 110,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priorityGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  priorityText: {
    fontSize: 11,
    color: Colors.dark.textMuted,
  },
  moodGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  moodPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  moodPillActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: Colors.dark.primaryLight,
  },
  moodEmoji: {
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tagInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    marginBottom: Spacing.sm,
  },
  tagInput: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xs + 1,
    width: 80,
    height: 30,
  },
  suggestedTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  suggestedTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  suggestedTagText: {
    fontSize: 11,
    color: Colors.dark.textDim,
  },
});
