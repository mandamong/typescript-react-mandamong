import {client} from '@/api/client.gen';
import {authService} from '@/services/AuthService';
import useAuthStore from '@/store/authStore';

export const setupErrorInterceptor = (showSnackbar: (message: string, severity?: "error" | "success" | "info" | "warning") => void) => {
    client.interceptors.error.use(async (error, response, request, options) => {
        const authStore = useAuthStore.getState();

        if (response && response.status === 401 && authStore.refreshToken) {
            if (request.url.includes('/api/auth/token/refresh')) {
                authStore.logout();
                showSnackbar('Session expired. Please log in again.', 'error');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                const refreshResult = await authService.refreshToken(authStore.refreshToken);
                if (!refreshResult) {
                    throw new Error('Token refresh failed: No payload received.');
                }
                const {accessToken, refreshToken} = refreshResult;
                authStore.setToken(accessToken);
                authStore.setRefreshToken(refreshToken);

                const newHeaders = new Headers(options.headers as HeadersInit);
                newHeaders.set('Authorization', `Bearer ${accessToken}`);
                const newOptions = {
                    ...options,
                    headers: newHeaders,
                    method: request.method,
                };

                return client.request(newOptions as any);
            } catch (_refreshError) {
                authStore.logout();
                showSnackbar('Session expired. Please log in again.', 'error');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        let errorMessage = 'An unexpected error occurred.';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error === 'object' && error !== null) {
            const message = (error as any).message || (error as any).detail || (error as any).error;
            if (typeof message === 'string') {
                errorMessage = message;
            }
        }
        showSnackbar(errorMessage, 'error');
        return Promise.reject(error);
    });
};
