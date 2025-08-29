import { useUIEffects } from '@/contexts/UIEffectsContext';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Box, FormControlLabel, IconButton, Paper, Switch, Tooltip } from '@mui/material';
import React, { useState } from 'react';

const UIEffectsPanel: React.FC = () => {
  const { particles, parallax, tilt, toggle } = useUIEffects();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ position:'fixed', left:14, bottom:14, zIndex:1500 }}>
      {open && (
        <Paper elevation={0} sx={{ mb:1, p:2, minWidth:200, backdropFilter:'blur(14px)', background:'rgba(15,23,42,0.6)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)' }}>
          <Box sx={{ display:'flex', flexDirection:'column', gap:1 }}>
            <FormControlLabel control={<Switch size="small" checked={particles} onChange={()=>toggle('particles')} />} label="Particles" />
            <FormControlLabel control={<Switch size="small" checked={parallax} onChange={()=>toggle('parallax')} />} label="Parallax" />
            <FormControlLabel control={<Switch size="small" checked={tilt} onChange={()=>toggle('tilt')} />} label="Tilt" />
          </Box>
        </Paper>
      )}
      <Tooltip title="UI Effects">
        <IconButton onClick={()=>setOpen(o=>!o)} sx={{ width:46, height:46, background:'var(--gradient-primary)', color:'#fff', boxShadow:'0 4px 18px rgba(0,0,0,0.35)' }}>
          <TuneOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default UIEffectsPanel;
