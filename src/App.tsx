import React from 'react';
import {Outlet} from 'react-router-dom';
import Header from '@/components/Header';
import {Container} from '@mui/material';

const App: React.FC = () => {
    return (
        <div>
            <Header/>
            <Container component="main" maxWidth="lg" sx={{mt: 4, mb: 4}}>
                <Outlet/>
            </Container>
        </div>
    );
};

export default App;
