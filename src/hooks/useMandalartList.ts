import { useSnackbar } from '@/hooks/useSnackbar';
import { mandalartService } from '@/services/MandalartService';
import useAuthStore from '@/store/authStore'; // authStore import 추가
import { useEffect, useState } from 'react';

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
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const { showSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuthStore(); // isAuthenticated 상태 가져오기

    useEffect(() => {
        const fetchMandalarts = async () => {
            setLoading(true);
            try {
                const response = await mandalartService.getMandalarts(String(0), String(20));
                if (response && response.content) {
                    setMandalarts(response.content);
                    setHasNext(!!response.hasNext);
                    setPage(0);
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
            setMandalarts([]);
            setHasNext(false);
            setPage(0);
        }
    }, [isAuthenticated, showSnackbar]); // useEffect 의존성 배열에 isAuthenticated 추가

    return {
        mandalarts,
        loading,
        loadingMore,
        hasNext,
        loadMore: async () => {
            if (loadingMore || !hasNext) return;
            setLoadingMore(true);
            try {
                const nextPage = page + 1;
                const response = await mandalartService.getMandalarts(String(nextPage), String(20));
                if (response && response.content) {
                    setMandalarts((prev) => [...prev, ...response.content]);
                    setHasNext(!!response.hasNext);
                    setPage(nextPage);
                }
            } catch (error) {
                console.error('Error loading more mandalarts:', error);
                showSnackbar('더 불러오는 데 실패했습니다.', 'error');
            } finally {
                setLoadingMore(false);
            }
        },
    };
};
