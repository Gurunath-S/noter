import { z } from 'zod';

export const captureIdeaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .min(1, 'Description or thought content is required'),
  type: z.enum(['idea', 'note', 'goal', 'experiment', 'problem', 'thought', 'learning']),
  status: z.enum(['thought', 'idea', 'building', 'parked', 'completed', 'archived']).default('idea'),
  mood: z.enum(['inspired', 'energized', 'curious', 'calm', 'creative']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  isFavorite: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  problemStatement: z.string().optional(),
  solutionStatement: z.string().optional(),
});

export type CaptureIdeaFormData = z.infer<typeof captureIdeaSchema>;

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  problem: z.string().default(''),
  solution: z.string().default(''),
  features: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  nextAction: z.string().default(''),
  notes: z.string().default(''),
  deadline: z.string().optional(),
  status: z.enum(['thought', 'idea', 'building', 'parked', 'completed', 'archived']).default('building'),
  tags: z.array(z.string()).default([]),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
