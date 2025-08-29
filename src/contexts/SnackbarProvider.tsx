import { Alert, Slide, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { SnackbarContext } from './SnackbarContext';

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    const showSnackbar = useCallback((msg: string, sev: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const Transition = (props: any) => <Slide {...props} direction="up"/>;

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4200}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Transition}
                sx={{
                    '& .MuiPaper-root': { boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }
                }}
            >
                                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                                                position: 'relative',
                                                borderRadius: 999,
                                                px: 3.25,
                                                py: 1.15,
                                                fontWeight: 600,
                                                letterSpacing: '.2px',
                                                boxShadow: (theme) => theme.palette.mode === 'dark'
                                                    ? '0 8px 30px -4px rgba(0,0,0,0.55)'
                                                    : '0 6px 28px -4px rgba(0,0,0,0.18)',
                                                backdropFilter: 'blur(10px) saturate(1.5)',
                                                WebkitBackdropFilter: 'blur(10px) saturate(1.5)',
                                                border: '1px solid rgba(255,255,255,0.25)',
                        background: () => {
                            switch (severity) {
                                case 'success': return 'linear-gradient(135deg,#16a34a,#22c55e)';
                                case 'error': return 'linear-gradient(135deg,#dc2626,#ef4444)';
                                case 'warning': return 'linear-gradient(135deg,#d97706,#f59e0b)';
                                default: return 'linear-gradient(135deg,#2563ff,#6366f1)';
                            }
                                                },
                                                '& .MuiAlert-icon': {
                                                    fontSize: 22,
                                                    mr: 1.25,
                                                    opacity: 0.95
                                                },
                                                '& .MuiAlert-message': {
                                                    py: 0.25
                                                },
                                                '& .MuiAlert-action': {
                                                    ml: 0.5
                                                }
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
