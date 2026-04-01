import { Droppable } from '@hello-pangea/dnd';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import TaskCard from './TaskCard';
import { ColumnId, Task } from '../types/task';
import { useTasksQuery } from '../hooks/useTasksQuery';
import { useTaskStore } from '../store/useTaskStore';

interface KanbanColumnProps {
  id: ColumnId;
  label: string;
}

export default function KanbanColumn({ id, label }: KanbanColumnProps) {
  const { searchQuery } = useTaskStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTasksQuery(id, searchQuery);

  const tasks = data?.pages.flatMap(page => page.tasks) || [];

  return (
    <Paper
      elevation={0}
      sx={{
        width: 320,
        minWidth: 320,
        backgroundColor: 'background.default',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {label}
          <Box sx={{ px: 1, py: 0.2, borderRadius: 10, fontSize: '0.75rem', backgroundColor: 'action.selected' }}>
            {tasks.length}
          </Box>
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                p: 1.5,
                flexGrow: 1,
                minHeight: 100,
                backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <Box sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                  <Typography variant="body2">No tasks yet</Typography>
                </Box>
              )}
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}

              {hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outlined"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Droppable>
      )}
    </Paper>
  );
}
