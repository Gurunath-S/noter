import { Priority, Status } from './common';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  achieved: boolean;
  dueDate?: string;
  date?: string;
}

export interface ProjectTimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export interface ProjectResource {
  id: string;
  title: string;
  url: string;
}

export interface Project {
  id: string;
  _id?: string; // MongoDB compatibility
  ideaId?: string; // Link to source idea
  sourceIdeaId?: string;
  title: string;
  tagline?: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  tasks: ProjectTask[];
  milestones?: ProjectMilestone[];
  nextAction: string;
  notes: string;
  deadline?: string;
  targetDeadline?: string;
  status: Status;
  tags: string[];
  progress: number; // 0 - 100
  timeline: ProjectTimelineEvent[];
  resources: ProjectResource[];
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectDTO = Omit<Project, 'id' | '_id' | 'createdAt' | 'updatedAt' | 'progress'> & {
  id?: string;
  progress?: number;
};

export type UpdateProjectDTO = Partial<CreateProjectDTO>;
