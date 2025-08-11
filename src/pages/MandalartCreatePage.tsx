import React, {useCallback} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import {useMandalartCreateForm} from '@/hooks/useMandalartCreateForm';
import MandalartGrid from '@/components/MandalartGrid';

const steps = ['기본 정보 입력', '만다라트 수정 및 저장'];

const MandalartCreatePage: React.FC = () => {
    const {
        activeStep,
        setActiveStep,
        name,
        setMandalartName,
        subject,
        setSubject,
        objectives,
        actions,
        loadingSubjectAI,
        loadingObjectiveAI,
        loadingSave,
        handleGenerateWithAI,
        handleSave,
        handleObjectiveChange,
        handleActionChange,
        handleGenerateObjectiveWithAI,
    } = useMandalartCreateForm();

    const handleGridItemNameChange = useCallback((itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => {
        if (itemType === 'subject') {
            const oldSubject = subject;
            setSubject(newName);
            if (newName !== oldSubject && newName.trim() !== '') {
                handleGenerateWithAI(newName);
            }
        } else if (itemType === 'objective') {
            const oldObjectiveName = objectives[itemId];
            handleObjectiveChange(itemId, newName);
            if (newName !== oldObjectiveName && newName.trim() !== '') {
                handleGenerateObjectiveWithAI(newName, itemId);
            }
        } else if (itemType === 'action') {
            const objIndex = Math.floor(itemId / 100);
            const actIndex = itemId % 100;
            handleActionChange(objIndex, actIndex, newName);
        }
    }, [subject, objectives, setSubject, handleObjectiveChange, handleActionChange, handleGenerateWithAI, handleGenerateObjectiveWithAI]);

    const handleGoToNextStep = async () => {
        await handleGenerateWithAI(subject);
        setActiveStep(1);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Typography component="h1" variant="h4" align="center" sx={{mb: 4}}>
                새 만다라트 만들기
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 4}}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <Paper elevation={3} sx={{p: 3}}>
                    <TextField
                        label="이름"
                        fullWidth
                        value={name}
                        onChange={(e) => setMandalartName(e.target.value)}
                        sx={{mb: 2}}
                    />
                    <TextField
                        label="주제"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}}>
                        <Button
                            variant="contained"
                            onClick={handleGoToNextStep}
                            disabled={!name || !subject || loadingSubjectAI}
                        >
                            {loadingSubjectAI ? <CircularProgress size={24}/> : '초안 만들기'}
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeStep === 1 && (
                <Paper elevation={3} sx={{p: 3}}>
                    <MandalartGrid
                        data={{
                            mandalart: {id: 0, name: name, status: 'IN_PROGRESS'},
                            subject: {id: 0, name: subject, status: 'IN_PROGRESS'},
                            objectives: objectives.map((obj, i) => ({id: i, name: obj, status: 'IN_PROGRESS'})),
                            actions: actions.map((objActions, objIndex) =>
                                objActions.map((act, actIndex) => ({
                                    id: objIndex * 100 + actIndex,
                                    name: act,
                                    status: 'IN_PROGRESS',
                                }))
                            ),
                        }}
                        updateItemName={handleGridItemNameChange}
                        updateItemStatus={() => {
                        }}
                        loadingSubjectAI={loadingSubjectAI}
                        loadingObjectiveAI={loadingObjectiveAI}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 3}}>
                        <Button onClick={() => setActiveStep(0)} disabled={loadingSave}>
                            이전
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSave} disabled={loadingSave}>
                            {loadingSave ? <CircularProgress size={24} color="inherit"/> : '만다라트 저장하기'}
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default MandalartCreatePage;
