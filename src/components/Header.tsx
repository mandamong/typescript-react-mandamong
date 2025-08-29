import BrandLogo from '@/components/BrandLogo';
import useAuthStore from '@/store/authStore';
import { AppBar, Avatar, Box, Button, Container, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 4 });

    return (
        <AppBar
            position="sticky"
            color="default"
            sx={(theme) => ({
                boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : '1px solid transparent',
                transition: 'box-shadow .25s, border-color .25s, backdrop-filter .25s',
                backdropFilter: scrolled ? 'saturate(1.8) blur(10px)' : 'saturate(1.4) blur(6px)',
                WebkitBackdropFilter: scrolled ? 'saturate(1.8) blur(10px)' : 'saturate(1.4) blur(6px)',
            })}
        >
            <Container maxWidth="lg" disableGutters>
                <Toolbar disableGutters sx={{ minHeight: { xs: 54, sm: 64 }, px: { xs: 1.1, sm: 2 } }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                                <BrandLogo titleImage="/mandamong-title.svg" titleImageHeight={14} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        {isAuthenticated && user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                <Button
                                    color="primary"
                                    variant="text"
                                    component={Link}
                                    to="/mandalart"
                                    sx={{ fontSize: { xs: '.78rem', sm: '.95rem' }, fontWeight: 600, minWidth: 'auto', px: { xs: 0.75, sm: 1 } }}
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
                                        pl: { xs: 0.6, sm: 1 },
                                        pr: { xs: 0.6, sm: 1 },
                                    }}
                                >
                                    <Avatar src={user.image} alt={user.nickname} sx={{ width: { xs: 26, sm: 32 }, height: { xs: 26, sm: 32 }, mr: { xs: 0.6, sm: 1 } }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '.78rem', sm: '.95rem' } }}>
                                        {user.nickname}
                                    </Typography>
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                    sx={{ ml: { xs: 0.4, sm: 1 }, fontSize: { xs: '.78rem', sm: '.95rem' }, fontWeight: 600, px: { xs: 0.75, sm: 1.5 }, py: { xs: 0.75, sm: 1 } }}
                                >
                                    로그아웃
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                <Button color="inherit" component={Link} to="/login" sx={{ fontSize: { xs: '.78rem', sm: '.95rem' }, fontWeight: 600, px: { xs: 0.75, sm: 1.5 }, py: { xs: 0.75, sm: 1 } }}>
                                    로그인
                                </Button>
                                <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ fontSize: { xs: '.78rem', sm: '.95rem' }, fontWeight: 700, px: { xs: 1.25, sm: 2 } }}>
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
