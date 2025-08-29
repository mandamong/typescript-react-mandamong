import AuthFrame from '@/components/layout/AuthFrame';
import { useLoginForm } from '@/hooks/useLoginForm';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, CircularProgress, Container, Link, Stack, TextField } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


const LoginPage: React.FC = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        emailError,
        setEmailError,
        passwordError,
        setPasswordError,
        handleSubmit,
    } = useLoginForm();


        return (
            <Container component="main" maxWidth="sm" sx={{ px:{ xs:2.5, sm:0 } }}>
                <AuthFrame icon={<LockOutlinedIcon />} title="로그인" subtitle="계정에 로그인하고 만다르트를 만들어보세요.">
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Stack spacing={{ xs: 2, md: 2.5 }}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일"
                                    name="email"
                                    autoComplete="username"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(false);
                                    }}
                                    error={emailError}
                                    helperText={emailError ? '유효한 이메일 주소를 입력해주세요.' : ''}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="비밀번호"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(false);
                                    }}
                                    error={passwordError}
                                    helperText={passwordError ? '비밀번호를 입력해주세요.' : ''}
                                />
                            </Stack>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1.5, py: { xs: 1.1, md: 1.2 } }} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : '로그인'}
                            </Button>
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                <Link component={RouterLink} to="/signup" variant="body2" color="primary">
                                    회원가입
                                </Link>
                                <Link component={RouterLink} to="/password-recovery" variant="body2" color="primary">
                                    비밀번호 찾기
                                </Link>
                            </Stack>
            </Box>
        </AuthFrame>
            </Container>
        );
};

export default LoginPage;
