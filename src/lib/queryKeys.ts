

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: { columnId?: string; search?: string }) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...taskKeys.details(), id.toString()] as const,
};
