import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Avatar, Box, Button, CircularProgress, Container, Grid, Link, TextField, Typography,} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useLoginForm} from '@/hooks/useLoginForm';


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
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    로그인
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="이메일"
                        name="email"
                        autoComplete="email"
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
                        margin="normal"
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : '로그인'}
                    </Button>
                    <Grid container>
                        <Grid>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {"회원가입"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
