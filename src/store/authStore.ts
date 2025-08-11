import {create} from 'zustand';
import { client } from '@/api/client.gen';
import { type AxiosResponse, type AxiosError } from 'axios';
import {handleTokenRefresh} from '@/utils/tokenRefresh';


interface User {
    id: number;
    email: string;
    nickname: string;
    image: string;
    language: string;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
    setToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    login: (accessToken, refreshToken, user) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({accessToken, refreshToken, user, isAuthenticated: true});
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({accessToken: null, refreshToken: null, user: null, isAuthenticated: false});
    },
    setToken: (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({accessToken, isAuthenticated: true});
    },
    setRefreshToken: (refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken);
        set({refreshToken});
    },
}));



client.interceptors.request.use((request) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
});

client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            return handleTokenRefresh(error);
        }
        return Promise.reject(error);
    }
);

export default useAuthStore;
