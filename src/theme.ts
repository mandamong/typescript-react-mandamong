import { alpha } from '@mui/material';
import { createTheme, type Theme } from '@mui/material/styles';

const primaryMain = '#3182f6';
const light = {
    gray900: '#0f172a',
    gray700: '#334155',
    gray500: '#64748b',
    gray200: '#e2e8f0',
    gray100: '#f1f5f9',
    backgroundDefault: '#ffffff',
    backgroundPaper: '#ffffff',
    divider: '#e2e8f0',
};
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
const successMain = '#2bc46b';
const errorMain = '#ef4444';
const warningMain = '#f59e0b';
export type ThemeMode = 'light' | 'dark';

export const createAppTheme = (mode: ThemeMode) => {
    const c = mode === 'dark' ? dark : light;
    return createTheme({
        cssVariables: true,
        palette: {
            mode,
            primary: { main: primaryMain },
            secondary: { main: c.gray700 },
            success: { main: successMain },
            error: { main: errorMain },
            warning: { main: warningMain },
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
        shape: { borderRadius: 14 },
        typography: {
            fontFamily:
                'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, Apple SD Gothic Neo, Noto Sans KR, "Malgun Gothic", sans-serif',
        h1: { fontWeight: 800, fontSize: 'clamp(1.625rem, 1.2rem + 2vw, 2.25rem)' },
        h2: { fontWeight: 800, fontSize: 'clamp(1.375rem, 1.1rem + 1.5vw, 1.75rem)' },
        h3: { fontWeight: 700, fontSize: 'clamp(1.25rem, 1.05rem + 1vw, 1.5rem)' },
        h4: { fontWeight: 700, fontSize: 'clamp(1.125rem, 1.0rem + 0.6vw, 1.25rem)' },
        h5: { fontWeight: 700, fontSize: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)' },
        h6: { fontWeight: 700, fontSize: 'clamp(0.95rem, 0.9rem + 0.3vw, 1rem)' },
        button: { textTransform: 'none', fontWeight: 600 },
        subtitle1: { color: c.gray700, fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1rem)' },
        subtitle2: { color: c.gray700, fontSize: 'clamp(0.875rem, 0.84rem + 0.2vw, 0.95rem)' },
        body1: { color: c.gray900, fontSize: 'clamp(0.95rem, 0.9rem + 0.2vw, 1rem)' },
        body2: { color: c.gray700, fontSize: 'clamp(0.875rem, 0.84rem + 0.2vw, 0.95rem)' },
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
                                },
                    body: {
                        background: theme.palette.background.default,
                        letterSpacing: '-0.01em',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                                        '--field-bg': theme.palette.background.paper,
                                        '--field-border': theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
                                        '--text-primary': theme.palette.text.primary,
                                        '--text-secondary': theme.palette.text.secondary,
                    },
                    a: { textDecoration: 'none', color: 'inherit' },
                }),
            },
                    MuiAppBar: {
                                styleOverrides: {
                                    root: {
                                        backgroundColor: 'var(--field-bg)',
                                        color: 'var(--text-primary)',
                                                borderRadius: 0,
                                        boxShadow: '0 4px 16px ' + alpha('#1f2937', 0.06),
                                    },
                                },
            },
            MuiToolbar: { styleOverrides: { root: { minHeight: 64 } } },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: { borderRadius: 12, paddingInline: 16 },
                    containedPrimary: { boxShadow: '0 8px 20px ' + alpha(primaryMain, 0.3) },
                },
            },
                            MuiPaper: {
                                styleOverrides: {
                                    root: {
                                        borderRadius: 16,
                                        boxShadow: '0 8px 24px ' + alpha('#0f172a', 0.12),
                                        backgroundColor: 'var(--field-bg)',
                                    },
                                },
                            },
            MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
            MuiTextField: { defaultProps: { size: 'medium' } },
                            MuiOutlinedInput: {
                                styleOverrides: {
                                    root: {
                                        borderRadius: 12,
                                        background: 'var(--field-bg)',
                                    },
                                },
                            },
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: {
                        color: errorMain,
                    },
                },
            },
                            MuiInputLabel: {
                                styleOverrides: {
                                    root: {
                                        color: 'var(--text-secondary)',
                                        '&.Mui-focused': { color: 'var(--text-primary)' },
                                        '&.MuiInputLabel-shrink': { color: 'var(--text-secondary)' },
                                    },
                                },
                            },
                            MuiAvatar: {
                                styleOverrides: {
                                    root: {
                                        boxShadow: '0 4px 12px ' + alpha('#0f172a', 0.18),
                                    },
                                },
                            },
            MuiContainer: { defaultProps: { maxWidth: 'md' } },
        },
    });
};

// Keep default export for compatibility (light theme)
const defaultTheme = createAppTheme('light');
export default defaultTheme;
