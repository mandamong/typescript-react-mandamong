import { authService } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import type { RefreshTokenResponse } from '@/types/auth';
import { type AxiosError } from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

export const handleTokenRefresh = async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
    }

    originalRequest._retry = true;

    const authStore = useAuthStore.getState();
    const currentRefreshToken = authStore.refreshToken;

    if (currentRefreshToken) {
        try {
            const newTokens: RefreshTokenResponse | undefined = await authService.refreshToken(currentRefreshToken);
            const payload = newTokens?.payload;
            if (payload && originalRequest.headers) {
                authStore.setToken(payload.accessToken);
                authStore.setRefreshToken(payload.refreshToken);

                                originalRequest.headers.set('Authorization', `Bearer ${payload.accessToken}`);
                                const newHeaders = new Headers();
                                Object.entries(originalRequest.headers as Record<string, string>).forEach(([k, v]) => newHeaders.set(k, v));
                                const retried = new Request(originalRequest.url ?? '', {
                                    method: (originalRequest.method as string) ?? 'GET',
                                    headers: newHeaders,
                                    body: (originalRequest as unknown as { data?: BodyInit }).data,
                                });
                                return fetch(retried);
            }
        } catch (refreshError: unknown) {
            const axiosRefreshError = refreshError as AxiosError;
            console.error('Failed to refresh token:', axiosRefreshError);
            authStore.logout();
        }
    } else {
        authStore.logout();
    }

    return Promise.reject(error);
};
