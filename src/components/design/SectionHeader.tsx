import { Box, Typography, type BoxProps } from '@mui/material';
import React from 'react';

export interface SectionHeaderProps extends BoxProps {
  eyebrow?: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  compact?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, heading, description, align='left', compact=false, sx, ...rest }) => {
  return (
    <Box {...rest} sx={{ textAlign: align, mx: align==='center' ? 'auto' : 'unset', maxWidth: 860, ...sx }}>
      {eyebrow && (
        <Typography variant="overline" sx={{ letterSpacing: '.14em', fontWeight:700, fontSize:'.68rem', opacity:.75, display:'block', mb: compact? 0.5 : 1 }}>{eyebrow}</Typography>
      )}
  <Typography component="h2" variant="h3" sx={{ fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.12, mb: description ? (compact?1.4:1.8) : 0 }}>{heading}</Typography>
      {description && (
        <Typography variant="subtitle1" sx={{ maxWidth: 620, mx: align==='center' ? 'auto' : 'unset', lineHeight:1.52, color:'text.secondary' }}>{description}</Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
