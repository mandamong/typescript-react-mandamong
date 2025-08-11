import type {
  PostApiGeminiSubjectResponse,
  PostApiGeminiObjectiveResponse,
  GetApiMandalartResponse,
  PostApiMandalartResponse,
  GetApiMandalartByMandalartIdResponse,
  PostApiMandalartData,
} from '@/api/types.gen';

export type GeminiSubjectResponse = PostApiGeminiSubjectResponse['200']['payload'];
export type GeminiObjectiveResponse = PostApiGeminiObjectiveResponse['200']['payload'];

export type Mandalart = GetApiMandalartResponse['200']['payload']['content'][0];
export type MandalartDetailResponse = GetApiMandalartByMandalartIdResponse['200']['payload'];
export type MandalartRequest = PostApiMandalartData['body'];

// This is not defined in the generated types, so I'll define it here based on usage
export interface Page<T> {
  totalPage: number;
  hasNext: boolean;
  content: T[];
}
