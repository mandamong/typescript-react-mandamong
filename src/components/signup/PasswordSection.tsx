import React from 'react';
import {Stack, TextField} from '@mui/material';

interface PasswordSectionProps {
    password: string;
    setPassword: (password: string) => void;
    passwordConfirm: string;
    setPasswordConfirm: (passwordConfirm: string) => void;
    passwordError: boolean;
    setPasswordError: (error: boolean) => void;
    passwordConfirmError: boolean;
    setPasswordConfirmError: (error: boolean) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
                                                             password,
                                                             setPassword,
                                                             passwordConfirm,
                                                             setPasswordConfirm,
                                                             passwordError,
                                                             setPasswordError,
                                                             passwordConfirmError,
                                                             setPasswordConfirmError,
                                                         }) => {
    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <TextField
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                }}
                error={passwordError}
                helperText={passwordError ? '비밀번호는 6자 이상이어야 합니다.' : ''}
            />
            <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="비밀번호 재입력"
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    setPasswordConfirmError(false);
                }}
                error={passwordConfirmError}
                helperText={passwordConfirmError ? '비밀번호가 일치하지 않습니다.' : ''}
            />
        </Stack>
    );
};

export default PasswordSection;
