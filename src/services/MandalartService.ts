import {
    deleteApiMandalartByMandalartId,
    getApiMandalart,
    getApiMandalartByMandalartId,
    patchApiMandalartActionByActionId,
    patchApiMandalartNameByMandalartId,
    patchApiMandalartObjectiveByObjectiveId,
    patchApiMandalartSubjectBySubjectId,
    postApiGeminiObjective,
    postApiGeminiSubject,
    postApiMandalart,
} from '@/api/sdk.gen';


const buildUpdatePayload = (name?: string, status?: string) => {
    const payload: Record<string, string> = {};
    if (name !== undefined) payload.updated = name;
    if (status !== undefined) payload.status = status;
    return payload;
};

class MandalartService {
    async getMandalarts(page?: string, size?: string) {
        const {data} = await getApiMandalart({query: {number: page, size}});
        return data?.payload;
    }

    async createMandalart(payload: {
        name: string;
        subject: string;
        objectives: string[];
        actions: string[][];
    }) {
        const {data} = await postApiMandalart({
            body: {
                name: payload.name,
                subject: payload.subject,
                objectives: payload.objectives,
                actions: payload.actions,
            },
        });
        return data?.payload;
    }

    async getMandalartDetail(mandalartId: string) {
        const {data} = await getApiMandalartByMandalartId({path: {mandalartId}});
        return data?.payload;
    }

    async updateMandalartName(mandalartId: string, updated: string) {
        const {data} = await patchApiMandalartNameByMandalartId({
            path: {mandalartId},
            body: {updated},
        });
        return data?.payload;
    }

    async updateSubject(subjectId: string, name?: string, status?: string) {
        interface UpdatePayload {
            updated: string;
            status?: string;
        }

        const body: UpdatePayload = {updated: name || ''};
        if (status !== undefined) body.status = status;
        const {data} = await patchApiMandalartSubjectBySubjectId({
            path: {subjectId},
            body: body,
        });
        return data?.payload;
    }

    async updateObjective(objectiveId: string, name?: string, status?: string) {
        interface UpdatePayload {
            updated: string;
            status?: string;
        }

        const body: UpdatePayload = {updated: name || ''};
        if (status !== undefined) body.status = status;
        const {data} = await patchApiMandalartObjectiveByObjectiveId({
            path: {objectiveId},
            body: body,
        });
        return data?.payload;
    }

    async updateAction(actionId: string, name?: string, status?: string) {
        const {data} = await patchApiMandalartActionByActionId({
            path: {actionId},
            body: buildUpdatePayload(name, status),
        });
        return data;
    }

    async deleteMandalart(mandalartId: string) {
        await deleteApiMandalartByMandalartId({path: {mandalartId}});
    }

    async generateGeminiSubject(subject: string) {
        const {data} = await postApiGeminiSubject({body: {prompt: subject}});
        return data?.payload;
    }

    async generateGeminiObjective(objective: string) {
        const {data} = await postApiGeminiObjective({body: {prompt: objective}});
        return data?.payload;
    }
}

export const mandalartService = new MandalartService();
