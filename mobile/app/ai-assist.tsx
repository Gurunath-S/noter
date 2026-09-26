import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { palette } from '../theme/colors';
import { Radii } from '../constants/Theme';
import { useIdeas } from '../hooks/useIdeas';
import { useHaptics } from '../hooks/useHaptics';
import { useToast } from '../components/shared/Toast';

const AI_ACTIONS = [
  { id: 'develop', icon: '🚀', label: 'Develop This Idea', prompt: 'Develop high-leverage value proposition, ICP, and positioning.' },
  { id: 'mvp', icon: '🛠️', label: 'Generate MVP', prompt: 'Scope out the simplest viable 1-week build specification.' },
  { id: 'features', icon: '💡', label: 'Suggest Features', prompt: 'Brainstorm 5 innovative viral product features.' },
  { id: 'improvements', icon: '🔍', label: 'Brainstorm Improvements', prompt: 'Critique this concept and identify unseen failure modes.' },
  { id: 'expand', icon: '📝', label: 'Expand Notes', prompt: 'Elaborate into detailed technical architecture and data schema.' },
  { id: 'summarize', icon: '⚡', label: 'Summarize', prompt: 'Generate an executive 30-second elevator pitch.' },
];

export default function AiAssistScreen() {
  const haptics = useHaptics();
  const { showToast } = useToast();
  const { ideas } = useIdeas();

  const [selectedIdeaId, setSelectedIdeaId] = useState(ideas[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState(AI_ACTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId);

  const handleRunAi = () => {
    if (!selectedIdea) return;
    haptics.impact();
    setIsGenerating(true);
    setGeneratedOutput(null);

    const action = AI_ACTIONS.find((a) => a.id === selectedAction);

    setTimeout(() => {
      let output = '';
      if (selectedAction === 'develop') {
        output = `### 🚀 Value Proposition & ICP for "${selectedIdea.title}"\n\n` +
          `**Core Positioning**: The ultimate specialized workflow engine designed specifically for fast-moving developers and founders.\n\n` +
          `**Ideal Customer Profile (ICP)**:\n` +
          `- Senior Software Engineers & Tech Leads\n` +
          `- Indie Hackers shipping 0 to 1 apps\n` +
          `- Tech Recruiters and Technical Founders\n\n` +
          `**Key Differentiator**: Privacy-first local execution with seamless cloud sync and zero lock-in.`;
      } else if (selectedAction === 'mvp') {
        output = `### 🛠️ MVP Roadmap: "${selectedIdea.title}" (1-Week Scope)\n\n` +
          `1. **Phase 1 (Day 1-2)**: Core parsing engine and basic input validation.\n` +
          `2. **Phase 2 (Day 3-4)**: Reactive UI cards with interactive checklist feedback.\n` +
          `3. **Phase 3 (Day 5)**: Offline persistence via AsyncStorage & export utilities.\n` +
          `4. **Phase 4 (Day 6-7)**: User testing with 10 beta testers; gather feedback on friction points.`;
      } else if (selectedAction === 'features') {
        output = `### 💡 5 High-Impact Feature Suggestions\n\n` +
          `1. **Context-Aware Smart Tagging**: Automatically cluster similar concepts based on semantic keywords.\n` +
          `2. **One-Tap Project Promotion**: Turn raw brainstorming notes into an actionable Kanban with deadlines.\n` +
          `3. **Audio-to-Task Transcription**: Speak your shower thoughts and receive clean bulleted tasks.\n` +
          `4. **Spaced-Repetition Resurfacing**: Surface older ideas on customizable Fibonacci time schedules.\n` +
          `5. **Two-Way Notion / GitHub Sync**: Keep team roadmaps aligned with personal notes.`;
      } else if (selectedAction === 'improvements') {
        output = `### 🔍 Critical Analysis & Improvement Areas\n\n` +
          `- **Potential Pitfall**: High onboarding friction if users must configure categories upfront.\n` +
          `- **Recommended Fix**: Implement zero-config capture with intelligent default fallbacks.\n` +
          `- **Retention Lever**: Add a weekly review digest highlighting resurfaced gems.`;
      } else if (selectedAction === 'expand') {
        output = `### 📝 Expanded Technical Architecture\n\n` +
          `\`\`\`typescript\n// Proposed Domain Entity Schema\ninterface Entity {\n  id: string;\n  tenantId: string;\n  vectorEmbedding: number[];\n  state: 'draft' | 'published';\n  syncState: 'synced' | 'pending';\n}\n\`\`\`\n\n` +
          `**Database Indexing Strategy**:\n` +
          `- Create compound indexes on \`{ userId: 1, createdAt: -1 }\` for instant feed retrieval.\n` +
          `- Utilize Atlas Vector Search for sub-10ms semantic queries.`;
      } else {
        output = `### ⚡ Executive Summary\n\n` +
          `"${selectedIdea.title}" is a modern personal second-brain asset designed to solve real-world workflow fragmentation through sub-3-second capture and intelligent milestone evolution.`;
      }

      setGeneratedOutput(output);
      setIsGenerating(false);
      haptics.success();
      showToast('AI analysis generated! ✨', 'success');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>AI Idea Incubator</Text>
            <Text style={styles.headerSub}>Second Brain Intelligence</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Target Idea Selector */}
          <Text style={styles.sectionLabel}>SELECT TARGET IDEA</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.ideaScroll}
            contentContainerStyle={styles.ideaScrollContent}
          >
            {ideas.map((i) => {
              const isSelected = i.id === selectedIdeaId;
              return (
                <TouchableOpacity
                  key={i.id}
                  activeOpacity={0.75}
                  onPress={() => {
                    haptics.selection();
                    setSelectedIdeaId(i.id);
                  }}
                  style={[styles.ideaPill, isSelected && styles.ideaPillActive]}
                >
                  <Text style={[styles.ideaPillText, isSelected && styles.ideaPillTextActive]}>
                    {i.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* AI Prompts Grid */}
          <Text style={styles.sectionLabel}>CHOOSE AI AGENT WORKFLOW</Text>
          <View style={styles.actionsGrid}>
            {AI_ACTIONS.map((action) => {
              const isSelected = selectedAction === action.id;
              return (
                <TouchableOpacity
                  key={action.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    haptics.selection();
                    setSelectedAction(action.id);
                  }}
                  style={[styles.actionCard, isSelected && styles.actionCardActive]}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={[styles.actionLabel, isSelected && styles.actionLabelActive]}>
                    {action.label}
                  </Text>
                  <Text style={styles.actionPrompt} numberOfLines={2}>
                    {action.prompt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Instruction Input */}
          <Text style={styles.sectionLabel}>CUSTOM PROMPT / CONTEXT (OPTIONAL)</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Add specific constraints, tech stacks, or target niches..."
            placeholderTextColor={palette.textMuted}
            value={customPrompt}
            onChangeText={setCustomPrompt}
          />

          {/* Generate Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRunAi}
            disabled={isGenerating}
            style={styles.generateBtn}
          >
            <Text style={styles.generateBtnText}>
              {isGenerating ? 'Synthesizing with AI Agent... ⚡' : 'Run AI Transformation ✨'}
            </Text>
          </TouchableOpacity>

          {/* Generated Result Output */}
          {generatedOutput && (
            <View style={styles.outputBox}>
              <View style={styles.outputHeader}>
                <Text style={styles.outputTitle}>AI Generated Response</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === 'web' && navigator.clipboard) {
                      navigator.clipboard.writeText(generatedOutput);
                      showToast('Copied to clipboard! 📋', 'success');
                    } else {
                      showToast('Copied AI response!', 'info');
                    }
                  }}
                >
                  <Text style={styles.copyBtnText}>Copy 📋</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.outputText}>{generatedOutput}</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeIcon: {
    fontSize: 18,
    color: palette.textMuted,
    fontWeight: '700',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: palette.text,
  },
  headerSub: {
    fontSize: 11,
    color: palette.primaryLight,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.textMuted,
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },
  ideaScroll: {
    marginHorizontal: -16,
    marginBottom: 8,
  },
  ideaScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  ideaPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.md,
  },
  ideaPillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryLight,
  },
  ideaPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  ideaPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    padding: 12,
  },
  actionCardActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  actionLabelActive: {
    color: palette.primaryLight,
  },
  actionPrompt: {
    fontSize: 10,
    color: palette.textSecondary,
    lineHeight: 14,
  },
  customInput: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: palette.text,
    fontSize: 13,
  },
  generateBtn: {
    backgroundColor: palette.primary,
    borderRadius: Radii.card,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  outputBox: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    borderRadius: Radii.cardLg,
    padding: 16,
    marginTop: 20,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  outputTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.primaryLight,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  outputText: {
    fontSize: 13,
    color: palette.text,
    lineHeight: 20,
  },
});
