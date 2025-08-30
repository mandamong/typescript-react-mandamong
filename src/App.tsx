import React from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Header from '@/components/Header';
import {Container} from '@mui/material';
import { GlobalEffects } from '@/components/design/GlobalEffects';
import { useLocationChange } from '@/hooks/useLocationChange';

const App: React.FC = () => {
    useLocationChange((location) => {
        if (location.pathname.startsWith('/mandalart')) {
            document.body.classList.add('bg-effect-disabled');
        } else {
            document.body.classList.remove('bg-effect-disabled');
        }
    });

    return (
        <div>
            <GlobalEffects />
            <Header/>
            <Container component="main" maxWidth="lg" sx={{mt: 4, mb: 4}}>
                <Outlet/>
            </Container>
        </div>
    );
};

export default App;
