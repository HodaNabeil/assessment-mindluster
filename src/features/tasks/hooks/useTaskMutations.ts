import { useMutation, useQueryClient, InfiniteData, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTask, updateTask, deleteTask } from '../services/taskService';
import { Task, ColumnId } from '../types/task';
import { taskKeys } from '@/lib/queryKeys';

type TasksResponse = {
  tasks: Task[];
  totalCount: number;
  nextPage?: number;
};

type TaskFilters = { columnId?: ColumnId; search?: string };
type InfiniteTasksData = InfiniteData<TasksResponse>;

type MutationContext = {
  backups: [QueryKey, InfiniteTasksData | undefined][];
  previousTask?: Task;
};

const generateTempId = () => -Math.floor(Date.now() + Math.random() * 1000);
const matchesFilters = (task: Task, filters?: TaskFilters) => {
  if (!filters) return true;

  const matchesColumn = !filters.columnId || filters.columnId === task.column;
  const matchesSearch =
    !filters.search ||
    task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    task.description.toLowerCase().includes(filters.search.toLowerCase());

  return matchesColumn && matchesSearch;
};

const findTaskInCache = (queryClient: ReturnType<typeof useQueryClient>, id: number): Task | undefined => {
  const queries = queryClient.getQueriesData<InfiniteTasksData>({ queryKey: taskKeys.lists() });
  for (const [, data] of queries) {
    if (!data) continue;
    for (const page of data.pages) {
      const task = page.tasks.find((t) => t.id === id);
      if (task) return task;
    }
  }
  return undefined;
};

const updateAllInfiniteLists = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (old: InfiniteTasksData, queryKey: QueryKey) => InfiniteTasksData
): [QueryKey, InfiniteTasksData | undefined][] => {
  const queries = queryClient.getQueriesData<InfiniteTasksData>({ queryKey: taskKeys.lists() });
  const backups: [QueryKey, InfiniteTasksData | undefined][] = [];

  queries.forEach(([queryKey, data]) => {
    if (data) {
      const updated = updater(data, queryKey);
      if (updated !== data) {
        backups.push([queryKey, data]);
        queryClient.setQueryData<InfiniteTasksData>(queryKey, updated);
      }
    }
  });

  return backups;
};

const useMutationHelpers = () => {
  const queryClient = useQueryClient();

  const handleRollback = (context?: MutationContext) => {
    if (!context) return;

    context.backups.forEach(([key, data]) => {
      queryClient.setQueryData(key, data);
    });

    if (context.previousTask) {
      queryClient.setQueryData(taskKeys.detail(context.previousTask.id), context.previousTask);
    }
  };

  const handleSettled = (taskId?: number) => {
    if (taskId) {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  };

  return { queryClient, handleRollback, handleSettled };
};

export function useCreateTask() {
  const { queryClient, handleRollback, handleSettled } = useMutationHelpers();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const tempTask: Task = {
        ...newTask,
        id: generateTempId(),
        createdAt: new Date().toISOString(),
      };

      const backups = updateAllInfiniteLists(queryClient, (old, queryKey) => {
        const filters = queryKey[2] as TaskFilters | undefined;
        if (!matchesFilters(tempTask, filters)) return old;

        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0
              ? {
                ...page,
                tasks: [tempTask, ...page.tasks],
                totalCount: page.totalCount + 1
              }
              : page
          ),
        };
      });

      return { backups };
    },
    onError: (_err, _vars, context) => {
      handleRollback(context);
      toast.error('Failed to create task');
    },
    onSuccess: () => {
      toast.success('Task created successfully');
    },
    onSettled: () => {
      handleSettled();
    },
  });
}

// ================= UPDATE =================
export function useUpdateTask() {
  const { queryClient, handleRollback, handleSettled } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<Task> }) => updateTask(id, task),
    onMutate: async ({ id, task: updates }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });

      const previousTask = findTaskInCache(queryClient, id);
      if (previousTask) {
        queryClient.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, ...updates });
      }

      const backups = updateAllInfiniteLists(queryClient, (old) => ({
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          tasks: page.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      }));

      return { backups, previousTask };
    },
    onError: (_err, _vars, context) => {
      handleRollback(context);
      toast.error('Failed to update task');
    },
    onSuccess: () => {
      toast.success('Task update successful');
    },
    onSettled: (_, __, { id }) => {
      handleSettled(id);
    },
  });
}

export function useDeleteTask() {
  const { queryClient, handleRollback, handleSettled } = useMutationHelpers();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });

      const backups = updateAllInfiniteLists(queryClient, (old) => ({
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          tasks: page.tasks.filter((t) => t.id !== id),
          totalCount: page.totalCount - 1,
        })),
      }));

      return { backups };
    },
    onError: (_err, _vars, context) => {
      handleRollback(context);
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onSettled: () => {
      handleSettled();
    },
  });
}

export function useMoveTask() {
  const { queryClient, handleRollback, handleSettled } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ id, column }: { id: number; column: ColumnId }) =>
      updateTask(id, { column }),
    onMutate: async ({ id, column }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const taskToMove = findTaskInCache(queryClient, id);
      if (!taskToMove) return { backups: [] };

      const updatedTask = { ...taskToMove, column };

      const backups = updateAllInfiniteLists(queryClient, (old, queryKey) => {
        const filters = queryKey[2] as TaskFilters | undefined;
        const exists = old.pages.some((p) => p.tasks.some((t) => t.id === id));
        const shouldBeInList = matchesFilters(updatedTask, filters);

        if (exists && !shouldBeInList) {
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              tasks: p.tasks.filter((t) => t.id !== id),
              totalCount: p.totalCount - 1,
            })),
          };
        }

        if (!exists && shouldBeInList) {
          return {
            ...old,
            pages: old.pages.map((p, i) =>
              i === 0
                ? {
                  ...p,
                  tasks: [updatedTask, ...p.tasks],
                  totalCount: p.totalCount + 1
                }
                : p
            ),
          };
        }

        if (exists && shouldBeInList) {
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              tasks: p.tasks.map((t) => (t.id === id ? updatedTask : t)),
            })),
          };
        }

        return old;
      });

      return { backups };
    },
    onError: (_err, _vars, context) => {
      handleRollback(context);
      toast.error('Failed to move task');
    },
    onSettled: (_, __, { id }) => {
      handleSettled(id);
    },
  });
}
