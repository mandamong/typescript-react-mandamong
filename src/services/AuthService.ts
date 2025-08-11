import {
    getApiAuthDuplicationEmail,
    getApiAuthDuplicationNickname,
    getApiAuthEmailVerification,
    postApiAuthBasic,
    postApiAuthBasicLogin,
    postApiAuthEmailVerification,
    postApiAuthTokenRefresh,
} from '@/api/sdk.gen';

class AuthService {
    async login(email: string, password: string) {
        const {data} = await postApiAuthBasicLogin({body: {email, password}});
        if (data) {
            return data.payload;
        }
        return undefined;
    }

    async signup(payload: {
        email: string;
        password: string;
        nickname: string;
        image: File;
        language: string;
    }) {
        const {data} = await postApiAuthBasic({body: payload});
        if (data) {
            return data.payload;
        }
        return undefined;
    }

    async checkEmailDuplication(email: string) {
        await getApiAuthDuplicationEmail({query: {email}});
    }

    async requestEmailVerification(email: string) {
        await postApiAuthEmailVerification({body: {email}});
    }

    async verifyEmailCode(email: string, code: string) {
        await getApiAuthEmailVerification({query: {email, code}});
    }

    async checkNicknameDuplication(nickname: string) {
        await getApiAuthDuplicationNickname({query: {nickname}});
    }

    async refreshToken(refreshToken: string) {
        const {data} = await postApiAuthTokenRefresh({body: {refreshToken}});
        if (data) {
            return data.payload;
        }
        return undefined;
    }
}

export const authService = new AuthService();
