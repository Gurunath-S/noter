import { IRepository } from '../../types/api';
import { CreateProjectDTO, Project, ProjectTask, UpdateProjectDTO } from '../../types/project';
import { Idea } from '../../types/idea';
import { getItem, setItem } from '../storage/asyncStorage';
import { STORAGE_KEYS } from '../storage/keys';
import { INITIAL_PROJECTS } from '../../constants/DummyData';
import { simulateNetworkDelay } from './client';

export class ProjectsService implements IRepository<Project, CreateProjectDTO, UpdateProjectDTO> {
  private async getStoredProjects(): Promise<Project[]> {
    const projects = await getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
    if (!projects || projects.length === 0) {
      await setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    return projects;
  }

  async getAll(): Promise<Project[]> {
    await simulateNetworkDelay(50);
    return this.getStoredProjects();
  }

  async getById(id: string): Promise<Project | null> {
    await simulateNetworkDelay(30);
    const projects = await this.getStoredProjects();
    const found = projects.find((p) => p.id === id || p._id === id);
    return found || null;
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    await simulateNetworkDelay(100);
    const projects = await this.getStoredProjects();
    const now = new Date().toISOString();

    const tasks: ProjectTask[] = data.tasks || [];
    const completedTasks = tasks.filter((t) => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const newProject: Project = {
      ...data,
      id: data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      _id: `mongo_proj_${Date.now()}`,
      problem: data.problem || '',
      solution: data.solution || '',
      features: data.features || [],
      techStack: data.techStack || [],
      tasks,
      nextAction: data.nextAction || 'Kickoff technical architecture & roadmap.',
      notes: data.notes || '',
      tags: data.tags || [],
      progress,
      timeline: data.timeline || [
        {
          id: `tl_${Date.now()}`,
          date: 'Just now',
          title: 'Project Initialized',
          description: 'Project created from Idea Vault.',
        },
      ],
      resources: data.resources || [],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newProject, ...projects];
    await setItem(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  }

  async update(id: string, data: UpdateProjectDTO): Promise<Project> {
    await simulateNetworkDelay(80);
    const projects = await this.getStoredProjects();
    const index = projects.findIndex((p) => p.id === id || p._id === id);
    if (index === -1) {
      throw new Error(`Project with id "${id}" not found`);
    }

    const current = projects[index];
    const updatedTasks = data.tasks !== undefined ? data.tasks : current.tasks;
    const completedTasks = updatedTasks.filter((t) => t.completed).length;
    const progress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;

    const updatedProject: Project = {
      ...current,
      ...data,
      tasks: updatedTasks,
      progress,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    await setItem(STORAGE_KEYS.PROJECTS, projects);
    return updatedProject;
  }

  async delete(id: string): Promise<boolean> {
    await simulateNetworkDelay(80);
    const projects = await this.getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id && p._id !== id);
    await setItem(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }

  async toggleTask(projectId: string, taskId: string): Promise<Project> {
    const project = await this.getById(projectId);
    if (!project) throw new Error('Project not found');

    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    return this.update(projectId, { tasks: updatedTasks });
  }

  async addTask(projectId: string, title: string): Promise<Project> {
    const project = await this.getById(projectId);
    if (!project) throw new Error('Project not found');

    const newTask: ProjectTask = {
      id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      completed: false,
    };

    return this.update(projectId, { tasks: [...project.tasks, newTask] });
  }

  async convertIdeaToProject(idea: Idea): Promise<Project> {
    const initialTasks: ProjectTask[] = idea.checklist.length > 0
      ? idea.checklist.map((item) => ({
          id: `pt_${item.id}`,
          title: item.text,
          completed: item.completed,
        }))
      : [
          { id: `pt_${Date.now()}_1`, title: 'Define MVP Requirements & Scope', completed: true },
          { id: `pt_${Date.now()}_2`, title: 'Draft Technical Architecture', completed: false },
          { id: `pt_${Date.now()}_3`, title: 'Build Core Prototype', completed: false },
        ];

    const newProject = await this.create({
      ideaId: idea.id,
      title: idea.title,
      description: idea.description,
      problem: idea.problemStatement || 'Problem identified in Idea Vault.',
      solution: idea.solutionStatement || 'Solution drafted in Idea Vault.',
      features: ['Core MVP Feature', 'Responsive Design', 'Local Offline Sync'],
      techStack: idea.tags.filter((t) => ['mern', 'react-native', 'web', 'ai', 'mobile'].includes(t.toLowerCase())),
      tasks: initialTasks,
      nextAction: 'Finalize specification and build prototype.',
      notes: `Converted from Idea: ${idea.title}`,
      status: 'building',
      tags: idea.tags,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          date: 'Today',
          title: 'Promoted to Active Project',
          description: `Spawned from Idea Vault entry "${idea.title}".`,
        },
      ],
      resources: [],
    });

    return newProject;
  }

  async resetToDemoData(): Promise<Project[]> {
    await setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }
}

export const projectsService = new ProjectsService();
