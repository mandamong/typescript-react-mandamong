import {useEffect, useState} from 'react';
import {mandalartService} from '@/services/MandalartService';
import {useSnackbar} from '@/hooks/useSnackbar';

export interface MandalartContent {
    mandalart: {
        id: number;
        name: string;
        status: string;
    };
    subject: {
        id: number;
        name: string;
        status: string;
    };
    objectives: Array<{
        id: number;
        name: string;
        status: string;
    }>;
    actions: Array<Array<{
        id: number;
        name: string;
        status: string;
    }>>;
}

export const useMandalartList = () => {
    const [mandalarts, setMandalarts] = useState<MandalartContent[]>([]);
    const [loading, setLoading] = useState(true);
    const {showSnackbar} = useSnackbar();

    useEffect(() => {
        const fetchMandalarts = async () => {
            setLoading(true);
            try {
                const response = await mandalartService.getMandalarts();
                if (response) {
                    setMandalarts(response.content);
                }
            } catch (error) {
                console.error('Error fetching mandalarts:', error);
                showSnackbar('만다라트 목록을 불러오는 데 실패했습니다.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMandalarts();
    }, [showSnackbar]);

    return {
        mandalarts,
        loading,
    };
};
