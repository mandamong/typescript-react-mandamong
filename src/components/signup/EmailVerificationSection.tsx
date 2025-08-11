import React from 'react';
import {Button, CircularProgress, InputAdornment, Stack, TextField} from '@mui/material';

interface EmailVerificationSectionProps {
    email: string;
    setEmail: (email: string) => void;
    emailChecked: boolean;
    setEmailChecked: (checked: boolean) => void;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    emailVerified: boolean;
    setEmailVerified: (verified: boolean) => void;
    loadingEmailCheck: boolean;
    loadingRequestVerification: boolean;
    loadingVerifyCode: boolean;
    emailError: boolean;
    setEmailError: (error: boolean) => void;
    handleCheckEmail: () => void;
    handleRequestVerification: () => void;
    handleVerifyCode: () => void;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
                                                                               email,
                                                                               setEmail,
                                                                               emailChecked,
                                                                               setEmailChecked,
                                                                               verificationCode,
                                                                               setVerificationCode,
                                                                               emailVerified,
                                                                               setEmailVerified,
                                                                               loadingEmailCheck,
                                                                               loadingRequestVerification,
                                                                               loadingVerifyCode,
                                                                               emailError,
                                                                               setEmailError,
                                                                               handleCheckEmail,
                                                                               handleRequestVerification,
                                                                               handleVerifyCode,
                                                                           }) => {
    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <TextField
                required
                fullWidth
                id="email"
                label="이메일"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                    setEmailChecked(false);
                    setEmailVerified(false);
                }}
                error={emailError}
                helperText={emailError ? '유효한 이메일 주소를 입력해주세요.' : ''}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                onClick={handleCheckEmail}
                                disabled={!email || loadingEmailCheck || emailChecked}
                            >
                                {loadingEmailCheck ? <CircularProgress size={24}/> : 'Check'}
                            </Button>
                        </InputAdornment>
                    ),
                }}
            />
            {emailChecked && (
                <>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleRequestVerification}
                        disabled={loadingRequestVerification || emailVerified}
                    >
                        {loadingRequestVerification ? (
                            <CircularProgress size={24}/>
                        ) : (
                            '인증 번호 전송'
                        )}
                    </Button>
                    <TextField
                        fullWidth
                        label="인증 번호"
                        value={verificationCode}
                        onChange={(e) => {
                            setVerificationCode(e.target.value);
                            setEmailVerified(false);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        onClick={handleVerifyCode}
                                        disabled={!verificationCode || loadingVerifyCode || emailVerified}
                                    >
                                        {loadingVerifyCode ? <CircularProgress size={24}/> : 'Verify'}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </>
            )}
        </Stack>
    );
};

export default EmailVerificationSection;
