import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';

interface SettingsListItemProps {
    icon: React.ReactNode;
    title: string;
    onClick: (event: React.MouseEvent) => void;
    open: boolean;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ icon, title, onClick, open }) => {
        return (
            <ListItem disablePadding>
                <ListItemButton onClick={onClick} sx={{ py: 2, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                    <ListItemText primary={<Typography variant="subtitle1">{title}</Typography>} />
                    <IconButton edge="end">
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
        );
};

export default SettingsListItem;
