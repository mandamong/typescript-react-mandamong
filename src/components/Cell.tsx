import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, CircularProgress, IconButton, Paper, TextField, Tooltip, Typography, } from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { ColorPalette } from './types';

interface CellProps {
    id: number;
    name: string;
    status?: string;
    type: 'subject' | 'objective' | 'action';
    palette: ColorPalette;
    updateItemName: (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => void;
    updateItemStatus: (itemId: number, itemType: 'subject' | 'objective' | 'action') => void;
    isCenter?: boolean;
    isMainSubject?: boolean;
    loadingSubjectAI?: boolean;
    loadingObjectiveAI?: number | null;
    objectiveIndex?: number;
}

const Cell: React.FC<CellProps> = ({
                                       id,
                                       name,
                                       status,
                                       type,
                                       palette,
                                       updateItemName,
                                       updateItemStatus,
                                       isCenter = false,
                                       isMainSubject = false,
                                       loadingSubjectAI = false,
                                       loadingObjectiveAI = null,
                                       objectiveIndex
                                   }) => {
    const canChangeStatus = type === 'action';

    const [isEditing, setIsEditing] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [currentName, setCurrentName] = useState(name);


    useEffect(() => {
        setCurrentName(name);
    }, [name]);

    const handleUpdateName = async () => {
        if (currentName === name) {
            setIsEditing(false);
            return;
        }
        setIsEditing(false);
        await updateItemName(id, type, currentName);
    };


    const handleUpdateStatus = async () => {
        setLocalLoading(true);
        await updateItemStatus(id, type);
        setLocalLoading(false);
    };

    const isDone = status === 'DONE';

    const cellStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // To make scrolling start from the top
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: 2,
        textAlign: 'center',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        overflowY: 'auto', // Enable vertical scrolling for overflow
    };

    if (isMainSubject) {
        cellStyle.backgroundColor = 'primary.main';
        cellStyle.color = 'primary.contrastText';
        cellStyle.boxShadow = '0 6px 16px rgba(0,0,0,0.18)';
    } else if (isCenter && palette) {
        // Theme-aware styling to emphasize objectives
        cellStyle.backgroundColor = 'var(--field-bg)';
        cellStyle.color = 'var(--text-primary)';
        cellStyle.border = '2px solid';
        cellStyle.borderColor = palette.main;
        cellStyle.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    } else {
        cellStyle.backgroundColor = 'background.paper';
        cellStyle.border = '1px solid';
        cellStyle.borderColor = palette ? palette.main : 'divider';
    }

    if (isDone) {
        cellStyle.backgroundColor = 'action.disabledBackground';
        cellStyle.color = 'text.disabled';
    }

    const showAILoading = (
        (type === 'objective' && loadingSubjectAI) ||
        (type === 'action' && loadingSubjectAI) ||
        (type === 'action' && loadingObjectiveAI === objectiveIndex)
    );

    let isLoading = localLoading || showAILoading;

    
    if (type === 'subject' && loadingSubjectAI) {
        isLoading = false;
    }
    if (type === 'objective' && loadingObjectiveAI === objectiveIndex) {
        isLoading = false;
    }

    return (
        <Paper elevation={0} sx={{
            ...cellStyle,
            padding: {xs: 0.5, sm: 1},
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            },
            '&:hover .cell-actions': {
                opacity: 1,
            },
        }}>
            {isLoading ? (
                <CircularProgress size={24} color="inherit"/>
            ) : isEditing ? (
                <TextField
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    onBlur={handleUpdateName}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleUpdateName();
                        }
                    }}
                    autoFocus
                    size="small"
                    variant="standard"
                    multiline
                    sx={{
                        input: {textAlign: 'center', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit'},
                        width: '100%',
                        padding: 0
                    }}
                    InputProps={{disableUnderline: true}}
                />
            ) : (
        <Typography
                    sx={{
            fontWeight: isMainSubject ? 800 : (isCenter ? 600 : 500),
            fontSize: {xs: isMainSubject ? '0.85rem' : (isCenter ? '0.7rem' : '0.65rem'), sm: isMainSubject ? '1.15rem' : (isCenter ? '0.95rem' : '0.85rem')},
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: 'inherit',
                    }}
                >
                    {name}
                </Typography>
            )}
            {!(loadingSubjectAI || loadingObjectiveAI !== null) && !isEditing && (
                <Box
                    className="cell-actions"
                    sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        gap: 0.5,
                        backgroundColor: 'action.hover',
                        borderRadius: '12px',
                        padding: '2px',
                    }}
                >
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setIsEditing(true)}
                                    sx={{color: 'text.secondary', padding: '2px'}}>
                            <EditIcon sx={{fontSize: {xs: '0.8rem', sm: '1rem'}}}/>
                        </IconButton>
                    </Tooltip>
                    {canChangeStatus && (
                        <Tooltip title={isDone ? 'Mark as In Progress' : 'Mark as Done'}>
                            <IconButton size="small" onClick={handleUpdateStatus}
                                        sx={{color: 'text.secondary', padding: '2px'}}>
                                {isDone ? (
                                    <CheckCircleIcon
                                        sx={{fontSize: {xs: '0.8rem', sm: '1rem'}, color: 'success.main'}}/>
                                ) : (
                                    <RadioButtonUncheckedIcon sx={{fontSize: {xs: '0.8rem', sm: '1rem'}}}/>
                                )}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default Cell;
