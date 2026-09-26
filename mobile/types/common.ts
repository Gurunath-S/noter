export type IdeaType =
  | 'idea'
  | 'note'
  | 'goal'
  | 'experiment'
  | 'problem'
  | 'thought'
  | 'learning';

export type Status =
  | 'thought'
  | 'idea'
  | 'building'
  | 'parked'
  | 'completed'
  | 'archived'
  | 'in_progress'
  | 'planning';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Mood =
  | 'inspired'
  | 'energized'
  | 'curious'
  | 'calm'
  | 'creative';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'priority'
  | 'alphabetical'
  | 'favorites';

export interface FilterOptions {
  type?: IdeaType | 'all';
  status?: Status | 'all';
  tags?: string[];
  priority?: Priority | 'all';
  favoritesOnly?: boolean;
  searchQuery?: string;
  sortBy?: SortOption;
}
