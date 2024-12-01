import type { IUuidGenerator } from "../../../shared/domain/IUuidGenerator";

type HealthCheckResponse = {
    reqId: string;
    success: boolean;
    date: string;
}

export class HealthCheckService {
    constructor(private uuidGenerator: IUuidGenerator) {}

    public async invoke(): Promise<HealthCheckResponse> {
        return {
            reqId: this.uuidGenerator.generate(),
            success: true,
            date: new Date().toISOString()
        }
    }
}