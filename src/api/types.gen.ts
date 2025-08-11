

export type GetApiAuthDuplicationNicknameData = {
    body?: never;
    path?: never;
    query: {
        nickname: string;
    };
    url: '/api/auth/duplication/nickname';
};

export type GetApiAuthDuplicationNicknameErrors = {
    409: {
        success: boolean;
        payload: unknown;
        error: {
            code: string;
            message: string;
        };
    };
};

export type GetApiAuthDuplicationNicknameError = GetApiAuthDuplicationNicknameErrors[keyof GetApiAuthDuplicationNicknameErrors];

export type GetApiAuthDuplicationNicknameResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type GetApiAuthDuplicationNicknameResponse = GetApiAuthDuplicationNicknameResponses[keyof GetApiAuthDuplicationNicknameResponses];

export type GetApiAuthDuplicationEmailData = {
    body?: never;
    path?: never;
    query: {
        email: string;
    };
    url: '/api/auth/duplication/email';
};

export type GetApiAuthDuplicationEmailErrors = {
    409: {
        success: boolean;
        payload: unknown;
        error: {
            code: string;
            message: string;
        };
    };
};

export type GetApiAuthDuplicationEmailError = GetApiAuthDuplicationEmailErrors[keyof GetApiAuthDuplicationEmailErrors];

export type GetApiAuthDuplicationEmailResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type GetApiAuthDuplicationEmailResponse = GetApiAuthDuplicationEmailResponses[keyof GetApiAuthDuplicationEmailResponses];

export type GetApiAuthEmailVerificationData = {
    body?: never;
    path?: never;
    query: {
        email: string;
        code: string;
    };
    url: '/api/auth/email/verification';
};

export type GetApiAuthEmailVerificationErrors = {
    401: {
        success: boolean;
        data: unknown;
        error: {
            code: string;
            message: string;
        };
    };
};

export type GetApiAuthEmailVerificationError = GetApiAuthEmailVerificationErrors[keyof GetApiAuthEmailVerificationErrors];

export type GetApiAuthEmailVerificationResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type GetApiAuthEmailVerificationResponse = GetApiAuthEmailVerificationResponses[keyof GetApiAuthEmailVerificationResponses];

export type PostApiAuthEmailVerificationData = {
    body?: {
        email: string;
    };
    path?: never;
    query?: never;
    url: '/api/auth/email/verification';
};

export type PostApiAuthEmailVerificationResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type PostApiAuthEmailVerificationResponse = PostApiAuthEmailVerificationResponses[keyof PostApiAuthEmailVerificationResponses];

export type DeleteApiAuthBasicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/auth/basic';
};

export type DeleteApiAuthBasicResponses = {
    204: void;
};

export type DeleteApiAuthBasicResponse = DeleteApiAuthBasicResponses[keyof DeleteApiAuthBasicResponses];

export type PostApiAuthBasicData = {
    body?: {
        email: string;
        password: string;
        nickname: string;
        image: Blob | File;
        language: string;
    };
    path?: never;
    query?: never;
    url: '/api/auth/basic';
};

export type PostApiAuthBasicErrors = {
    409: {
        success: boolean;
        payload: unknown;
        error: {
            code: string;
            message: string;
        };
    };
};

export type PostApiAuthBasicError = PostApiAuthBasicErrors[keyof PostApiAuthBasicErrors];

export type PostApiAuthBasicResponses = {
    201: {
        success: boolean;
        payload: {
            id: number;
            email: string;
            nickname: string;
            image: string;
            language: string;
            accessToken: string;
            refreshToken: string;
        };
        error: unknown;
    };
};

export type PostApiAuthBasicResponse = PostApiAuthBasicResponses[keyof PostApiAuthBasicResponses];

export type PostApiAuthBasicLoginData = {
    body?: {
        email: string;
        password: string;
    };
    path?: never;
    query?: never;
    url: '/api/auth/basic/login';
};

export type PostApiAuthBasicLoginResponses = {
    200: {
        success: boolean;
        payload: {
            id: number;
            email: string;
            nickname: string;
            image: string;
            language: string;
            accessToken: string;
            refreshToken: string;
        };
        error: unknown;
    };
};

export type PostApiAuthBasicLoginResponse = PostApiAuthBasicLoginResponses[keyof PostApiAuthBasicLoginResponses];

export type PostApiAuthTokenRefreshData = {
    body?: {
        refreshToken: string;
    };
    path?: never;
    query?: never;
    url: '/api/auth/token/refresh';
};

export type PostApiAuthTokenRefreshResponses = {
    200: {
        success: boolean;
        payload: {
            id: number;
            accessToken: string;
            refreshToken: string;
        };
        error: unknown;
    };
};

export type PostApiAuthTokenRefreshResponse = PostApiAuthTokenRefreshResponses[keyof PostApiAuthTokenRefreshResponses];

export type PostApiGeminiSubjectData = {
    body?: {
        prompt: string;
    };
    path?: never;
    query?: never;
    url: '/api/gemini/subject';
};

export type PostApiGeminiSubjectResponses = {
    200: {
        success: boolean;
        payload: {
            objectives: Array<string>;
            actions: Array<Array<string>>;
        };
        error: unknown;
    };
};

export type PostApiGeminiSubjectResponse = PostApiGeminiSubjectResponses[keyof PostApiGeminiSubjectResponses];

export type PostApiGeminiObjectiveData = {
    body?: {
        prompt: string;
    };
    path?: never;
    query?: never;
    url: '/api/gemini/objective';
};

export type PostApiGeminiObjectiveResponses = {
    200: {
        success: boolean;
        payload: {
            actions: Array<string>;
        };
        error: unknown;
    };
};

export type PostApiGeminiObjectiveResponse = PostApiGeminiObjectiveResponses[keyof PostApiGeminiObjectiveResponses];

export type GetApiMandalartData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * default=1 (1부터 시작)
         */
        number?: string;
        /**
         * default=5
         */
        size?: string;
    };
    url: '/api/mandalart';
};

export type GetApiMandalartResponses = {
    200: {
        success: boolean;
        payload: {
            totalPage: number;
            hasNext: boolean;
            content: Array<{
                mandalart: {
                    id: number;
                    name: string;
                    status: string;
                };
                subject: {
                    id: number;
                    name: string;
                    status: string;
                };
                objectives: Array<{
                    id: number;
                    name: string;
                    status: string;
                }>;
                actions: Array<Array<{
                    id: number;
                    name: string;
                    status: string;
                }>>;
            }>;
        };
        error: unknown;
    };
};

export type GetApiMandalartResponse = GetApiMandalartResponses[keyof GetApiMandalartResponses];

export type PostApiMandalartData = {
    body?: {
        name: string;
        subject: string;
        objectives: Array<string>;
        actions: Array<Array<string>>;
    };
    path?: never;
    query?: never;
    url: '/api/mandalart';
};

export type PostApiMandalartResponses = {
    200: {
        success: boolean;
        payload: {
            mandalart: {
                id: number;
                name: string;
            };
            subject: {
                id: number;
                name: string;
            };
            objectives: Array<{
                id: number;
                name: string;
            }>;
            actions: Array<Array<{
                id: number;
                name: string;
            }>>;
        };
        error: unknown;
    };
};

export type PostApiMandalartResponse = PostApiMandalartResponses[keyof PostApiMandalartResponses];

export type PatchApiMandalartNameByMandalartIdData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        mandalartId: string;
    };
    query?: never;
    url: '/api/mandalart/name/{mandalartId}';
};

export type PatchApiMandalartNameByMandalartIdResponses = {
    200: {
        success: boolean;
        payload: {
            id: number;
            name: string;
            status: string;
        };
        error: unknown;
    };
};

export type PatchApiMandalartNameByMandalartIdResponse = PatchApiMandalartNameByMandalartIdResponses[keyof PatchApiMandalartNameByMandalartIdResponses];

export type PatchApiMandalartSubjectBySubjectIdData = {
    body?: {
        updated: string;
    };
    path: {
        subjectId: string;
    };
    query?: never;
    url: '/api/mandalart/subject/{subjectId}';
};

export type PatchApiMandalartSubjectBySubjectIdResponses = {
    200: {
        success: boolean;
        payload: {
            id: number;
            name: string;
            status: string;
        };
        error: unknown;
    };
};

export type PatchApiMandalartSubjectBySubjectIdResponse = PatchApiMandalartSubjectBySubjectIdResponses[keyof PatchApiMandalartSubjectBySubjectIdResponses];

export type PatchApiMandalartObjectiveByObjectiveIdData = {
    body?: {
        updated: string;
    };
    path: {
        objectiveId: string;
    };
    query?: never;
    url: '/api/mandalart/objective/{objectiveId}';
};

export type PatchApiMandalartObjectiveByObjectiveIdResponses = {
    200: {
        success: boolean;
        payload: {
            id: number;
            name: string;
            status: string;
        };
        error: unknown;
    };
};

export type PatchApiMandalartObjectiveByObjectiveIdResponse = PatchApiMandalartObjectiveByObjectiveIdResponses[keyof PatchApiMandalartObjectiveByObjectiveIdResponses];

export type PatchApiMandalartActionByActionIdData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        actionId: string;
    };
    query?: never;
    url: '/api/mandalart/action/{actionId}';
};

export type PatchApiMandalartActionByActionIdResponses = {
    200: {
        [key: string]: unknown;
    };
};

export type PatchApiMandalartActionByActionIdResponse = PatchApiMandalartActionByActionIdResponses[keyof PatchApiMandalartActionByActionIdResponses];

export type DeleteApiMandalartByMandalartIdData = {
    body?: never;
    path: {
        mandalartId: string;
    };
    query?: never;
    url: '/api/mandalart/{mandalartId}';
};

export type DeleteApiMandalartByMandalartIdResponses = {
    204: void;
};

export type DeleteApiMandalartByMandalartIdResponse = DeleteApiMandalartByMandalartIdResponses[keyof DeleteApiMandalartByMandalartIdResponses];

export type GetApiMandalartByMandalartIdData = {
    body?: never;
    path: {
        mandalartId: string;
    };
    query?: never;
    url: '/api/mandalart/{mandalartId}';
};

export type GetApiMandalartByMandalartIdResponses = {
    200: {
        success: boolean;
        payload: {
            mandalart: {
                id: number;
                name: string;
            };
            subject: {
                id: number;
                name: string;
            };
            objectives: Array<{
                id: number;
                name: string;
            }>;
            actions: Array<Array<{
                id: number;
                name: string;
            }>>;
        };
        error: unknown;
    };
};

export type GetApiMandalartByMandalartIdResponse = GetApiMandalartByMandalartIdResponses[keyof GetApiMandalartByMandalartIdResponses];

export type PatchApiUserNicknameData = {
    body?: {
        updated: string;
    };
    path?: never;
    query?: never;
    url: '/api/user/nickname';
};

export type PatchApiUserNicknameResponses = {
    200: {
        success: boolean;
        payload: {
            updated: string;
        };
        error: unknown;
    };
};

export type PatchApiUserNicknameResponse = PatchApiUserNicknameResponses[keyof PatchApiUserNicknameResponses];

export type PatchApiUserPasswordData = {
    body?: {
        updated: string;
    };
    path?: never;
    query?: never;
    url: '/api/user/password';
};

export type PatchApiUserPasswordResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type PatchApiUserPasswordResponse = PatchApiUserPasswordResponses[keyof PatchApiUserPasswordResponses];

export type PostApiUserPasswordData = {
    body?: {
        password: string;
    };
    path?: never;
    query?: never;
    url: '/api/user/password';
};

export type PostApiUserPasswordResponses = {
    200: {
        success: boolean;
        payload: unknown;
        error: unknown;
    };
};

export type PostApiUserPasswordResponse = PostApiUserPasswordResponses[keyof PostApiUserPasswordResponses];

export type PatchApiUserPasswordInitializeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/user/password/initialize';
};

export type PatchApiUserPasswordInitializeResponses = {
    200: {
        success: boolean;
        payload: {
            updated: string;
        };
        error: unknown;
    };
};

export type PatchApiUserPasswordInitializeResponse = PatchApiUserPasswordInitializeResponses[keyof PatchApiUserPasswordInitializeResponses];

export type PostApiAuthLogoutData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/auth/logout';
};

export type PostApiAuthLogoutResponses = {
    204: void;
};

export type PostApiAuthLogoutResponse = PostApiAuthLogoutResponses[keyof PostApiAuthLogoutResponses];

export type ClientOptions = {
    baseUrl: string;
};
