import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import React from 'react';

interface PasswordChangeProps {
    currentPassword: string;
    setCurrentPassword: (password: string) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    newPasswordConfirm: string;
    setNewPasswordConfirm: (password: string) => void;
    isPasswordVerified: boolean;
    passwordError: string;
    loadingPasswordVerify: boolean;
    loadingPasswordUpdate: boolean;
    handleVerifyPassword: () => void;
    handleUpdatePassword: () => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isPasswordVerified,
    passwordError,
    loadingPasswordVerify,
    loadingPasswordUpdate,
    handleVerifyPassword,
    handleUpdatePassword,
}) => {
    return (
        <Stack spacing={2}>
                        {!isPasswordVerified ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
                                <Box sx={{ flex: 1, width: '100%' }}>
                                    <TextField
                                        type="password"
                                        placeholder="현재 비밀번호"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        hiddenLabel
                                        error={!!passwordError}
                                        helperText={passwordError}
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: { borderRadius: 2, backgroundColor: 'var(--field-bg)' },
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        onClick={handleVerifyPassword}
                                        disabled={loadingPasswordVerify}
                                        variant="contained"
                                        size="large"
                                        sx={{ py: '7.5px', px: 3, borderRadius: 2, fontWeight: 'bold' }}
                                    >
                                        {loadingPasswordVerify ? <CircularProgress size={24} color="inherit" /> : '확인'}
                                    </Button>
                                </Box>
                            </Stack>
                        ) : (
                <Stack component="form" spacing={2} noValidate autoComplete="off">
                    <TextField
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="filled"
                        size="small"
                        fullWidth
                        hiddenLabel
                        InputProps={{
                            disableUnderline: true,
                            sx: { borderRadius: 2, backgroundColor: 'var(--field-bg)' }
                        }}
                    />
                    <TextField
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        variant="filled"
                        size="small"
                        fullWidth
                        hiddenLabel
                        InputProps={{
                            disableUnderline: true,
                            sx: { borderRadius: 2, backgroundColor: 'var(--field-bg)' }
                        }}
                    />
                    <Button 
                        onClick={handleUpdatePassword} 
                        disabled={loadingPasswordUpdate} 
                        variant="contained" 
                        sx={{ 
                            alignSelf: 'flex-end',
                            borderRadius: 2,
                            fontWeight: 'bold'
                        }}
                    >
                        {loadingPasswordUpdate ? <CircularProgress size={24} color="inherit" /> : '비밀번호 변경'}
                    </Button>
                </Stack>
            )}
        </Stack>
    );
};

export default PasswordChange;