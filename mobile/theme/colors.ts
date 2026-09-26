export const palette = {
  // Dark Backgrounds
  background: '#0B0D13',
  backgroundElevated: '#111520',
  surface: '#151B28',
  surfaceHighlight: '#1E2638',
  surfaceGlass: 'rgba(21, 27, 40, 0.75)',

  // Borders
  border: '#232C40',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderActive: '#6366F1',

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B0D13',

  // Indigo Accent
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',

  // Accents & Badges
  emerald: '#10B981',
  emeraldGlow: 'rgba(16, 185, 129, 0.2)',
  amber: '#F59E0B',
  amberGlow: 'rgba(245, 158, 11, 0.2)',
  rose: '#F43F5E',
  roseGlow: 'rgba(244, 63, 94, 0.2)',
  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.2)',
  violet: '#8B5CF6',
  violetGlow: 'rgba(139, 92, 246, 0.2)',

  // Overlay
  overlay: 'rgba(5, 7, 12, 0.75)',
};

export const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  idea: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' },
  note: { bg: 'rgba(6, 182, 212, 0.15)', text: '#38BDF8', border: 'rgba(6, 182, 212, 0.3)' },
  goal: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' },
  experiment: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
  problem: { bg: 'rgba(244, 63, 94, 0.15)', text: '#FB7185', border: 'rgba(244, 63, 94, 0.3)' },
  thought: { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA', border: 'rgba(139, 92, 246, 0.3)' },
  learning: { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6', border: 'rgba(236, 72, 153, 0.3)' },
};

export const statusColors: Record<string, { bg: string; text: string; border: string; label: string; icon: string }> = {
  thought: { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA', border: 'rgba(139, 92, 246, 0.3)', label: 'Thought', icon: '💭' },
  idea: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)', label: 'Idea', icon: '💡' },
  building: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)', label: 'Building', icon: '🔨' },
  parked: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94A3B8', border: 'rgba(100, 116, 139, 0.3)', label: 'Parked', icon: '⏸️' },
  completed: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)', label: 'Completed', icon: '✅' },
  archived: { bg: 'rgba(71, 85, 105, 0.15)', text: '#64748B', border: 'rgba(71, 85, 105, 0.3)', label: 'Archived', icon: '🗂️' },
};
