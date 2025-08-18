import useAuthStore from '@/store/authStore';
import React from 'react';
import { Navigate } from 'react-router-dom';
import IntroPage from './IntroPage';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/mandalart" replace />;
  }
  return <IntroPage />;
};

export default HomePage;
