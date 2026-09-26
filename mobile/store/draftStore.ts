import { create } from 'zustand';
import { IdeaType, Mood, Priority } from '../types/common';
import { getItem, removeItem, setItem } from '../services/storage/asyncStorage';
import { STORAGE_KEYS } from '../services/storage/keys';

export interface DraftChecklist {
  id: string;
  text: string;
  completed: boolean;
}

export interface DraftState {
  title: string;
  description: string;
  type: IdeaType;
  priority: Priority;
  mood: Mood;
  tags: string[];
  checklist: DraftChecklist[];
  draft: Partial<DraftState> | null;
  hasDraft: boolean;

  setField: (field: string, value: any) => void;
  setDraft: (data: Partial<DraftState>) => void;
  loadDraft: () => Promise<void>;
  saveDraft: (data?: Partial<DraftState>) => Promise<void>;
  clearDraft: () => Promise<void>;
  resetDraft: () => void;
}

const defaultValues = {
  title: '',
  description: '',
  type: 'idea' as IdeaType,
  priority: 'medium' as Priority,
  mood: 'inspired' as Mood,
  tags: [],
  checklist: [],
  draft: null,
  hasDraft: false,
};

export const useDraftStore = create<DraftState>((set, get) => ({
  ...defaultValues,

  setField: (field, value) => {
    set({ [field]: value } as any);
  },

  setDraft: (data) => {
    set((state) => ({ ...state, ...data }));
  },

  loadDraft: async () => {
    const saved = await getItem<Partial<DraftState> | null>(STORAGE_KEYS.DRAFT_CAPTURE, null);
    if (saved) {
      set({ ...saved, draft: saved, hasDraft: true });
    }
  },

  saveDraft: async (data) => {
    const currentState = data || {
      title: get().title,
      description: get().description,
      type: get().type,
      priority: get().priority,
      mood: get().mood,
      tags: get().tags,
      checklist: get().checklist,
    };
    set({ ...currentState, draft: currentState, hasDraft: true });
    await setItem(STORAGE_KEYS.DRAFT_CAPTURE, currentState);
  },

  clearDraft: async () => {
    set({ ...defaultValues });
    await removeItem(STORAGE_KEYS.DRAFT_CAPTURE);
  },

  resetDraft: () => {
    set({ ...defaultValues });
  },
}));
