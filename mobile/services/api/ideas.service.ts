import { IRepository } from '../../types/api';
import { ChecklistItem, CreateIdeaDTO, Idea, UpdateIdeaDTO } from '../../types/idea';
import { supabase } from '../../utils/supabase';

// Map snake_case from DB to camelCase for the frontend
const mapIdeaFromDB = (data: any): Idea => ({
  id: data.id,
  title: data.title,
  description: data.description,
  type: data.type,
  status: data.status,
  isArchived: data.is_archived,
  convertedToProjectId: data.converted_to_project_id,
  mood: data.mood,
  priority: data.priority,
  isFavorite: data.is_favorite,
  tags: data.tags || [],
  checklist: data.checklist || [],
  problemStatement: data.problem_statement,
  solutionStatement: data.solution_statement,
  voiceNoteUri: data.voice_note_uri,
  voiceNoteDuration: data.voice_note_duration,
  imageUri: data.image_uri,
  projectId: data.project_id,
  resurfacedCount: data.resurfaced_count,
  lastResurfacedAt: data.last_resurfaced_at,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

const mapIdeaToDB = (data: Partial<Idea> | CreateIdeaDTO | UpdateIdeaDTO): any => {
  const mapped: any = {};
  if (data.title !== undefined) mapped.title = data.title;
  if (data.description !== undefined) mapped.description = data.description;
  if (data.type !== undefined) mapped.type = data.type;
  if (data.status !== undefined) mapped.status = data.status;
  if ((data as any).isArchived !== undefined) mapped.is_archived = (data as any).isArchived;
  if ((data as any).convertedToProjectId !== undefined) mapped.converted_to_project_id = (data as any).convertedToProjectId;
  if ((data as any).mood !== undefined) mapped.mood = (data as any).mood;
  if (data.priority !== undefined) mapped.priority = data.priority;
  if ((data as any).isFavorite !== undefined) mapped.is_favorite = (data as any).isFavorite;
  if (data.tags !== undefined) mapped.tags = data.tags;
  if (data.checklist !== undefined) mapped.checklist = data.checklist;
  if ((data as any).problemStatement !== undefined) mapped.problem_statement = (data as any).problemStatement;
  if ((data as any).solutionStatement !== undefined) mapped.solution_statement = (data as any).solutionStatement;
  if ((data as any).voiceNoteUri !== undefined) mapped.voice_note_uri = (data as any).voiceNoteUri;
  if ((data as any).voiceNoteDuration !== undefined) mapped.voice_note_duration = (data as any).voiceNoteDuration;
  if ((data as any).imageUri !== undefined) mapped.image_uri = (data as any).imageUri;
  if ((data as any).projectId !== undefined) mapped.project_id = (data as any).projectId;
  return mapped;
};

export class IdeasService implements IRepository<Idea, CreateIdeaDTO, UpdateIdeaDTO> {
  async getAll(): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    return (data || []).map(mapIdeaFromDB);
  }

  async getById(id: string): Promise<Idea | null> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data ? mapIdeaFromDB(data) : null;
  }

  async create(data: CreateIdeaDTO): Promise<Idea> {
    const dbData = mapIdeaToDB(data);
    
    // Auto-generate ids for checklist items if missing
    if (dbData.checklist) {
      dbData.checklist = dbData.checklist.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `c_${Date.now()}_${idx}`,
      }));
    }

    const { data: created, error } = await supabase
      .from('ideas')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return mapIdeaFromDB(created);
  }

  async update(id: string, data: UpdateIdeaDTO): Promise<Idea> {
    const dbData = mapIdeaToDB(data);
    
    // Fix update timestamp
    dbData.updated_at = new Date().toISOString();
    
    const { data: updated, error } = await supabase
      .from('ideas')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapIdeaFromDB(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async toggleFavorite(id: string): Promise<Idea> {
    const idea = await this.getById(id);
    if (!idea) throw new Error('Idea not found');
    
    return this.update(id, { isFavorite: !idea.isFavorite });
  }

  async archive(id: string): Promise<Idea> {
    return this.update(id, { status: 'archived', isArchived: true });
  }

  async resetToDemoData(): Promise<Idea[]> {
    // Not dropping production db here
    return this.getAll();
  }
}

export const ideasService = new IdeasService();
