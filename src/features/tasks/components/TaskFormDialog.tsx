import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useTaskStore } from '../store/useTaskStore';
import { useCreateTask, useUpdateTask } from '../hooks/useTaskMutations';
import { COLUMNS, ColumnId } from '../types/task';

export default function TaskFormDialog() {
  const { isFormDialogOpen, closeFormDialog, editingTask } = useTaskStore();
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    column: 'backlog' as ColumnId,
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        column: editingTask.column,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        column: 'backlog',
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await updateTask({ id: editingTask.id, task: formData });
    } else {
      await createTask(formData);
    }
    closeFormDialog();
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
      <DialogTitle fontWeight={700}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="outlined"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Column</InputLabel>
              <Select
                value={formData.column}
                label="Column"
                onChange={(e) => setFormData({ ...formData, column: e.target.value as ColumnId })}
              >
                {COLUMNS.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeFormDialog}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            sx={{ px: 3, borderRadius: 2 }}
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
