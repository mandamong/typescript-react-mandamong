import type {
  PostApiAuthBasicData,
  PostApiAuthBasicLoginResponse,
  PostApiAuthTokenRefreshResponse,
  PostApiAuthBasicResponse,
} from '@/api/types.gen';

export type SignUpRequest = PostApiAuthBasicData['body'];
export type SignUpResponse = PostApiAuthBasicResponse['201']['payload'];
export type LoginResponse = PostApiAuthBasicLoginResponse['200']['payload'];
export type RefreshTokenResponse = PostApiAuthTokenRefreshResponse['200'];
