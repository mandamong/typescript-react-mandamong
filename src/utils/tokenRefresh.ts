import {authService} from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import {client} from '@/api/client.gen';
import { type AxiosError, type AxiosRequestConfig } from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

export const handleTokenRefresh = async (error: AxiosError, ...args: any[]) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
    }

    originalRequest._retry = true;

    const authStore = useAuthStore.getState();
    const currentRefreshToken = authStore.refreshToken;

    if (currentRefreshToken) {
        try {
            const newTokens = await authService.refreshToken(currentRefreshToken);
            if (newTokens) {
                authStore.setToken(newTokens.accessToken);
                authStore.setRefreshToken(newTokens.refreshToken);

                originalRequest.headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
                return client.request({ ...originalRequest, url: originalRequest.url ?? '', signal: originalRequest.signal as AbortSignal | undefined, auth: originalRequest.auth as any, method: originalRequest.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE' });
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
