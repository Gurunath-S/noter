import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIdeaStore } from '../store/ideaStore';
import { ideasService } from '../services/api/ideas.service';
import { CreateIdeaDTO, UpdateIdeaDTO } from '../types/idea';
import { useEffect } from 'react';

const QUERY_KEY = ['ideas'];

export function useIdeas() {
  const queryClient = useQueryClient();
  const { ideas, setFilters, filters, selectIdea, selectedIdea } = useIdeaStore();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const data = await ideasService.getAll();
      useIdeaStore.setState({ ideas: data });
      return data;
    },
    initialData: ideas.length > 0 ? ideas : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      useIdeaStore.setState({ ideas: query.data });
    }
  }, [query.data]);

  const createMutation = useMutation({
    mutationFn: (newIdea: CreateIdeaDTO) => ideasService.create(newIdea),
    onSuccess: (created) => {
      queryClient.setQueryData<typeof ideas>(QUERY_KEY, (old) => [created, ...(old || [])]);
      useIdeaStore.setState((state) => ({ ideas: [created, ...state.ideas] }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIdeaDTO }) =>
      ideasService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<typeof ideas>(QUERY_KEY, (old) =>
        (old || []).map((i) => (i.id === updated.id ? updated : i))
      );
      useIdeaStore.setState((state) => ({
        ideas: state.ideas.map((i) => (i.id === updated.id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === updated.id ? updated : state.selectedIdea,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ideasService.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<typeof ideas>(QUERY_KEY, (old) =>
        (old || []).filter((i) => i.id !== id)
      );
      useIdeaStore.setState((state) => ({
        ideas: state.ideas.filter((i) => i.id !== id),
        selectedIdea: state.selectedIdea?.id === id ? null : state.selectedIdea,
      }));
    },
  });

  return {
    ideas: ideas.length > 0 ? ideas : query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createIdea: createMutation.mutateAsync,
    updateIdea: updateMutation.mutateAsync,
    deleteIdea: deleteMutation.mutateAsync,
    filters,
    setFilters,
    selectIdea,
    selectedIdea,
  };
}
