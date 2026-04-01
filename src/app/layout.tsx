
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Toaster from '@/components/shared/Toaster';
import ThemeProvider from '@/providers/ThemeProvider';
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
        <AppRouterCacheProvider>
          <QueryProvider>
            <ThemeProvider>
              <Toaster position="top-center" richColors />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
