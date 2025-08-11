import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {authService} from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import {useSnackbar} from '@/hooks/useSnackbar';

export const useSignUpForm = () => {
    const navigate = useNavigate();
    const {login} = useAuthStore();
    const {showSnackbar} = useSnackbar();

    const [email, setEmail] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [nickname, setNickname] = useState('');
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [language, setLanguage] = useState('ko_KR');

    const [loadingEmailCheck, setLoadingEmailCheck] = useState(false);
    const [loadingRequestVerification, setLoadingRequestVerification] = useState(false);
    const [loadingVerifyCode, setLoadingVerifyCode] = useState(false);
    const [loadingNicknameCheck, setLoadingNicknameCheck] = useState(false);
    const [loadingSignUp, setLoadingSignUp] = useState(false);

    
    const [emailError, setEmailError] = useState(false);
    const [nicknameError, setNicknameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const validateEmail = (email: string) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const validatePassword = (password: string) => {
        const hasMinLength = password.length >= 8; // Changed to 8 for stronger password
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    };

    const validateNickname = (nickname: string) => {
        const hasMinLength = nickname.length >= 2;
        const hasMaxLength = nickname.length <= 15;
        const hasValidChars = /^[a-zA-Z0-9가-힣]+$/.test(nickname);
        return hasMinLength && hasMaxLength && hasValidChars;
    };

    const validateImage = useCallback((image: File | null) => {
        if (!image) return false;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedTypes.includes(image.type)) {
            showSnackbar('지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF)', 'warning');
            return false;
        }
        if (image.size > maxSize) {
            showSnackbar('이미지 파일 크기는 2MB를 초과할 수 없습니다.', 'warning');
            return false;
        }
        return true;
    }, [showSnackbar]);

    const handleCheckEmail = useCallback(async () => {
        if (!validateEmail(email)) {
            setEmailError(true);
            showSnackbar('유효한 이메일 주소를 입력해주세요.', 'warning');
            return;
        }
        setLoadingEmailCheck(true);
        try {
            await authService.checkEmailDuplication(email);
            showSnackbar('사용 가능한 이메일입니다.', 'success');
            setEmailChecked(true);
        } catch (_error) {
            showSnackbar('이미 사용 중인 이메일입니다.', 'error');
        } finally {
            setLoadingEmailCheck(false);
        }
    }, [email, showSnackbar]);

    const handleRequestVerification = useCallback(async () => {
        if (!emailChecked) {
            showSnackbar('이메일 중복 확인을 먼저 해주세요.', 'warning');
            return;
        }
        setLoadingRequestVerification(true);
        try {
            await authService.requestEmailVerification(email);
            showSnackbar('인증 코드를 발송했습니다.', 'info');
        } catch (_error) {
            showSnackbar('인증 코드 발송에 실패했습니다.', 'error');
        } finally {
            setLoadingRequestVerification(false);
        }
    }, [email, emailChecked, showSnackbar]);

    const handleVerifyCode = useCallback(async () => {
        if (!verificationCode) {
            showSnackbar('인증 코드를 입력해주세요.', 'warning');
            return;
        }
        setLoadingVerifyCode(true);
        try {
            await authService.verifyEmailCode(email, verificationCode);
            showSnackbar('이메일 인증이 완료되었습니다.', 'success');
            setEmailVerified(true);
        } catch (_error) {
            showSnackbar('인증 코드가 올바르지 않습니다.', 'error');
        } finally {
            setLoadingVerifyCode(false);
        }
    }, [email, verificationCode, showSnackbar]);

    const handleCheckNickname = useCallback(async () => {
        if (!validateNickname(nickname)) {
            setNicknameError(true);
            showSnackbar('닉네임은 2자 이상 15자 이하의 영문, 숫자, 한글만 가능합니다.', 'warning');
            return;
        }
        setLoadingNicknameCheck(true);
        try {
            await authService.checkNicknameDuplication(nickname);
            showSnackbar('사용 가능한 닉네임입니다.', 'success');
            setNicknameChecked(true);
        } catch (_error) {
            showSnackbar('이미 사용 중인 닉네임입니다.', 'error');
        } finally {
            setLoadingNicknameCheck(false);
        }
    }, [nickname, showSnackbar]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;

        if (!emailChecked || !emailVerified) {
            showSnackbar('이메일 중복 확인 및 인증을 완료해야 합니다.', 'warning');
            valid = false;
        }
        if (!nicknameChecked || !validateNickname(nickname)) {
            showSnackbar('닉네임 중복 확인 및 유효성 검사를 완료해야 합니다.', 'warning');
            valid = false;
        }
        if (!validatePassword(password)) {
            setPasswordError(true);
            showSnackbar('비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.', 'warning');
            valid = false;
        }
        if (password !== passwordConfirm) {
            setPasswordConfirmError(true);
            showSnackbar('비밀번호가 일치하지 않습니다.', 'warning');
            valid = false;
        }
        if (!validateImage(image)) {
            setImageError(true);
            valid = false;
        }

        if (!valid) {
            return;
        }

        setLoadingSignUp(true);
        try {
            const payload = await authService.signup({
                email,
                password,
                nickname,
                image: image as File,
                language,
            });
            if (payload) {
                const {accessToken, refreshToken, ...user} = payload;
                login(accessToken, refreshToken, user);
                showSnackbar('회원가입이 완료되었습니다.', 'success');
                navigate('/mandalart');
            }
        } catch (_error) {
            showSnackbar('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setLoadingSignUp(false);
        }
    }, [email, emailChecked, emailVerified, nickname, nicknameChecked, password, passwordConfirm, image, language, login, showSnackbar, navigate, validateImage]);

    return {
        email,
        setEmail,
        emailChecked,
        setEmailChecked,
        verificationCode,
        setVerificationCode,
        emailVerified,
        setEmailVerified,
        nickname,
        setNickname,
        nicknameChecked,
        setNicknameChecked,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        image,
        setImage,
        language,
        setLanguage,
        loadingEmailCheck,
        loadingRequestVerification,
        loadingVerifyCode,
        loadingNicknameCheck,
        loadingSignUp,
        emailError,
        setEmailError,
        nicknameError,
        setNicknameError,
        passwordError,
        setPasswordError,
        passwordConfirmError,
        setPasswordConfirmError,
        imageError,
        setImageError,
        validateEmail,
        validatePassword,
        handleCheckEmail,
        handleRequestVerification,
        handleVerifyCode,
        handleCheckNickname,
        handleSubmit,
    };
};
