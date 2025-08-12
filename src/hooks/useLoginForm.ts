import { useSnackbar } from '@/hooks/useSnackbar';
import { authService } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const validateEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export const useLoginForm = () => {
    const navigate = useNavigate();
    const {login} = useAuthStore();
    const {showSnackbar} = useSnackbar();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;
        if (!validateEmail(email)) {
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }

    if (password.length < 8) {
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }

        if (!valid) {
            showSnackbar('이메일 형식, 비밀번호 길이(최소 8자)를 확인해주세요.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const loginData = await authService.login(email, password);
            if (loginData) {
                const { accessToken, refreshToken, ...user } = loginData;

                

                login(accessToken, refreshToken, user);
                showSnackbar('로그인 되었습니다.', 'success');
                navigate('/mandalart');
            } else {
                throw new Error('Login failed: No data received');
            }
        } catch (_error) {
            showSnackbar('로그인에 실패했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    }, [email, password, login, showSnackbar, navigate]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        emailError,
        setEmailError,
        passwordError,
        setPasswordError,
        handleSubmit,
    };
};
