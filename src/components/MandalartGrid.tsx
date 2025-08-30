import useReducedMotion from '@/hooks/useReducedMotion';
import { resolveMandalartItemName } from '@/utils/mandalartName';
import { Box } from '@mui/material';
import { green, orange, purple, red } from '@mui/material/colors';
import React from 'react';
import Cell from './Cell';
import type { ColorPalette, Item } from './types';

interface RawSubject {
  id: number;
  name?: string;
  subject?: string;
  status?: string;
}
interface RawObjective {
  id: number;
  name?: string;
  objective?: string;
  status?: string;
}
interface RawAction {
  id: number;
  name?: string;
  action?: string;
  status?: string;
}
export interface MandalartGridData {
  mandalart: { id: number; name: string; status?: string };
  subject: RawSubject;
  objectives: RawObjective[];
  actions: RawAction[][];
}
interface MandalartGridProps {
  data: MandalartGridData;
  updateItemName: (
    id: number,
    t: 'subject' | 'objective' | 'action',
    name: string,
  ) => void;
  updateItemStatus: (
    id: number,
    t: 'subject' | 'objective' | 'action',
  ) => void;
  onCreateSubMandalart?: (
    id: number,
    t: 'objective' | 'action',
    name: string,
  ) => void;
  loadingSubjectAI?: boolean;
  loadingObjectiveAI?: number | null;
  loadingSubMandalartAI?: boolean;
  readOnly?: boolean;
  centered?: boolean;
  visualMode?: 'default' | 'preview';
  shape?: 'square' | 'circle';
  perfMode?: boolean;
  showConnections?: boolean;
}

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
  { light: red[50], main: red[200], dark: red[700] },
  { light: orange[50], main: orange[200], dark: orange[700] },
  { light: green[50], main: green[200], dark: green[700] },
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
  centered = false,
  visualMode = centered ? 'preview' : 'default',
  shape = visualMode === 'preview' ? 'circle' : 'square',
  perfMode = false,
  showConnections = false,
}) => {
  const { subject, objectives, actions } = data;
  const reducedMotion = useReducedMotion();
  const lowMem =
    typeof navigator !== 'undefined' &&
    (navigator as any).deviceMemory &&
    (navigator as any).deviceMemory <= 4;
  const ultraPerf =
    typeof window !== 'undefined' && (lowMem || window.innerWidth < 820);
  const perf = perfMode || reducedMotion || lowMem || ultraPerf;

  const [hoverObjective, setHoverObjective] = React.useState<number | null>(
    null,
  );

  const gridCells: {
    item: Item | null;
    type: 'subject' | 'objective' | 'action' | 'empty';
    palette?: ColorPalette;
    isMainSubject?: boolean;
    isCenter?: boolean;
    objIndex?: number;
  }[] = React.useMemo(
    () => Array(25).fill(null).map(() => ({ item: null, type: 'empty' })),
    [data],
  );

  const subjectItem: Item | null = subject
    ? {
        id: subject.id,
        name: resolveMandalartItemName(subject),
        status: subject.status,
      }
    : null;
  gridCells[SUBJECT_INDEX] = {
    item: subjectItem,
    type: 'subject',
    palette: { light: '', main: '', dark: '' },
    isMainSubject: true,
  };

  for (let i = 0; i < MAX_OBJECTIVES; i++) {
    const raw = objectives[i];
    if (!raw) continue;
    gridCells[OBJECTIVE_POSITIONS[i]] = {
      item: {
        id: raw.id,
        name: resolveMandalartItemName(raw),
        status: raw.status,
      },
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
        item: {
          id: act.id,
          name: resolveMandalartItemName(act),
          status: act.status,
        },
        type: 'action',
        palette: palettes[objectiveIdx],
        objIndex: objectiveIdx,
      };
    });
  });

  const idxToRC = (i: number) => ({ r: Math.floor(i / 5), c: i % 5 });
  const rcToPct = (r: number, c: number) => ({
    x: ((c + 0.5) / 5) * 100,
    y: ((r + 0.5) / 5) * 100,
  });
  const centerPct = rcToPct(
    idxToRC(SUBJECT_INDEX).r,
    idxToRC(SUBJECT_INDEX).c,
  );
  interface Line {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    objectiveOrdinal: number;
    kind: 'subject-objective' | 'objective-action';
    actionCellIdx?: number;
  }
  const lines: Line[] = React.useMemo(() => {
    const acc: Line[] = [];
    OBJECTIVE_POSITIONS.forEach((pos, ord) => {
      const rc = idxToRC(pos);
      const objPct = rcToPct(rc.r, rc.c);
      acc.push({
        key: `l-sub-${pos}`,
        x1: centerPct.x,
        y1: centerPct.y,
        x2: objPct.x,
        y2: objPct.y,
        objectiveOrdinal: ord,
        kind: 'subject-objective',
      });
      ACTION_GROUPS[ord].forEach(ai => {
        const arc = idxToRC(ai);
        const aPct = rcToPct(arc.r, arc.c);
        acc.push({
          key: `l-obj-${pos}-act-${ai}`,
          x1: objPct.x,
          y1: objPct.y,
          x2: aPct.x,
          y2: aPct.y,
          objectiveOrdinal: ord,
          kind: 'objective-action',
          actionCellIdx: ai,
        });
      });
    });
    return acc;
  }, []);

  const actionStatusMap = React.useMemo(() => {
    const map: Record<number, string[]> = {};
    ACTION_GROUPS.forEach((grp, i) => {
      map[i] = grp.map(idx => {
        const c = gridCells[idx];
        return c.item ? (c.item as Item).status || '' : '';
      });
    });
    return map;
  }, [gridCells]);

  const objectiveProgress: Record<number, number> = React.useMemo(() => {
    const res: Record<number, number> = {};
    Object.keys(actionStatusMap).forEach(k => {
      const idx = Number(k);
      const arr = actionStatusMap[idx];
      const done = arr.filter(s => s === 'DONE').length;
      res[idx] = arr.length ? done / arr.length : 0;
    });
    return res;
  }, [actionStatusMap]);
  const overallProgress = React.useMemo(() => {
    const vals = Object.values(objectiveProgress);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }, [objectiveProgress]);

  const containerSx: any = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: { xs: 1, sm: 2 },
    boxSizing: 'border-box',
    overflow: 'hidden', 
  };

  return (
    <Box sx={containerSx}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: { xs: 1, sm: 1.5 },
            aspectRatio: '1 / 1',
            width: '100%',
            height: 'auto',
            maxWidth: 'min(95vw, 95vh)', 
            maxHeight: 'min(95vw, 95vh)', 
            margin: 'auto',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {showConnections && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <svg
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                {/* SVG content remains the same */}
              </svg>
            </Box>
          )}
          {gridCells.map((cell, idx) => {
            const objIdx = cell.objIndex;
            const handleEnter = () => {
              if (perf) return;
              if (cell.type === 'objective' && typeof objIdx === 'number')
                setHoverObjective(objIdx);
              else if (cell.type === 'action' && typeof objIdx === 'number')
                setHoverObjective(objIdx);
              else if (cell.type === 'subject') setHoverObjective(null);
            };
            const handleLeave = () => {
              if (!perf) setHoverObjective(null);
            };
            const highlight =
              !perf &&
              hoverObjective !== null &&
              typeof objIdx === 'number' &&
              objIdx === hoverObjective;
            const progRatio =
              cell.type === 'objective' && typeof objIdx === 'number'
                ? objectiveProgress[objIdx]
                : cell.type === 'subject'
                ? overallProgress
                : undefined;
            return (
              <Box
                key={idx}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
                sx={
                  shape === 'circle'
                    ? {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: perf
                          ? 'none'
                          : 'transform .6s var(--easing-emphasized)',
                        transform: 'scale(0.9)',
                        ...(highlight && { transform: 'scale(1.0)' }),
                        ...(highlight && cell.palette
                          ? {
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: '-4%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle at 50% 50%, ${cell.palette.main}55, transparent 70%)`,
                                pointerEvents: 'none',
                                zIndex: 0,
                                filter: perf ? undefined : 'blur(8px)',
                              },
                            }
                          : {}),
                      }
                    : undefined
                }
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
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor:
                        shape === 'circle' ? 'transparent' : 'transparent',
                      opacity: shape === 'circle' ? 0.18 : 0.5,
                      borderRadius: shape === 'circle' ? '50%' : 4,
                      border:
                        shape === 'circle'
                          ? '1px dashed rgba(255,255,255,0.08)'
                          : 'none',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
const MandalartGrid = React.memo(MandalartGridComponent);
export default MandalartGrid;