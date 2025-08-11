import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from '@/router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import { setupAxiosInterceptors } from '@/api/interceptor';
import './index.css';

setupAxiosInterceptors();

export const Root = () => {
  return (
    <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </SnackbarProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
