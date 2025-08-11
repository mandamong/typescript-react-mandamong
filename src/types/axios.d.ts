import { AxiosResponse as OriginalAxiosResponse, AxiosError as OriginalAxiosError } from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }

    export interface AxiosResponse<T = any, D = any> extends OriginalAxiosResponse<T, D> {}
    export interface AxiosError<T = unknown, D = any> extends OriginalAxiosError<T, D> {}
}