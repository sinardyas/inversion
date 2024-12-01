import type { Request, Response } from "express";
import type { HealthCheckService } from "../../../application";

export class HealthCheckController {
    constructor(private healthCheckService: HealthCheckService) {}

    public async invoke(req: Request, res: Response): Promise<Response> {
        console.log('> req | health-check.controller.ts line 9', { req })
        return res.json(await this.healthCheckService.invoke());
    }
}