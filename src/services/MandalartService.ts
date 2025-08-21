import axiosInstance from "@/api/client/axios";
import type {
  GeminiObjectiveResponse,
  GeminiSubjectResponse,
  Mandalart,
  MandalartDetailResponse,
  MandalartRequest,
  Page,
} from "@/types/mandalart";

class MandalartService {
  async getMandalarts(
    page?: string,
    size?: string
  ): Promise<Page<Mandalart> | undefined> {
    // NOTE: 백엔드가 목록 응답을 단순화(name, subject, status)한 경우에도
    // Mandalart 타입(중첩 구조)와 달라 캐스팅이 필요할 수 있으므로
    // 호출부에서 필요한 형태로 narrowing / 변환하여 사용.
    const pageNumber = page ?? "0";
    const pageSize = size ?? "5";
    const { data } = await axiosInstance.get<{ payload: Page<Mandalart> }>(
      "/mandalart",
      {
        params: { number: pageNumber, size: pageSize },
      }
    );
    return data.payload;
  }

  async createMandalart(
    payload: MandalartRequest
  ): Promise<MandalartDetailResponse | undefined> {
    const { data } = await axiosInstance.post<{
      payload: MandalartDetailResponse;
    }>("/mandalart", payload);
    return data.payload;
  }

  async getMandalartDetail(
    mandalartId: string
  ): Promise<MandalartDetailResponse | undefined> {
    const { data } = await axiosInstance.get<{
      payload: MandalartDetailResponse;
    }>(`/mandalart/${mandalartId}`);
    return data.payload;
  }

  async updateMandalartName(
    mandalartId: string,
    mandalartName: string
  ): Promise<void> {
    await axiosInstance.patch(`/mandalart/name/${mandalartId}`, {
      mandalartName,
    });
  }

  async updateSubject(
    subjectId: string,
    subject?: string,
    status?: string
  ): Promise<void> {
    await axiosInstance.patch(`/mandalart/subject/${subjectId}`, {
      subject,
      status,
    });
  }

  async updateObjective(
    objectiveId: string,
    objective?: string,
    status?: string
  ): Promise<void> {
    await axiosInstance.patch(`/mandalart/objective/${objectiveId}`, {
      objective,
      status,
    });
  }

  async updateAction(
    actionId: string,
    action?: string,
    status?: string
  ): Promise<void> {
    await axiosInstance.patch(`/mandalart/action/${actionId}`, {
      action,
      status,
    });
  }

  async deleteMandalart(mandalartId: string): Promise<void> {
    await axiosInstance.delete(`/mandalart/${mandalartId}`);
  }

  async generateGeminiSubject(
    subject: string
  ): Promise<GeminiSubjectResponse | undefined> {
    const { data } = await axiosInstance.post<{
      payload: GeminiSubjectResponse;
    }>("/gemini/subject", { subject });
    return data.payload;
  }

  async generateGeminiObjective(
    objective: string
  ): Promise<GeminiObjectiveResponse | undefined> {
    const { data } = await axiosInstance.post<{
      payload: GeminiObjectiveResponse;
    }>("/gemini/objective", { objective });
    return data.payload;
  }
}

export const mandalartService = new MandalartService();
