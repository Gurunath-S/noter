import { useMemo } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import { useProjectStore } from '../store/projectStore';
import { daysDifference } from '../utils/date';
import { Idea } from '../types/idea';

export function useResurfacedIdea() {
  const ideas = useIdeaStore((s) => s.ideas);
  const updateIdea = useIdeaStore((s) => s.updateIdea);
  const archiveIdea = useIdeaStore((s) => s.archiveIdea);
  const convertIdea = useProjectStore((s) => s.convertIdea);

  const resurfacedIdea = useMemo(() => {
    if (!ideas || ideas.length === 0) return null;
    // Prefer non-archived ideas older than 7 days, or pick the oldest
    const nonArchived = ideas.filter((i) => i.status !== 'archived');
    if (nonArchived.length === 0) return null;

    // Pick candidate with highest days or specific demo candidate
    const sortedByAge = [...nonArchived].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedByAge[0];
  }, [ideas]);

  const daysAgo = resurfacedIdea ? daysDifference(resurfacedIdea.createdAt) : 0;

  const markStillInteresting = async (idea: Idea) => {
    await updateIdea(idea.id, {
      resurfacedCount: (idea.resurfacedCount || 0) + 1,
      lastResurfacedAt: new Date().toISOString(),
    });
  };

  const archive = async (idea: Idea) => {
    await archiveIdea(idea.id);
  };

  const promoteToProject = async (idea: Idea) => {
    const project = await convertIdea(idea);
    await updateIdea(idea.id, { status: 'building', projectId: project.id });
    return project;
  };

  return {
    resurfacedIdea,
    daysAgo,
    markStillInteresting,
    archive,
    promoteToProject,
  };
}
