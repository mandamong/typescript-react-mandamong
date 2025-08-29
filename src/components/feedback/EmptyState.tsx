import { Box, Button, Typography } from '@mui/material';
import type { Theme, SxProps } from '@mui/material';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  sx?: SxProps<Theme>;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction, secondaryActionLabel, onSecondaryAction, sx }) => {
  return (
    <Box sx={{ textAlign:'center', px:3, py:8, display:'flex', flexDirection:'column', alignItems:'center', gap:2, ...sx }}>
      {icon && <Box sx={{ fontSize:54, lineHeight:1 }}>{icon}</Box>}
      <Typography variant="h6" sx={{ fontWeight:700 }}>{title}</Typography>
      {description && <Typography variant="body2" color="text.secondary" sx={{ maxWidth:420 }}>{description}</Typography>}
      {(actionLabel || secondaryActionLabel) && (
        <Box sx={{ display:'flex', flexDirection:{ xs:'column', sm:'row' }, gap:1.5, mt:1 }}>
          {actionLabel && <Button variant="contained" onClick={onAction}>{actionLabel}</Button>}
          {secondaryActionLabel && <Button variant="outlined" onClick={onSecondaryAction}>{secondaryActionLabel}</Button>}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
