import { useUIEffects } from '@/contexts/UIEffectsContext';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import React from 'react';
import Tilt from './Tilt';

export interface FeatureItem { icon?: React.ReactNode; title: string; description: string; }

interface FeatureGridProps { features: FeatureItem[]; columns?: { xs?: number; sm?: number; md?: number }; }

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { tilt } = useUIEffects();
  return (
    <Box sx={{
      display:'grid',
      gap:{ xs:2, md:3 },
      gridTemplateColumns:{ xs:'1fr', sm:'repeat(2,1fr)', md:'repeat(4,1fr)' }
    }}>
      {features.map((f,i)=>{
        const card = (
          <Box key={i} data-reveal className="feature-card" sx={{
          position:'relative',
            p: { xs: 2.2, md: 2.8 },
            minHeight: 180,
            borderRadius: 3,
            background: isDark ? 'linear-gradient(145deg, rgba(30,41,59,0.75), rgba(17,25,39,0.65))' : 'linear-gradient(145deg,#ffffff,#f1f5fb)',
            border: `1px solid ${alpha(isDark? '#ffffff':'#0f172a', isDark?0.08:0.08)}`,
            boxShadow:'var(--shadow-sm)',
            display:'flex',
            flexDirection:'column',
            gap:1.1,
            transition:'transform .55s var(--easing-standard), box-shadow .55s var(--easing-standard)',
            '&:hover': { transform:'translateY(-6px)', boxShadow:'var(--shadow-md)' },
            '@media (prefers-reduced-motion: reduce)': { transition:'none', '&:hover': { transform:'none' } }
        }}>
          {f.icon && <Box className="feature-icon-pulse" sx={{ fontSize:32, lineHeight:1, filter:'grayscale(.15)', opacity:.9 }}>{f.icon}</Box>}
          <Typography variant="subtitle1" sx={{ fontWeight:700 }}>{f.title}</Typography>
          <Typography variant="body2" sx={{ color:'text.secondary', lineHeight:1.5 }}>{f.description}</Typography>
          <Box sx={{ mt:'auto', height:3, borderRadius:2, background:'linear-gradient(90deg,var(--status-in-progress),var(--status-done))', opacity:0.75 }} />
        </Box>
        );
        return tilt ? <Tilt glare key={i} style={{ borderRadius:12 }}>{card}</Tilt> : card;
      })}
    </Box>
  );
};

export default FeatureGrid;
