import GlassPanel from '@/components/design/GlassPanel';
import AccountManagement from '@/components/settings/AccountManagement';
import NicknameChange from '@/components/settings/NicknameChange';
import PasswordChange from '@/components/settings/PasswordChange';
import ProfileImageUpload from '@/components/settings/ProfileImageUpload';
import SettingsListItem from '@/components/settings/SettingsListItem';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Box, Collapse, Container, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const SettingsPage: React.FC = () => {
    const userSettings = useUserSettings();
    const [open, setOpen] = useState<string | false>(false);

    const handleToggle = (panel: string) => (_event: React.MouseEvent) => {
        setOpen(open === panel ? false : panel);
    };

    return (
    <Container maxWidth="sm" sx={{ px: { xs: 2.5, sm: 0 } }}>
            <Box sx={{ py: { xs: 3.5, sm: 5 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: { xs: 3, sm: 4 },
                        fontWeight: 800,
                        fontSize: { xs: 'clamp(1.55rem, 5.6vw, 2rem)', sm: '2.125rem' },
            letterSpacing: '-.02em',
            background:'linear-gradient(120deg,var(--status-in-progress),var(--status-done))',
            WebkitBackgroundClip:'text',
            color:'transparent'
                    }}
                >
                    설정
                </Typography>
        <GlassPanel gradientBorder sx={{ p:0, overflow:'hidden', borderRadius:4 }}>
                    <Stack>
                        {/* 닉네임 변경 섹션 */}
                        <SettingsListItem
                            title="닉네임 변경"
                            icon={<EditIcon />}
                            onClick={handleToggle('nickname')}
                            open={open === 'nickname'}
                            id="settings-nickname"
                        />
                        <Collapse id="settings-nickname-panel" in={open === 'nickname'} timeout="auto" unmountOnExit role="region" aria-labelledby="settings-nickname" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ p: 2, backgroundColor: 'var(--field-bg)' }}>
                                <NicknameChange
                                    nickname={userSettings.nickname}
                                    setNickname={userSettings.setNickname}
                                    handleUpdateNickname={userSettings.handleUpdateNickname}
                                    handleCheckNickname={userSettings.handleCheckNickname}
                                    loading={userSettings.loadingNickname}
                                    loadingCheck={userSettings.loadingNicknameCheck}
                                    nicknameChecked={userSettings.nicknameChecked}
                                />
                            </Box>
                        </Collapse>
                        <Divider flexItem sx={{ mx: 3 }} />
                        {/* 프로필 이미지 변경 섹션 */}
                        <SettingsListItem
                            title="프로필 이미지 변경"
                            icon={<PhotoCameraIcon />}
                            onClick={handleToggle('profileImage')}
                            open={open === 'profileImage'}
                            id="settings-profile-image"
                        />
                        <Collapse id="settings-profile-image-panel" in={open === 'profileImage'} timeout="auto" unmountOnExit role="region" aria-labelledby="settings-profile-image" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ p: 2, backgroundColor: 'var(--field-bg)' }}>
                                <ProfileImageUpload
                                    currentImageUrl={userSettings.user?.image}
                                    loading={userSettings.loadingProfileImage}
                                    onImageUpload={userSettings.handleUpdateProfileImage}
                                />
                            </Box>
                        </Collapse>
                        <Divider flexItem sx={{ mx: 3 }} />
                        {/* 비밀번호 변경 섹션 */}
                        <SettingsListItem
                            title="비밀번호 변경"
                            icon={<LockResetIcon />}
                            onClick={handleToggle('password')}
                            open={open === 'password'}
                            id="settings-password"
                        />
                        <Collapse id="settings-password-panel" in={open === 'password'} timeout="auto" unmountOnExit role="region" aria-labelledby="settings-password" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ p: 2, backgroundColor: 'var(--field-bg)' }}>
                                <PasswordChange
                                    currentPassword={userSettings.currentPassword}
                                    setCurrentPassword={userSettings.setCurrentPassword}
                                    newPassword={userSettings.newPassword}
                                    setNewPassword={userSettings.setNewPassword}
                                    newPasswordConfirm={userSettings.newPasswordConfirm}
                                    setNewPasswordConfirm={userSettings.setNewPasswordConfirm}
                                    isPasswordVerified={userSettings.isPasswordVerified}
                                    passwordError={userSettings.passwordError}
                                    loadingPasswordVerify={userSettings.loadingPasswordVerify}
                                    loadingPasswordUpdate={userSettings.loadingPasswordUpdate}
                                    handleVerifyPassword={userSettings.handleVerifyPassword}
                                    handleUpdatePassword={userSettings.handleUpdatePassword}
                                />
                            </Box>
                        </Collapse>
                        <Divider flexItem sx={{ mx: 3 }} />
                        {/* 계정 관리 섹션 */}
                        <SettingsListItem
                            title="계정 관리"
                            icon={<LockResetIcon />}
                            onClick={handleToggle('account')}
                            open={open === 'account'}
                            id="settings-account"
                        />
                        <Collapse id="settings-account-panel" in={open === 'account'} timeout="auto" unmountOnExit role="region" aria-labelledby="settings-account">
                            <Box sx={{ p: 2, backgroundColor: 'var(--field-bg)' }}>
                                <AccountManagement
                                    loadingDeleteAccount={userSettings.loadingDeleteAccount}
                                    handleDeleteAccount={userSettings.handleDeleteAccount}
                                />
                            </Box>
                        </Collapse>
                    </Stack>
                </GlassPanel>
            </Box>
        </Container>
    );
};

export default SettingsPage;
