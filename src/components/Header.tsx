import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import {AppBar, Avatar, Box, Button, Toolbar, Typography,} from '@mui/material';

const Header: React.FC = () => {
    const {isAuthenticated, logout, user} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        만다몽
                    </Link>
                </Typography>
                <Box>
                    {isAuthenticated && user ? (
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Avatar src={user.image} alt={user.nickname} sx={{width: 32, height: 32, mr: 1}}/>
                            <Typography sx={{mr: 2}}>{user.nickname}</Typography>
                            <Button color="inherit" component={Link} to="/mandalart">
                                만다르트
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                로그인
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                회원가입
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
