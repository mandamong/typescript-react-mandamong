import React from 'react';
import {Box, Paper} from '@mui/material';
import Cell from './Cell';
import type {ColorPalette, Item} from './types';

interface SubGridProps {
    objective: Item;
    actions: Item[];
    palette: ColorPalette;
    updateItemName: (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => void;
    updateItemStatus: (itemId: number, itemType: 'subject' | 'objective' | 'action') => void;
    isCentralGrid?: boolean;
}

const SubGrid: React.FC<SubGridProps> = ({
                                             objective,
                                             actions,
                                             palette,
                                             updateItemName,
                                             updateItemStatus,
                                             isCentralGrid
                                         }) => {
    const subGridCells = [];
    const subGridOrder = [0, 1, 2, 7, 8, 3, 6, 5, 4];

    for (let i = 0; i < 9; i++) {
        const cellIndex = subGridOrder[i];
        if (cellIndex === 8) {
            subGridCells.push(
                <Box key={`sub-center-${objective.id}`}>
                    <Cell
                        id={objective.id}
                        name={objective.name}
                        status={objective.status}
                        type="objective"
                        palette={palette}
                        updateItemName={updateItemName}
                        updateItemStatus={updateItemStatus}
                        isCenter={true}
                        isMainSubject={!!isCentralGrid}
                    />
                </Box>
            );
        } else {
            const action = actions[cellIndex];
            subGridCells.push(
                <Box key={`action-${cellIndex}-${action?.id || 'empty'}`}>
                    {action ? (
                        <Cell
                            id={action.id}
                            name={action.name}
                            status={action.status}
                            type="action"
                            palette={palette}
                            updateItemName={updateItemName}
                            updateItemStatus={updateItemStatus}
                        />
                    ) : (
                        <Paper sx={{
                            height: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 2
                        }}/>
                    )}
                </Box>
            );
        }
    }

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: {xs: '3px', sm: '6px'},
                padding: {xs: '3px', sm: '6px'},
                backgroundColor: 'background.paper',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
        >
            {subGridCells}
        </Box>
    );
};

export default SubGrid;
