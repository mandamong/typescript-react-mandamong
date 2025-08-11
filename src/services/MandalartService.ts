import axiosInstance from '@/api/client/axios';
import type {
  Mandalart,
  MandalartDetailResponse,
  MandalartRequest,
  GeminiSubjectResponse,
  GeminiObjectiveResponse,
  Page,
} from '@/types/mandalart';

class MandalartService {
  async getMandalarts(page?: string, size?: string): Promise<Page<Mandalart> | undefined> {
    const { data } = await axiosInstance.get<{ payload: Page<Mandalart> }>('/mandalart', {
      params: { number: page, size },
    });
    return data.payload;
  }

  async createMandalart(payload: MandalartRequest): Promise<MandalartDetailResponse | undefined> {
    const { data } = await axiosInstance.post<{ payload: MandalartDetailResponse }>('/mandalart', payload);
    return data.payload;
  }

  async getMandalartDetail(mandalartId: string): Promise<MandalartDetailResponse | undefined> {
    const { data } = await axiosInstance.get<{ payload: MandalartDetailResponse }>(`/mandalart/${mandalartId}`);
    return data.payload;
  }

  async updateMandalartName(mandalartId: string, updated: string): Promise<void> {
    await axiosInstance.patch(`/mandalart/name/${mandalartId}`, { updated });
  }

  async updateSubject(subjectId: string, name?: string, status?: string): Promise<void> {
    await axiosInstance.patch(`/mandalart/subject/${subjectId}`, { updated: name, status });
  }

  async updateObjective(objectiveId: string, name?: string, status?: string): Promise<void> {
    await axiosInstance.patch(`/mandalart/objective/${objectiveId}`, { updated: name, status });
  }

  async updateAction(actionId: string, name?: string, status?: string): Promise<void> {
    await axiosInstance.patch(`/mandalart/action/${actionId}`, { updated: name, status });
  }

  async deleteMandalart(mandalartId: string): Promise<void> {
    await axiosInstance.delete(`/mandalart/${mandalartId}`);
  }

  async generateGeminiSubject(subject: string): Promise<GeminiSubjectResponse | undefined> {
    const { data } = await axiosInstance.post<{ payload: GeminiSubjectResponse }>('/gemini/subject', { prompt: subject });
    return data.payload;
  }

  async generateGeminiObjective(objective: string): Promise<GeminiObjectiveResponse | undefined> {
    const { data } = await axiosInstance.post<{ payload: GeminiObjectiveResponse }>('/gemini/objective', { prompt: objective });
    return data.payload;
  }
}

export const mandalartService = new MandalartService();
