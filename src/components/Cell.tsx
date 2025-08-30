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
import { alpha, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ColorPalette } from './types';

const useFitText = (text: string) => {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const checkAndAdjust = () => {
            const parent = element.parentElement;
            if (!parent) return;

            
            let currentSize = 16; 
            element.style.fontSize = `${currentSize}px`;

            
            while (
                (element.scrollHeight > parent.clientHeight || element.scrollWidth > parent.clientWidth) &&
                currentSize > 7 
            ) {
                currentSize--;
                element.style.fontSize = `${currentSize}px`;
            }
        };

        
        checkAndAdjust();

        
        window.addEventListener('resize', checkAndAdjust);
        return () => window.removeEventListener('resize', checkAndAdjust);

    }, [text]);

    return ref;
};


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
    centerContent?: boolean;
    visualMode?: 'default' | 'preview';
    shapeVariant?: 'square' | 'circle';
    perfMode?: boolean; 
    progressRatio?: number;
    isRelated?: boolean; 
    isHovered?: boolean; 
}

const CellComponent: React.FC<CellProps> = ({
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
    readOnly = false,
    centerContent = false,
    visualMode = 'default',
    shapeVariant = 'square',
    perfMode = false,
    progressRatio,
    isRelated = false,
    isHovered = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const canChangeStatus = type === 'action' && !readOnly;

    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(name);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const textRef = useFitText(name);

    useEffect(() => {
        setCurrentName(name);
    }, [name]);

    const handleUpdateName = async () => {
        if (currentName === name) {
            setIsEditing(false);
            return;
        }
        const prevName = name;
        const newName = currentName;
        setIsEditing(false);
        await updateItemName(id, type, newName);
    };


    const handleUpdateStatus = async () => {
        await updateItemStatus(id, type);
    };
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
        minWidth: '0',
        minHeight: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: 0,
        textAlign: 'center',
        transition: perfMode ? 'none' : 'all 0.35s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        padding: '5px',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        aspectRatio: '1 / 1',
        flexShrink: 0,
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        transform: isRelated ? (isHovered ? 'scale(1.05)' : 'scale(1.02)') : 'scale(1)',
        zIndex: isRelated ? (isHovered ? 10 : 5) : 1,
        filter: isRelated ? 'brightness(1.05) saturate(1.1)' : 'none',
        border: isRelated ? 
            (isHovered ? 
                `2px solid ${palette?.main || theme.palette.primary.main}` : 
                `1px solid ${alpha(palette?.main || theme.palette.primary.main, 0.3)}`
            ) : undefined,
    };

    const isDark = theme.palette.mode === 'dark';
    const toneBg = (col: string, alphaVal: number) => `linear-gradient(145deg, ${alpha(col, alphaVal)}, ${alpha(col, alphaVal*0.5)})`;

    const prog = typeof progressRatio === 'number' ? Math.max(0, Math.min(1, progressRatio)) : undefined;
    const progHue = palette?.main || theme.palette.primary.main;
    const progBorderColor = prog!==undefined ? alpha(progHue, 0.35 + 0.45*prog) : undefined;

    if (isMainSubject) {
        cellStyle.background = perfMode ? palette.main || 'var(--gradient-primary)' : 'var(--gradient-primary)';
        cellStyle.color = '#fff';
        cellStyle.boxShadow = isDark ? '0 10px 28px -6px rgba(0,0,0,0.65)' : '0 10px 26px -4px rgba(15,23,42,0.22)';
        cellStyle.border = '1px solid ' + (progBorderColor || alpha('#ffffff', isDark?0.22:0.4));
        cellStyle.position = 'relative';
    } else if (isCenter && palette) {
        cellStyle.background = perfMode ? alpha(palette.main, isDark?0.25:0.35) : toneBg(palette.main, isDark?0.28:0.4);
        cellStyle.border = '1.5px solid ' + (progBorderColor || alpha(palette.main, isDark?0.9:0.85));
        cellStyle.boxShadow = isDark ? '0 4px 16px -4px rgba(0,0,0,0.6)' : '0 4px 14px -4px rgba(15,23,42,0.18)';
    } else {
        const baseCol = palette?.main || theme.palette.divider;
        cellStyle.background = perfMode
            ? (visualMode==='preview' ? alpha(baseCol, isDark?0.12:0.16) : alpha(baseCol, isDark?0.12:0.16))
            : (visualMode==='preview'
                ? toneBg(baseCol, isDark?0.10:0.18)
                : toneBg(baseCol, isDark?0.10:0.18));
        cellStyle.border = '1px solid ' + (progBorderColor || alpha(baseCol, isDark?0.55:0.55));
    }

    if (isDone) {
        const base = palette?.main || theme.palette.primary.main;
        if (theme.palette.mode === 'dark') {
            const darkA = alpha(base, 0.08);
            const darkB = alpha(base, 0.15);
            if (isMainSubject) {
                cellStyle.background = perfMode ? darkA : `linear-gradient(135deg, ${darkA}, ${darkB})`;
                cellStyle.color = alpha('#ffffff', 0.9);
            } else if (isCenter) {
                cellStyle.background = perfMode ? darkA : `linear-gradient(145deg, ${darkA}, ${darkB})`;
                cellStyle.borderColor = alpha(base, 0.4);
            } else {
                cellStyle.background = perfMode ? darkB : `linear-gradient(160deg, ${darkB}, ${darkA})`;
                cellStyle.borderColor = alpha(base, 0.3);
            }
            cellStyle.boxShadow = perfMode ? 
                `inset 0 0 0 1px ${alpha(base, 0.2)}` : 
                `inset 0 0 0 1px ${alpha(base, 0.2)}, 0 1px 4px ${alpha(base, 0.1)}`;
        } else {
            const lightA = alpha(base, 0.15);
            const lightB = alpha(base, 0.25);
            if (isMainSubject) {
                cellStyle.background = perfMode ? base : `linear-gradient(135deg, ${base}, ${alpha(base, 0.8)})`;
                cellStyle.color = '#fff';
            } else if (isCenter) {
                cellStyle.background = perfMode ? lightA : `linear-gradient(145deg, ${lightA}, ${lightB})`;
                cellStyle.borderColor = alpha(base, 0.6);
            } else {
                cellStyle.background = perfMode ? lightB : `linear-gradient(160deg, ${lightB}, ${lightA})`;
                cellStyle.borderColor = alpha(base, 0.5);
            }
            cellStyle.boxShadow = perfMode ? 
                `inset 0 0 0 1px ${alpha(base, 0.4)}` : 
                `inset 0 0 0 1px ${alpha(base, 0.4)}, 0 2px 4px ${alpha(base, 0.08)}`;
        }
        
        if (!isMainSubject) {
            cellStyle.color = theme.palette.mode === 'dark' ? alpha(theme.palette.text.primary, 0.85) : theme.palette.text.secondary;
        }
        cellStyle.position = 'relative';
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
                onClick={!isEditing ? handleMobileTouch : undefined}
                data-status={status}
                sx={{
                    ...cellStyle,
                    '@media (hover: hover)': perfMode ? undefined : {
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: isDone
                                ? '0 6px 14px rgba(0,0,0,0.12)'
                                : '0 12px 26px rgba(0,0,0,0.18)',
                        },
                        '&:hover .cell-actions': { opacity: 1 },
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                        '&:hover': { transform: 'none', boxShadow: 'none' }
                    },
                    outline: 'none',
                    cursor: isMobile && !isEditing && !readOnly ? 'pointer' : 'default',
                    '&:focus-visible': {
                        boxShadow: '0 0 0 3px rgba(37,99,255,0.4)',
                    },
                }}
            >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" disableShrink />
            ) : isEditing ? (
                <TextField
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    onBlur={handleUpdateName}
                    onClick={(e) => e.stopPropagation()}
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
                        width: '100%',
                        padding: 0,
                        '& .MuiInputBase-input': { textAlign: 'left', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }
                    }}
                    InputProps={{disableUnderline: true}}
                />
            ) : (
                <Typography
                    ref={textRef}
                    sx={{
                        fontWeight: isMainSubject ? 800 : (isCenter ? 600 : 500),
                        lineHeight: 1.4,
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: 'inherit',
                        textAlign: 'center',
                        width: '100%',
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        fontFamily: 'inherit',
                        position: 'relative',
                        zIndex: 1,
                        hyphens: 'auto',
                        wordSpacing: 'normal',
                        letterSpacing: 'normal',
                        textDecorationThickness: isDone ? '2px' : 'auto',
                        textDecorationColor: isDone ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)') : 'auto',
                    }}
                >
                    {name}
                </Typography>
            )}
            {!isEditing && !readOnly && (
                <Box
                    className="cell-actions"
                    sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        opacity: 0,
                        transition: perfMode ? 'none' : 'opacity 0.25s',
                        display: { xs: 'none', md: 'flex' },
                        gap: 0.5,
                        backgroundColor: 'action.hover',
                        borderRadius: '12px',
                        padding: '2px',
                    }}
                >
                    <Tooltip title="Edit">
                        <IconButton 
                            size="small" 
                            onClick={() => setIsEditing(true)}
                            sx={{color: 'text.secondary', padding: '2px'}}
                        >
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
                                    <CircularProgress size={12} disableShrink sx={{fontSize: {xs: '0.8rem', sm: '1rem'}}} />
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

            <Drawer
                anchor="bottom"
                open={showMobileActions}
                onClose={() => setShowMobileActions(false)}
                disableRestoreFocus 
                disableEnforceFocus 
                keepMounted={false} 
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
                                        <CircularProgress size={24} disableShrink />
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

const Cell = React.memo(CellComponent, (prev, next) => {
    return prev.id === next.id &&
        prev.name === next.name &&
        prev.status === next.status &&
        prev.type === next.type &&
        prev.readOnly === next.readOnly &&
        prev.perfMode === next.perfMode &&
        prev.visualMode === next.visualMode &&
        prev.shapeVariant === next.shapeVariant;
});

export default Cell;