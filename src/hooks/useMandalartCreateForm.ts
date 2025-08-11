import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {mandalartService} from '@/services/MandalartService';
import {useSnackbar} from '@/hooks/useSnackbar';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export const useMandalartCreateForm = () => {
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [mandalartName, setMandalartName] = useState('');
    const [subject, setSubject] = useState('');
    const [objectives, setObjectives] = useState<string[]>(Array(4).fill(''));
    const [actions, setActions] = useState<string[][]>(Array(4).fill(Array(5).fill('')));

    const [loadingSubjectAI, setLoadingSubjectAI] = useState(false);
    const [loadingObjectiveAI, setLoadingObjectiveAI] = useState<number | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);

    const handleGenerateWithAI = useCallback(async (currentSubject: string) => {
        if (!currentSubject) {
            showSnackbar('먼저 주제를 입력해주세요.', 'warning');
            return;
        }
        setLoadingSubjectAI(true);
        try {
            const payload = await mandalartService.generateGeminiSubject(currentSubject);
            if (payload) {
                const {objectives: aiObjectives, actions: aiActions} = payload;
                setObjectives(aiObjectives.slice(0, 4));
                setActions(aiActions.map((objActions: string[]) => objActions.slice(0, 5)));
                showSnackbar('AI 제안이 생성되었습니다.', 'success');
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            showSnackbar('AI 제안 생성에 실패했습니다.', 'error');
        } finally {
            setLoadingSubjectAI(false);
        }
    }, [showSnackbar]);

    const handleSave = useCallback(async () => {
        if (!mandalartName || !subject) {
            showSnackbar('만다라트 이름과 주제를 모두 입력해야 합니다.', 'warning');
            return;
        }

        setLoadingSave(true);

        // Filter out empty objectives and their corresponding actions
        const filteredObjectives: string[] = [];
        const filteredActions: string[][] = [];
        objectives.forEach((objective, index) => {
            if (objective.trim() !== '') {
                filteredObjectives.push(objective);
                // Also push the corresponding actions, even if they are empty, to maintain index integrity
                filteredActions.push(actions[index] || []);
            }
        });

        if (filteredObjectives.length === 0) {
            showSnackbar('하나 이상의 목표를 입력해야 합니다.', 'warning');
            setLoadingSave(false);
            return;
        }

        try {
            console.log({
                name: mandalartName,
                subject,
                objectives: filteredObjectives,
                actions: filteredActions,
            })
            await mandalartService.createMandalart({
                name: mandalartName,
                subject,
                objectives: filteredObjectives,
                actions: filteredActions,
            });
            navigate('/mandalart');
            showSnackbar('만다라트가 성공적으로 저장되었습니다.', 'success');
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error('Save failed:', axiosError);
            const errorMessage = (axiosError.response?.data as { error?: ApiError })?.error?.message || '만다라트 저장에 실패했습니다.';
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoadingSave(false);
        }
    }, [mandalartName, subject, objectives, actions, showSnackbar, navigate]);

    const handleObjectiveChange = useCallback((index: number, value: string) => {
        setObjectives(prevObjectives => {
            const newObjectives = [...prevObjectives];
            newObjectives[index] = value;
            return newObjectives;
        });
    }, []);

    const handleActionChange = useCallback((objIndex: number, actIndex: number, value: string) => {
        setActions(prevActions => {
            const newActions = prevActions.map(arr => arr.slice());
            newActions[objIndex][actIndex] = value;
            return newActions;
        });
    }, []);

    const handleGenerateObjectiveWithAI = useCallback(async (objectiveName: string, objectiveIndex: number) => {
        if (!objectiveName) {
            showSnackbar('목표를 입력해주세요.', 'warning');
            return;
        }
        setLoadingObjectiveAI(objectiveIndex);
        try {
            const payload = await mandalartService.generateGeminiObjective(objectiveName);
            if (payload && payload.actions) {
                setActions(prevActions => {
                    const newActions = prevActions.map(arr => arr.slice());
                    newActions[objectiveIndex] = payload.actions.slice(0, 5);
                    return newActions;
                });
                showSnackbar('행동이 생성되었습니다.', 'success');
            }
        } catch (error) {
            console.error(`AI generation for objective ${objectiveIndex} failed:`, error);
            showSnackbar('행동 생성에 실패했습니다.', 'error');
        } finally {
            setLoadingObjectiveAI(null);
        }
    }, [setActions, showSnackbar, setLoadingObjectiveAI]);

    return {
        activeStep,
        setActiveStep,
        name: mandalartName,
        setMandalartName,
        subject,
        setSubject,
        objectives,
        setObjectives,
        actions,
        setActions,
        loadingSubjectAI,
        loadingObjectiveAI,
        loadingSave,
        handleGenerateWithAI,
        handleSave,
        handleObjectiveChange,
        handleActionChange,
        handleGenerateObjectiveWithAI,
    };
};
