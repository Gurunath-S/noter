import { create } from 'zustand';
import { getItem, setItem } from '../services/storage/asyncStorage';
import { STORAGE_KEYS } from '../services/storage/keys';

interface UserSettings {
  isDarkMode: boolean;
  hapticsEnabled: boolean;
  autoSaveDrafts: boolean;
  userName: string;
  userRole: string;
  streakDays: number;
  lastActiveDate: string;
}

interface SettingsState extends UserSettings {
  loadSettings: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  toggleHaptics: () => Promise<void>;
  toggleAutoSave: () => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  incrementStreak: () => Promise<void>;
  recordCaptureForStreak: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  isDarkMode: true,
  hapticsEnabled: true,
  autoSaveDrafts: true,
  userName: 'Guru',
  userRole: 'Product Architect & Second Brain Explorer',
  streakDays: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,

  loadSettings: async () => {
    const saved = await getItem<UserSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
    set(saved);
  },

  toggleDarkMode: async () => {
    const isDarkMode = !get().isDarkMode;
    set({ isDarkMode });
    await setItem(STORAGE_KEYS.SETTINGS, { ...get(), isDarkMode });
  },

  toggleHaptics: async () => {
    const hapticsEnabled = !get().hapticsEnabled;
    set({ hapticsEnabled });
    await setItem(STORAGE_KEYS.SETTINGS, { ...get(), hapticsEnabled });
  },

  toggleAutoSave: async () => {
    const autoSaveDrafts = !get().autoSaveDrafts;
    set({ autoSaveDrafts });
    await setItem(STORAGE_KEYS.SETTINGS, { ...get(), autoSaveDrafts });
  },

  setUserName: async (userName: string) => {
    set({ userName });
    await setItem(STORAGE_KEYS.SETTINGS, { ...get(), userName });
  },

  incrementStreak: async () => {
    const today = new Date().toISOString().split('T')[0];
    if (get().lastActiveDate !== today) {
      const streakDays = get().streakDays + 1;
      set({ streakDays, lastActiveDate: today });
      await setItem(STORAGE_KEYS.SETTINGS, { ...get(), streakDays, lastActiveDate: today });
    }
  },

  recordCaptureForStreak: async () => {
    await get().incrementStreak();
  },
}));
