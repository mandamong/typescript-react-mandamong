import axiosInstance from '@/api/client/axios';

class UserService {
  async updateNickname(nickname: string): Promise<string> {
    const formData = new FormData();
    formData.append('nickname', nickname);
  await axiosInstance.patch<unknown>('/user', formData);
    return nickname;
  }

  async verifyPassword(password: string): Promise<void> {
    await axiosInstance.post('/user/password', { password });
  }

  async updatePassword(password: string): Promise<boolean> {
    const formData = new FormData();
    formData.append('password', password);
  const { data } = await axiosInstance.patch<{ success: boolean; payload: null; error: unknown }>('/user', formData);
    return data.success;
  }

  async resetPassword(email: string): Promise<{ email: string }> {
  const { data } = await axiosInstance.patch<{ payload: any }>('/user/password', { email });
  return data.payload;
  }

  async updateProfileImage(image: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', image);
    const { data } = await axiosInstance.patch<{ success?: boolean; payload?: any; error?: any }>(
      '/user',
      formData,
    );
  if (data?.payload == null) return '';
    const payload = data.payload;
    const url = typeof payload === 'string' ? payload : payload.image;
  if (!url) return '';
    return url;
  }
}

export const userService = new UserService();
