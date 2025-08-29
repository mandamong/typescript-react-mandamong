import GlassPanel from '@/components/design/GlassPanel';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

export interface AuthFrameProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: number | string;
}

const AuthFrame: React.FC<AuthFrameProps> = ({ icon, title, subtitle, children, maxWidth = 600 }) => {
  return (
    <Box sx={{ mt:{ xs:4.5, md:8 }, mb:{ xs:5, md:10 } }}>
      <GlassPanel glow gradientBorder sx={{ p:{ xs:3.2, md:5 }, borderRadius:{ xs:4, md:5 }, maxWidth, mx:'auto' }}>
        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', mb:2 }}>
          <Avatar sx={{ bgcolor:'primary.main', mb:1, width:{ xs:56, md:60 }, height:{ xs:56, md:60 } }}>{icon}</Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight:800, fontSize:{ xs:'1.34rem', md:'1.5rem' }, letterSpacing:'-0.01em' }}>{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt:0.6, textAlign:'center', lineHeight:1.42, fontSize:{ xs:'.75rem', md:'.85rem' } }}>{subtitle}</Typography>}
        </Box>
        {children}
      </GlassPanel>
    </Box>
  );
};

export default AuthFrame;
