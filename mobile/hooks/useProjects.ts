import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProjectStore } from '../store/projectStore';
import { projectsService } from '../services/api/projects.service';
import { CreateProjectDTO, Project, UpdateProjectDTO } from '../types/project';
import { Idea } from '../types/idea';
import { useEffect } from 'react';

const QUERY_KEY = ['projects'];

export function useProjects() {
  const queryClient = useQueryClient();
  const { projects, selectProject, selectedProject } = useProjectStore();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const data = await projectsService.getAll();
      useProjectStore.setState({ projects: data });
      return data;
    },
    initialData: projects.length > 0 ? projects : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      useProjectStore.setState({ projects: query.data });
    }
  }, [query.data]);

  const createMutation = useMutation({
    mutationFn: (newProject: CreateProjectDTO) => projectsService.create(newProject),
    onSuccess: (created) => {
      queryClient.setQueryData<Project[]>(QUERY_KEY, (old) => [created, ...(old || [])]);
      useProjectStore.setState((state) => ({ projects: [created, ...state.projects] }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDTO }) =>
      projectsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(QUERY_KEY, (old) =>
        (old || []).map((p) => (p.id === updated.id ? updated : p))
      );
      useProjectStore.setState((state) => ({
        projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
        selectedProject: state.selectedProject?.id === updated.id ? updated : state.selectedProject,
      }));
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
      projectsService.toggleTask(projectId, taskId),
    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(QUERY_KEY, (old) =>
        (old || []).map((p) => (p.id === updated.id ? updated : p))
      );
      useProjectStore.setState((state) => ({
        projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
        selectedProject: state.selectedProject?.id === updated.id ? updated : state.selectedProject,
      }));
    },
  });

  const convertIdeaMutation = useMutation({
    mutationFn: (idea: Idea) => projectsService.convertIdeaToProject(idea),
    onSuccess: (createdProject) => {
      queryClient.setQueryData<Project[]>(QUERY_KEY, (old) => [createdProject, ...(old || [])]);
      useProjectStore.setState((state) => ({ projects: [createdProject, ...state.projects] }));
    },
  });

  return {
    projects: projects.length > 0 ? projects : query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    toggleTask: (projectId: string, taskId: string) =>
      toggleTaskMutation.mutateAsync({ projectId, taskId }),
    convertIdeaToProject: convertIdeaMutation.mutateAsync,
    selectProject,
    selectedProject,
  };
}
