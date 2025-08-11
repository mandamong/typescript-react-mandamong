import axiosInstance from '@/api/client/axios';

class UserService {
  async updateNickname(updated: string): Promise<{ updated: string }> {
    const { data } = await axiosInstance.patch<{ payload: { updated: string } }>('/user/nickname', { updated });
    return data.payload;
  }

  async verifyPassword(password: string): Promise<void> {
    await axiosInstance.post('/user/password', { password });
  }

  async updatePassword(password: string): Promise<void> {
    await axiosInstance.patch('/user/password', { updated: password });
  }

  async resetPassword(): Promise<{ updated: string }> {
    const { data } = await axiosInstance.patch<{ payload: { updated: string } }>('/user/password/initialize');
    return data.payload;
  }
}

export const userService = new UserService();
