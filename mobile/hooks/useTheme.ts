import { Colors, palette } from '../constants/Colors';
import { useSettingsStore } from '../store/settingsStore';

export function useTheme() {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return {
    isDarkMode,
    colors,
    palette,
  };
}
