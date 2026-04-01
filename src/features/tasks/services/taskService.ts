import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { Task, ColumnId } from '../types/task';

interface GetTasksParams {
  _page: number;
  _limit: number;
  _sort: string;
  _order: string;
  column?: ColumnId;
  q?: string;
}

export async function getTasks(columnId?: ColumnId, page = 1, limit = 10, search = '') {
  const params: GetTasksParams = {
    _page: page,
    _limit: limit,
    _sort: 'createdAt',
    _order: 'desc',
  };

  if (columnId) {
    params.column = columnId;
  }

  if (search) {
    params.q = search;
  }

  const { data, headers } = await api.get<Task[]>(API_ENDPOINTS.TASKS, { params });
  const totalCount = parseInt(headers['x-total-count'] || '0', 10);

  return {
    tasks: data,
    totalCount,
    nextPage: data.length === limit ? page + 1 : undefined,
  };
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>) {
  const newTask = {
    ...task,
    createdAt: new Date().toISOString(),
  };
  const { data } = await api.post<Task>(API_ENDPOINTS.TASKS, newTask);
  return data;
}

export async function updateTask(id: number, task: Partial<Task>) {
  const { data } = await api.patch<Task>(`${API_ENDPOINTS.TASKS}/${id}`, task);
  return data;
}

export async function deleteTask(id: number) {
  await api.delete(`${API_ENDPOINTS.TASKS}/${id}`);
}

