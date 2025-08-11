import React from 'react';
import {Box, Paper} from '@mui/material';
import {blue, green, orange, pink, purple, red, teal, yellow} from '@mui/material/colors';
import Cell from './Cell';
import type {ColorPalette, Item} from './types';

export interface MandalartGridData {
    mandalart: { id: number; name: string; status?: string };
    subject: { id: number; name: string; status?: string };
    objectives: Array<{ id: number; name: string; status?: string }>;
    actions: Array<Array<{ id: number; name: string; status?: string }>>;
}

interface MandalartGridProps {
    data: MandalartGridData;
    updateItemName: (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => void;
    updateItemStatus: (itemId: number, itemType: 'subject' | 'objective' | 'action') => void;
    loadingSubjectAI?: boolean;
    loadingObjectiveAI?: number | null;
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
                                                         loadingSubjectAI,
                                                         loadingObjectiveAI
                                                     }) => {
    const {subject, objectives, actions} = data;

    const gridCells: {
        item: Item | null;
        type: 'subject' | 'objective' | 'action' | 'empty';
        palette?: ColorPalette;
        isMainSubject?: boolean;
        isCenter?: boolean;
        objIndex?: number
    }[] = Array(25).fill(null).map(() => ({item: null, type: 'empty'}));

    gridCells[12] = {item: subject, type: 'subject', palette: {light: '', main: '', dark: ''}, isMainSubject: true};

    const objectivePositions = [6, 8, 18, 16];
    const objectiveDataIndices = [0, 1, 2, 3];

    for (let i = 0; i < 4; i++) {
        const obj = objectives[objectiveDataIndices[i]];
        if (obj) {
            gridCells[objectivePositions[i]] = {
                item: obj,
                type: 'objective',
                palette: objectivePalettes[objectiveDataIndices[i]],
                isCenter: true
            };
        }
    }

    const A1_indices = [0, 1, 2, 5, 7];
    const A2_indices = [3, 4, 9, 13, 14];
    const A3_indices = [17, 19, 22, 23, 24];
    const A4_indices = [10, 11, 15, 20, 21];

    const fillActions = (indices: number[], objIndex: number) => {
        const objActions = actions[objIndex] || [];
        for (let i = 0; i < indices.length; i++) {
            if (objActions[i]) {
                gridCells[indices[i]] = {
                    item: objActions[i],
                    type: 'action',
                    palette: objectivePalettes[objIndex],
                    objIndex: objIndex
                };
            } else {
                gridCells[indices[i]] = {item: null, type: 'empty'};
            }
        }
    };

    fillActions(A1_indices, 0);
    fillActions(A2_indices, 1);
    fillActions(A3_indices, 2);
    fillActions(A4_indices, 3);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '900px',
                margin: 'auto',
                padding: {xs: 1, sm: 2},
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: {xs: 1, sm: 2},
                    aspectRatio: '1 / 1',
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
                                palette={cellData.palette || {light: '', main: '', dark: ''}}
                                updateItemName={updateItemName}
                                updateItemStatus={updateItemStatus}
                                isMainSubject={cellData.isMainSubject}
                                isCenter={cellData.isCenter}
                                loadingSubjectAI={loadingSubjectAI}
                                loadingObjectiveAI={loadingObjectiveAI}
                                objectiveIndex={cellData.objIndex}
                            />
                        ) : (
                            <Paper sx={{
                                height: '100%',
                                boxSizing: 'border-box',
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                borderRadius: 4
                            }}/>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MandalartGrid;
