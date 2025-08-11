export interface ApiResponse<T> {
    success: boolean;
    payload: T | null;
    error: ApiError | null;
}

export interface ApiError {
    code: string;
    message: string;
}
