import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import { useDeleteTask } from '../hooks/useTaskMutations';

interface TaskCardProps {
  task: Task;
  index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const { openFormDialog } = useTaskStore();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2,
            backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4],
            },
          }}
        >
          <CardContent sx={{ '&:last-child': { pb: 1 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  onClick={() => openFormDialog(task)}
                  aria-label={`Edit task ${task.title}`}
                >
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleDelete}
                  aria-label={`Delete task ${task.title}`}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              {task.description}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
