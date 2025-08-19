import { mandalartService } from '@/services/MandalartService';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MandalartGrid from '@/components/MandalartGrid';
import type { MandalartData } from '@/hooks/useMandalartDetail';
import { useMandalartDetail } from '@/hooks/useMandalartDetail';
import { useSnackbar } from '@/hooks/useSnackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';

// The detail API response doesn't include status, so we make it optional here.
type MandalartItem = { id: number; name: string; status?: string };

const MandalartDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const {mandalart, setMandalart, loading} = useMandalartDetail(id);
    const mandalartRef = useRef(mandalart); // mandalart의 최신 값을 저장할 ref

    useEffect(() => {
        mandalartRef.current = mandalart; // mandalart가 변경될 때마다 ref 업데이트
    }, [mandalart]);

    const aiGenerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loadingSubjectAI, setLoadingSubjectAI] = useState(false);
    const [loadingObjectiveAI, setLoadingObjectiveAI] = useState<number | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false); // New loading state for delete

    // 서브 만다르트 생성 관련 상태
    const [openSubMandalartDialog, setOpenSubMandalartDialog] = useState(false);
    const [subMandalartStep, setSubMandalartStep] = useState(0);
    const [subMandalartData, setSubMandalartData] = useState<{
        itemName: string;
        mandalartName: string;
        subject: string;
        objectives: string[];
        actions: string[][];
    } | null>(null);
    const [loadingSubMandalartAI, setLoadingSubMandalartAI] = useState(false);
    const [loadingSubMandalartSave, setLoadingSubMandalartSave] = useState(false);

    // Extracted AI update and save functions
    const handleSubjectAIUpdateAndSave = useCallback(async (subjectId: string, newSubjectName: string, currentMandalart: MandalartData) => {
        setLoadingSubjectAI(true);
        try {
            // Update subject name and status via API
            await mandalartService.updateSubject(subjectId, newSubjectName, 'IN_PROGRESS');

            // Generate AI content
            const aiResult = await mandalartService.generateGeminiSubject(newSubjectName);
            console.log('AI Result for subject:', aiResult);

            if (!aiResult || !aiResult.objectives || aiResult.objectives.length === 0 || !aiResult.actions || aiResult.actions.length === 0) {
                showSnackbar('AI 제안을 생성하지 못했습니다. AI 응답이 비어있거나 유효하지 않습니다.', 'warning');
                throw new Error('AI generation failed or data is missing');
            }

            // Optimistically update local state with AI results and reset statuses
            setMandalart((prev: MandalartData | null) => {
                if (!prev) return null;
                const newMandalart: MandalartData = JSON.parse(JSON.stringify(prev));

                // Update subject name and status
                newMandalart.subject.name = newSubjectName;
                newMandalart.subject.status = 'IN_PROGRESS';

                // Update objective names and reset statuses
                newMandalart.objectives = newMandalart.objectives.map((objective: MandalartItem, index: number) => ({
                    ...objective,
                    name: aiResult.objectives[index] || objective.name,
                    status: 'IN_PROGRESS',
                }));

                // Update action names and reset statuses
                newMandalart.actions = newMandalart.actions.map((actionList: MandalartItem[]) =>
                    actionList.map((action: MandalartItem) => ({
                        ...action,
                        status: 'IN_PROGRESS',
                    }))
                );
                newMandalart.actions.forEach((actionList: MandalartItem[], objIndex: number) => {
                    actionList.forEach((action: MandalartItem, actIndex: number) => {
                        action.name = aiResult.actions[objIndex]?.[actIndex] || action.name;
                    });
                });

                return newMandalart;
            });

            showSnackbar('주제와 연결된 모든 항목이 새로 제안되었습니다.', 'success');

            // Update objectives and actions via API
            const updatePromises: Promise<void>[] = [];
            currentMandalart.objectives.forEach((objective: MandalartItem, index: number) => {
                const newObjectiveName = aiResult.objectives[index];
                if (newObjectiveName) {
                    updatePromises.push(mandalartService.updateObjective(String(objective.id), newObjectiveName, 'IN_PROGRESS'));
                }
            });
            currentMandalart.actions.forEach((actionList: MandalartItem[], objIndex: number) => {
                actionList.forEach((action: MandalartItem, actIndex: number) => {
                    const newActionName = aiResult.actions[objIndex]?.[actIndex];
                    if (newActionName) {
                        updatePromises.push(mandalartService.updateAction(String(action.id), newActionName, 'IN_PROGRESS'));
                    }
                });
            });
            await Promise.all(updatePromises);
    } catch (_error) {
            console.error('AI update for subject failed:', _error);
            showSnackbar('AI 업데이트에 실패했습니다. 다시 시도해주세요.', 'error');
            setMandalart(currentMandalart);
        } finally {
            setLoadingSubjectAI(false);
        }
    }, [setMandalart, showSnackbar]);

    const handleObjectiveAIUpdateAndSave = useCallback(async (objectiveId: string, newObjectiveName: string, objectiveIndex: number, currentMandalart: MandalartData) => {
        setLoadingObjectiveAI(objectiveIndex);
        try {
            // Update objective name and status via API
            await mandalartService.updateObjective(objectiveId, newObjectiveName, 'IN_PROGRESS');

            // Generate AI actions
            const aiResult = await mandalartService.generateGeminiObjective(newObjectiveName);
            if (!aiResult || !aiResult.actions || aiResult.actions.length === 0) {
                showSnackbar('AI 제안을 생성하지 못했습니다. AI 응답이 비어있거나 유효하지 않습니다.', 'warning');
                throw new Error('AI generation failed or data is missing');
            }

            // Optimistically update local state with AI results and reset statuses
            setMandalart((prev: MandalartData | null) => {
                if (!prev) return null;
                const newMandalart: MandalartData = JSON.parse(JSON.stringify(prev));

                // Update objective name and status
                const targetObjective = newMandalart.objectives[objectiveIndex];
                if (targetObjective) {
                    targetObjective.name = newObjectiveName;
                    targetObjective.status = 'IN_PROGRESS';
                }

                // Update action names and reset statuses for the specific objective
                newMandalart.actions[objectiveIndex] = newMandalart.actions[objectiveIndex].map((action: MandalartItem, index: number) => ({
                    ...action,
                    name: aiResult.actions[index] || action.name,
                    status: 'IN_PROGRESS',
                }));

                return newMandalart;
            });

            showSnackbar('목표와 연결된 행동들이 새로 제안되었습니다.', 'success');

            // Update actions via API
            const updatePromises: Promise<void>[] = [];
            const targetActions = currentMandalart.actions[objectiveIndex];
            targetActions.forEach((action: MandalartItem, index: number) => {
                const newActionName = aiResult.actions[index];
                if (newActionName) {
                    updatePromises.push(mandalartService.updateAction(String(action.id), newActionName, 'IN_PROGRESS'));
                }
            });
            await Promise.all(updatePromises);
    } catch (_error) {
            console.error(`AI generation for objective ${objectiveIndex} failed:`, _error);
            showSnackbar('AI 업데이트에 실패했습니다. 다시 시도해주세요.', 'error');
            setMandalart(currentMandalart);
        } finally {
            setLoadingObjectiveAI(null);
        }
    }, [setMandalart, showSnackbar]);

    const updateMandalartItemStatus = useCallback(
        async (itemId: number, itemType: 'subject' | 'objective' | 'action') => {
            let originalMandalartState: MandalartData | null = null;

            setMandalart((prevMandalart: MandalartData | null) => {
                if (!prevMandalart) return null;

                originalMandalartState = JSON.parse(JSON.stringify(prevMandalart));

                const newMandalart: MandalartData = JSON.parse(JSON.stringify(prevMandalart)); // Deep copy for safe mutation

                let toggledActionObjectiveIndex: number | null = null;

                const findAndToggle = (item: MandalartItem) => {
                    if (item.id === itemId) {
                        return {...item, status: item.status === 'DONE' ? 'IN_PROGRESS' : 'DONE'};
                    }
                    return item;
                };

                if (itemType === 'subject') {
                    newMandalart.subject = findAndToggle(newMandalart.subject);
                } else if (itemType === 'objective') {
                    newMandalart.objectives = newMandalart.objectives.map(findAndToggle);
                } else if (itemType === 'action') {
                    newMandalart.actions = newMandalart.actions.map((objActions: MandalartItem[], objIndex: number) => {
                        const updatedActions = objActions.map(action => {
                            if (action.id === itemId) {
                                toggledActionObjectiveIndex = objIndex;
                                return {...action, status: action.status === 'DONE' ? 'IN_PROGRESS' : 'DONE'};
                            }
                            return action;
                        });
                        return updatedActions;
                    });

                    if (toggledActionObjectiveIndex !== null) {
                        const allActionsDone = newMandalart.actions[toggledActionObjectiveIndex].every(
                            (action: MandalartItem) => action.status === 'DONE'
                        );

                        if (allActionsDone) {
                            newMandalart.objectives[toggledActionObjectiveIndex].status = 'DONE';
                        } else {
                            // If not all actions are done, ensure the parent objective is not DONE
                            // This handles the case where a user un-does an action
                            newMandalart.objectives[toggledActionObjectiveIndex].status = 'IN_PROGRESS';
                        }
                    }
                }

                // After all updates, check if the subject should be marked as done
                const allObjectivesDone = newMandalart.objectives.every((o: MandalartItem) => o.status === 'DONE');
                if (allObjectivesDone) {
                    newMandalart.subject.status = 'DONE';
                } else {
                    newMandalart.subject.status = 'IN_PROGRESS';
                }

                return newMandalart;
            });

            try {
                // Determine original status using the last committed state
                const before = mandalartRef.current as MandalartData | null;
                let originalStatus: string | undefined;
                if (before) {
                    const flatActions: MandalartItem[] = before.actions.flat();
                    const allItems: MandalartItem[] = [before.subject, ...before.objectives, ...flatActions];
                    const originalItem = allItems.find((item) => item.id === itemId);
                    originalStatus = originalItem?.status;
                }

                const newStatus = originalStatus === 'DONE' ? 'IN_PROGRESS' : 'DONE';

                if (itemType === 'subject') {
                    await mandalartService.updateSubject(String(itemId), undefined, newStatus);
                } else if (itemType === 'objective') {
                    await mandalartService.updateObjective(String(itemId), undefined, newStatus);
                } else if (itemType === 'action') {
                    await mandalartService.updateAction(String(itemId), undefined, newStatus);
                }

                showSnackbar('상태가 업데이트되었습니다.', 'success');
        } catch (_error) {
                showSnackbar('상태 업데이트에 실패했습니다.', 'error');
                if (originalMandalartState) {
                    setMandalart(originalMandalartState);
                }
            }
        },
        [setMandalart, showSnackbar],
    );

    const handleCreateSubMandalart = useCallback(
        async (_itemId: number, _itemType: 'objective' | 'action', itemName: string) => {
            // 초기 데이터 설정하고 다이얼로그 열기
            setSubMandalartData({
                itemName,
                mandalartName: `${itemName} 세부 계획`,
                subject: itemName,
                objectives: ['', '', '', '', '', '', '', ''],
                actions: [
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']
                ]
            });
            setSubMandalartStep(0);
            setOpenSubMandalartDialog(true);
        },
        []
    );

    const handleSubMandalartGoToNextStep = useCallback(async () => {
        if (!subMandalartData) return;
        
        setLoadingSubMandalartAI(true);
        try {
            const aiResult = await mandalartService.generateGeminiSubject(subMandalartData.subject);
            
            if (aiResult && aiResult.objectives && aiResult.objectives.length > 0 && aiResult.actions && aiResult.actions.length > 0) {
                setSubMandalartData(prev => prev ? {
                    ...prev,
                    objectives: aiResult.objectives,
                    actions: aiResult.actions
                } : null);
                showSnackbar('AI 제안이 생성되었습니다.', 'success');
            } else {
                showSnackbar('AI 제안 생성에 실패했습니다. 직접 입력해주세요.', 'warning');
            }
            setSubMandalartStep(1);
        } catch (error) {
            console.error('AI 제안 생성 실패:', error);
            showSnackbar('AI 제안 생성에 실패했습니다. 직접 입력해주세요.', 'error');
            setSubMandalartStep(1);
        } finally {
            setLoadingSubMandalartAI(false);
        }
    }, [subMandalartData, showSnackbar]);

    const handleGenerateSubMandalartWithAI = useCallback(async () => {
        if (!subMandalartData) return;
        
        setLoadingSubMandalartAI(true);
        try {
            const aiResult = await mandalartService.generateGeminiSubject(subMandalartData.subject);
            
            if (!aiResult || !aiResult.objectives || aiResult.objectives.length === 0 || !aiResult.actions || aiResult.actions.length === 0) {
                showSnackbar('AI 제안을 생성하지 못했습니다.', 'warning');
                return;
            }

            setSubMandalartData(prev => prev ? {
                ...prev,
                objectives: aiResult.objectives,
                actions: aiResult.actions
            } : null);
            
            showSnackbar('AI 제안이 다시 생성되었습니다.', 'success');
        } catch (error) {
            console.error('AI 제안 생성 실패:', error);
            showSnackbar('AI 제안 생성에 실패했습니다.', 'error');
        } finally {
            setLoadingSubMandalartAI(false);
        }
    }, [subMandalartData, showSnackbar]);

    const handleSubMandalartItemNameChange = useCallback((itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => {
        if (!subMandalartData) return;
        
        if (itemType === 'subject') {
            setSubMandalartData(prev => prev ? {...prev, subject: newName} : null);
        } else if (itemType === 'objective') {
            setSubMandalartData(prev => prev ? {
                ...prev,
                objectives: prev.objectives.map((obj, index) => index === itemId ? newName : obj)
            } : null);
        } else if (itemType === 'action') {
            const objIndex = Math.floor(itemId / 100);
            const actIndex = itemId % 100;
            setSubMandalartData(prev => prev ? {
                ...prev,
                actions: prev.actions.map((actionList, oIndex) => 
                    oIndex === objIndex 
                        ? actionList.map((action, aIndex) => aIndex === actIndex ? newName : action)
                        : actionList
                )
            } : null);
        }
    }, [subMandalartData]);

    const handleSubMandalartItemStatusChange = useCallback(() => {
        // 서브 만다르트 생성 중에는 상태 변경 불가
    }, []);

    const handleSaveSubMandalart = useCallback(async () => {
        if (!subMandalartData) return;
        
        setLoadingSubMandalartSave(true);
        try {
            const newMandalart = await mandalartService.createMandalart({
                name: subMandalartData.mandalartName,
                subject: subMandalartData.subject,
                objectives: subMandalartData.objectives,
                actions: subMandalartData.actions
            });
            
            showSnackbar('서브 만다르트가 생성되었습니다.', 'success');
            setOpenSubMandalartDialog(false);
            setSubMandalartData(null);
            
            if (newMandalart?.mandalart?.id) {
                navigate(`/mandalart/${newMandalart.mandalart.id}`);
            }
        } catch (error) {
            console.error('서브 만다르트 생성 실패:', error);
            showSnackbar('서브 만다르트 생성에 실패했습니다.', 'error');
        } finally {
            setLoadingSubMandalartSave(false);
        }
    }, [subMandalartData, navigate, showSnackbar]);

    const updateMandalartItemName = useCallback(
        async (itemId: number, itemType: 'subject' | 'objective' | 'action', newName: string) => {
            if (!mandalart) return;
            if (aiGenerationTimeoutRef.current) {
                clearTimeout(aiGenerationTimeoutRef.current);
            }

            const originalMandalart = mandalart; // Capture current mandalart for potential rollback

            // Update local state with new name (immutable update)
            setMandalart((prev: MandalartData | null) => {
                if (!prev) return null;
                const newMandalart = {...prev};
                const findAndUpdate = (item: MandalartItem) => {
                    if (item.id === itemId) return {...item, name: newName};
                    return item;
                };
                if (itemType === 'subject') newMandalart.subject = findAndUpdate(newMandalart.subject);
                if (itemType === 'objective') newMandalart.objectives = newMandalart.objectives.map(findAndUpdate);
                if (itemType === 'action')
                    newMandalart.actions = newMandalart.actions.map((objActions: MandalartItem[]) =>
                        objActions.map(findAndUpdate),
                    );
                return newMandalart;
            });

            try {
                if (itemType === 'subject') {
                    await handleSubjectAIUpdateAndSave(String(itemId), newName, originalMandalart);
                } else if (itemType === 'objective') {
                    const objectiveIndex = mandalart.objectives.findIndex((o: MandalartItem) => o.id === itemId);
                    if (objectiveIndex === -1) throw new Error('Could not find objective in state');
                    await handleObjectiveAIUpdateAndSave(String(itemId), newName, objectiveIndex, originalMandalart);
                } else {
                    await mandalartService.updateAction(String(itemId), newName);
                    showSnackbar('이름이 업데이트되었습니다.', 'success');
                }
            } catch (_error) {
                console.error('Update failed:', _error);
                showSnackbar('업데이트에 실패했습니다. 다시 시도해주세요.', 'error');
                setMandalart(originalMandalart); // Rollback local state
            } finally {
                setLoadingSubjectAI(false);
                setLoadingObjectiveAI(null);
            }
        },
        [mandalart, setMandalart, showSnackbar, handleSubjectAIUpdateAndSave, handleObjectiveAIUpdateAndSave],
    );

    const handleDelete = async () => {
        setOpenDeleteDialog(false);
        if (!id) return;

        setLoadingDelete(true); // Set loading to true

        try {
            await mandalartService.deleteMandalart(id);
            showSnackbar('만다라트가 삭제되었습니다.', 'success');
            navigate('/mandalart'); // Navigate after successful deletion
        } catch (_error) {
            showSnackbar('만다라트 삭제에 실패했습니다.', 'error');
            // No navigation rollback needed here, as it's a delete operation
        } finally {
            setLoadingDelete(false); // Set loading to false
        }
    };

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(mandalart?.mandalart.name || '');

    useEffect(() => {
        if (mandalart) {
            setNewName(mandalart.mandalart.name);
        }
    }, [mandalart]);

    const handleNameChange = async () => {
        if (!id || !mandalart || newName === mandalart.mandalart.name) {
            setIsEditingName(false);
            return;
        }

        const originalName = mandalart.mandalart.name;

        setMandalart(prev => {
            if (!prev) return null;
            const newMandalartData = JSON.parse(JSON.stringify(prev));
            newMandalartData.mandalart.name = newName;
            return newMandalartData;
        });

        setIsEditingName(false);

        try {
            await mandalartService.updateMandalartName(id, newName);
            showSnackbar('이름이 성공적으로 변경되었습니다.', 'success');
    } catch (_error) {
            setMandalart(prev => {
                if (!prev) return null;
                const newMandalartData = JSON.parse(JSON.stringify(prev));
                newMandalartData.mandalart.name = originalName;
                return newMandalartData;
            });
            showSnackbar('이름 변경에 실패했습니다.', 'error');
        }
    };

    if (loading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>;
    }

    if (!mandalart) {
        return <Typography>Mandalart not found.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{p: 3, position: 'relative'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2}}>
                {isEditingName ? (
                    <TextField
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleNameChange();
                            } else if (e.key === 'Escape') {
                                setIsEditingName(false);
                                setNewName(mandalart.mandalart.name);
                            }
                        }}
                        autoFocus
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                typography: 'h4',
                                padding: 0,
                            }
                        }}
                    />
                ) : (
                    <Typography variant="h4" component="h1" onClick={() => setIsEditingName(true)} sx={{cursor: 'pointer'}}>
                        {mandalart.mandalart.name}
                    </Typography>
                )}
                <IconButton
                    aria-label="delete mandalart"
                    onClick={() => setOpenDeleteDialog(true)}
                    disabled={loadingDelete}
                    color="error"
                >
                    {loadingDelete ? <CircularProgress size={24} /> : <DeleteIcon />}
                </IconButton>
            </Box>
            <MandalartGrid
                data={mandalart}
                updateItemName={updateMandalartItemName}
                updateItemStatus={updateMandalartItemStatus}
                onCreateSubMandalart={handleCreateSubMandalart}
                loadingSubjectAI={loadingSubjectAI}
                loadingObjectiveAI={loadingObjectiveAI}
                loadingSubMandalartAI={loadingSubMandalartAI}
                autoFit={false}
            />

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>{"만다라트 삭제 확인"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말로 이 만다라트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} disabled={loadingDelete}>취소</Button>
                    <Button onClick={handleDelete} autoFocus color="error" disabled={loadingDelete}>삭제</Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={openSubMandalartDialog} 
                onClose={() => setOpenSubMandalartDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>서브 만다르트 생성</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%', pt: 1 }}>
                        <Stepper activeStep={subMandalartStep} alternativeLabel sx={{ mb: 4 }}>
                            <Step>
                                <StepLabel>기본 정보 입력</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>만다라트 수정 및 저장</StepLabel>
                            </Step>
                        </Stepper>

                        {subMandalartStep === 0 && (
                            <Box>
                                <TextField
                                    label="만다르트 이름"
                                    fullWidth
                                    value={subMandalartData?.mandalartName || ''}
                                    onChange={(e) => setSubMandalartData(prev => prev ? {...prev, mandalartName: e.target.value} : null)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="이루고 싶은 주제"
                                    fullWidth
                                    value={subMandalartData?.subject || ''}
                                    onChange={(e) => setSubMandalartData(prev => prev ? {...prev, subject: e.target.value} : null)}
                                />
                            </Box>
                        )}

                        {subMandalartStep === 1 && subMandalartData && (
                            <Box>
                                <MandalartGrid
                                    data={{
                                        mandalart: { id: 0, name: subMandalartData.mandalartName },
                                        subject: { id: 0, name: subMandalartData.subject },
                                        objectives: subMandalartData.objectives.map((name, index) => ({ id: index, name })),
                                        actions: subMandalartData.actions.map((actionList, objIndex) =>
                                            actionList.map((name, actionIndex) => ({ id: objIndex * 100 + actionIndex, name }))
                                        )
                                    }}
                                    updateItemName={handleSubMandalartItemNameChange}
                                    updateItemStatus={handleSubMandalartItemStatusChange}
                                    loadingSubjectAI={loadingSubMandalartAI}
                                    loadingObjectiveAI={null}
                                    autoFit={false}
                                    showZoomControls={false}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleGenerateSubMandalartWithAI}
                                        disabled={loadingSubMandalartAI}
                                    >
                                        {loadingSubMandalartAI ? <CircularProgress size={20} /> : 'AI 제안 다시 받기'}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {subMandalartStep === 0 ? (
                        <>
                            <Button onClick={() => setOpenSubMandalartDialog(false)}>
                                취소
                            </Button>
                            <Button 
                                variant="contained"
                                onClick={handleSubMandalartGoToNextStep}
                                disabled={loadingSubMandalartAI || !subMandalartData?.mandalartName || !subMandalartData?.subject}
                            >
                                {loadingSubMandalartAI ? <CircularProgress size={20} /> : '초안 만들기'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setSubMandalartStep(0)}>
                                이전
                            </Button>
                            <Button onClick={() => setOpenSubMandalartDialog(false)} disabled={loadingSubMandalartSave}>
                                취소
                            </Button>
                            <Button 
                                onClick={handleSaveSubMandalart} 
                                variant="contained" 
                                disabled={loadingSubMandalartSave || !subMandalartData?.mandalartName || !subMandalartData?.subject}
                            >
                                {loadingSubMandalartSave ? <CircularProgress size={20} /> : '생성하기'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default MandalartDetailPage;
