import { usePerformance } from '@/contexts/PerformanceContext';
import type { PaperProps } from '@mui/material';
import { Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import React from 'react';

export interface GlassPanelProps extends PaperProps {
  glow?: boolean;
  hoverLift?: boolean;
  gradientBorder?: boolean;
  intenseHover?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  glow = false,
  hoverLift = true,
  gradientBorder = true,
  intenseHover = false,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const { perf, ultra } = usePerformance();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Paper
      elevation={0}
      {...rest}
      sx={{
        position: 'relative',
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: isDark
          ? 'linear-gradient(140deg, rgba(30,41,59,0.85), rgba(17,25,39,0.72))'
          : 'linear-gradient(140deg, rgba(255,255,255,0.86), rgba(248,251,255,0.94))',
  backdropFilter: perf ? (ultra ? 'none' : 'blur(8px) saturate(1.1)') : 'blur(22px) saturate(1.4)',
  WebkitBackdropFilter: perf ? (ultra ? 'none' : 'blur(8px) saturate(1.1)') : 'blur(22px) saturate(1.4)',
        overflow: 'hidden',
        border: gradientBorder
          ? '1px solid transparent'
          : `1px solid ${alpha(isDark ? '#ffffff' : '#0f172a', isDark ? 0.08 : 0.08)}`,
        '&::before': gradientBorder
          ? {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: 1,
              borderRadius: 'inherit',
              background: 'linear-gradient(160deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 40%), linear-gradient(120deg, var(--gradient-primary), transparent 70%)',
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none'
            }
          : undefined,
        boxShadow: perf
          ? (glow ? `0 0 0 1px ${alpha(theme.palette.primary.main,0.35)}` : '0 0 0 1px rgba(0,0,0,0.12)')
          : (glow
            ? `0 8px 28px -6px ${alpha(theme.palette.primary.main, 0.38)}, 0 2px 6px ${alpha('#000',0.18)}`
            : 'var(--shadow-sm)'),
        transition: perf ? 'none' : 'box-shadow .5s var(--easing-standard), transform .55s var(--easing-standard), border-color .4s',
  ...(!perf && hoverLift && {
          '&:hover': {
            boxShadow: glow
              ? `0 12px 40px -8px ${alpha(theme.palette.primary.main, 0.55)}, 0 4px 14px ${alpha('#000',0.28)}`
              : 'var(--shadow-md)',
            transform: 'translateY(-4px)',
            ...(intenseHover && { transform:'translateY(-6px) scale(1.015)' })
          }
        }),
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
        ...sx
      }}
    >
      {children}
    </Paper>
  );
};

export default GlassPanel;
