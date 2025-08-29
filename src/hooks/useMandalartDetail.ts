import { useSnackbar } from '@/hooks/useSnackbar';
import { mandalartService } from '@/services/MandalartService';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export interface MandalartDataRaw {
    mandalart: { id: number; name: string; status?: string };
    subject: { id: number; subject?: string; name?: string; status?: string };
    objectives: Array<{ id: number; objective?: string; name?: string; status?: string }>;
    actions: Array<Array<{ id: number; action?: string; name?: string; status?: string }>>;
}
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
            
            if (payload) {
                const normalized = {
                    mandalart: { id: (payload as any).mandalart.id, name: (payload as any).mandalart.name || (payload as any).mandalart.mandalartName, status: (payload as any).mandalart.status },
                    subject: { ...payload.subject, name: (payload.subject as any).name || (payload.subject as any).subject },
                    objectives: payload.objectives?.map(o => ({ ...o, name: (o as any).name || (o as any).objective })) || [],
                    actions: payload.actions?.map(arr => arr.map(a => ({ ...a, name: (a as any).name || (a as any).action }))) || []
                } as MandalartDataRaw;
                setMandalart(normalized);
            } else {
                setMandalart(null);
            }
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
