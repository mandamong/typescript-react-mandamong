import {type AxiosError, type InternalAxiosRequestConfig} from 'axios';
import axiosInstance from '@/api/client/axios';
import {authService} from '@/services/AuthService';
import useAuthStore from '@/store/authStore';

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
                        if (newTokens && newTokens.payload) {
                            const {setToken, setRefreshToken} = useAuthStore.getState();
                            const { accessToken, refreshToken: newRefreshToken } = newTokens.payload;
                            setToken(accessToken);
                            setRefreshToken(newRefreshToken);

                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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

            return Promise.reject(error);
        }
    );
};
