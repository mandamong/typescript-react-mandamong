import {useCallback, useEffect, useState} from 'react';
import {mandalartService} from '@/services/MandalartService';
import {useSnackbar} from '@/hooks/useSnackbar';
import {useNavigate} from 'react-router-dom';

export interface MandalartData {
    mandalart: {
        id: number;
        name: string;
        status?: string;
    };
    subject: {
        id: number;
        name: string;
        status?: string;
    };
    objectives: Array<{
        id: number;
        name: string;
        status?: string;
    }>;
    actions: Array<Array<{
        id: number;
        name: string;
        status?: string;
    }>>;
}

export const useMandalartDetail = (id: string | undefined) => {
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const [mandalart, setMandalart] = useState<MandalartData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMandalart = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        try {
            const payload = await mandalartService.getMandalartDetail(id);
            setMandalart(payload || null);
        } catch (error) {
            console.error('Error fetching mandalart:', error);
            showSnackbar('만다라트 정보를 불러오는 데 실패했습니다.', 'error');
            navigate('/mandalart');
        } finally {
            setLoading(false);
        }
    }, [id, navigate, showSnackbar]);

    useEffect(() => {
        fetchMandalart();
    }, [fetchMandalart]);

    return {
        mandalart,
        setMandalart,
        loading,
        fetchMandalart,
    };
};
