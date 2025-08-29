import { usePerformance } from '@/contexts/PerformanceContext';
import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import React from 'react';

interface HeroSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  /**
   * 전체 히어로 섹션을 뷰포트 중앙(세로)으로 정렬합니다.
   * 헤더 높이가 있다면 calc 값으로 조정하세요.
   */
  centerScreen?: boolean;
  /** centerScreen 사용 시 제목/설명 블록을 추가로 위로 올릴 픽셀. 반응형 객체 지원. */
  centerShift?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

const HeroSection: React.FC<HeroSectionProps> = ({ eyebrow, title, description, primaryAction, secondaryAction, centerScreen, centerShift = 0 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { perf } = usePerformance();

  
  const shiftStyles = React.useMemo(() => {
    if (!centerScreen) return undefined;
    if (typeof centerShift === 'number') {
      const v = -centerShift; 
      return { xs: `translateY(${v}px)`, sm: `translateY(${v}px)`, md: `translateY(${v}px)`, lg: `translateY(${v}px)`, xl: `translateY(${v}px)` } as const;
    }
    const sxVal = centerShift.xs ?? centerShift.sm ?? centerShift.md ?? centerShift.lg ?? centerShift.xl ?? 0;
    const smVal = centerShift.sm ?? centerShift.md ?? centerShift.lg ?? centerShift.xl ?? sxVal;
    const mdVal = centerShift.md ?? centerShift.lg ?? centerShift.xl ?? smVal;
    const lgVal = centerShift.lg ?? centerShift.xl ?? mdVal;
    const xlVal = centerShift.xl ?? lgVal;
    return {
      xs: `translateY(${-sxVal}px)`,
      sm: `translateY(${-smVal}px)`,
      md: `translateY(${-mdVal}px)`,
      lg: `translateY(${-lgVal}px)`,
      xl: `translateY(${-xlVal}px)`
    } as const;
  }, [centerShift, centerScreen]);

  return (
    <Box sx={{
      position: 'relative',
      textAlign: 'center',
      pt: centerScreen ? 0 : { xs: 'clamp(88px,18vh,160px)', md: 'clamp(110px,20vh,200px)' },
      pb: centerScreen ? 0 : { xs: 'clamp(56px,12vh,120px)', md: 'clamp(72px,14vh,140px)' },
      ...(centerScreen && {
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        mt: { xs: '-54px', sm: '-64px' }, 
        pt: { xs: '54px', sm: '64px' },
        px: { xs: 2, sm: 3 }
      })
    }}>
  {centerScreen && !perf && (
        <Box aria-hidden sx={{ position:'absolute', inset:0, pointerEvents:'none',
          background: theme.palette.mode==='dark'
            ? 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.05), transparent 60%)'
            : 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.55), transparent 62%)',
          mask:'linear-gradient(to bottom, rgba(0,0,0,.9), rgba(0,0,0,.4), rgba(0,0,0,0))',
          opacity: .55
        }} />
      )}
  <Box sx={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
  {!perf && <Box data-parallax="60" sx={{
          position:'absolute',
          width: 520,
          height: 520,
          top: -120,
          left: '50%',
          transform:'translateX(-50%)',
          background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, isDark?0.20:0.28)} 0%, transparent 70%)`
    }} />}
  {!perf && <Box data-parallax="40" sx={{ position:'absolute', width:420, height:420, bottom:-160, left:'12%', background:`radial-gradient(circle at center, ${alpha('#6366f1',0.22)}, transparent 70%)` }} />}
      </Box>
      <Stack spacing={0} sx={{ position:'relative', width:'100%', maxWidth: 980, mx:'auto', flex: centerScreen ? 1 : 'unset', display: 'flex' }}>
        {/* Centered content including actions */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: shiftStyles || 'none',
          transition: 'transform .45s cubic-bezier(.4,0,.2,1)'
        }}>
          {eyebrow && (
            typeof eyebrow === 'string' ? (
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: '.12em',
                  fontWeight: 700,
                  fontSize: '.72rem',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                {eyebrow}
              </Typography>
            ) : (
              <Box sx={{ mb: 1 }}>{eyebrow}</Box>
            )
          )}
          <Typography component="h1" /* reveal 제거 */ sx={{
            fontWeight:800,
            lineHeight:1.1,
            fontSize:{ xs:'clamp(2.0rem, 6vw, 2.75rem)', sm:'clamp(2.6rem,5vw,3.4rem)', md:'clamp(3rem,4.2vw,3.85rem)' },
            letterSpacing:'-0.025em',
            background:'var(--gradient-primary)',
            WebkitBackgroundClip:'text',
            color:'transparent',
            filter: perf ? 'none' : 'drop-shadow(0 4px 14px rgba(0,0,0,0.25))',
            maxWidth: 860,
            mx:'auto',
            px:1.5,
            position:'relative'
          }}>
            {title}
          </Typography>
          {description && (
            <Typography /* reveal 제거 */
              variant="subtitle1"
              sx={{
                maxWidth: 640,
                mx: 'auto',
                mt:{ xs:1.6, sm:2.1 },
                lineHeight: 1.5,
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', sm: '1.05rem', md:'1.07rem' },
                letterSpacing:'-0.01em',
                textAlign: 'center'
              }}
            >
              {description}
            </Typography>
          )}
          {(primaryAction || secondaryAction) && (
            <Box sx={{
              mt:{ xs:3.6, sm:4.5 },
              display:'flex',
              flexDirection:{ xs:'column', sm:'row' },
              gap:{ xs:1.1, sm:1.6 },
              alignItems:'center'
            }}>
              {primaryAction && (
                <Button onClick={primaryAction.onClick} size="large" variant="contained" sx={{
                  px:{ xs:3.6, sm:4.8 }, py:{ xs:1.3, sm:1.55 }, fontWeight:800, letterSpacing:'-0.01em', borderRadius: 999,
                  boxShadow: perf ? 'none' : '0 6px 22px -4px rgba(0,0,0,0.35)',
                  fontSize:{ xs:'0.97rem', sm:'1.02rem' },
                  backdropFilter:'blur(6px)',
                  transition:'transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s, background .4s',
                  '&:hover': perf ? undefined : { transform:'translateY(-4px)', boxShadow:'0 14px 34px -6px rgba(0,0,0,0.45)' }
                }}>{primaryAction.label}</Button>
              )}
              {secondaryAction && (
                <Button onClick={secondaryAction.onClick} size="large" variant="outlined" sx={{
                  px:{ xs:3.3, sm:4.3 }, py:{ xs:1.22, sm:1.48 }, fontWeight:600, borderRadius: 999,
                  fontSize:{ xs:'0.92rem', sm:'0.98rem' },
                  position:'relative',
                  overflow:'hidden',
                  background: theme.palette.mode==='dark' ? alpha('#ffffff',0.04) : alpha('#ffffff',0.65),
                  boxShadow: perf ? 'none' : (isDark ? '0 4px 14px -2px rgba(0,0,0,0.45)' : '0 4px 14px -2px rgba(37,99,255,0.25)'),
                  '&::before':{
                    content:'""', position:'absolute', inset:0, background:'linear-gradient(140deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)', opacity: isDark?0.15:0.3
                  },
                  '&:hover': perf ? undefined : { transform:'translateY(-4px)', background: isDark? alpha('#ffffff',0.09): alpha('#ffffff',0.9) }
                }}>{secondaryAction.label}</Button>
              )}
            </Box>
          )}
        </Box>
      </Stack>
  {centerScreen && !perf && (
        <Box aria-hidden sx={{ position:'absolute', left:'50%', bottom:{ xs:56, sm:48, md:46 }, transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:.6, color:'text.secondary', fontSize:12 }}>
          <Box sx={{ position:'relative', width:22, height:36, border:'2px solid', borderColor:'text.secondary', borderRadius:12, opacity:.6 }}>
            <Box sx={{ position:'absolute', left:'50%', top:6, width:4, height:8, borderRadius:2, background:'currentColor', transform:'translateX(-50%)', animation:'scroll-indicator 1.8s infinite' }} />
          </Box>
          Scroll
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
