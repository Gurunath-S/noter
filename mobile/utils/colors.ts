import { statusColors, typeColors } from '../theme/colors';
import { IdeaType, Priority, Status } from '../types/common';
import { PriorityConfig, TypeIcons } from '../constants/Theme';

const TAG_PALETTES = [
  { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' }, // Indigo
  { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' }, // Emerald
  { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' }, // Amber
  { bg: 'rgba(244, 63, 94, 0.15)', text: '#FB7185', border: 'rgba(244, 63, 94, 0.3)' }, // Rose
  { bg: 'rgba(6, 182, 212, 0.15)', text: '#38BDF8', border: 'rgba(6, 182, 212, 0.3)' }, // Cyan
  { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA', border: 'rgba(139, 92, 246, 0.3)' }, // Violet
  { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6', border: 'rgba(236, 72, 153, 0.3)' }, // Pink
];

export function getTagColor(tag: string): { bg: string; text: string; border: string } {
  if (!tag) return TAG_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_PALETTES.length;
  return TAG_PALETTES[index];
}

export function getStatusDetails(status: Status) {
  return statusColors[status] || {
    bg: 'rgba(148, 163, 184, 0.15)',
    text: '#94A3B8',
    border: 'rgba(148, 163, 184, 0.3)',
    label: status,
    icon: '📌',
  };
}

export function getTypeDetails(type: IdeaType) {
  const colors = typeColors[type] || {
    bg: 'rgba(99, 102, 241, 0.15)',
    text: '#818CF8',
    border: 'rgba(99, 102, 241, 0.3)',
  };
  const icon = TypeIcons[type] || '💡';
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return { ...colors, icon, label };
}

export function getPriorityColor(priority: Priority | string): string {
  if (priority && PriorityConfig[priority]) {
    return PriorityConfig[priority].color;
  }
  return '#94A3B8';
}
