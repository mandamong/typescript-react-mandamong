import { useSnackbar } from '@/hooks/useSnackbar';
import { authService } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // 수동 중복확인 로딩 제거 (자동 검사 전환)
    const [loadingRequestVerification, setLoadingRequestVerification] = useState(false);
    const [loadingVerifyCode, setLoadingVerifyCode] = useState(false);
    // 수동 닉네임 중복확인 로딩 제거 (자동 검사 전환)
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const [autoCheckingEmail, setAutoCheckingEmail] = useState(false);
    const [autoCheckingNickname, setAutoCheckingNickname] = useState(false);
    const lastEmailCheckStatus = useRef<'success' | 'error' | undefined>(undefined);
    const lastNicknameCheckStatus = useRef<'success' | 'error' | undefined>(undefined);

    const [emailError, setEmailError] = useState(false); // 형식 오류
    const [emailCheckFailed] = useState(false); // (자동 검사에서 snackbar만 사용, 필드 에러는 바로 표현)
    const [nicknameError, setNicknameError] = useState(false); // 형식 오류
    const [nicknameCheckFailed] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const timerId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerId.current) {
                clearInterval(timerId.current);
            }
        };
    }, []);

    // 디바운스 자동 이메일 중복 검사
    useEffect(() => {
        if (!email || (emailChecked && emailVerified)) return; // 이미 인증 완료되면 재요청 안함
        if (!validateEmail(email)) {
            setEmailChecked(false);
            return;
        }
        const debounce = setTimeout(async () => {
            setAutoCheckingEmail(true);
            try {
                await authService.checkEmailDuplication(email);
                setEmailChecked(true);
                if (lastEmailCheckStatus.current !== 'success') {
                    showSnackbar('사용 가능한 이메일입니다.', 'success');
                    lastEmailCheckStatus.current = 'success';
                }
            } catch {
                setEmailChecked(false);
                if (lastEmailCheckStatus.current !== 'error') {
                    showSnackbar('이미 사용 중인 이메일입니다.', 'error');
                    lastEmailCheckStatus.current = 'error';
                }
            } finally {
                setAutoCheckingEmail(false);
            }
        }, 600);
        return () => clearTimeout(debounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    // 디바운스 자동 닉네임 중복 검사
    useEffect(() => {
        if (!nickname) return;
        if (!validateNickname(nickname)) {
            setNicknameChecked(false);
            return;
        }
        const debounce = setTimeout(async () => {
            setAutoCheckingNickname(true);
            try {
                await authService.checkNicknameDuplication(nickname);
                setNicknameChecked(true);
                if (lastNicknameCheckStatus.current !== 'success') {
                    showSnackbar('사용 가능한 닉네임입니다.', 'success');
                    lastNicknameCheckStatus.current = 'success';
                }
            } catch {
                setNicknameChecked(false);
                if (lastNicknameCheckStatus.current !== 'error') {
                    showSnackbar('이미 사용 중인 닉네임입니다.', 'error');
                    lastNicknameCheckStatus.current = 'error';
                }
            } finally {
                setAutoCheckingNickname(false);
            }
        }, 600);
        return () => clearTimeout(debounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nickname]);

    const validateEmail = (email: string) => {
        return /^["\w-.]+@(["\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const validatePassword = (password: string) => {
        const hasMinLength = password.length >= 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasMinLength && hasLowercase && hasNumber && hasSpecialChar;
    };

    const validateNickname = (nickname: string) => {
        const hasMinLength = nickname.length >= 2;
        const hasMaxLength = nickname.length <= 15;
        const hasValidChars = /^[a-zA-Z0-9가-힣]+$/.test(nickname);
        return hasMinLength && hasMaxLength && hasValidChars;
    };

    const validateImage = useCallback((image: File | null) => {
        if (!image) return true; // 선택 안해도 통과
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

    // 수동 이메일 중복확인 핸들러 제거 (자동 검사)

    const handleRequestVerification = useCallback(async () => {
        if (!emailChecked) {
            showSnackbar('이메일 중복 확인을 먼저 해주세요.', 'warning');
            return;
        }
        setLoadingRequestVerification(true);
        try {
            await authService.requestEmailVerification(email);
            showSnackbar('인증 코드를 발송했습니다.', 'info');
            setIsCodeSent(true);
            setResendCooldown(60);

            if (timerId.current) clearInterval(timerId.current);
            timerId.current = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timerId.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

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
            if (timerId.current) clearInterval(timerId.current);
            setResendCooldown(0);
        } catch (_error) {
            showSnackbar('인증 코드가 올바르지 않습니다.', 'error');
        } finally {
            setLoadingVerifyCode(false);
        }
    }, [email, verificationCode, showSnackbar]);

    // 수동 닉네임 중복확인 핸들러 제거 (자동 검사)

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
            showSnackbar('비밀번호는 8자 이상이며, 소문자, 숫자, 특수문자를 포함해야 합니다.', 'warning');
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
        } else {
            setImageError(false);
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
                image: image ?? undefined,
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
        loadingRequestVerification,
        loadingVerifyCode,
        loadingSignUp,
    autoCheckingEmail,
    autoCheckingNickname,
        emailError,
        emailCheckFailed,
        setEmailError,
        nicknameError,
        nicknameCheckFailed,
        setNicknameError,
        passwordError,
        setPasswordError,
        passwordConfirmError,
        setPasswordConfirmError,
        imageError,
        setImageError,
        isCodeSent,
        resendCooldown,
        handleRequestVerification,
        handleVerifyCode,
        handleSubmit,
    };
};

