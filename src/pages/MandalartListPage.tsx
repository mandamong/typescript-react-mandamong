import { useMandalartList } from "@/hooks/useMandalartList";
import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Fab,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const MandalartListPage: React.FC = () => {
  const { mandalarts, loading, hasNext, loadMore, loadingMore } = useMandalartList();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const desktopPrefetchedRef = useRef(false);
 
  useEffect(() => {
    const onScroll = () => {
      if (!userScrolled && window.scrollY > 0) {
        setUserScrolled(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [userScrolled]);

  // 데스크탑(폭 >= 900px)에서 첫 페이지가 화면을 채우지 못하면 1회 자동 프리패치
  useEffect(() => {
    if (loading) return;
    if (userScrolled) return; // 이미 사용자가 스크롤 했으면 필요 없음
    if (desktopPrefetchedRef.current) return;
    if (!hasNext) return;
    const isDesktop = window.innerWidth >= 900; // MUI md(900px) 기준
    if (!isDesktop) return; // 모바일/태블릿에서는 자동 프리패치 없음
    const docHeight = document.documentElement.scrollHeight;
    const vpHeight = window.innerHeight;
    if (docHeight <= vpHeight + 16) {
      desktopPrefetchedRef.current = true;
      // loadMore 는 내부 가드(loadingMore 등) 있으므로 바로 호출
      void loadMore();
    }
  }, [loading, mandalarts.length, hasNext, userScrolled, loadMore]);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (!hasNext || loadingMore || loading) return;
      if (!userScrolled) return; // 사용자 스크롤 필요
      loadMore();
    },
    [hasNext, loadingMore, loadMore, loading, mandalarts.length, userScrolled]
  );

  useEffect(() => {
    if (!hasNext) return; // 더 이상 페이지 없으면 관찰 불필요
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      // 아래쪽 200px 전에 미리 로드 (상단/좌우 margin 0)
      rootMargin: "0px 0px 200px 0px",
      threshold: 0,
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [onIntersect, hasNext, mandalarts.length]);

  const getStatusInKorean = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행 중";
      case "DONE":
        return "완료";
      default:
        return status;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        만다르트
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : mandalarts.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 3,
          }}
        >
          {mandalarts.map((m, index) => {
            const id = m.id ?? undefined;
            const key = id != null ? `mandalart-${id}` : `mandalart-fallback-${index}`;
            return (
              <Box
                sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" } }}
                key={key}
              >
                <Card>
                  <CardActionArea
                    component={RouterLink}
                    to={id != null ? `/mandalart/${id}` : '#'}
                    disabled={id == null}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {m.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          상태:
                        </Typography>
                        <Chip
                          label={getStatusInKorean(m.status)}
                          color={m.status === "DONE" ? "success" : "primary"}
                          size="small"
                        />
                      </Box>
                      {m.subject && (
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          🎯 {m.subject}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography>생성된 만다르트가 없습니다.</Typography>
      )}
      {/* 무한스크롤 sentinel & 상태 표시 */}
      {mandalarts.length > 0 && (
        <>
          {loadingMore && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {hasNext ? (
            <Box ref={sentinelRef} sx={{ height: 16 }} />
          ) : (
            !loading && (
              <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                모든 만다르트를 불러왔습니다
              </Box>
            )
          )}
        </>
      )}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        component={RouterLink}
        to="/mandalart/new"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MandalartListPage;
