import { useInfiniteQuery } from '@tanstack/react-query';
import { getTasks } from '../services/taskService';
import { ColumnId } from '../types/task';
import { taskKeys } from '@/lib/queryKeys';

export function useTasksQuery(columnId?: ColumnId, search = '') {
  return useInfiniteQuery({
    queryKey: taskKeys.list({ columnId, search }),
    queryFn: ({ pageParam = 1 }) => getTasks(columnId, pageParam as number, 10, search),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}
