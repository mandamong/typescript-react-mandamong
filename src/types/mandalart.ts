import type {
    GetApiMandalartByMandalartIdResponse,
    GetApiMandalartResponse,
    PostApiGeminiObjectiveResponse,
    PostApiGeminiSubjectResponse,
    PostApiMandalartData,
} from '@/api/types.gen';

export type GeminiSubjectResponse = PostApiGeminiSubjectResponse['payload'];
export type GeminiObjectiveResponse = PostApiGeminiObjectiveResponse['payload'];

export type Mandalart = GetApiMandalartResponse['payload']['content'][0];
export type MandalartDetailResponse = GetApiMandalartByMandalartIdResponse['payload'];
export type MandalartRequest = PostApiMandalartData['body'];

// This is not defined in the generated types, so I'll define it here based on usage
export interface Page<T> {
  totalPage: number;
  hasNext: boolean;
  content: T[];
}
