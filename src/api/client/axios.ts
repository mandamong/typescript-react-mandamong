import useAuthStore from '@/store/authStore';
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  // Content-Type 은 요청 데이터 타입에 따라 axios가 자동 지정 (FormData 업로드 방해 방지 위해 전역 지정 제거)
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
