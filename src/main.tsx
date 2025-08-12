import { setupAxiosInterceptors } from '@/api/interceptor';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';
import AppRouter from '@/router';
import CssBaseline from '@mui/material/CssBaseline';
import ReactDOM from 'react-dom/client';
import './index.css';

setupAxiosInterceptors();

export const Root = () => {
  return (
    <SnackbarProvider>
        <ThemeModeProvider>
          <CssBaseline />
          <AppRouter />
        </ThemeModeProvider>
      </SnackbarProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
