import { Stack, TextField } from '@mui/material';
import React from 'react';

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
                label={"비밀번호"}
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                }}
                error={passwordError}
                helperText={passwordError ? '비밀번호는 8자 이상이며, 소문자/숫자/특수문자를 포함해야 합니다.' : ''}
            />
            <TextField
                required
                fullWidth
                name="passwordConfirm"
                label={"비밀번호 재입력"}
                type="password"
                id="passwordConfirm"
                autoComplete="new-password"
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
