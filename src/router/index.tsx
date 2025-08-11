import {lazy, Suspense} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import App from '../App';
import {Box, CircularProgress} from '@mui/material';

// Lazy load page components
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const MandalartListPage = lazy(() => import('../pages/MandalartListPage'));
const MandalartCreatePage = lazy(() => import('../pages/MandalartCreatePage'));
const MandalartDetailPage = lazy(() => import('../pages/MandalartDetailPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const CenteredLoader = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress/>
    </Box>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<CenteredLoader/>}>
                        <HomePage/>
                    </Suspense>
                ),
            },
            {
                path: 'login',
                element: (
                    <Suspense fallback={<CenteredLoader/>}>
                        <LoginPage/>
                    </Suspense>
                ),
            },
            {
                path: 'signup',
                element: (
                    <Suspense fallback={<CenteredLoader/>}>
                        <SignUpPage/>
                    </Suspense>
                ),
            },
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        path: 'mandalart',
                        element: (
                            <Suspense fallback={<CenteredLoader/>}>
                                <MandalartListPage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: 'mandalart/new',
                        element: (
                            <Suspense fallback={<CenteredLoader/>}>
                                <MandalartCreatePage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: 'mandalart/:id',
                        element: (
                            <Suspense fallback={<CenteredLoader/>}>
                                <MandalartDetailPage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: 'settings',
                        element: (
                            <Suspense fallback={<CenteredLoader/>}>
                                <SettingsPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);

const AppRouter = () => <RouterProvider router={router}/>;

export default AppRouter;
