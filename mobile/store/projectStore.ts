import { create } from 'zustand';
import { CreateProjectDTO, Project, ProjectTask, UpdateProjectDTO } from '../types/project';
import { Idea } from '../types/idea';
import { projectsService } from '../services/api/projects.service';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;

  fetchProjects: () => Promise<void>;
  selectProject: (id: string | null) => void;
  addProject: (data: CreateProjectDTO) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectDTO) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleTask: (projectId: string, taskId: string) => Promise<void>;
  addTask: (projectId: string, title: string) => Promise<void>;
  removeTask: (projectId: string, taskId: string) => Promise<void>;
  toggleMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  convertIdea: (idea: Idea) => Promise<Project>;
  resetToDemo: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectsService.getAll();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ isLoading: false });
    }
  },

  selectProject: (id) => {
    if (!id) {
      set({ selectedProject: null });
      return;
    }
    const found = get().projects.find((p) => p.id === id || p._id === id);
    set({ selectedProject: found || null });
  },

  addProject: async (data) => {
    const created = await projectsService.create(data);
    set((state) => ({ projects: [created, ...state.projects] }));
    return created;
  },

  updateProject: async (id, data) => {
    const updated = await projectsService.update(id, data);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
      selectedProject: state.selectedProject?.id === id ? updated : state.selectedProject,
    }));
    return updated;
  },

  deleteProject: async (id) => {
    const success = await projectsService.delete(id);
    if (success) {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
      }));
    }
    return success;
  },

  toggleTask: async (projectId, taskId) => {
    const updated = await projectsService.toggleTask(projectId, taskId);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
      selectedProject: state.selectedProject?.id === projectId ? updated : state.selectedProject,
    }));
  },

  addTask: async (projectId, title) => {
    const updated = await projectsService.addTask(projectId, title);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
      selectedProject: state.selectedProject?.id === projectId ? updated : state.selectedProject,
    }));
  },

  removeTask: async (projectId, taskId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project) return;
    const filteredTasks = project.tasks.filter((t) => t.id !== taskId);
    await get().updateProject(projectId, { tasks: filteredTasks });
  },

  toggleMilestone: async (projectId, milestoneId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project || !project.milestones) return;
    const updatedMilestones = project.milestones.map((ms) =>
      ms.id === milestoneId ? { ...ms, achieved: !ms.achieved } : ms
    );
    await get().updateProject(projectId, { milestones: updatedMilestones } as any);
  },

  convertIdea: async (idea) => {
    const project = await projectsService.convertIdeaToProject(idea);
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  resetToDemo: async () => {
    set({ isLoading: true });
    const projects = await projectsService.resetToDemoData();
    set({ projects, isLoading: false, selectedProject: null });
  },
}));
