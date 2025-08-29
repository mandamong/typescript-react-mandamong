import { Box, Typography } from '@mui/material';
import React from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  spacing?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
  bordered?: boolean; 
  dense?: boolean; 
}
const Section: React.FC<SectionProps> = ({ title, subtitle, spacing = 2.2, children, action, bordered = true, dense = false }) => {
  const content = (
    <Box sx={{
      ...(bordered ? {
        p: dense ? 1.4 : 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        background: 'var(--field-bg)'
      } : {
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.4
      })
    }}>
      {children}
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: bordered ? spacing : 1.2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: bordered ? 0 : 0.5 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: '.78rem', textTransform: 'uppercase', color: 'text.secondary' }}>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>{subtitle}</Typography>
          )}
        </Box>
        {action}
      </Box>
      {content}
    </Box>
  );
};

export default Section;
