import React from 'react';
import { Box, Typography, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface SettingsListItemProps {
    icon: React.ReactNode;
    title: string;
    onClick: (event: React.MouseEvent) => void;
    open: boolean;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ icon, title, onClick, open }) => {
    return (
        <ListItem button onClick={onClick} sx={{ py: 2, px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
                {icon}
            </ListItemIcon>
            <ListItemText primary={<Typography variant="subtitle1">{title}</Typography>} />
            <IconButton edge="end">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </ListItem>
    );
};

export default SettingsListItem;
