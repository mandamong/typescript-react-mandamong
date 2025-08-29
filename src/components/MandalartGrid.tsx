import useReducedMotion from '@/hooks/useReducedMotion';
import { resolveMandalartItemName } from '@/utils/mandalartName';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, Fade, IconButton, Paper, Tooltip } from '@mui/material';
import { green, orange, purple, red } from '@mui/material/colors';

import React from 'react';
import Cell from './Cell';
import type { ColorPalette, Item } from './types';

interface RawSubject { id:number; name?:string; subject?:string; status?:string }
interface RawObjective { id:number; name?:string; objective?:string; status?:string }
interface RawAction { id:number; name?:string; action?:string; status?:string }
export interface MandalartGridData { mandalart:{id:number; name:string; status?:string}; subject:RawSubject; objectives:RawObjective[]; actions:RawAction[][] }
interface MandalartGridProps { data:MandalartGridData; updateItemName:(id:number,t:'subject'|'objective'|'action',name:string)=>void; updateItemStatus:(id:number,t:'subject'|'objective'|'action')=>void; onCreateSubMandalart?:(id:number,t:'objective'|'action',name:string)=>void; loadingSubjectAI?:boolean; loadingObjectiveAI?:number|null; loadingSubMandalartAI?:boolean; readOnly?:boolean; autoFit?:boolean; reservedVertical?:number; minScale?:number; showZoomControls?:boolean; centered?:boolean; visualMode?:'default'|'preview'; shape?:'square'|'circle'; perfMode?:boolean; showConnections?:boolean }


const SUBJECT_INDEX = 12; 
const MAX_OBJECTIVES = 4;
const ACTIONS_PER_OBJECTIVE = 5;

const OBJECTIVE_POSITIONS = [6, 8, 18, 16];

const ACTION_GROUPS: number[][] = [
    [0, 1, 2, 5, 7],      
    [3, 4, 9, 13, 14],    
    [17, 19, 22, 23, 24], 
    [10, 11, 15, 20, 21], 
];

const palettes: ColorPalette[] = [
    { light: red[50],    main: red[200],    dark: red[700] },
    { light: orange[50], main: orange[200], dark: orange[700] },
    { light: green[50],  main: green[200],  dark: green[700] },
    { light: purple[50], main: purple[200], dark: purple[700] },
];

const MandalartGridComponent: React.FC<MandalartGridProps> = ({
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
    centered = false,
    visualMode = centered ? 'preview' : 'default',
    shape = visualMode === 'preview' ? 'circle' : 'square',
    perfMode = false,
    showConnections = false,
}) => {
    const { subject, objectives, actions } = data;
    const reducedMotion = useReducedMotion();
    const lowMem = typeof navigator !== 'undefined' && (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
    const ultraPerf = typeof window !== 'undefined' && (lowMem || window.innerWidth < 820);
    const perf = perfMode || reducedMotion || lowMem || ultraPerf;

    
    const [autoScale, setAutoScale] = React.useState(1);
    const [userScale, setUserScale] = React.useState<number | null>(null);
    const [wrapperWidth, setWrapperWidth] = React.useState<number | null>(null);
    React.useLayoutEffect(() => {
        if (!autoFit) return;
        const calc = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const base = Math.min(vw - 32, 900);
            const avail = vh - reservedVertical;
            setAutoScale(Math.max(minScale, Math.min(1, avail / base)));
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, [autoFit, reservedVertical, minScale]);

    React.useLayoutEffect(() => {
        if (!autoFit) return;
        const calcW = () => {
            const vw = window.innerWidth;
            const base = Math.min(vw - 32, 900);
            setWrapperWidth(base);
        };
        calcW();
        window.addEventListener('resize', calcW);
        return () => window.removeEventListener('resize', calcW);
    }, [autoFit]);

    
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(()=>{
        if (!autoFit || userScale!==null) return; 
        if (!contentRef.current) return;
        const el = contentRef.current;
        const ro = new ResizeObserver(()=>{
            const scaledW = el.offsetWidth; 
            const scaledH = el.offsetHeight;
            const currentScale = autoScale; 
            if (!currentScale) return;
            const naturalW = scaledW / currentScale;
            const naturalH = scaledH / currentScale;
            const availW = window.innerWidth - 32; 
            const availH = window.innerHeight - reservedVertical; 
            const fitScale = Math.min(1, availW / naturalW, availH / naturalH);
            const clamped = Math.max(minScale, Math.min(1, fitScale));
            if (Math.abs(clamped - autoScale) > 0.015) {
                setAutoScale(clamped);
            }
        });
        ro.observe(el);
        const onWinResize = () => {
            
            if (el) {
                
                void el.offsetWidth;
            }
        };
        window.addEventListener('resize', onWinResize);
        return () => { window.removeEventListener('resize', onWinResize); ro.disconnect(); };
    }, [autoFit, userScale, autoScale, reservedVertical, minScale]);
    const effectiveScale = userScale ?? autoScale;
    const changeScale = (d: number) => setUserScale(p => {
        const b = p ?? autoScale;
        return Math.min(1.1, Math.max(minScale * 0.9, parseFloat((b + d).toFixed(2))));
    });
    const resetScale = () => setUserScale(null);

    
    const [hoverObjective, setHoverObjective] = React.useState<number | null>(null);

    
    const gridCells: {
        item: Item | null;
        type: 'subject' | 'objective' | 'action' | 'empty';
        palette?: ColorPalette;
        isMainSubject?: boolean;
        isCenter?: boolean;
        objIndex?: number;
    }[] = React.useMemo(()=>Array(25).fill(null).map(() => ({ item: null, type: 'empty' })), [data]);

    const subjectItem: Item | null = subject ? {
        id: subject.id,
        name: resolveMandalartItemName(subject),
        status: subject.status,
    } : null;
    gridCells[SUBJECT_INDEX] = { item: subjectItem, type: 'subject', palette: { light: '', main: '', dark: '' }, isMainSubject: true };

    
    for (let i = 0; i < MAX_OBJECTIVES; i++) {
        const raw = objectives[i];
        if (!raw) continue;
        gridCells[OBJECTIVE_POSITIONS[i]] = {
            item: { id: raw.id, name: resolveMandalartItemName(raw), status: raw.status },
            type: 'objective',
            palette: palettes[i],
            isCenter: true,
            objIndex: i,
        };
    }
    
    ACTION_GROUPS.forEach((grp, objectiveIdx) => {
        const arr = (actions[objectiveIdx] || []).slice(0, ACTIONS_PER_OBJECTIVE);
        grp.forEach((cellIdx, localIdx) => {
            const act = arr[localIdx];
            if (!act) return; 
            gridCells[cellIdx] = {
                item: { id: act.id, name: resolveMandalartItemName(act), status: act.status },
                type: 'action',
                palette: palettes[objectiveIdx],
                objIndex: objectiveIdx,
            };
        });
    });

    

    
    const idxToRC = (i: number) => ({ r: Math.floor(i / 5), c: i % 5 });
    const rcToPct = (r: number, c: number) => ({ x: ((c + 0.5) / 5) * 100, y: ((r + 0.5) / 5) * 100 });
    const centerPct = rcToPct(idxToRC(SUBJECT_INDEX).r, idxToRC(SUBJECT_INDEX).c);
    interface Line { key: string; x1: number; y1: number; x2: number; y2: number; objectiveOrdinal: number; kind: 'subject-objective' | 'objective-action'; actionCellIdx?: number }
    const lines: Line[] = React.useMemo(()=>{
        
        const acc: Line[] = [];
        OBJECTIVE_POSITIONS.forEach((pos, ord) => {
            const rc = idxToRC(pos); const objPct = rcToPct(rc.r, rc.c);
            acc.push({ key: `l-sub-${pos}` , x1: centerPct.x, y1: centerPct.y, x2: objPct.x, y2: objPct.y, objectiveOrdinal: ord, kind: 'subject-objective' });
            ACTION_GROUPS[ord].forEach(ai => {
                const arc = idxToRC(ai); const aPct = rcToPct(arc.r, arc.c);
                acc.push({ key: `l-obj-${pos}-act-${ai}`, x1: objPct.x, y1: objPct.y, x2: aPct.x, y2: aPct.y, objectiveOrdinal: ord, kind: 'objective-action', actionCellIdx: ai });
            });
        });
        return acc;
    }, []);

    
    const actionStatusMap = React.useMemo(()=>{
        const map: Record<number,string[]> = {};
        ACTION_GROUPS.forEach((grp,i)=>{
            map[i] = grp.map(idx=>{
                const c = gridCells[idx];
                return c.item ? (c.item as Item).status || '' : '';
            });
        });
        return map;
    },[gridCells]);

    
    const objectiveProgress: Record<number, number> = React.useMemo(()=>{
        const res: Record<number, number> = {};
        Object.keys(actionStatusMap).forEach(k=>{
            const idx = Number(k);
            const arr = actionStatusMap[idx];
            const done = arr.filter(s=>s==='DONE').length;
            res[idx] = arr.length? done/arr.length : 0;
        });
        return res;
    },[actionStatusMap]);
    const overallProgress = React.useMemo(()=>{
        const vals = Object.values(objectiveProgress);
        return vals.length? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    },[objectiveProgress]);

    const containerSx: any = {
        width: '100%',
        maxWidth: { xs: '100vw', sm: 900 },
        mx: 'auto',
        p: { xs: 0.5, sm: 2 },
        position: 'relative' as const,
        boxSizing: 'border-box' as const,
        minHeight: { xs: 'calc(100vh - 120px)', sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        '& > *': { position: 'relative', zIndex: 1 },
    };
    if (!perf) {
        containerSx['&::before'] = {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            background: (t: any) => t.palette.mode === 'dark'
                ? 'radial-gradient(circle at 30% 25%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.18), transparent 65%)'
                : 'radial-gradient(circle at 25% 30%, rgba(37,99,255,0.08), transparent 60%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.1), transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: .85,
        };
    }

    return (
        <Box sx={containerSx}>
            {showZoomControls && (
                <Fade in timeout={300}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Box sx={{
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: .5,
                            borderRadius: 6,
                            p: .5,
                            bgcolor: (t: any) => t.palette.mode === 'dark' ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.75)',
                            backdropFilter: 'saturate(1.4) blur(6px)',
                            WebkitBackdropFilter: 'saturate(1.4) blur(6px)',
                            boxShadow: (t: any) => t.palette.mode === 'dark' ? '0 4px 18px rgba(0,0,0,0.55)' : '0 6px 18px rgba(0,0,0,0.12)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}>
                            <Tooltip title='축소'><span><IconButton size='small' onClick={() => changeScale(-0.05)} disabled={effectiveScale <= minScale * 0.9}><ZoomOutIcon fontSize='small' /></IconButton></span></Tooltip>
                            <Box sx={{ fontSize: 12, fontWeight: 600, px: .75, minWidth: 52, textAlign: 'center', letterSpacing: '.5px', color: 'text.secondary' }}>{(effectiveScale * 100).toFixed(0)}%</Box>
                            <Tooltip title={userScale === null ? '기본 자동 맞춤' : '자동 맞춤으로 되돌리기'}><span><IconButton size='small' color={userScale === null ? 'primary' : 'default'} onClick={resetScale}><CenterFocusStrongIcon fontSize='small' /></IconButton></span></Tooltip>
                            <Tooltip title='확대'><span><IconButton size='small' onClick={() => changeScale(+0.05)} disabled={effectiveScale >= 1}><ZoomInIcon fontSize='small' /></IconButton></span></Tooltip>
                        </Box>
                    </Box>
                </Fade>
            )}

            <Box ref={contentRef} sx={{ transform: `scale(${effectiveScale})`, transformOrigin: 'top center', width: wrapperWidth ? `${wrapperWidth}px` : '100%', display: 'flex', justifyContent: 'center', transition: perf ? 'none' : 'transform .25s ease', mx: 'auto' }}>
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {showConnections && (
                    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                        <svg width='100%' height='100%' preserveAspectRatio='none' style={{ overflow: 'visible' }}>
                            {!perf && (
                                <defs>
                                    <filter id='mandalart-glow' x='-50%' y='-50%' width='200%' height='200%'>
                                        <feGaussianBlur in='SourceGraphic' stdDeviation='3' result='blur' />
                                        <feColorMatrix in='blur' type='matrix' values='0 0 0 0 0  0 0 0 0 0.25  0 0 0 0 0.6  0 0 0 0.9 0' result='colored' />
                                        <feMerge><feMergeNode in='colored' /><feMergeNode in='SourceGraphic' /></feMerge>
                                    </filter>
                                </defs>
                            )}
                            {/** minimal 스타일 (요청 스크린샷 느낌) */}
                            {shape==='square' && visualMode==='default' ? lines.map(l=>{
                                const pal = palettes[l.objectiveOrdinal];
                                const isObjLine = l.kind==='subject-objective';
                                const rawDx = l.x2 - l.x1; const rawDy = l.y2 - l.y1; const len = Math.hypot(rawDx, rawDy)||1; const ux=rawDx/len; const uy=rawDy/len;
                                
                                const shrink = isObjLine ? Math.min(6, len*0.12) : Math.min(5, len*0.14);
                                const x1 = l.x1 + ux*shrink; const y1 = l.y1 + uy*shrink; const x2 = l.x2 - ux*shrink; const y2 = l.y2 - uy*shrink;
                                return (
                                    <line
                                        key={l.key}
                                        x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                                        stroke={pal.main}
                                        strokeWidth={isObjLine?1.8:1.4}
                                        strokeLinecap='round'
                                        opacity={isObjLine?0.9:0.75}
                                        vectorEffect='non-scaling-stroke'
                                    />
                                );
                            }) : lines.map(l => {
                                const pal = palettes[l.objectiveOrdinal];
                                const acts = actionStatusMap[l.objectiveOrdinal];
                                const doneCount = acts.filter(s=>s==='DONE').length;
                                const doneRatio = acts.length ? doneCount/acts.length : 0;
                                const isObjLine = l.kind === 'subject-objective';
                                const actionDone = l.kind==='objective-action' && l.actionCellIdx!==undefined && gridCells[l.actionCellIdx].item && (gridCells[l.actionCellIdx].item as Item).status==='DONE';
                                
                                const rawDx = l.x2 - l.x1; const rawDy = l.y2 - l.y1; const len = Math.hypot(rawDx, rawDy) || 1;
                                const ux = rawDx / len; const uy = rawDy / len;
                                
                                let shrinkStart:number; let shrinkEnd:number;
                                if (isObjLine) {
                                    shrinkStart = Math.min(4, len*0.085); 
                                    shrinkEnd = 0; 
                                } else { 
                                    shrinkStart = 0; 
                                    shrinkEnd = Math.min(3.2, len*0.11); 
                                }
                                const x1 = l.x1 + ux * shrinkStart;
                                const y1 = l.y1 + uy * shrinkStart;
                                const x2 = l.x2 - ux * shrinkEnd;
                                const y2 = l.y2 - uy * shrinkEnd;
                                
                                const focused = !perf && hoverObjective !== null && l.objectiveOrdinal === hoverObjective;
                                const baseStrokeWidth = isObjLine ? 3.4 : 2.45;
                                const strokeWidth = focused ? baseStrokeWidth + 0.6 : baseStrokeWidth;
                                const baseColor = pal.main;
                                const progressColor = pal.dark;
                                const progress = isObjLine ? doneRatio : (actionDone ? 1 : 0);
                                const baseOpacity = (isObjLine ? 0.65 : 0.58);
                                const minClusterOpacity = 0.35; 
                                const displayOpacity = focused ? baseOpacity + 0.3*progress : (hoverObjective===null ? baseOpacity + 0.25*progress : minClusterOpacity);
                                const filterRef = perf ? undefined : 'url(#mandalart-glow)';
                                return (
                                    <g key={l.key} className='mandalart-line-group'>
                                        {/* base neutral line */}
                                        <line
                                            className='mandalart-line-base'
                                            x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                                            stroke={baseColor}
                                            strokeWidth={strokeWidth}
                                            strokeLinecap='round'
                                            opacity={displayOpacity}
                                            vectorEffect='non-scaling-stroke'
                                            filter={filterRef}
                                            pathLength={100}
                                        />
                                        {/* overlay progress segment */}
                                        {progress>0 && (
                                            <line
                                                className='mandalart-line-progress'
                                                x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                                                stroke={progressColor}
                                                strokeWidth={strokeWidth*0.9}
                                                strokeLinecap='round'
                                                opacity={focused ? 0.9 : 0.75}
                                                vectorEffect='non-scaling-stroke'
                                                pathLength={100}
                                                strokeDasharray={`${(progress*100).toFixed(2)} 100`}
                                                filter={filterRef}
                                            />
                                        )}
                                        {/* endpoint dots for clarity */}
                                        {!perf && (
                                            <>
                                                <circle cx={`${x1}%`} cy={`${y1}%`} r={strokeWidth*0.55} fill={progress>0?progressColor:baseColor} opacity={displayOpacity*0.9} />
                                                <circle cx={`${x2}%`} cy={`${y2}%`} r={strokeWidth*0.55} fill={progress>0?progressColor:baseColor} opacity={displayOpacity*0.9} />
                                            </>
                                        )}
                                    </g>
                                );
                            })}
                            <style>{`.mandalart-line-base,.mandalart-line-progress{transition:${perf?'none':'opacity .25s ease,stroke-dasharray .6s cubic-bezier(.4,0,.2,1),stroke-width .25s ease'};will-change:opacity}`}</style>
                        </svg>
                    </Box>
                    )}
                    {/* showConnections=false 인 경우 아무 것도 렌더하지 않음 (링 제거) */}

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5,1fr)',
                        gap: { xs: 1, sm: 2.4 },
                        aspectRatio: '1 / 1',
                        position: 'relative',
                        width: '100%',
                        maxWidth: { xs: 'min(700px, 100%)', sm: 'min(900px, 100%)' },
                        margin: '0 auto',
                        padding: { xs: 1.5, sm: 0 },
                        boxSizing: 'border-box',
                        justifyItems: 'center',
                    }}>
                        {gridCells.map((cell, idx) => {
                            const objIdx = cell.objIndex;
                            const handleEnter = () => {
                                if (perf) return;
                                if (cell.type === 'objective' && typeof objIdx === 'number') setHoverObjective(objIdx);
                                else if (cell.type === 'action' && typeof objIdx === 'number') setHoverObjective(objIdx);
                                else if (cell.type === 'subject') setHoverObjective(null);
                            };
                            const handleLeave = () => { if (!perf) setHoverObjective(null); };
                            const highlight = !perf && hoverObjective !== null && typeof objIdx === 'number' && objIdx === hoverObjective;
                            const progRatio = cell.type==='objective' && typeof objIdx==='number' ? objectiveProgress[objIdx] : (cell.type==='subject'? overallProgress : undefined);
                            return (
                <Box
                                    key={idx}
                                    onMouseEnter={handleEnter}
                                    onMouseLeave={handleLeave}
                                    onFocus={handleEnter}
                                    onBlur={handleLeave}
                                    sx={shape === 'circle' ? {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                    transition: perf ? 'none' : 'transform .6s var(--easing-emphasized)',
                    
                    transform: 'scale(0.9)',
                    ...(cell.isMainSubject && { transform: 'scale(1.05)' }),
                    ...(cell.isCenter && !cell.isMainSubject && { transform: 'scale(0.95)' }),
                    ...(highlight && { transform: 'scale(1.0)' }),
                                        ...(highlight && cell.palette ? {
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: '-4%',
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle at 50% 50%, ${cell.palette.main}55, transparent 70%)`,
                                                pointerEvents: 'none',
                                                zIndex: 0,
                                                filter: perf?undefined:'blur(8px)'
                                            }
                                        }:{}),
                                    } : undefined}
                                >
                                    {cell.item ? (
                                        <Cell
                                            id={(cell.item as Item).id}
                                            name={(cell.item as Item).name}
                                            status={(cell.item as Item).status}
                                            type={cell.type as 'subject' | 'objective' | 'action'}
                                            palette={cell.palette || { light: '', main: '', dark: '' }}
                                            updateItemName={updateItemName}
                                            updateItemStatus={updateItemStatus}
                                            onCreateSubMandalart={onCreateSubMandalart}
                                            isMainSubject={cell.isMainSubject}
                                            isCenter={cell.isCenter}
                                            loadingSubjectAI={loadingSubjectAI}
                                            loadingObjectiveAI={loadingObjectiveAI}
                                            loadingSubMandalartAI={loadingSubMandalartAI}
                                            objectiveIndex={cell.objIndex}
                                            readOnly={readOnly}
                                            visualMode={visualMode}
                                            centerContent={shape === 'circle'}
                                            shapeVariant={shape}
                                            perfMode={perf}
                                            progressRatio={progRatio}
                                        />
                                    ) : (
                                        <Paper sx={{ height: '100%', boxSizing: 'border-box', backgroundColor: shape === 'circle' ? 'transparent' : 'var(--field-bg)', opacity: shape === 'circle' ? 0.18 : 0.5, borderRadius: shape === 'circle' ? '50%' : 4, border: shape === 'circle' ? '1px dashed rgba(255,255,255,0.08)' : 'none' }} />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
const MandalartGrid = React.memo(MandalartGridComponent);
export default MandalartGrid;
