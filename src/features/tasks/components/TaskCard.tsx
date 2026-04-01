import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import { useDeleteTask } from '../hooks/useTaskMutations';
import { memo, useCallback } from 'react';

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = memo(function TaskCard({ task, index }: TaskCardProps) {
  const { openFormDialog } = useTaskStore();
  const { mutateAsync: deleteTask, isPending } = useDeleteTask();

  const handleDelete = useCallback(async () => {
    await deleteTask(task.id);
  }, [deleteTask, task.id]);

  const handleEdit = useCallback(() => {
    openFormDialog(task);
  }, [openFormDialog, task]);

  return (
    <Draggable draggableId={task.id.toString()}
      index={index}
      isDragDisabled={isPending}
    >
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          inert={snapshot.isDragging}
          sx={{
            mb: 2,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
            transition: snapshot.isDragging ? 'none' : 'background-color 0.2s ease',
            '&:hover': {
              boxShadow: snapshot.isDragging ? 'none' : (theme) => theme.shadows[4],
            },
          }}
        >
          <CardContent sx={{ '&:last-child': { pb: 1 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4',
                  maxHeight: '2.8em',
                  flex: 1,
                  mr: 1
                }}
              >
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  aria-label={`Edit task ${task.title}`}
                >
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  disabled={isPending}
                  aria-label={`Delete task ${task.title}`}
                >
                  <DeleteIcon fontSize="small" color={isPending ? 'disabled' : 'error'} />
                </IconButton>
              </Box>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4',
                maxHeight: '4.2em'
              }}
            >
              {task.description || 'No description'}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

export default TaskCard;
