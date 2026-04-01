

import { Toaster } from 'sonner';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Mindluster Kanban Dashboard</title>
        <meta name="description" content="A simple and elegant Kanban board" />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster position="top-center" richColors />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
