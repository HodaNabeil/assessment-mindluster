import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTask, updateTask, deleteTask } from '../services/taskService';
import { Task, ColumnId } from '../types/task';
import { taskKeys } from '@/lib/queryKeys';

type TasksResponse = {
  tasks: Task[];
  totalCount: number;
  nextPage?: number;
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      const fullNewTask: Task = {
        ...newTask,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const queries = queryClient.getQueriesData<InfiniteData<TasksResponse>>({ queryKey: taskKeys.lists() });
      
      queries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<TasksResponse>>(queryKey, (old) => {
          if (!old) return old;

          const filters = queryKey[2] as { columnId?: ColumnId; search?: string } | undefined;
          
          const matchesColumn = !filters?.columnId || filters.columnId === newTask.column;
          const matchesSearch = !filters?.search || 
            newTask.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            newTask.description.toLowerCase().includes(filters.search.toLowerCase());

          if (!matchesColumn || !matchesSearch) return old;

          return {
            ...old,
            pages: old.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  tasks: [fullNewTask, ...page.tasks],
                  totalCount: page.totalCount + 1,
                };
              }
              return page;
            }),
          };
        });
      });

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: taskKeys.lists() }, context.previousTasks);
      }
      toast.error('Failed to create task');
    },
    onSuccess: () => {
      toast.success('Task created successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<Task> }) =>
      updateTask(id, task),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      toast.success('Task updated successfully');
    },
    onError: () => toast.error('Failed to update task'),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueriesData<InfiniteData<TasksResponse>>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              tasks: page.tasks.filter((task) => task.id !== id),
              totalCount: page.totalCount - 1,
            })),
          };
        }
      );

      return { previousTasks };
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: taskKeys.lists() }, context.previousTasks);
      }
      toast.error('Failed to delete task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, column }: { id: number; column: ColumnId }) =>
      updateTask(id, { column }),
    onMutate: async ({ id, column }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      let movedTask: Task | undefined;
      
      const queries = queryClient.getQueriesData<InfiniteData<TasksResponse>>({ queryKey: taskKeys.lists() });
      
      queries.forEach(([_, data]) => {
        if (data) {
          data.pages.forEach(page => {
            const foundTask = page.tasks.find(t => t.id === id);
            if (foundTask) movedTask = { ...foundTask, column };
          });
        }
      });

      if (!movedTask) return { previousTasks };

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<TasksResponse>>(queryKey, (old) => {
          if (!old) return old;
          
          const filters = queryKey[2] as { columnId?: ColumnId; search?: string } | undefined;
          
          const matchesNewColumn = !filters?.columnId || filters.columnId === column;
          const wasInThisList = old.pages.some(page => page.tasks.some(t => t.id === id));

          if (wasInThisList && !matchesNewColumn) {
            return {
              ...old,
              pages: old.pages.map(page => ({
                ...page,
                tasks: page.tasks.filter(t => t.id !== id),
                totalCount: page.totalCount - 1,
              })),
            };
          } else if (!wasInThisList && matchesNewColumn && movedTask) {
            return {
              ...old,
              pages: old.pages.map((page, index) => {
                if (index === 0) {
                  return {
                    ...page,
                    tasks: [movedTask!, ...page.tasks],
                    totalCount: page.totalCount + 1,
                  };
                }
                return page;
              }),
            };
          } else if (wasInThisList && matchesNewColumn) {
            return {
              ...old,
              pages: old.pages.map(page => ({
                ...page,
                tasks: page.tasks.map(t => t.id === id ? { ...t, column } : t),
              })),
            };
          }

          return old;
        });
      });

      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: taskKeys.lists() }, context.previousTasks);
      }
      toast.error('Failed to move task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
