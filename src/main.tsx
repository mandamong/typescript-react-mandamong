import { setupAxiosInterceptors } from '@/api/interceptor';
import Particles from '@/components/design/Particles';
import { PerformanceProvider, usePerformance } from '@/contexts/PerformanceContext';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';
import { UIEffectsProvider, useUIEffects } from '@/contexts/UIEffectsContext';
import useParallax from '@/hooks/useParallax';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import AppRouter from '@/router';
import CssBaseline from '@mui/material/CssBaseline';
import ReactDOM from 'react-dom/client';
import './index.css';

setupAxiosInterceptors();

const AppShell = () => {
  const { particles } = useUIEffects();
  const { perf, ultra } = usePerformance();
  usePerformanceMetrics();
  useParallax();
  return (
    <>
  {particles && !perf && <Particles count={ultra ? 12 : 28} />}
      <AppRouter />
    </>
  );
};

export const Root = () => (
  <PerformanceProvider>
    <SnackbarProvider>
      <ThemeModeProvider>
          <UIEffectsProvider>
            <CssBaseline />
            <AppShell />
          </UIEffectsProvider>
      </ThemeModeProvider>
    </SnackbarProvider>
  </PerformanceProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
