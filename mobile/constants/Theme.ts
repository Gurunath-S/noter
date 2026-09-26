import { ViewStyle, TextStyle } from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 22,
  cardLg: 28,
  round: 9999,
  full: 9999,
};

export const Radii = BorderRadius;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  h4: typography.h4,
  body: typography.body,
  caption: typography.caption,
};

export const Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  } as ViewStyle,
  glow: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  } as ViewStyle,
};

export const Glass = {
  card: {
    backgroundColor: palette.surfaceGlass,
    borderColor: palette.borderLight,
    borderWidth: 1,
    borderRadius: BorderRadius.card,
  } as ViewStyle,
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: palette.borderLight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  } as ViewStyle,
};

export const TypeIcons: Record<string, string> = {
  idea: '💡',
  note: '📝',
  goal: '🎯',
  experiment: '🧪',
  problem: '🐛',
  thought: '💭',
  learning: '📚',
};

export const MoodEmojis: Record<string, { label: string; emoji: string }> = {
  inspired: { label: 'Inspired', emoji: '🚀' },
  energized: { label: 'Energized', emoji: '⚡' },
  curious: { label: 'Curious', emoji: '🧐' },
  calm: { label: 'Calm', emoji: '🧘' },
  creative: { label: 'Creative', emoji: '💡' },
};

export const PriorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' },
  medium: { label: 'Medium', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  high: { label: 'High', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  urgent: { label: 'Urgent', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)' },
};
