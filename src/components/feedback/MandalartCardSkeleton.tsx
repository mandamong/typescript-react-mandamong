import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface MandalartCardSkeletonProps { density: 'comfortable' | 'compact'; }

const MandalartCardSkeleton: React.FC<MandalartCardSkeletonProps> = ({ density }) => {
  return (
  <Box data-reveal className="skeleton-card" sx={{
      border:'1px solid',
      borderColor:'divider',
      borderRadius: { xs:4, sm:5 },
      p:{ xs: density==='compact'?1:1.2, sm: density==='compact'?1.2:1.6 },
      background:(t)=> t.palette.mode==='dark' ? 'linear-gradient(155deg, rgba(30,41,59,0.9), rgba(17,25,39,0.7))' : 'linear-gradient(155deg,#ffffff,#f1f5fb)',
      display:'flex', flexDirection:'column', gap:0.75, minHeight: density==='compact'?160:190
    }}>
      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="rectangular" width="55%" height={18} sx={{ borderRadius:2 }} />
      <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius:4 }} />
      <Skeleton variant="text" width="85%" height={18} />
      <Skeleton variant="text" width="60%" height={18} />
    </Box>
  );
};

export default MandalartCardSkeleton;
