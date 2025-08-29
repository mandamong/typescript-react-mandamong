import type { Accent } from '@/contexts/AccentThemeContext';
import { useAccent } from '@/contexts/AccentThemeContext';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';

const accents: Accent[] = ['blue','violet','teal','pink','amber'];

const AccentSwitcher: React.FC = () => {
  const { accent, setAccent } = useAccent();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ position:'fixed', right:14, bottom:14, zIndex:1500 }}>
      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:1, mb: open?1:0, transition:'margin .4s' }}>
        {open && accents.map(a => (
          <IconButton key={a} size="small" onClick={()=>setAccent(a)} sx={{
            width:34, height:34,
            background: a===accent? 'var(--gradient-primary)': 'rgba(255,255,255,0.1)',
            backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.2)',
            color:'#fff',
            fontSize:12,
            '&:hover':{ background: 'var(--gradient-primary)' }
          }}>{a[0].toUpperCase()}</IconButton>
        ))}
      </Box>
      <Tooltip title="Accent">
        <IconButton onClick={()=>setOpen(o=>!o)} sx={{
          width:46, height:46, boxShadow:'0 4px 18px rgba(0,0,0,0.3)',
          background:'var(--gradient-primary)', color:'#fff'
        }}>
          <PaletteOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default AccentSwitcher;
