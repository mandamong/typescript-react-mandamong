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

  async resetPassword(email: string): Promise<{ updated: string }> {
    const { data } = await axiosInstance.patch<{ payload: { updated: string } }>('/user/password/initialize', { email });
    return data.payload;
  }

  async updateProfileImage(image: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await axiosInstance.patch('/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.payload;
  }
}

export const userService = new UserService();
