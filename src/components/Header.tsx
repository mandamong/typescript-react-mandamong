import { useThemeMode } from '@/contexts/ThemeModeContext';
import useAuthStore from '@/store/authStore';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { AppBar, Avatar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { mode, toggle } = useThemeMode();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" color="default">
            <Container maxWidth="lg" disableGutters>
                <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2 } }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 800,
                            fontSize: { xs: 'clamp(1.05rem, 0.95rem + 1vw, 1.25rem)', sm: '1.25rem' },
                            letterSpacing: '-0.01em',
                        }}
                    >
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            만다몽
                        </Link>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Tooltip title={mode === 'dark' ? '라이트 모드' : '다크 모드'}>
                            <IconButton color="inherit" onClick={toggle} aria-label="toggle dark mode">
                                {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                            </IconButton>
                        </Tooltip>
                        {isAuthenticated && user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                <Button
                                    color="primary"
                                    variant="text"
                                    component={Link}
                                    to="/mandalart"
                                    sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' }, fontWeight: 600, minWidth: 'auto', px: { xs: 0.5, sm: 1 } }}
                                >
                                    만다르트
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/settings"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '999px',
                                        pl: { xs: 0.75, sm: 1 },
                                        pr: { xs: 0.75, sm: 1 },
                                    }}
                                >
                                    <Avatar src={user.image} alt={user.nickname} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, mr: { xs: 0.75, sm: 1 } }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                                        {user.nickname}
                                    </Typography>
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                    sx={{ ml: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.9rem', sm: '0.95rem' }, fontWeight: 600 }}
                                >
                                    로그아웃
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                <Button color="inherit" component={Link} to="/login" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' }, fontWeight: 600 }}>
                                    로그인
                                </Button>
                                <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' }, fontWeight: 700 }}>
                                    회원가입
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
