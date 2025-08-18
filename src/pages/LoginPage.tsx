import { useLoginForm } from '@/hooks/useLoginForm';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, CircularProgress, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
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
            <Container component="main" maxWidth="sm">
                <Box sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
                                로그인
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                계정에 로그인하고 만다르트를 만들어보세요.
                            </Typography>
                        </Box>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Stack spacing={2.5}>
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
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1.5 }} disabled={loading}>
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
                    </Paper>
                </Box>
            </Container>
        );
};

export default LoginPage;
