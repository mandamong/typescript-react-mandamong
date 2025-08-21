import { MANDALART_LIST_PAGE_SIZE } from '@/constants/pagination';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mandalartService } from '@/services/MandalartService';
import useAuthStore from '@/store/authStore';
import type { MandalartListItem } from '@/types/mandalart';
import { useEffect, useRef, useState } from 'react';

export const useMandalartList = () => {
    const [mandalarts, setMandalarts] = useState<MandalartListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const pageRef = useRef(1);
    const loadingMoreRef = useRef(false);
    const [hasNext, setHasNext] = useState(false);
    const { showSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchMandalarts = async () => {
            setLoading(true);
            try {
                const response = await mandalartService.getMandalarts(String(1), String(MANDALART_LIST_PAGE_SIZE));
                if (response && response.content) {
                    // 새 응답 형태: { name, subject, status, id? }
                    setMandalarts(response.content as unknown as MandalartListItem[]);
                    setHasNext(!!response.hasNext);
                    pageRef.current = 1;
                } else {
                    setMandalarts([]);
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
            pageRef.current = 1;
        }
    }, [isAuthenticated, showSnackbar]);

    return {
        mandalarts,
        loading,
        loadingMore,
        hasNext,
        loadMore: async () => {
            if (loadingMoreRef.current || loadingMore || !hasNext) return;
            loadingMoreRef.current = true;
            setLoadingMore(true);
            try {
                const nextPage = pageRef.current + 1;
                const response = await mandalartService.getMandalarts(String(nextPage), String(MANDALART_LIST_PAGE_SIZE));
                if (response && response.content) {
                    setMandalarts((prev) => {
                        const existingIds = new Set(prev.map(p => (p as any).id));
                        const incoming = (response.content as unknown as MandalartListItem[]).filter(i => {
                            const id = (i as any).id;
                            return id == null || !existingIds.has(id);
                        });
                        return [...prev, ...incoming];
                    });
                    setHasNext(!!response.hasNext);
                    pageRef.current = nextPage;
                }
            } catch (error) {
                console.error('Error loading more mandalarts:', error);
                showSnackbar('더 불러오는 데 실패했습니다.', 'error');
            } finally {
                setLoadingMore(false);
                loadingMoreRef.current = false;
            }
        },
    };
};
