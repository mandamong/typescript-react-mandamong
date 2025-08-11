import {create} from 'zustand';

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
    setNickname: (nickname: string) => void;
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
    setNickname: (nickname) => set(state => {
        const user = state.user ? { ...state.user, nickname } : null;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        return { ...state, user };
    }),
}));

export default useAuthStore;
