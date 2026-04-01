import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStore } from '../store/useTaskStore';
import { useCreateTask, useUpdateTask } from '../hooks/useTaskMutations';
import { COLUMNS } from '../types/task';
import { taskSchema, TaskFormData } from '@/validation/tasks';

export default function TaskFormDialog() {
  const { isFormDialogOpen, closeFormDialog, editingTask } = useTaskStore();
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      column: 'backlog',
    },
  });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        column: editingTask.column,
      });
    } else {
      reset({
        title: '',
        description: '',
        column: 'backlog',
      });
    }
  }, [editingTask, reset, isFormDialogOpen]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, task: data });
      } else {
        await createTask(data);
      }
      reset();
      closeFormDialog();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <Dialog
      open={isFormDialogOpen}
      onClose={closeFormDialog}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle fontWeight={700} sx={{ pb: 1 }}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 1 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <Controller
              name="column"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.column} size="small">
                  <InputLabel>Column</InputLabel>
                  <Select {...field} label="Column">
                    {COLUMNS.map((col) => (
                      <MenuItem key={col.id} value={col.id}>
                        {col.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.column && (
                    <FormHelperText>{errors.column.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={closeFormDialog} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            sx={{
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

