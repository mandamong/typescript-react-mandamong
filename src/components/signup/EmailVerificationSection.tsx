import { Box, Button, CircularProgress, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

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
    isCodeSent: boolean;
    resendCooldown: number;
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
    isCodeSent,
    resendCooldown,
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
                label={"이메일"}
                name="email"
                autoComplete="username"
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
                                {loadingEmailCheck ? <CircularProgress size={24}/> : '중복확인'}
                            </Button>
                        </InputAdornment>
                    ),
                }}
            />
            {emailChecked && (
                <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Button
                            fullWidth
                variant="outlined"
                            onClick={handleRequestVerification}
                            disabled={loadingRequestVerification || emailVerified || resendCooldown > 0}
                        >
                            {loadingRequestVerification ? (
                                <CircularProgress size={24}/>
                            ) : (
                                isCodeSent ? '재전송' : '인증 번호 전송'
                            )}
                        </Button>
                        {isCodeSent && !emailVerified && (
                 <Typography variant="body2" color="text.secondary" sx={{ minWidth: '70px', textAlign: 'right' }}>
                                {resendCooldown > 0 ? `(${resendCooldown}s)` : '재전송 가능'}
                            </Typography>
                        )}
                    </Box>
                    {isCodeSent && (
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
                                            {loadingVerifyCode ? <CircularProgress size={24}/> : '인증확인'}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                            disabled={emailVerified}
                        />
                    )}
                </>
            )}
        </Stack>
    );
};

export default EmailVerificationSection;
