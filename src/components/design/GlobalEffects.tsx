import { useLocation } from 'react-router-dom';
import { useUIEffects } from '@/contexts/UIEffectsContext';
import { usePerformance } from '@/contexts/PerformanceContext';
import Particles from './Particles';

export const GlobalEffects = () => {
  const { particles } = useUIEffects();
  const { perf, ultra } = usePerformance();

  return (
    <>
      {particles && !perf && <Particles count={ultra ? 12 : 28} />}
    </>
  );
};
