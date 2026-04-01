import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters'),
  column: z.enum(['backlog', 'in_progress', 'review', 'done']),
});

export type TaskFormData = z.infer<typeof taskSchema>;
