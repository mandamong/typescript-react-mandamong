import { useSnackbar } from '@/hooks/useSnackbar';
import { authService } from '@/services/AuthService';
import { userService } from '@/services/UserService';
import useAuthStore from '@/store/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUserSettings = () => {
    const navigate = useNavigate();
    const { user, logout, setNickname: setStoreNickname, setProfileImage: setStoreProfileImage } = useAuthStore();
    const { showSnackbar } = useSnackbar();

    const [nickname, setNicknameValue] = useState(user?.nickname || '');
    const [nicknameChecked, setNicknameChecked] = useState(true);
    const [currentPassword, _setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [loadingNickname, setLoadingNickname] = useState(false);
    const [loadingNicknameCheck, setLoadingNicknameCheck] = useState(false);
    const [loadingPasswordVerify, setLoadingPasswordVerify] = useState(false);
    const [loadingPasswordUpdate, setLoadingPasswordUpdate] = useState(false);
    const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
    const [loadingProfileImage, setLoadingProfileImage] = useState(false);

    const setNickname = (newNickname: string) => {
        setNicknameValue(newNickname);
        if (newNickname !== user?.nickname) {
            setNicknameChecked(false);
        } else {
            setNicknameChecked(true);
        }
    };
    
    const setCurrentPassword = (password: string) => {
        _setCurrentPassword(password);
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleCheckNickname = async () => {
        if (!nickname || nickname === user?.nickname) return;
        setLoadingNicknameCheck(true);
        try {
            await authService.checkNicknameDuplication(nickname);
            setNicknameChecked(true);
            showSnackbar('사용 가능한 닉네임입니다.', 'success');
    } catch (_error) {
            showSnackbar('이미 사용 중인 닉네임입니다.', 'error');
        } finally {
            setLoadingNicknameCheck(false);
        }
    };

    const handleUpdateNickname = async () => {
        if (!nicknameChecked && nickname !== user?.nickname) {
            showSnackbar('닉네임 중복 확인을 해주세요.', 'warning');
            return;
        }
        if (nickname === user?.nickname) {
            return;
        }
        setLoadingNickname(true);
        try {
            const { updated: updatedNickname } = await userService.updateNickname(nickname);
            setStoreNickname(updatedNickname);
            showSnackbar('닉네임이 변경되었습니다.', 'success');
    } catch (_error) {
            showSnackbar('닉네임 변경에 실패했습니다.', 'error');
        } finally {
            setLoadingNickname(false);
        }
    };

    const handleVerifyPassword = async () => {
        if (!currentPassword) return;
        setLoadingPasswordVerify(true);
        try {
            await userService.verifyPassword(currentPassword);
            setIsPasswordVerified(true);
            setPasswordError('');
            showSnackbar('비밀번호가 확인되었습니다. 새 비밀번호를 입력하세요.', 'success');
    } catch (_error) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
        } finally {
            setLoadingPasswordVerify(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== newPasswordConfirm || !newPassword) {
            showSnackbar('새 비밀번호가 일치하지 않습니다.', 'warning');
            return;
        }
        setLoadingPasswordUpdate(true);
        try {
            await userService.updatePassword(newPassword);
            showSnackbar('비밀번호가 변경되었습니다.', 'success');
            _setCurrentPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
            setIsPasswordVerified(false);
    } catch (_error) {
            showSnackbar('비밀번호 변경에 실패했습니다.', 'error');
        } finally {
            setLoadingPasswordUpdate(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoadingDeleteAccount(true);
        try {
            await authService.deleteAccount();
            showSnackbar('회원 탈퇴가 완료되었습니다.', 'success');
            logout();
            navigate('/');
    } catch (_error) {
            showSnackbar('회원 탈퇴에 실패했습니다.', 'error');
        } finally {
            setLoadingDeleteAccount(false);
        }
    };

    const handleUpdateProfileImage = async (image: File) => {
        setLoadingProfileImage(true);
        try {
            const imageUrl = await userService.updateProfileImage(image);
            
            // authStore의 user 정보 업데이트
            if (imageUrl) {
                setStoreProfileImage(imageUrl);
            } else {
                console.warn('응답 payload에서 이미지 URL을 찾을 수 없습니다:', imageUrl);
            }
            
            showSnackbar('프로필 이미지가 성공적으로 변경되었습니다.', 'success');
            return imageUrl;
        } catch (error) {
            console.error('프로필 이미지 업데이트 실패:', error);
            showSnackbar('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.', 'error');
            throw error;
        } finally {
            setLoadingProfileImage(false);
        }
    };

    return {
        user,
        nickname,
        setNickname,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        newPasswordConfirm,
        setNewPasswordConfirm,
        isPasswordVerified,
        passwordError,
        nicknameChecked,
        loadingNickname,
        loadingNicknameCheck,
        loadingPasswordVerify,
        loadingPasswordUpdate,
        loadingDeleteAccount,
        loadingProfileImage,
        handleUpdateNickname,
        handleCheckNickname,
        handleVerifyPassword,
        handleUpdatePassword,
        handleDeleteAccount,
        handleUpdateProfileImage,
    };
};