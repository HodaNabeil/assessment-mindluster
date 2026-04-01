import { Droppable } from '@hello-pangea/dnd';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import TaskCard from './TaskCard';
import { ColumnId, Task } from '../types/task';
import { useTasksQuery } from '../hooks/useTasksQuery';
import { useTaskStore } from '../store/useTaskStore';
import { memo } from 'react';

interface KanbanColumnProps {
  id: ColumnId;
  label: string;
}

const KanbanColumn = memo(function KanbanColumn({ id, label }: KanbanColumnProps) {
  const { searchQuery } = useTaskStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTasksQuery(id, searchQuery);

  const tasks = data?.pages.flatMap(page => page.tasks) || [];

  const getStatusColor = (colId: ColumnId) => {
    switch (colId) {
      case 'backlog': return '#3b82f6'; // Blue
      case 'in_progress': return '#f59e0b'; // Orange/Amber
      case 'review': return '#8b5cf6'; // Purple
      case 'done': return '#10b981'; // Green
      default: return '#6366f1';
    }
  };

  const statusColor = getStatusColor(id);

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: 280, sm: 320 },
        minWidth: { xs: 280, sm: 320 },
        backgroundColor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`, 
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{ 
          width: 8, 
          height: 8, 
          borderRadius: '50%', 
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}44`
        }} />
        <Typography 
          variant="subtitle2" 
          fontWeight={800} 
          sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {label}
        </Typography>
        <Box sx={{ 
          px: 1, 
          py: 0.2, 
          borderRadius: 10, 
          fontSize: '0.7rem', 
          fontWeight: 700,
          backgroundColor: 'action.selected',
          color: 'text.secondary'
        }}>
          {tasks.length}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Droppable droppableId={id.toString()}>
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
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 250px)',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'action.selected',
                  borderRadius: 3,
                },
              }}
            >
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <Box key="empty-state" sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                  <Typography variant="body2">No tasks yet</Typography>
                </Box>
              )}
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}

              {hasNextPage && (
                <Box key="load-more" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
});

export default KanbanColumn;
