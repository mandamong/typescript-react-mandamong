import axios from 'axios';
import axiosInstance from '@/api/client/axios';
import type { LoginResponse, SignUpRequest, RefreshTokenResponse, SignUpResponse } from '@/types/auth';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse | undefined> {
    const { data } = await axiosInstance.post<{ payload: LoginResponse }>('/auth/basic/login', { email, password });
    return data.payload;
  }

  async signup(payload: SignUpRequest): Promise<SignUpResponse | undefined> {
    const formData = new FormData();
    if (payload) {
      formData.append('email', payload.email);
      formData.append('password', payload.password);
      formData.append('nickname', payload.nickname);
      formData.append('image', payload.image);
      formData.append('language', payload.language);
    }

    const { data } = await axiosInstance.post<{ payload: SignUpResponse }>('/auth/basic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.payload;
  }

  async checkEmailDuplication(email: string): Promise<void> {
    await axiosInstance.get('/auth/duplication/email', { params: { email } });
  }

  async requestEmailVerification(email: string): Promise<void> {
    await axiosInstance.post('/auth/email/verification', { email });
  }

  async verifyEmailCode(email: string, code: string): Promise<void> {
    await axiosInstance.get('/auth/email/verification', { params: { email, code } });
  }

  async checkNicknameDuplication(nickname: string): Promise<void> {
    await axiosInstance.get('/auth/duplication/nickname', { params: { nickname } });
  }

  // 인터셉터에서 무한 루프를 방지하기 위해 axiosInstance를 사용하지 않음
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse | undefined> {
    const { data } = await axios.post<RefreshTokenResponse>('/api/auth/token/refresh', { refreshToken }, {
      baseURL: '/', // baseURL을 오버라이드하여 /api/ 경로를 직접 사용
    });
    return data;
  }
}

export const authService = new AuthService();
