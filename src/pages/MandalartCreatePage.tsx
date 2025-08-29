import GlassPanel from '@/components/design/GlassPanel';
import MandalartGrid from '@/components/MandalartGrid';
import { usePerformance } from '@/contexts/PerformanceContext';
import { useMandalartCreateForm } from '@/hooks/useMandalartCreateForm';
import { Box, Button, CircularProgress, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useCallback } from 'react';

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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { perf } = usePerformance();

    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', px: { xs: 2, sm: 3 }, pb: { xs:10, md:14 } }}>
            <Typography component="h1" variant="h2" align="center" sx={{ mb: { xs: 3.5, sm: 5 }, fontSize: { xs: 'clamp(1.9rem,5.8vw,2.6rem)', sm: '2.85rem' }, fontWeight: 800, letterSpacing:'-0.03em', background:'linear-gradient(120deg,var(--status-in-progress),var(--status-done))', WebkitBackgroundClip:'text', color:'transparent' }}>
                새 만다르트 만들기
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: { xs: 3, sm: 4 }, '& .MuiStepLabel-label': { typography: 'caption', display: { xs: 'none', sm: 'block' } }, '& .MuiStepConnector-line': { minHeight: { xs: 12, sm: 24 } } }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <GlassPanel glow gradientBorder sx={{ p: { xs: 3, sm: 4 }, borderRadius: { xs: 4, sm: 5 } }}>
                    <TextField
                        label="만다라트 이름"
                        fullWidth
                        value={name}
                        onChange={(e) => setMandalartName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="이루고 싶은 주제"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' }, mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleGoToNextStep}
                            disabled={!name || !subject || loadingSubjectAI}
                            fullWidth={isMobile}
                            sx={{ py: { xs: 1.05, sm: 0.8 } }}
                        >
                            {loadingSubjectAI ? <CircularProgress size={24}/> : '초안 만들기'}
                        </Button>
                    </Box>
                </GlassPanel>
            )}

            {activeStep === 1 && (
                <GlassPanel gradientBorder glow sx={{ p: { xs: 2.4, sm: 3.2 }, borderRadius: { xs: 4, sm: 5 } }}>
                    <Box sx={{ position:'relative' }}>
                        <MandalartGrid
                                            data={{
                                                mandalart: { id: 0, name: name, status: 'IN_PROGRESS' },
                                                subject: { id: 0, name: subject, status: 'IN_PROGRESS' },
                                                objectives: objectives.map((obj, i) => ({ id: i, name: obj, status: 'IN_PROGRESS' })),
                                                actions: actions.map((objActions, objIndex) =>
                                                    objActions.map((act, actIndex) => ({
                                                        id: objIndex * 100 + actIndex,
                                                        name: act,
                                                        status: 'IN_PROGRESS',
                                                    }))
                                                ),
                                            }}
                                            updateItemName={handleGridItemNameChange}
                                            updateItemStatus={() => {}}
                                            loadingSubjectAI={loadingSubjectAI}
                                            loadingObjectiveAI={loadingObjectiveAI}
                                            autoFit
                                            visualMode='preview' /* Intro / Detail 과 동일한 프리뷰 스타일 */
                                            shape='circle'
                                            readOnly={false}
                                            minScale={isMobile ? 0.58 : 0.7}
                                            reservedVertical={isMobile ? 320 : 200}
                                            showZoomControls={!isMobile}
                                            perfMode={perf}
                                        />
                        {(loadingSubjectAI || typeof loadingObjectiveAI === 'number') && (
                            <Box sx={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, backdropFilter:'blur(4px) saturate(1.2)', WebkitBackdropFilter:'blur(4px) saturate(1.2)', background: (t)=> t.palette.mode==='dark' ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.55)', borderRadius: { xs: 4, sm:5 } }}>
                                <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                                    <CircularProgress size={42} thickness={4} />
                                    <Typography variant='body2' sx={{ fontWeight:500, opacity:0.8 }}>AI 제안 생성 중...</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.2, mb: 2.4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => handleGenerateWithAI(subject)}
                            disabled={loadingSubjectAI || !subject}
                            sx={{ mr: 2 }}
                        >
                            {loadingSubjectAI ? <CircularProgress size={20} /> : '전체 AI 제안 다시 받기'}
                        </Button>
                    </Box>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mt: 3.2, gap: { xs: 1.5, sm: 0 } }}>
                        <Button onClick={() => setActiveStep(0)} disabled={loadingSave} fullWidth={isMobile}>
                            이전
                        </Button>
                                                <Button variant="contained" color="primary" onClick={handleSave} disabled={loadingSave} fullWidth={isMobile} sx={{ py: { xs: 1.05, sm: 0.95 } }}>
                            {loadingSave ? <CircularProgress size={24} color="inherit"/> : '만다라트 저장하기'}
                        </Button>
                    </Box>
                </GlassPanel>
            )}
        </Box>
    );
};

export default MandalartCreatePage;
