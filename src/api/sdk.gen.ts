

import { formDataBodySerializer, type Client, type Options as ClientOptions, type TDataShape } from './client';
import { client as _heyApiClient } from './client.gen';
import type {
    DeleteApiAuthBasicData,
    DeleteApiAuthBasicResponses,
    DeleteApiMandalartByMandalartIdData,
    DeleteApiMandalartByMandalartIdResponses,
    GetApiAuthDuplicationEmailData,
    GetApiAuthDuplicationEmailErrors,
    GetApiAuthDuplicationEmailResponses,
    GetApiAuthDuplicationNicknameData,
    GetApiAuthDuplicationNicknameErrors,
    GetApiAuthDuplicationNicknameResponses,
    GetApiAuthEmailVerificationData,
    GetApiAuthEmailVerificationErrors,
    GetApiAuthEmailVerificationResponses,
    GetApiMandalartByMandalartIdData,
    GetApiMandalartByMandalartIdResponses,
    GetApiMandalartData,
    GetApiMandalartResponses,
    PatchApiMandalartActionByActionIdData,
    PatchApiMandalartActionByActionIdResponses,
    PatchApiMandalartNameByMandalartIdData,
    PatchApiMandalartNameByMandalartIdResponses,
    PatchApiMandalartObjectiveByObjectiveIdData,
    PatchApiMandalartObjectiveByObjectiveIdResponses,
    PatchApiMandalartSubjectBySubjectIdData,
    PatchApiMandalartSubjectBySubjectIdResponses,
    PatchApiUserNicknameData,
    PatchApiUserNicknameResponses,
    PatchApiUserPasswordData,
    PatchApiUserPasswordInitializeData,
    PatchApiUserPasswordInitializeResponses,
    PatchApiUserPasswordResponses,
    PostApiAuthBasicData,
    PostApiAuthBasicErrors,
    PostApiAuthBasicLoginData,
    PostApiAuthBasicLoginResponses,
    PostApiAuthBasicResponses,
    PostApiAuthEmailVerificationData,
    PostApiAuthEmailVerificationResponses,
    PostApiAuthLogoutData,
    PostApiAuthLogoutResponses,
    PostApiAuthTokenRefreshData,
    PostApiAuthTokenRefreshResponses,
    PostApiGeminiObjectiveData,
    PostApiGeminiObjectiveResponses,
    PostApiGeminiSubjectData,
    PostApiGeminiSubjectResponses,
    PostApiMandalartData,
    PostApiMandalartResponses,
    PostApiUserPasswordData,
    PostApiUserPasswordResponses
} from './types.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> =
    ClientOptions<TData, ThrowOnError>
    & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * 닉네임 중복 검증
 */
export const getApiAuthDuplicationNickname = <ThrowOnError extends boolean = false>(options: Options<GetApiAuthDuplicationNicknameData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetApiAuthDuplicationNicknameResponses, GetApiAuthDuplicationNicknameErrors, ThrowOnError>({
        url: '/api/auth/duplication/nickname',
        ...options
    });
};

/**
 * 이메일 중복 검증
 */
export const getApiAuthDuplicationEmail = <ThrowOnError extends boolean = false>(options: Options<GetApiAuthDuplicationEmailData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetApiAuthDuplicationEmailResponses, GetApiAuthDuplicationEmailErrors, ThrowOnError>({
        url: '/api/auth/duplication/email',
        ...options
    });
};

/**
 * 이메일 검증
 */
export const getApiAuthEmailVerification = <ThrowOnError extends boolean = false>(options: Options<GetApiAuthEmailVerificationData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetApiAuthEmailVerificationResponses, GetApiAuthEmailVerificationErrors, ThrowOnError>({
        url: '/api/auth/email/verification',
        ...options
    });
};

/**
 * 이메일 인증 요청
 */
export const postApiAuthEmailVerification = <ThrowOnError extends boolean = false>(options?: Options<PostApiAuthEmailVerificationData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiAuthEmailVerificationResponses, unknown, ThrowOnError>({
        url: '/api/auth/email/verification',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 탈퇴
 */
export const deleteApiAuthBasic = <ThrowOnError extends boolean = false>(options?: Options<DeleteApiAuthBasicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).delete<DeleteApiAuthBasicResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/auth/basic',
        ...options
    });
};

/**
 * 기본 회원가입
 */
export const postApiAuthBasic = <ThrowOnError extends boolean = false>(options?: Options<PostApiAuthBasicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiAuthBasicResponses, PostApiAuthBasicErrors, ThrowOnError>({
        ...formDataBodySerializer,
        url: '/api/auth/basic',
        ...options,
        headers: {
            'Content-Type': null,
            ...options?.headers
        }
    });
};

/**
 * 로그인
 */
export const postApiAuthBasicLogin = <ThrowOnError extends boolean = false>(options?: Options<PostApiAuthBasicLoginData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiAuthBasicLoginResponses, unknown, ThrowOnError>({
        url: '/api/auth/basic/login',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * AT 갱신 (RTR)
 */
export const postApiAuthTokenRefresh = <ThrowOnError extends boolean = false>(options?: Options<PostApiAuthTokenRefreshData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiAuthTokenRefreshResponses, unknown, ThrowOnError>({
        url: '/api/auth/token/refresh',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 주제 입력으로 목표, 행동 생성
 */
export const postApiGeminiSubject = <ThrowOnError extends boolean = false>(options?: Options<PostApiGeminiSubjectData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiGeminiSubjectResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/gemini/subject',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 목표 입력으로 행동 생성
 */
export const postApiGeminiObjective = <ThrowOnError extends boolean = false>(options?: Options<PostApiGeminiObjectiveData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiGeminiObjectiveResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/gemini/objective',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 만다르트 표 다건 조회
 */
export const getApiMandalart = <ThrowOnError extends boolean = false>(options?: Options<GetApiMandalartData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetApiMandalartResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart',
        ...options
    });
};

/**
 * 만다르트 표 저장
 */
export const postApiMandalart = <ThrowOnError extends boolean = false>(options?: Options<PostApiMandalartData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiMandalartResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 만다르트 이름 수정
 */
export const patchApiMandalartNameByMandalartId = <ThrowOnError extends boolean = false>(options: Options<PatchApiMandalartNameByMandalartIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<PatchApiMandalartNameByMandalartIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/name/{mandalartId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
};

/**
 * 만다르트 주제 수정
 */
export const patchApiMandalartSubjectBySubjectId = <ThrowOnError extends boolean = false>(options: Options<PatchApiMandalartSubjectBySubjectIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<PatchApiMandalartSubjectBySubjectIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/subject/{subjectId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
};

/**
 * 만다라트 목표 수정
 */
export const patchApiMandalartObjectiveByObjectiveId = <ThrowOnError extends boolean = false>(options: Options<PatchApiMandalartObjectiveByObjectiveIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<PatchApiMandalartObjectiveByObjectiveIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/objective/{objectiveId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
};

/**
 * 만다르트 행동 상태 수정
 */
export const patchApiMandalartActionByActionId = <ThrowOnError extends boolean = false>(options: Options<PatchApiMandalartActionByActionIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<PatchApiMandalartActionByActionIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/action/{actionId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
};

/**
 * 만다르트 표 삭제
 */
export const deleteApiMandalartByMandalartId = <ThrowOnError extends boolean = false>(options: Options<DeleteApiMandalartByMandalartIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteApiMandalartByMandalartIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/{mandalartId}',
        ...options
    });
};

/**
 * 만다르트 표 단건 조회
 */
export const getApiMandalartByMandalartId = <ThrowOnError extends boolean = false>(options: Options<GetApiMandalartByMandalartIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetApiMandalartByMandalartIdResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/mandalart/{mandalartId}',
        ...options
    });
};

/**
 * 닉네임 변경
 */
export const patchApiUserNickname = <ThrowOnError extends boolean = false>(options?: Options<PatchApiUserNicknameData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).patch<PatchApiUserNicknameResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 비밀번호 변경
 */
export const patchApiUserPassword = <ThrowOnError extends boolean = false>(options?: Options<PatchApiUserPasswordData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).patch<PatchApiUserPasswordResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 비밀번호 검증
 */
export const postApiUserPassword = <ThrowOnError extends boolean = false>(options?: Options<PostApiUserPasswordData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiUserPasswordResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * 비밀번호 초기화
 */
export const patchApiUserPasswordInitialize = <ThrowOnError extends boolean = false>(options?: Options<PatchApiUserPasswordInitializeData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).patch<PatchApiUserPasswordInitializeResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/user/password/initialize',
        ...options
    });
};

/**
 * 로그아웃
 */
export const postApiAuthLogout = <ThrowOnError extends boolean = false>(options?: Options<PostApiAuthLogoutData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostApiAuthLogoutResponses, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/auth/logout',
        ...options
    });
};
