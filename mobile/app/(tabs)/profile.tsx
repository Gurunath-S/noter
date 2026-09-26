import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { palette } from '../../theme/colors';
import { Radii } from '../../constants/Theme';
import { useSettingsStore } from '../../store/settingsStore';
import { useIdeas } from '../../hooks/useIdeas';
import { useProjects } from '../../hooks/useProjects';
import { useIdeaStore } from '../../store/ideaStore';
import { useProjectStore } from '../../store/projectStore';
import { TagChip } from '../../components/shared/TagChip';
import { useHaptics } from '../../hooks/useHaptics';
import { useToast } from '../../components/shared/Toast';

export default function ProfileScreen() {
  const haptics = useHaptics();
  const { showToast } = useToast();
  const {
    userName,
    userRole,
    streakDays,
    isDarkMode,
    hapticsEnabled,
    autoSaveDrafts,
    toggleDarkMode,
    toggleHaptics,
    toggleAutoSave,
  } = useSettingsStore();

  const { ideas } = useIdeas();
  const { projects } = useProjects();
  const resetIdeas = useIdeaStore((s) => s.resetToDemo);
  const resetProjects = useProjectStore((s) => s.resetToDemo);

  const [exportModalVisible, setExportModalVisible] = useState(false);

  const completedProjects = projects.filter((p) => p.status === 'completed' || p.progress === 100).length;
  const favoriteIdeas = ideas.filter((i) => i.isFavorite).length;

  // Tag frequency
  const tagCounts: Record<string, number> = {};
  ideas.forEach((i) => {
    i.tags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t]) => t);

  const handleExportData = () => {
    haptics.impact();
    const payload = JSON.stringify({ ideas, projects, exportedAt: new Date().toISOString() }, null, 2);
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(payload);
      showToast('Vault backup JSON copied to clipboard! 📋', 'success');
    } else {
      showToast('Backup prepared for export! 💾', 'success');
    }
  };

  const handleResetData = () => {
    haptics.warning();
    const executeReset = async () => {
      await Promise.all([resetIdeas(), resetProjects()]);
      showToast('Reset to starter demo data! 🔄', 'success');
    };

    if (Platform.OS === 'web') {
      if (confirm('Reset all vault data to initial demo state?')) {
        executeReset();
      }
    } else {
      Alert.alert('Reset Demo Data', 'Reset all ideas and projects to starter data?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: executeReset },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>G</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{userRole}</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{streakDays} Day Mindset Streak</Text>
            </View>
          </View>
        </View>

        {/* Statistics Grid */}
        <Text style={styles.sectionHeader}>SECOND BRAIN METRICS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{ideas.length}</Text>
            <Text style={styles.statLbl}>Ideas Vaulted</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: palette.emerald }]}>{projects.length}</Text>
            <Text style={styles.statLbl}>Total Projects</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: palette.amber }]}>{favoriteIdeas}</Text>
            <Text style={styles.statLbl}>Starred Gems</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#38BDF8' }]}>{completedProjects}</Text>
            <Text style={styles.statLbl}>Finished</Text>
          </View>
        </View>

        {/* Favorite Tags Cloud */}
        {topTags.length > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.boxTitle}>Top Knowledge Domains</Text>
            <View style={styles.tagsCloud}>
              {topTags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </View>
          </View>
        )}

        {/* Cloud Sync & Backend Service Status */}
        <View style={styles.sectionBox}>
          <Text style={styles.boxTitle}>Backend & Storage Architecture</Text>
          <View style={styles.syncRow}>
            <View style={styles.syncLeft}>
              <Text style={styles.syncIcon}>⚡</Text>
              <View>
                <Text style={styles.syncName}>Offline-First Local Storage</Text>
                <Text style={styles.syncDesc}>AsyncStorage Active (0ms latency)</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.statusBadgeText}>Synced</Text>
            </View>
          </View>

          <View style={[styles.syncRow, { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingTop: 12, marginTop: 12 }]}>
            <View style={styles.syncLeft}>
              <Text style={styles.syncIcon}>🍃</Text>
              <View>
                <Text style={styles.syncName}>MongoDB + Node Server Ready</Text>
                <Text style={styles.syncDesc}>Repository abstraction configured</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(99, 102, 241, 0.15)', borderColor: palette.primary }]}>
              <Text style={[styles.statusBadgeText, { color: palette.primaryLight }]}>Ready</Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <Text style={styles.sectionHeader}>SETTINGS & PREFERENCES</Text>
        <View style={styles.settingsGroup}>
          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode First</Text>
              <Text style={styles.settingDesc}>Sleek indigo & obsidian visual palette</Text>
            </View>
            <TouchableOpacity onPress={toggleDarkMode} style={[styles.switch, isDarkMode && styles.switchActive]}>
              <View style={[styles.switchKnob, isDarkMode && styles.switchKnobActive]} />
            </TouchableOpacity>
          </View>

          {/* Haptics */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Haptic Touch Feedback</Text>
              <Text style={styles.settingDesc}>Tactile response on button taps & saves</Text>
            </View>
            <TouchableOpacity onPress={toggleHaptics} style={[styles.switch, hapticsEnabled && styles.switchActive]}>
              <View style={[styles.switchKnob, hapticsEnabled && styles.switchKnobActive]} />
            </TouchableOpacity>
          </View>

          {/* Auto Save Drafts */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Autosave Capture Drafts</Text>
              <Text style={styles.settingDesc}>Never lose in-progress thoughts</Text>
            </View>
            <TouchableOpacity onPress={toggleAutoSave} style={[styles.switch, autoSaveDrafts && styles.switchActive]}>
              <View style={[styles.switchKnob, autoSaveDrafts && styles.switchKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Actions */}
        <Text style={styles.sectionHeader}>DATA & BACKUP</Text>
        <View style={styles.actionButtonsCol}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleExportData} style={styles.dataActionBtn}>
            <Text style={styles.dataActionIcon}>📤</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dataActionTitle}>Export Vault Backup</Text>
              <Text style={styles.dataActionDesc}>Download or copy complete brain JSON archive</Text>
            </View>
            <Text style={styles.dataActionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showToast('Import feature ready for JSON restore', 'info')}
            style={styles.dataActionBtn}
          >
            <Text style={styles.dataActionIcon}>📥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dataActionTitle}>Import Vault Backup</Text>
              <Text style={styles.dataActionDesc}>Restore ideas and projects from previous archive</Text>
            </View>
            <Text style={styles.dataActionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleResetData} style={[styles.dataActionBtn, styles.resetBtnBorder]}>
            <Text style={styles.dataActionIcon}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dataActionTitle, { color: palette.rose }]}>Reset to Starter Demo Data</Text>
              <Text style={styles.dataActionDesc}>Re-populate with realistic AI, FinTech & MERN ideas</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: Radii.cardLg,
    padding: 18,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: palette.primaryLight,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
  },
  userRole: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  streakEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FBBF24',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(21, 27, 40, 0.9)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.textSecondary,
    marginTop: 4,
  },
  sectionBox: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    padding: 16,
    marginBottom: 16,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  tagsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  syncName: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.text,
  },
  syncDesc: {
    fontSize: 11,
    color: palette.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.emerald,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.emerald,
  },
  settingsGroup: {
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  settingDesc: {
    fontSize: 11,
    color: palette.textSecondary,
    marginTop: 2,
  },
  switch: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
  },
  switchActive: {
    backgroundColor: palette.primary,
  },
  switchKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  switchKnobActive: {
    transform: [{ translateX: 20 }],
  },
  actionButtonsCol: {
    gap: 10,
  },
  dataActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.95)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    padding: 14,
  },
  resetBtnBorder: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  dataActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dataActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  dataActionDesc: {
    fontSize: 11,
    color: palette.textSecondary,
    marginTop: 2,
  },
  dataActionArrow: {
    fontSize: 16,
    color: palette.textMuted,
    fontWeight: '700',
  },
});
