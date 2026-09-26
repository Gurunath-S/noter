import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/settingsStore';

export function useHaptics() {
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  const impact = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (!hapticsEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(style);
    } catch {
      // Graceful fallback
    }
  };

  const notification = async (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (!hapticsEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(type);
    } catch {
      // Graceful fallback
    }
  };

  const selection = async () => {
    if (!hapticsEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Graceful fallback
    }
  };

  return {
    impact,
    notification,
    selection,
    light: () => impact(Haptics.ImpactFeedbackStyle.Light),
    medium: () => impact(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => impact(Haptics.ImpactFeedbackStyle.Heavy),
    success: () => notification(Haptics.NotificationFeedbackType.Success),
    warning: () => notification(Haptics.NotificationFeedbackType.Warning),
    error: () => notification(Haptics.NotificationFeedbackType.Error),
  };
}
