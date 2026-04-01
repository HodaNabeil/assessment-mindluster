'use client';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  TextField, 
  InputAdornment, 
  Box, 
  Container 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTaskStore } from '@/features/tasks';
import { useEffect, useState } from 'react';

export default function AppHeader() {
  const { searchQuery, setSearchQuery } = useTaskStore();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearchQuery]);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              MINDLUSTER
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Kanban Board
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search tasks..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
