import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box, Button, Typography, Container, Fab, useMediaQuery, Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KanbanColumn from './KanbanColumn';
import { COLUMNS, ColumnId } from '../types/task';
import { useMoveTask } from '../hooks/useTaskMutations';
import { useTaskStore } from '../store/useTaskStore';

export default function KanbanBoard() {
  const { mutateAsync: moveTask } = useMoveTask();
  const { openFormDialog } = useTaskStore();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const newColumnId = destination.droppableId as ColumnId;

    await moveTask({ id: taskId, column: newColumnId });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 4, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            My Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your daily tasks and keep track of progress.
          </Typography>
        </Box>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openFormDialog()}
            sx={{ px: 3, borderRadius: 2, fontWeight: 600 }}
          >
            Create Task
          </Button>
        )}
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            p: 4,
            pt: 2,
            flexGrow: 1,
            overflowX: 'auto',
            alignItems: 'flex-start',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'action.selected',
              borderRadius: 4,
            },
          }}
        >
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              label={column.label}
            />
          ))}
        </Box>
      </DragDropContext>

      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => openFormDialog()}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}
