import { Box, type BoxProps } from '@mui/material';
import React from 'react';

const GradientDivider: React.FC<BoxProps> = ({ sx, ...rest }) => (
  <Box
    aria-hidden
    {...rest}
    sx={{
      height: 1,
      width: '100%',
      background: 'linear-gradient(to right, transparent, var(--status-in-progress) 15%, var(--status-done) 85%, transparent)',
      opacity: 0.65,
      ...sx
    }}
  />
);

export default GradientDivider;
