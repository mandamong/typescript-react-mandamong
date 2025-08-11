import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from '@/router';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import {SnackbarProvider} from '@/contexts/SnackbarProvider';
import {useSnackbar} from '@/hooks/useSnackbar';
import {client} from '@/api/client.gen';

import './index.css';

import {setupErrorInterceptor} from '@/api/interceptor';

client.setConfig({
    baseUrl: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL,
});

export const AppInitializer: React.FC = () => {
    const {showSnackbar} = useSnackbar();
    setupErrorInterceptor(showSnackbar);

    return null;
};

export const Root = () => {
    return (
        <React.StrictMode>
            <SnackbarProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <AppInitializer/>
                    <AppRouter/>
                </ThemeProvider>
            </SnackbarProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>);