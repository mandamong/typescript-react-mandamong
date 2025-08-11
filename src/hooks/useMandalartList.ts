import { useEffect, useState } from 'react';
import { mandalartService } from '@/services/MandalartService';
import { useSnackbar } from '@/hooks/useSnackbar';
import useAuthStore from '@/store/authStore'; // authStore import 추가

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
    const { showSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuthStore(); // isAuthenticated 상태 가져오기

    useEffect(() => {
        const fetchMandalarts = async () => {
            setLoading(true);
            try {
                const response = await mandalartService.getMandalarts();
                if (response && response.content) {
                    setMandalarts(response.content);
                }
            } catch (error) {
                console.error('Error fetching mandalarts:', error);
                showSnackbar('만다라트 목록을 불러오는 데 실패했습니다.', 'error');
            } finally {
                setLoading(false);
            }
        };

        // 인증 상태가 true일 때만 API 호출
        if (isAuthenticated) {
            fetchMandalarts();
        } else {
            // 인증되지 않은 경우 로딩 중단
            setLoading(false);
        }
    }, [isAuthenticated, showSnackbar]); // useEffect 의존성 배열에 isAuthenticated 추가

    return {
        mandalarts,
        loading,
    };
};
