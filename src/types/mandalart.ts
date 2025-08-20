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

export interface Page<T> {
  totalPage: number;
  hasNext: boolean;
  content: T[];
}
