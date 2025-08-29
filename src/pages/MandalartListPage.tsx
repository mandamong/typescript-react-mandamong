import SectionHeader from '@/components/design/SectionHeader';
import EmptyState from '@/components/feedback/EmptyState';
import MandalartCardSkeleton from '@/components/feedback/MandalartCardSkeleton';
import { useMandalartList } from "@/hooks/useMandalartList";
import { mandalartService } from "@/services/MandalartService";
import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Fab,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const MandalartListPage: React.FC = () => {
  const { mandalarts, loading, hasNext, loadMore, loadingMore } = useMandalartList();
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const desktopPrefetchedRef = useRef(false);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const loadingProgressRef = useRef<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [sortKey, setSortKey] = useState<'RECENT' | 'PROGRESS_DESC' | 'NAME_ASC'>('RECENT');
  
  const density = 'comfortable' as const;
 
  useEffect(() => {
    const onScroll = () => {
      if (!userScrolled && window.scrollY > 0) {
        setUserScrolled(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [userScrolled]);
  useEffect(() => {
    if (loading) return;
    if (userScrolled) return; 
    if (desktopPrefetchedRef.current) return;
    if (!hasNext) return;
    const isDesktop = window.innerWidth >= 900; 
    if (!isDesktop) return; 
    const docHeight = document.documentElement.scrollHeight;
    const vpHeight = window.innerHeight;
    if (docHeight <= vpHeight + 16) {
      desktopPrefetchedRef.current = true;
      void loadMore();
    }
  }, [loading, mandalarts.length, hasNext, userScrolled, loadMore]);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (!hasNext || loadingMore || loading) return;
      if (!userScrolled) return; 
      loadMore();
    },
    [hasNext, loadingMore, loadMore, loading, mandalarts.length, userScrolled]
  );

  useEffect(() => {
    if (!hasNext) return; 
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px 0px 200px 0px",
      threshold: 0,
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [onIntersect, hasNext, mandalarts.length]);

  const getStatusInKorean = (status: string) => {
    if (status === 'DONE') return '완료';
    if (status === 'IN_PROGRESS') return '진행 중';
    return status;
  };
  const computeProgressFromDetail = useCallback((detail: any) => {
    try {
      const objectives = detail.objectives || [];
      const actionsMatrix = detail.actions || [];
      const totalObjectives = objectives.length || 1;
      const objectivesDone = objectives.filter((o: any) => o.status === 'DONE').length;
      const allActions = actionsMatrix.flat();
      const totalActions = allActions.length || 1;
      const actionsDone = allActions.filter((a: any) => a.status === 'DONE').length;
      const objectivesPct = objectivesDone / totalObjectives;
      const actionsPct = actionsDone / totalActions;
      const progress = Math.round((objectivesPct * 0.4 + actionsPct * 0.6) * 100);
      return progress;
    } catch {
      return 0;
    }
  }, []);

  const fetchProgress = useCallback(async (id?: number) => {
    if (id == null) return;
    if (progressMap[id] != null) return; 
    if (loadingProgressRef.current.has(id)) return; 
    loadingProgressRef.current.add(id);
    try {
      const detail = await mandalartService.getMandalartDetail(String(id));
      if (detail) {
        const pct = computeProgressFromDetail(detail);
        setProgressMap(prev => ({ ...prev, [id]: pct }));
      }
    } finally {
      loadingProgressRef.current.delete(id);
    }
  }, [progressMap, computeProgressFromDetail]);
  const observersRef = useRef<Record<number, IntersectionObserver>>({});
  const cardRefs = useRef<Record<number, HTMLElement | null>>({});
  const setCardRef = useCallback((id: number | undefined) => (el: HTMLElement | null) => {
    if (id == null) return;
    cardRefs.current[id] = el;
    if (el) {
      const existing = observersRef.current[id];
      if (existing) existing.disconnect();
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchProgress(id);
          observer.disconnect();
          delete observersRef.current[id];
        }
      }, { root: null, rootMargin: '200px 0px', threshold: 0 });
      observer.observe(el);
      observersRef.current[id] = observer;
    }
  }, [fetchProgress]);
  const filteredSorted = useMemo(() => {
    const base = mandalarts.filter(m => {
      if (statusFilter === 'ALL') return true;
      return m.status === statusFilter;
    });
    const cloned = [...base];
    if (sortKey === 'NAME_ASC') cloned.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    else if (sortKey === 'PROGRESS_DESC') cloned.sort((a, b) => {
      const pa = progressMap[a.id ?? -1];
      const pb = progressMap[b.id ?? -1];
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1; 
      if (pb == null) return -1;
      return pb - pa;
    });
    return cloned;
  }, [mandalarts, statusFilter, sortKey, progressMap]);
  const gridTemplate = useMemo(() => ({
    xs: 'span 12',
    sm: 'span 6',
    md: 'span 4',
    lg: 'span 3',
    xl: 'span 2'
  }), []);

  const deriveProgress = (mId?: number, status?: string) => {
    if (mId != null && progressMap[mId] != null) return progressMap[mId];
    if (status === 'DONE') return 100;
    return undefined; 
  };

  const theme = useTheme();
  const PROGRESS_MIN_HEIGHT = 4; 
  const TITLE_BLOCK_HEIGHT_COMFORT = 44; 
  const SUBJECT_BLOCK_HEIGHT_COMFORT = 36; 
  const STATUS_BLOCK_HEIGHT_COMFORT = 36; 
  const CARD_MIN_HEIGHT_COMFORT = 156; 
  const commonChipSx = {
    fontSize: { xs: 10, sm: 10.5 }, 
    height: { xs: 20, sm: 22 }, 
    lineHeight: 1,
    fontWeight: 600,
    px: 1.2, 
    borderRadius: 999,
    letterSpacing: '-.2px'
  } as const;

  return (
    <Box>
      <Box sx={{ display:'flex', flexDirection:'column', gap:2, mb:2 }}>
        <SectionHeader heading="만다르트" align="left" compact sx={{ mb:0, '& h2': { fontSize:{ xs:'1.55rem', sm:'1.9rem' }, background:'var(--gradient-primary)', WebkitBackgroundClip:'text', color:'transparent' } }} />
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:1.5, alignItems:'center' }}>
          <ToggleButtonGroup 
            size="small" 
            value={statusFilter} 
            exclusive 
            onChange={(_,v)=> v && setStatusFilter(v)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                background: 'transparent',
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: (t) => alpha(t.palette.primary.main, 0.08),
                  borderColor: (t) => alpha(t.palette.primary.main, 0.3),
                  color: 'primary.main'
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff',
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.4)'
                  }
                }
              }
            }}
          >
            <ToggleButton value="ALL">전체</ToggleButton>
            <ToggleButton value="IN_PROGRESS">진행 중</ToggleButton>
            <ToggleButton value="DONE">완료</ToggleButton>
          </ToggleButtonGroup>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: (t) => t.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(59,130,246,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: (t) => alpha(t.palette.primary.main, 0.3),
                  background: (t) => t.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(59,130,246,0.08)'
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 3px rgba(59,130,246,0.1)'
                }
              }
            }}
          >
            <InputLabel id="sort-label">정렬</InputLabel>
            <Select labelId="sort-label" label="정렬" value={sortKey} onChange={e=> setSortKey(e.target.value as any)}>
              <MenuItem value="RECENT">최근 생성순</MenuItem>
              <MenuItem value="PROGRESS_DESC">진행률 높은 순</MenuItem>
              <MenuItem value="NAME_ASC">이름 A-Z</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ 
          display:'grid', 
          gridTemplateColumns:'repeat(12,1fr)', 
          gap:{ xs:1.5, sm:2 },
          opacity: 0.8,
          animation: 'fadeIn 0.6s ease-out'
        }}>
          {Array.from({ length: 6 }).map((_,i)=>(
            <Box key={i} sx={{ gridColumn: gridTemplate }}>
              <MandalartCardSkeleton density={density} />
            </Box>
          ))}
        </Box>
      ) : filteredSorted.length > 0 ? (
        <Box sx={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:{ xs:1.5, sm:2 }, textAlign:'left' }}>
          {filteredSorted.map((m, index) => {
            const id = m.id ?? undefined;
            const key = id != null ? `mandalart-${id}` : `mandalart-fallback-${index}`;
            const pct = deriveProgress(id, m.status);
            const progressLoaded = pct != null;
            return (
              <Box key={key} sx={{ gridColumn: gridTemplate }} ref={id != null ? setCardRef(id) : undefined}>
                <Card
                  className="mandalart-card"
                  sx={{
                    position:'relative',
                    overflow:'hidden',
                    transition:'all .4s cubic-bezier(.4,0,.2,1)',
                    border:'1px solid',
                    borderColor:'divider',
                    borderRadius:{ xs: 6, sm: 8 },
                    background:(t)=> t.palette.mode === 'dark'
                      ? 'linear-gradient(155deg, rgba(41,54,71,0.95), rgba(30,41,59,0.98))'
                      : 'linear-gradient(155deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
                    textAlign:'left',
                    backdropFilter:'blur(12px) saturate(1.2)',
                    minHeight: CARD_MIN_HEIGHT_COMFORT,
                    
                    '&::before':{
                      content:'""',
                      position:'absolute',
                      inset:0,
                      background:(t)=>`radial-gradient( circle at 120% -10%, ${alpha(t.palette.primary.main,0.15)}, transparent 70%)`,
                      pointerEvents:'none',
                      transition:'opacity .4s ease'
                    },
                    
                    '&::after':{
                      content:'""',
                      position:'absolute',
                      top:0,
                      left:0,
                      right:0,
                      height:'50%',
                      background:(t)=>`linear-gradient(180deg, ${alpha(t.palette.primary.main,0.03)} 0%, transparent 100%)`,
                      pointerEvents:'none',
                      transition:'opacity .4s ease'
                    },
                    
                    '&:hover':{ 
                      transform:'translateY(-8px) scale(1.02)', 
                      boxShadow: theme.palette.mode==='dark' 
                        ? '0 20px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.3)' 
                        : '0 20px 40px -12px rgba(30,64,175,0.3), 0 0 0 1px rgba(59,130,246,0.2)', 
                      borderColor:'primary.main',
                      '&::before': {
                        opacity: 0.8
                      },
                      '&::after': {
                        opacity: 0.6
                      }
                    },
                    
                    '&:focus-within':{ 
                      boxShadow:'0 0 0 3px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)' 
                    },
                    p:0,
                  }}
                >
                  <CardActionArea component={RouterLink} to={id != null ? `/mandalart/${id}` : '#'} disabled={id == null} sx={{ height:'100%', alignItems:'stretch', display:'flex', p: 2, '&:focus-visible':{ outline:'none' } }}>
                    <CardContent sx={{
                                            py:{ xs:1, sm:1.2 },
                      px:{ xs:1.2, sm:1.8 },
                      textAlign:'left',
                      display:{ xs:'flex', sm:'grid' },
                      flexDirection:{ xs:'column' },
                      gridTemplateRows:{ sm: `${TITLE_BLOCK_HEIGHT_COMFORT}px ${STATUS_BLOCK_HEIGHT_COMFORT}px ${SUBJECT_BLOCK_HEIGHT_COMFORT}px` },
                      rowGap:{ sm: 8 },
                      height:'100%'
                    }}>
                      {/* 제목 블록 (2줄 고정 높이) */}
                      <Box sx={{
                        height:{ sm: TITLE_BLOCK_HEIGHT_COMFORT },
                        minHeight:{ xs: TITLE_BLOCK_HEIGHT_COMFORT-2 },
                        position:'relative',
                        mb:{ p: 2, }
                      }}>
                        {/* 내부 텍스트를 항상 상단 정렬, 두 줄 확보 */}
                        <Tooltip title={m.name} placement="top" arrow disableHoverListener={m.name.length < 18}>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{
                              fontSize:{ xs:'0.9rem', sm:'1rem' },
                              fontWeight:600,
                              lineHeight:1.3,
                              m:0,
                              display:'-webkit-box',
                              WebkitLineClamp:2,
                              WebkitBoxOrient:'vertical',
                              overflow:'hidden',
                              wordBreak:'break-word',
                              width:'100%',
                              position:{ sm:'absolute', xs:'static' },
                              top:0,
                              left:0,
                              right:0,
                              height:{ sm: TITLE_BLOCK_HEIGHT_COMFORT },
                              pt:{ sm:0.5, xs:0 },
                              color: 'text.primary',
                              textShadow: (t) => t.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                            }}
                          >
                            {m.name}
                          </Typography>
                        </Tooltip>
                      </Box>
                      {/* 상태 + 진행률 블록 */}
                      <Box sx={{ display:'flex', flexDirection:'column', width:'100%', alignItems:'stretch', mb:{ xs:0.4, sm:0 } }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:0.55, minHeight:{ xs:22, sm:24 } }}>
                          <Chip
                            label={getStatusInKorean(m.status)}
                            size="small"
                            sx={{ 
                              ...commonChipSx, 
                              boxShadow:'none', 
                              background: m.status==='DONE' 
                                ? 'linear-gradient(135deg, #10b981, #059669)' 
                                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                              color:'#fff', 
                              '& .MuiChip-label':{ px:0 },
                              
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(0deg, rgba(255,255,255,0.2), transparent 60%)',
                                borderRadius: 999,
                                opacity: 0.6
                              },
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          />
                          <Chip
                            variant={progressLoaded ? 'outlined':'outlined'}
                            size="small"
                            label={progressLoaded ? `${pct}%` : (m.status==='DONE' ? '100%' : '…')}
                            sx={{ 
                              ...commonChipSx, 
                              fontWeight:600, 
                              minWidth:48, 
                              justifyContent:'center', 
                              borderColor:(t)=>alpha(t.palette.primary.main,0.4), 
                              color: progressLoaded ? (t => t.palette.mode === 'dark' ? '#fff' : 'text.primary') : 'text.disabled', 
                              background:(t)=> t.palette.mode === 'dark' 
                                ? 'rgba(255,255,255,0.08)' 
                                : 'rgba(59,130,246,0.08)', 
                              backdropFilter:'blur(8px)',
                              textShadow: (t) => t.palette.mode === 'dark' ? '0 1px 1px rgba(0,0,0,0.2)' : 'none',
                              
                              '&:hover': {
                                borderColor: (t)=>alpha(t.palette.primary.main,0.5),
                                background: (t)=> t.palette.mode === 'dark' 
                                  ? 'rgba(255,255,255,0.08)' 
                                  : 'rgba(59,130,246,0.08)'
                              }
                            }}
                          />
                        </Box>
                        <Box
                          role="progressbar"
                          aria-label="진행률"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progressLoaded ? pct : undefined}
                          sx={{
                            position:'relative',
                            mt:0.5,
                            height: PROGRESS_MIN_HEIGHT,
                            borderRadius: PROGRESS_MIN_HEIGHT/2,
                            overflow:'hidden',
                            width:'100%',
                            alignSelf:'stretch',
                            display:'block',
                            background:(t)=>`linear-gradient(90deg, ${alpha(t.palette.grey[500], t.palette.mode==='dark'?0.25:0.15)}, ${alpha(t.palette.grey[600], t.palette.mode==='dark'?0.2:0.25)})`,
                            boxShadow:(t)=>`inset 0 0 0 1px ${alpha(t.palette.common.black,0.04)}`,
                            
                            '&::before': !progressLoaded && m.status!=='DONE' ? {
                              content:'""',
                              position:'absolute',
                              inset:0,
                              background:(t)=>`linear-gradient(90deg, ${alpha(t.palette.primary.main,0)} 0%, ${alpha(t.palette.primary.main,0.12)} 50%, ${alpha(t.palette.primary.main,0)} 100%)`,
                              backgroundSize:'200% 100%',
                              animation:'shimmer 1.8s ease-in-out infinite',
                            }: undefined,
                            '@keyframes shimmer': { 
                              '0%': { backgroundPosition:'0% 0%' }, 
                              '50%': { backgroundPosition:'100% 0%' },
                              '100%': { backgroundPosition:'0% 0%' }
                            }
                          }}
                        >
                          <Box sx={{ 
                            position:'absolute', 
                            inset:0, 
                            width: progressLoaded ? `${pct}%` : (m.status==='DONE' ? '100%' : 0), 
                            background: m.status==='DONE' 
                              ? 'linear-gradient(90deg, #10b981, #059669)' 
                              : 'linear-gradient(90deg, #3b82f6, #1d4ed8)', 
                            transition:'width .6s cubic-bezier(.4,0,.2,1)', 
                            borderRadius: PROGRESS_MIN_HEIGHT/2,
                            
                            '&::after': { 
                              content:'""', 
                              position:'absolute', 
                              inset:0, 
                              background:'linear-gradient(0deg, rgba(255,255,255,0.3), transparent 70%)', 
                              opacity:0.8,
                              borderRadius: PROGRESS_MIN_HEIGHT/2
                            },
                            
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }} />
                        </Box>
                      </Box>
                      {/* 주제 블록 (2줄 고정, 높이 강제 -> 카드 높이 통일) */}
                      {m.subject ? (
                        <Tooltip title={m.subject} placement="bottom" arrow disableHoverListener={m.subject.length < 18}>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight:1.4,
                              fontSize:{ xs:'.74rem', sm:'.82rem' },
                              display:'-webkit-box',
                              WebkitLineClamp:2,
                              WebkitBoxOrient:'vertical',
                              overflow:'hidden',
                              wordBreak:'break-word',
                              height:{ sm: SUBJECT_BLOCK_HEIGHT_COMFORT },
                              minHeight:{ xs: SUBJECT_BLOCK_HEIGHT_COMFORT - 4 },
                              color: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                              textShadow: (t) => t.palette.mode === 'dark' ? '0 1px 1px rgba(0,0,0,0.2)' : 'none'
                            }}
                          >
                            <Box component="span" sx={{ mr:.35, filter:'grayscale(.2)', opacity:.9 }}>🎯</Box>{m.subject}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Box sx={{ height:{ sm: SUBJECT_BLOCK_HEIGHT_COMFORT }, minHeight:{ xs: SUBJECT_BLOCK_HEIGHT_COMFORT - 4 } }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Box>
      ) : (
        <EmptyState
          icon="🌱"
          title="아직 만든 만다르트가 없어요"
          description="우측 하단 + 버튼을 눌러 새 만다르트를 시작해보세요."
          actionLabel="새 만다르트 만들기"
          onAction={()=> navigate('/mandalart/new')}
          sx={{
            background: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            py: { xs: 6, sm: 8 },
          }}
        />
      )}
      {/* 무한스크롤 sentinel & 상태 표시 */}
      {mandalarts.length > 0 && !loading && (
        <>
          {loadingMore && !loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              py: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1.5,
                p: 3,
                borderRadius: 3,
                background: (t) => t.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(59,130,246,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <CircularProgress size={32} thickness={4} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  더 많은 만다르트를 불러오는 중...
                </Typography>
              </Box>
            </Box>
          )}
          {hasNext ? (
            <Box ref={sentinelRef} sx={{ height: 16 }} />
          ) : (
            !loading && (
              <EmptyState
                icon="🎉"
                title="모든 만다르트를 불러왔습니다"
                description="새로운 만다르트를 만들어보세요!"
                sx={{
                  mt: 4,
                  background: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  py: { xs: 6, sm: 8 },
                }}
              />
            )
          )}
        </>
      )}
  <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 28 },
          right: { xs: 20, sm: 32 },
          width: { xs: 58, sm: 64 },
          height: { xs: 58, sm: 64 },
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8 60%, #1e40af)',
          boxShadow: '0 8px 24px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { 
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0 12px 32px rgba(59,130,246,0.5), 0 0 0 1px rgba(59,130,246,0.2)',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8 60%, #1e40af)'
          },
          '&:active': { 
            transform: 'translateY(0px) scale(0.98)',
            boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
          },
          '& .MuiSvgIcon-root': { 
            fontSize: { xs: 26, sm: 30 },
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }
        }}
        component={RouterLink}
        to="/mandalart/new"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MandalartListPage;
