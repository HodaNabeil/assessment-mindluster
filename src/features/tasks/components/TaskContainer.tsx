'use client';

import { Box } from '@mui/material';
import AppHeader from '@/components/shared/layout/AppHeader';
import { KanbanBoard, TaskFormDialog } from '@/features/tasks';

export default function TaskContainer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'background.default'
      }}
    >
      <AppHeader />

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <KanbanBoard />
      </Box>

      <TaskFormDialog />
    </Box>
  );
}
