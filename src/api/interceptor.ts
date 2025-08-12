import axiosInstance from '@/api/client/axios';
import { authService } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import type { RefreshTokenResponse } from '@/types/auth';
import { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { client } from './client.gen';

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const setupAxiosInterceptors = () => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryConfig;

            if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                originalRequest._retry = true;

                const {refreshToken, logout} = useAuthStore.getState();

                if (refreshToken) {
                    try {
                        const newTokens = await authService.refreshToken(refreshToken);
                        const data: any = (newTokens as any)?.payload ?? newTokens;
                        const accessToken: string | undefined = data?.accessToken;
                        const newRefreshToken: string | undefined = data?.refreshToken;
                        if (accessToken && newRefreshToken) {
                            const {setToken, setRefreshToken} = useAuthStore.getState();
                            setToken(accessToken);
                            setRefreshToken(newRefreshToken);

                            if (originalRequest.headers) {
                                (originalRequest.headers as any).Authorization = `Bearer ${accessToken}`;
                            }
                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        logout();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                logout();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Retry on network errors/timeouts or 429/5xx, only for idempotent methods
            const status = error.response?.status;
            const method = (originalRequest?.method || 'get').toUpperCase();
            // Allow safe retries for specific POST endpoints (AI suggestion endpoints are idempotent server-side)
            const url = originalRequest?.url || '';
            const isSafePost = method === 'POST' && (/\/gemini\/subject$/.test(url) || /\/gemini\/objective$/.test(url));
            const shouldRetry = (!status || status === 429 || (status >= 500 && status < 600)) && ((method === 'GET' || method === 'HEAD') || isSafePost);
            if (shouldRetry) {
                const retryCount = (originalRequest as any)._retryCount ?? 0;
                if (retryCount < 3) {
                    (originalRequest as any)._retryCount = retryCount + 1;
                    const delay = Math.min(1000 * 2 ** retryCount, 4000);
                    await new Promise((res) => setTimeout(res, delay));
                    return axiosInstance(originalRequest);
                }
            }
            return Promise.reject(error);
        }
    );
};

/**
 * Setup fetch-client 401 handling for generated client (used in tests).
 * On 401: try refresh with refreshToken, update store, retry with Authorization.
 * On failure: logout and redirect to /login.
 */
export const setupErrorInterceptor = (_showSnackbar?: (msg: string, variant?: 'error' | 'success' | 'info' | 'warning') => void) => {
    // Avoid duplicate registrations in watch/test mode
    client.interceptors.response.use(async (response, request, options) => {
        // Automatic retry for network/429/5xx on idempotent methods + whitelisted POST endpoints
        const method = (request.method || 'GET').toUpperCase();
        const url = request.url || '';
        const isSafePost = method === 'POST' && (/\/gemini\/subject$/.test(url) || /\/gemini\/objective$/.test(url));
        if ((method === 'GET' || method === 'HEAD' || isSafePost) && (response.status === 0 || response.status === 429 || (response.status >= 500 && response.status < 600))) {
            const retryHeader = request.headers.get('x-retry-count');
            const retryCount = retryHeader ? parseInt(retryHeader, 10) : 0;
            if (retryCount < 3) {
                const headers = new Headers(request.headers);
                headers.set('x-retry-count', String(retryCount + 1));
                const delay = Math.min(1000 * 2 ** retryCount, 4000);
                await new Promise((r) => setTimeout(r, delay));
                const retried = new Request(request, { headers });
                const fetchFn = options.fetch ?? globalThis.fetch;
                return fetchFn(retried);
            }
        }

        if (response.status !== 401) return response;

        // Prevent infinite retry loops
        if (request.headers.get('x-retried') === '1') return response;

        const { refreshToken, setToken, setRefreshToken, logout } = useAuthStore.getState();
        if (!refreshToken) {
            logout();
            if (typeof window !== 'undefined') window.location.href = '/login';
            return response;
        }

        try {
            const refreshed: RefreshTokenResponse | undefined = await authService.refreshToken(refreshToken);
            const payload: any = (refreshed as any)?.payload ?? refreshed;
            const newAccessToken: string | undefined = payload?.accessToken;
            const newRefreshToken: string | undefined = payload?.refreshToken;
            if (newAccessToken && newRefreshToken) {
                setToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                const headers = new Headers(request.headers);
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                headers.set('x-retried', '1');
                const retriedRequest = new Request(request, { headers });

                const fetchFn = options.fetch ?? globalThis.fetch;
                const retriedResponse = await fetchFn(retriedRequest);
                return retriedResponse;
            }
        } catch (_e) {
            // fallthrough to logout
        }

        // On failure, logout and redirect
        logout();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return response;
    });
};
