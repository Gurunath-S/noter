import { IdeaType, Mood, Priority, Status } from './common';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: string;
}

export interface Idea {
  id: string;
  _id?: string; // MongoDB compatibility
  title: string;
  description: string;
  type: IdeaType;
  status: Status;
  isArchived?: boolean;
  convertedToProjectId?: string;
  mood?: Mood;
  priority: Priority;
  isFavorite: boolean;
  tags: string[];
  checklist: ChecklistItem[];
  problemStatement?: string;
  solutionStatement?: string;
  voiceNoteUri?: string;
  voiceNoteDuration?: number;
  imageUri?: string;
  projectId?: string;
  resurfacedCount?: number;
  lastResurfacedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateIdeaDTO = Omit<
  Idea,
  'id' | '_id' | 'createdAt' | 'updatedAt' | 'checklist' | 'status' | 'isFavorite'
> & {
  id?: string;
  status?: Status;
  isFavorite?: boolean;
  checklist?: Array<ChecklistItem | { id?: string; text: string; completed: boolean; createdAt?: string }>;
};

export type UpdateIdeaDTO = Partial<CreateIdeaDTO>;
