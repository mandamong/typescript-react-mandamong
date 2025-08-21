import axiosInstance from "@/api/client/axios";
import type {
  LoginResponse,
  RefreshTokenResponse,
  SignUpResponse,
} from "@/types/auth";
import axios from "axios";

interface SignUpPayload {
  email: string;
  password: string;
  nickname: string;
  language: string;
  image?: File | null;
}

class AuthService {
  async login(
    email: string,
    password: string
  ): Promise<LoginResponse | undefined> {
    const { data } = await axiosInstance.post<{ payload: LoginResponse }>(
      "/auth/basic/login",
      { email, password }
    );
    return data.payload;
  }

  async signup(payload: SignUpPayload): Promise<SignUpResponse | undefined> {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("nickname", payload.nickname);
    formData.append("language", payload.language);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const { data } = await axiosInstance.post<{ payload: SignUpResponse }>(
      "/auth/basic",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.payload;
  }

  async checkEmailDuplication(email: string): Promise<void> {
    await axiosInstance.get("/auth/duplication/email", { params: { email } });
  }

  async requestEmailVerification(email: string): Promise<void> {
    await axiosInstance.post("/auth/email", { email });
  }

  async verifyEmailCode(email: string, code: string): Promise<void> {
    await axiosInstance.get("/auth/email", { params: { email, code } });
  }

  async checkNicknameDuplication(nickname: string): Promise<void> {
    await axiosInstance.get("/auth/duplication/nickname", {
      params: { nickname },
    });
  }

  async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse | undefined> {
    const { data } = await axios.post<RefreshTokenResponse>(
      "/api/auth/token/refresh",
      { refreshToken },
      {
        baseURL: "/",
      }
    );
    return data;
  }

  async deleteAccount(): Promise<void> {
    await axiosInstance.delete("/auth/basic");
  }
}

export const authService = new AuthService();
