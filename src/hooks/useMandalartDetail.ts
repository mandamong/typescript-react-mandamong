import { useSnackbar } from '@/hooks/useSnackbar';
import { mandalartService } from '@/services/MandalartService';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Raw API response shape (single detail)
export interface MandalartDataRaw {
    mandalart: { id: number; name: string; status?: string };
    subject: { id: number; subject?: string; name?: string; status?: string };
    objectives: Array<{ id: number; objective?: string; name?: string; status?: string }>;
    actions: Array<Array<{ id: number; action?: string; name?: string; status?: string }>>;
}

// Helper: unify any item to display name
export const resolveItemName = (item: { name?: string; subject?: string; objective?: string; action?: string }) =>
    item.name ?? item.subject ?? item.objective ?? item.action ?? '';

export const useMandalartDetail = (id: string | undefined) => {
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const [mandalart, setMandalart] = useState<MandalartDataRaw | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMandalart = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        try {
            const payload = await mandalartService.getMandalartDetail(id);
            setMandalart(payload || null); // 그대로 저장 (매핑 제거)
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
