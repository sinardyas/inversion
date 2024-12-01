import { Router } from "express";
import type * as controllers from "../controllers";

export const ApiRouter = (
    healthCheckController: controllers.HealthCheckController
): Router => {
    const apiV1Router = Router();

    apiV1Router.get('/ping', healthCheckController.invoke.bind(healthCheckController) as any);

    return apiV1Router;
}