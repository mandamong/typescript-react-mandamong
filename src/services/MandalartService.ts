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
  const body: Record<string, any> = {};
  if (subject !== undefined) body.subject = subject;
  if (status !== undefined) body.status = status;
  await axiosInstance.patch(`/mandalart/subject/${subjectId}`, body);
  }

  async updateObjective(
    objectiveId: string,
    objective?: string,
    status?: string
  ): Promise<void> {
  const body: Record<string, any> = {};
  if (objective !== undefined) body.objective = objective;
  if (status !== undefined) body.status = status;
  await axiosInstance.patch(`/mandalart/objective/${objectiveId}`, body);
  }

  async updateAction(
    actionId: string,
    action?: string,
    status?: string
  ): Promise<void> {
  const body: Record<string, any> = {};
  if (action !== undefined) body.action = action;
  if (status !== undefined) body.status = status;
  await axiosInstance.patch(`/mandalart/action/${actionId}`, body);
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
