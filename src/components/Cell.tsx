import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
    Box,
    CircularProgress,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import type { ColorPalette } from './types';

interface CellProps {
    id: number;
    name: string;
    status?: string;
    type: 'subject' | 'objective' | 'action';
    palette: ColorPalette;
    updateItemName: (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => void;
    updateItemStatus: (itemId: number, itemType: 'subject' | 'objective' | 'action') => void;
    onCreateSubMandalart?: (itemId: number, itemType: 'objective' | 'action', itemName: string) => void;
    isCenter?: boolean;
    isMainSubject?: boolean;
    loadingSubjectAI?: boolean;
    loadingObjectiveAI?: number | null;
    loadingSubMandalartAI?: boolean;
    objectiveIndex?: number;
    readOnly?: boolean;
}

const Cell: React.FC<CellProps> = ({
                                       id,
                                       name,
                                       status,
                                       type,
                                       palette,
                                       updateItemName,
                                       updateItemStatus,
                                       onCreateSubMandalart,
                                       isCenter = false,
                                       isMainSubject = false,
                                       loadingSubjectAI = false,
                                       loadingObjectiveAI = null,
                                       loadingSubMandalartAI = false,
                                       objectiveIndex,
                                       readOnly = false
                                   }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const canChangeStatus = type === 'action' && !readOnly;

    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(name);
    const [showMobileActions, setShowMobileActions] = useState(false);

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
        await updateItemStatus(id, type);
    };

    // 모바일 터치 핸들러 (즉시 액션 메뉴 표시)
    const handleMobileTouch = useCallback(() => {
        if (!isMobile || isEditing || readOnly) return;
        setShowMobileActions(true);
    }, [isMobile, isEditing, readOnly]);

    const handleMobileEdit = () => {
        setShowMobileActions(false);
        setIsEditing(true);
    };

    const handleMobileStatusChange = () => {
        setShowMobileActions(false);
        handleUpdateStatus();
    };

    const handleMobileSubMandalart = () => {
        setShowMobileActions(false);
        if (onCreateSubMandalart) {
            onCreateSubMandalart(id, type as 'objective' | 'action', name);
        }
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
        cellStyle.backgroundColor = theme.palette.primary.main;
        cellStyle.color = theme.palette.primary.contrastText;
        cellStyle.boxShadow = theme.palette.mode === 'dark'
            ? '0 6px 18px rgba(0,0,0,0.55)'
            : '0 6px 16px rgba(0,0,0,0.18)';
    } else if (isCenter && palette) {
        cellStyle.backgroundColor = theme.palette.background.paper;
        cellStyle.color = theme.palette.text.primary;
        cellStyle.border = '2px solid';
        cellStyle.borderColor = palette.main;
        cellStyle.boxShadow = theme.palette.mode === 'dark'
            ? '0 2px 10px rgba(0,0,0,0.5)'
            : '0 2px 8px rgba(0,0,0,0.08)';
    } else {
        cellStyle.backgroundColor = theme.palette.background.paper;
        cellStyle.border = '1px solid';
        cellStyle.borderColor = palette ? palette.main : theme.palette.divider;
    }

    if (isDone) {
        const base = palette?.main || theme.palette.primary.main;
        if (isMainSubject) {
            cellStyle.backgroundColor = theme.palette.primary.main;
            cellStyle.color = theme.palette.primary.contrastText;
        } else if (isCenter) {
            cellStyle.backgroundColor = theme.palette.mode === 'dark'
                ? theme.palette.background.default
                : lighten(base, 0.6);
            cellStyle.borderColor = base;
        } else {
            cellStyle.backgroundColor = theme.palette.mode === 'dark'
                ? theme.palette.background.default
                : lighten(base, 0.75);
            cellStyle.borderColor = base;
        }
        if (!isMainSubject) {
            cellStyle.color = theme.palette.text.secondary;
        }
        cellStyle.filter = isMainSubject
            ? 'brightness(0.97) saturate(0.92)'
            : 'brightness(0.94) saturate(0.88)';
    }

    const showAILoading = (
        (type === 'objective' && loadingSubjectAI) ||
        (type === 'action' && loadingSubjectAI) ||
        (type === 'action' && loadingObjectiveAI === objectiveIndex)
    );

    let isLoading = showAILoading;

    
    if (type === 'subject' && loadingSubjectAI) {
        isLoading = false;
    }
    if (type === 'objective' && loadingObjectiveAI === objectiveIndex) {
        isLoading = false;
    }

    return (
        <>
            <Paper 
                elevation={0} 
                onClick={handleMobileTouch} // 모바일에서 터치(클릭) 시 액션 메뉴 표시
                sx={{
                    ...cellStyle,
                    padding: {xs: 0.5, sm: 1},
                    // 데스크톱에서만 호버 효과 적용
                    '@media (hover: hover)': {
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                        '&:hover .cell-actions': {
                            opacity: 1,
                        },
                    },
                    // 모바일에서 터치 가능함을 나타내는 커서
                    cursor: isMobile && !isEditing && !readOnly ? 'pointer' : 'default',
                }}
            >
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
            {!(loadingSubjectAI || loadingObjectiveAI !== null) && !isEditing && !readOnly && (
                <Box
                    className="cell-actions"
                    sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: { xs: 'none', md: 'flex' }, // 모바일에서는 아예 숨김, 데스크톱에서만 표시
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
                    {(type === 'objective' || type === 'action') && onCreateSubMandalart && (
                        <Tooltip title="서브 만다르트 생성">
                            <IconButton 
                                size="small" 
                                onClick={() => onCreateSubMandalart(id, type, name)}
                                disabled={loadingSubMandalartAI}
                                sx={{color: 'text.secondary', padding: '2px'}}
                            >
                                {loadingSubMandalartAI ? (
                                    <CircularProgress size={12} sx={{fontSize: {xs: '0.8rem', sm: '1rem'}}} />
                                ) : (
                                    <AddIcon sx={{fontSize: {xs: '0.8rem', sm: '1rem'}}}/>
                                )}
                            </IconButton>
                        </Tooltip>
                    )}
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

            {/* 모바일 액션 드로어 */}
            <Drawer
                anchor="bottom"
                open={showMobileActions}
                onClose={() => setShowMobileActions(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingBottom: 2,
                    },
                }}
            >
                <Box sx={{ width: '100%', padding: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
                        {name}
                    </Typography>
                    <List>
                        <ListItemButton 
                            onClick={handleMobileEdit}
                            sx={{ 
                                borderRadius: 2, 
                                mb: 1,
                                backgroundColor: 'action.hover',
                                '&:hover': { backgroundColor: 'action.selected' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="내용 수정" />
                        </ListItemButton>
                        
                        {(type === 'objective' || type === 'action') && onCreateSubMandalart && (
                            <ListItemButton 
                                onClick={handleMobileSubMandalart}
                                disabled={loadingSubMandalartAI}
                                sx={{ 
                                    borderRadius: 2, 
                                    mb: 1,
                                    backgroundColor: 'action.hover',
                                    '&:hover': { backgroundColor: 'action.selected' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {loadingSubMandalartAI ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <AddIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary="서브 만다르트 생성" />
                            </ListItemButton>
                        )}
                        
                        {canChangeStatus && (
                            <ListItemButton 
                                onClick={handleMobileStatusChange}
                                sx={{ 
                                    borderRadius: 2,
                                    backgroundColor: 'action.hover',
                                    '&:hover': { backgroundColor: 'action.selected' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {isDone ? (
                                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={isDone ? '진행중으로 변경' : '완료로 변경'} 
                                />
                            </ListItemButton>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Cell;
