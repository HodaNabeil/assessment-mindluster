import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFormDialogOpen: boolean;
  editingTask: Task | null;
  openFormDialog: (task?: Task) => void;
  closeFormDialog: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isFormDialogOpen: false,
  editingTask: null,
  openFormDialog: (task) => set({ isFormDialogOpen: true, editingTask: task || null }),
  closeFormDialog: () => set({ isFormDialogOpen: false, editingTask: null }),
}));
