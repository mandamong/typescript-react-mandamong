import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import BrandLogo from '@/components/BrandLogo';

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="sticky" component="header" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <BrandLogo />
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } }}>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>
            <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} mandamong
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;