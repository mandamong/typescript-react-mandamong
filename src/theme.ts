import { duration, easing, gradients, paletteTokens, radius as r, shadows, spacingUnit } from '@/theme/tokens';
import { alpha } from '@mui/material';
import { createTheme, type Theme } from '@mui/material/styles';

const dark = {
    gray900: '#e5e7eb',
    gray700: '#94a3b8',
    gray500: '#94a3b8',
    gray200: '#1f2937',
    gray100: '#0b1220',
    backgroundDefault: '#0b1220',
    backgroundPaper: '#0f172a',
    divider: 'rgba(255,255,255,0.12)',
};
const successMain = '#16a34a';
const errorMain = '#ef4444';
const warningMain = '#f59e0b';

const neutral = {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
};
export type ThemeMode = 'dark';

export const createAppTheme = (mode: ThemeMode) => {
    const c = dark;
    const darkPrimary = '#3a74ff';
    const theme = createTheme({
        cssVariables: true,
        palette: {
            mode,
            primary: { main: darkPrimary },
            secondary: { main: c.gray700 },
            success: { main: successMain },
            error: { main: errorMain },
            warning: { main: warningMain },
            grey: neutral as any,
            text: {
                primary: c.gray900,
                secondary: c.gray700,
                disabled: c.gray500,
            },
            divider: c.divider,
            background: {
                default: c.backgroundDefault,
                paper: c.backgroundPaper,
            },
        },
                shape: { borderRadius: r.md },
        typography: {
            fontFamily:
                'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, Apple SD Gothic Neo, Noto Sans KR, "Malgun Gothic", sans-serif',
                        h1: { fontWeight: 800, fontSize: 'clamp(2.1rem, 1.6rem + 2.4vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.08 },
                        h2: { fontWeight: 800, fontSize: 'clamp(1.7rem, 1.35rem + 1.8vw, 2.35rem)', letterSpacing: '-0.03em', lineHeight: 1.12 },
                        h3: { fontWeight: 700, fontSize: 'clamp(1.4rem, 1.2rem + 1.1vw, 1.9rem)', letterSpacing: '-0.02em', lineHeight: 1.18 },
                        h4: { fontWeight: 700, fontSize: 'clamp(1.2rem, 1.05rem + 0.65vw, 1.5rem)', letterSpacing: '-0.015em', lineHeight: 1.22 },
                        h5: { fontWeight: 700, fontSize: 'clamp(1.06rem, 0.98rem + 0.5vw, 1.28rem)', lineHeight: 1.28 },
                        h6: { fontWeight: 700, fontSize: 'clamp(0.96rem, 0.9rem + 0.4vw, 1.1rem)', letterSpacing: '-0.01em', lineHeight: 1.35 },
            button: { textTransform: 'none', fontWeight: 600, letterSpacing: '-0.01em' },
            subtitle1: { color: c.gray700, fontSize: 'clamp(0.97rem, 0.9rem + 0.25vw, 1.02rem)' },
            subtitle2: { color: c.gray700, fontSize: 'clamp(0.88rem, 0.85rem + 0.2vw, 0.96rem)' },
            body1: { color: c.gray900, fontSize: 'clamp(0.94rem, 0.9rem + 0.2vw, 1rem)', lineHeight: 1.5 },
            body2: { color: c.gray700, fontSize: 'clamp(0.84rem, 0.82rem + 0.2vw, 0.93rem)', lineHeight: 1.5 },
            caption: { color: c.gray500 },
        },
    components: {
            MuiCssBaseline: {
                styleOverrides: (theme: Theme) => ({
                    html: {
                        scrollbarGutter: 'stable both-edges',
                        overflowY: 'scroll',
                    },
                    ':root': {
                        colorScheme: theme.palette.mode,
                                                '--radius-sm': r.xs+'px',
                                                '--radius-md': r.md+'px',
                                                '--radius-lg': r.lg+'px',
                                                '--radius-xl': r.xl+'px',
                                                '--shadow-xs': shadows.xs,
                                                '--shadow-sm': shadows.sm,
                                                '--shadow-md': shadows.md,
                                                '--shadow-lg': shadows.lg,
                                                '--shadow-xl': shadows.xl,
                        '--focus-ring': `0 0 0 3px ${alpha(darkPrimary, 0.32)}`,
                                                '--gradient-primary': gradients.primary,
                                                '--gradient-surface': 'linear-gradient(145deg,rgba(30,41,59,0.9),rgba(17,25,39,0.78))',
                                                
                                                '--easing-standard': easing.standard,
                                                '--easing-emphasized': easing.emphasized,
                                                '--duration-quickest': duration.quickest,
                                                '--duration-fast': duration.fast,
                                                '--duration-normal': duration.normal,
                                                '--duration-slow': duration.slow,
                        
                        '--space-unit': spacingUnit+'px',
                        '--space-1': (spacingUnit*1)+'px',
                        '--space-2': (spacingUnit*2)+'px',
                        '--space-3': (spacingUnit*3)+'px',
                        '--space-4': (spacingUnit*4)+'px',
                        '--space-6': (spacingUnit*6)+'px',
                        '--space-8': (spacingUnit*8)+'px',
                        '--space-10': (spacingUnit*10)+'px',
                        '--space-12': (spacingUnit*12)+'px',
                        '--space-16': (spacingUnit*16)+'px',
                        
                        '--status-done': paletteTokens.status?.done || paletteTokens.success,
                        '--status-in-progress': paletteTokens.status?.inProgress || paletteTokens.primary[500],
                        '--status-pending': paletteTokens.status?.pending || '#94a3b8'
                    },
                    body: {
                        background: 'var(--app-bg, #0b1220)',
                        letterSpacing: '-0.01em',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        '--field-bg': alpha('#1e293b', 0.9),
                        '--field-border': 'rgba(255,255,255,0.08)',
                        '--text-primary': theme.palette.text.primary,
                        '--text-secondary': theme.palette.text.secondary,
                        margin: 0,
                        minHeight: '100dvh',
                        '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none !important',
                            transition: 'none !important',
                            scrollBehavior: 'auto'
                        }
                    },
                    a: { textDecoration: 'none', color: 'inherit' },
                    '*, *::before, *::after': { boxSizing: 'border-box' },
                    '.u-flex-center': { display:'flex', alignItems:'center', justifyContent:'center' },
                    '.u-fade-in': { animation: 'fade-in var(--duration-normal) var(--easing-standard)' },
                    '@keyframes fade-in': { from:{ opacity:0, transform:'translateY(4px)' }, to:{ opacity:1, transform:'translateY(0)' } },
                    '::-webkit-scrollbar': { width: 10 },
                    '::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha('#475569', 0.35),
                        borderRadius: 20,
                        border: '2px solid transparent',
                        backgroundClip: 'content-box',
                    },
                }),
            },
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        left: 0,
                        right: 0,
                        top: 0,
                        background: 'linear-gradient(180deg,rgba(15,23,42,0.85),rgba(15,23,42,0.7))',
                        backdropFilter: 'saturate(1.6) blur(10px)',
                        WebkitBackdropFilter: 'saturate(1.6) blur(10px)',
                        color: 'var(--text-primary)',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'var(--shadow-sm)',
                    }),
                },
            },
            MuiToolbar: { styleOverrides: { root: { minHeight: 64 } } },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: () => ({
                        borderRadius: r.pill,
                        paddingInline: 20,
                        fontWeight: 600,
                        position:'relative',
                        overflow:'hidden',
                        transition: 'background-color .18s, box-shadow .18s, color .18s, transform .18s',
                        '&:focus-visible': { outline: 'none', boxShadow: 'var(--focus-ring)' },
                        '&:active': { transform: 'translateY(1px)' },
                        '& .pulse': { position:'absolute', inset:0, pointerEvents:'none', opacity:0, background:'radial-gradient(circle at center, rgba(255,255,255,0.4), transparent 70%)' }
                    }),
                    containedPrimary: () => ({
                        boxShadow: '0 4px 16px ' + alpha(darkPrimary, 0.35),
                        backgroundImage: gradients.primary,
                        '&:hover': { boxShadow: '0 6px 22px ' + alpha(darkPrimary, 0.46) },
                    }),
                    outlined: ({ theme }) => ({
                        borderColor: alpha('#ffffff', 0.16),
                        background: alpha('#ffffff', 0.04),
                        '&:hover': { background: alpha('#ffffff', 0.08) },
                    }),
                    text: ({ theme }) => ({
                        paddingInline: 12,
                        '&:hover': { background: alpha('#ffffff', 0.06) },
                    }),
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: r.lg,
                        background: 'var(--gradient-surface)',
                        border: `1px solid rgba(255,255,255,0.08)`,
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'background .35s, border-color .35s, box-shadow .35s',
                        position:'relative',
                        '&::after': { content:'""', position:'absolute', inset:0, background:'radial-gradient(circle at 110% -5%, rgba(255,255,255,0.25), transparent 60%)', mixBlendMode:'overlay', pointerEvents:'none' },
                        '&[data-elevation="1"]': { boxShadow: 'var(--shadow-md)' },
                    }),
                },
            },
            MuiCard: { styleOverrides: { root: ({ theme }) => ({ borderRadius: r.lg, boxShadow: 'var(--shadow-sm)', background: 'var(--gradient-surface)', border: `1px solid rgba(255,255,255,0.08)`, position:'relative', overflow:'hidden', '&::before': { content:'""', position:'absolute', inset:0, background: 'linear-gradient(160deg, rgba(255,255,255,0.1), transparent 60%)', pointerEvents:'none' } }) } },
            MuiTextField: { defaultProps: { size: 'medium' } },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 14,
                        background: 'var(--field-bg)',
                        '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.12)',
                            transition: 'border-color .18s, background .18s',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: darkPrimary,
                            boxShadow: `0 0 0 3px ${alpha(darkPrimary, 0.18)}`,
                        },
                    }),
                    input: { paddingTop: 14, paddingBottom: 14 },
                },
            },
            MuiFormLabel: {
                styleOverrides: { asterisk: { color: errorMain } },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: () => ({
                        color: 'var(--text-secondary)',
                        '&.Mui-focused': { color: 'var(--text-primary)' },
                        '&.MuiInputLabel-shrink': { color: 'var(--text-secondary)' },
                    }),
                },
            },
            MuiAvatar: { styleOverrides: { root: { boxShadow: '0 4px 10px ' + alpha('#0f172a', 0.15), backdropFilter:'saturate(1.4) blur(4px)' } } },
            MuiContainer: { defaultProps: { maxWidth: 'lg' } },
        },
    });
    
    theme.typography.body2 = {
        ...theme.typography.body2,
        color: '#a9b8c8',
    } as any;
    theme.typography.caption = {
        ...theme.typography.caption,
        color: '#9fb1c4',
    } as any;

    return theme;
};
const defaultTheme = createAppTheme('dark');
export default defaultTheme;
