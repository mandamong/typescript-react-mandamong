import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';

interface SettingsListItemProps {
    icon: React.ReactNode;
    title: string;
    onClick: (event: React.MouseEvent) => void;
    open: boolean;
    id?: string; 
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ icon, title, onClick, open, id }) => {
        return (
            <ListItem disablePadding>
                <ListItemButton
                    onClick={onClick}
                    sx={{
                        py: { xs: 1.6, sm: 2 },
                        px: { xs: 2.25, sm: 3 },
                        gap: 1,
                        alignItems: 'center',
                        '& .MuiListItemIcon-root': {
                            minWidth: 38,
                            color: 'text.secondary'
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none'
                        }
                    }}
                    id={id}
                    aria-expanded={open ? 'true' : 'false'}
                    aria-controls={id ? `${id}-panel` : undefined}
                >
                    <ListItemIcon sx={{ minWidth: 38 }}>{icon}</ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontSize: { xs: '.95rem', sm: '1rem' },
                                    fontWeight: 600,
                                    letterSpacing: '.2px'
                                }}
                            >
                                {title}
                            </Typography>
                        }
                    />
                    <IconButton edge="end" size="small" sx={{ ml: 0.5 }}>
                        {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
        );
};

export default SettingsListItem;
