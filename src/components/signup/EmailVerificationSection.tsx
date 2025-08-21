import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, CircularProgress, Fade, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

interface EmailVerificationSectionProps {
    email: string;
    setEmail: (email: string) => void;
    emailChecked: boolean;
    setEmailChecked: (checked: boolean) => void;
    autoCheckingEmail?: boolean;
    emailCheckFailed?: boolean;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    emailVerified: boolean;
    setEmailVerified: (verified: boolean) => void;
    loadingRequestVerification: boolean;
    loadingVerifyCode: boolean;
    emailError: boolean;
    setEmailError: (error: boolean) => void;
    isCodeSent: boolean;
    resendCooldown: number;
    handleRequestVerification: () => void;
    handleVerifyCode: () => void;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
    email,
    setEmail,
    emailChecked,
    setEmailChecked,
    autoCheckingEmail,
    emailCheckFailed,
    verificationCode,
    setVerificationCode,
    emailVerified,
    setEmailVerified,
    loadingRequestVerification,
    loadingVerifyCode,
    emailError,
    setEmailError,
    isCodeSent,
    resendCooldown,
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
                error={!!emailCheckFailed}
                helperText={emailError ? '유효한 이메일 주소를 입력해주세요.' : emailCheckFailed ? '이미 사용 중인 이메일입니다.' : ''}
                FormHelperTextProps={{
                    sx: {
                        m: 0.5,
                        fontSize: 12,
                        color: emailCheckFailed ? 'error.main' : emailError ? 'warning.main' : 'text.secondary'
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {autoCheckingEmail && !emailChecked && (
                                <CircularProgress size={20} />
                            )}
                            <Fade in={emailChecked && !autoCheckingEmail && !emailCheckFailed} timeout={250}>
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{
                                        ml: 0.5,
                                        '@keyframes popIn': {
                                            '0%': { transform: 'scale(0.4)', opacity: 0 },
                                            '70%': { transform: 'scale(1.05)', opacity: 1 },
                                            '100%': { transform: 'scale(1)', opacity: 1 }
                                        },
                                        animation: 'popIn 300ms ease'
                                    }}
                                    aria-label="사용 가능한 이메일"
                                />
                            </Fade>
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
