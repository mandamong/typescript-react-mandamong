import { resolveMandalartItemName } from '@/utils/mandalartName';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, Fade, IconButton, Paper, Tooltip } from '@mui/material';
import { blue, green, orange, pink, purple, red, teal, yellow } from '@mui/material/colors';
import React from 'react';
import Cell from './Cell';
import type { ColorPalette, Item } from './types';

type RawSubject = { id: number; name?: string; subject?: string; status?: string };
type RawObjective = { id: number; name?: string; objective?: string; status?: string };
type RawAction = { id: number; name?: string; action?: string; status?: string };
export interface MandalartGridData {
    mandalart: { id: number; name: string; status?: string };
    subject: RawSubject;
    objectives: RawObjective[];
    actions: RawAction[][];
}

interface MandalartGridProps {
    data: MandalartGridData;
    updateItemName: (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => void;
    updateItemStatus: (itemId: number, itemType: 'subject' | 'objective' | 'action') => void;
    onCreateSubMandalart?: (itemId: number, itemType: 'objective' | 'action', itemName: string) => void;
    loadingSubjectAI?: boolean;
    loadingObjectiveAI?: number | null;
    loadingSubMandalartAI?: boolean;
    readOnly?: boolean;
    autoFit?: boolean;
    reservedVertical?: number;
    minScale?: number;
    showZoomControls?: boolean;
}

const objectivePalettes = [
    {light: red[50], main: red[200], dark: red[700]},
    {light: orange[50], main: orange[200], dark: orange[700]},
    {light: yellow[50], main: yellow[300], dark: yellow[700]},
    {light: green[50], main: green[200], dark: green[700]},
    {light: teal[50], main: teal[100], dark: teal[600]},
    {light: blue[50], main: blue[200], dark: blue[700]},
    {light: purple[50], main: purple[200], dark: purple[700]},
    {light: pink[50], main: pink[100], dark: pink[700]},
];

const MandalartGrid: React.FC<MandalartGridProps> = ({
    data,
    updateItemName,
    updateItemStatus,
    onCreateSubMandalart,
    loadingSubjectAI,
    loadingObjectiveAI,
    loadingSubMandalartAI,
    readOnly = false,
    autoFit = true,
    reservedVertical = 140,
    minScale = 0.75,
    showZoomControls = true,
}) => {
    const { subject, objectives, actions } = data;

    // auto fit logic
    const [autoScale, setAutoScale] = React.useState(1);
    const [userScale, setUserScale] = React.useState<number | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (!autoFit) return;
        const calc = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const baseSize = Math.min(vw - 32, 900);
            const availableHeightForGrid = vh - reservedVertical;
            const nextScale = Math.max(minScale, Math.min(1, availableHeightForGrid / baseSize));
            setAutoScale(nextScale);
            // autoScale이 커지는 상황이면 사용자 지정 스케일이 없을 때만 반영
            if (userScale === null) {
                // pass
            }
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, [autoFit, reservedVertical, minScale, userScale]);

    const effectiveScale = userScale ?? autoScale;

    const changeScale = (delta: number) => {
        setUserScale(prev => {
            const base = prev ?? autoScale;
            return Math.min(1.1, Math.max(minScale * 0.9, parseFloat((base + delta).toFixed(2))));
        });
    };

    const resetScale = () => setUserScale(null);

    const gridCells: {
        item: Item | null;
        type: 'subject' | 'objective' | 'action' | 'empty';
        palette?: ColorPalette;
        isMainSubject?: boolean;
        isCenter?: boolean;
        objIndex?: number;
    }[] = Array(25).fill(null).map(() => ({ item: null, type: 'empty' }));

    const subjectItem: Item | null = subject ? { id: subject.id, name: resolveMandalartItemName(subject), status: subject.status } : null;
    gridCells[12] = { item: subjectItem, type: 'subject', palette: { light: '', main: '', dark: '' }, isMainSubject: true };

    const objectivePositions = [6, 8, 18, 16];
    const objectiveDataIndices = [0, 1, 2, 3];

    for (let i = 0; i < 4; i++) {
    const obj = objectives[objectiveDataIndices[i]];
        if (obj) {
            gridCells[objectivePositions[i]] = {
                item: { id: obj.id, name: resolveMandalartItemName(obj), status: obj.status },
                type: 'objective',
                palette: objectivePalettes[objectiveDataIndices[i]],
                isCenter: true,
            };
        }
    }

    const A1_indices = [0, 1, 2, 5, 7];
    const A2_indices = [3, 4, 9, 13, 14];
    const A3_indices = [17, 19, 22, 23, 24];
    const A4_indices = [10, 11, 15, 20, 21];
    const actionGroups = [A1_indices, A2_indices, A3_indices, A4_indices];

    const fillActions = (indices: number[], objIndex: number) => {
    const objActions = actions[objIndex] || [];
        for (let i = 0; i < indices.length; i++) {
            if (objActions[i]) {
                gridCells[indices[i]] = {
                    item: {
                        id: objActions[i].id,
                        name: resolveMandalartItemName(objActions[i]),
                        status: objActions[i].status,
                    },
                    type: 'action',
                    palette: objectivePalettes[objIndex],
                    objIndex: objIndex,
                };
            } else {
                gridCells[indices[i]] = { item: null, type: 'empty' };
            }
        }
    };

    fillActions(A1_indices, 0);
    fillActions(A2_indices, 1);
    fillActions(A3_indices, 2);
    fillActions(A4_indices, 3);

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                maxWidth: '900px',
                margin: 'auto',
                padding: { xs: 1, sm: 2 },
                boxSizing: 'border-box',
                position: 'relative',
            }}
        >
            {showZoomControls && (
                <Fade in timeout={300}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Box sx={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'var(--field-bg)', borderRadius: 6, boxShadow: 2, p: 0.5 }}>
                            <Tooltip title="축소">
                                <span>
                                    <IconButton size="small" onClick={() => changeScale(-0.05)} disabled={effectiveScale <= minScale * 0.9}>
                                        <ZoomOutIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Box sx={{ fontSize: 12, fontWeight: 600, px: 0.5, minWidth: 52, textAlign: 'center' }}>
                                {(effectiveScale * 100).toFixed(0)}%
                            </Box>
                            <Tooltip title={userScale === null ? '기본 자동 맞춤' : '자동 맞춤으로 되돌리기'}>
                                <span>
                                    <IconButton size="small" color={userScale === null ? 'primary' : 'default'} onClick={resetScale}>
                                        <CenterFocusStrongIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="확대">
                                <span>
                                    <IconButton size="small" onClick={() => changeScale(+0.05)} disabled={effectiveScale >= 1}>
                                        <ZoomInIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    </Box>
                </Fade>
            )}
            <Box sx={{ transform: `scale(${effectiveScale})`, transformOrigin: 'top center', width: '100%', transition: 'transform .25s ease' }}>
            {/* Grid + lines wrapper */}
            <Box sx={{ position: 'relative' }}>
                {/* Connection lines between center subject and objectives */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                    }}
                >
                    <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {(() => {
                        const lines: React.ReactElement[] = [];
                        const objectivePositionsLocal = [6, 8, 18, 16];
                        const center = 12;
                        const idxToRC = (i: number) => ({ r: Math.floor(i / 5), c: i % 5 });
                        const rcToPct = (r: number, c: number) => ({
                            x: ((c + 0.5) / 5) * 100,
                            y: ((r + 0.5) / 5) * 100,
                        });
                        const centerRC = idxToRC(center);
                        const centerPct = rcToPct(centerRC.r, centerRC.c);

                        // Subject -> Objectives
                        objectivePositionsLocal.forEach((p, i) => {
                            const obj = gridCells[p];
                            if (obj.type !== 'objective') return;
                            const rc = idxToRC(p);
                            const pct = rcToPct(rc.r, rc.c);
                            lines.push(
                                <line
                                    key={`subject-${p}`}
                                    x1={`${centerPct.x}%`}
                                    y1={`${centerPct.y}%`}
                                    x2={`${pct.x}%`}
                                    y2={`${pct.y}%`}
                                    stroke={objectivePalettes[i].main}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    opacity={0.55}
                                />
                            );
                        });

                        // Objectives -> Actions
                        objectivePositionsLocal.forEach((p, i) => {
                            const obj = gridCells[p];
                            if (obj.type !== 'objective') return;
                            const objRC = idxToRC(p);
                            const objPct = rcToPct(objRC.r, objRC.c);
                            const actionsIdx = actionGroups[i];
                            actionsIdx.forEach((ai) => {
                                const actionCell = gridCells[ai];
                                if (actionCell.type !== 'action') return; // only draw if action exists
                                const aRC = idxToRC(ai);
                                const aPct = rcToPct(aRC.r, aRC.c);
                                lines.push(
                                    <line
                                        key={`obj-${p}-act-${ai}`}
                                        x1={`${objPct.x}%`}
                                        y1={`${objPct.y}%`}
                                        x2={`${aPct.x}%`}
                                        y2={`${aPct.y}%`}
                                        stroke={objectivePalettes[i].main}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        opacity={0.4}
                                    />
                                );
                            });
                        });
                        return lines;
                    })()}
                    </svg>
                </Box>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: { xs: 1, sm: 2 },
                        aspectRatio: '1 / 1',
                        position: 'relative',
                    }}
                >
                    {gridCells.map((cellData, index) => (
                        <Box key={index}>
                            {cellData.item ? (
                                <Cell
                                    id={(cellData.item as Item).id}
                                    name={(cellData.item as Item).name}
                                    status={(cellData.item as Item).status}
                                    type={cellData.type as 'subject' | 'objective' | 'action'}
                                    palette={cellData.palette || { light: '', main: '', dark: '' }}
                                    updateItemName={updateItemName}
                                    updateItemStatus={updateItemStatus}
                                    onCreateSubMandalart={onCreateSubMandalart}
                                    isMainSubject={cellData.isMainSubject}
                                    isCenter={cellData.isCenter}
                                    loadingSubjectAI={loadingSubjectAI}
                                    loadingObjectiveAI={loadingObjectiveAI}
                                    loadingSubMandalartAI={loadingSubMandalartAI}
                                    objectiveIndex={cellData.objIndex}
                                    readOnly={readOnly}
                                />
                            ) : (
                                <Paper
                                    sx={{
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'var(--field-bg)',
                                        opacity: 0.5,
                                        borderRadius: 4,
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
            </Box>
        </Box>
    );
};

export default MandalartGrid;
