import { create } from 'zustand';
import { CreateIdeaDTO, Idea, UpdateIdeaDTO } from '../types/idea';
import { FilterOptions } from '../types/common';
import { Project } from '../types/project';
import { ideasService } from '../services/api/ideas.service';
import { projectsService } from '../services/api/projects.service';

interface IdeaState {
  ideas: Idea[];
  selectedIdea: Idea | null;
  isLoading: boolean;
  filters: FilterOptions;
  
  // Actions
  fetchIdeas: () => Promise<void>;
  selectIdea: (id: string | null) => void;
  addIdea: (data: CreateIdeaDTO) => Promise<Idea>;
  updateIdea: (id: string, data: UpdateIdeaDTO) => Promise<Idea>;
  deleteIdea: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  archiveIdea: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  convertToProject: (id: string, data?: any) => Promise<Project>;
  toggleChecklistItem: (ideaId: string, itemId: string) => Promise<void>;
  addChecklistItem: (ideaId: string, text: string) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  resetToDemo: () => Promise<void>;
}

const defaultFilters: FilterOptions = {
  type: 'all',
  status: 'all',
  tags: [],
  priority: 'all',
  favoritesOnly: false,
  searchQuery: '',
  sortBy: 'newest',
};

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  selectedIdea: null,
  isLoading: false,
  filters: defaultFilters,

  fetchIdeas: async () => {
    set({ isLoading: true });
    try {
      const ideas = await ideasService.getAll();
      set({ ideas, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
      set({ isLoading: false });
    }
  },

  selectIdea: (id) => {
    if (!id) {
      set({ selectedIdea: null });
      return;
    }
    const found = get().ideas.find((i) => i.id === id || i._id === id);
    set({ selectedIdea: found || null });
  },

  addIdea: async (data) => {
    const created = await ideasService.create(data as any);
    set((state) => ({ ideas: [created, ...state.ideas] }));
    return created;
  },

  updateIdea: async (id, data) => {
    const updated = await ideasService.update(id, data);
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
      selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
    }));
    return updated;
  },

  deleteIdea: async (id) => {
    const success = await ideasService.delete(id);
    if (success) {
      set((state) => ({
        ideas: state.ideas.filter((i) => i.id !== id),
        selectedIdea: state.selectedIdea?.id === id ? null : state.selectedIdea,
      }));
    }
    return success;
  },

  toggleFavorite: async (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return;
    const updated = await ideasService.update(id, { isFavorite: !idea.isFavorite });
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
      selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
    }));
  },

  archiveIdea: async (id) => {
    const updated = await ideasService.archive(id);
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
      selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
    }));
  },

  toggleArchive: async (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return;
    const isArchived = !idea.isArchived;
    const status = isArchived ? 'archived' : 'idea';
    const updated = await ideasService.update(id, { isArchived, status });
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
      selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
    }));
  },

  convertToProject: async (id, customData) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) throw new Error('Idea not found');
    const project = await projectsService.convertIdeaToProject({
      ...idea,
      title: customData?.title || idea.title,
      description: customData?.tagline || idea.description,
      tags: customData?.techStack || idea.tags,
    });
    await get().updateIdea(id, {
      convertedToProjectId: project.id,
      projectId: project.id,
      status: 'building',
    });
    return project;
  },

  toggleChecklistItem: async (ideaId, itemId) => {
    const idea = get().ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const updatedChecklist = idea.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await get().updateIdea(ideaId, { checklist: updatedChecklist });
  },

  addChecklistItem: async (ideaId, text) => {
    const idea = get().ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const newItem = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      text,
      completed: false,
    };
    await get().updateIdea(ideaId, { checklist: [...idea.checklist, newItem] });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  resetToDemo: async () => {
    set({ isLoading: true });
    const ideas = await ideasService.resetToDemoData();
    set({ ideas, isLoading: false, selectedIdea: null });
  },
}));
