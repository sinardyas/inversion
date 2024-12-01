import { ApiRouter } from "../api/infrastructure/express/router";
import { asClass, asFunction, asValue, type AwilixContainer, createContainer, InjectionMode } from "awilix";
import { UuidGenerator } from "./infrastructure/uuid";
import { HealthCheckController } from "../api/infrastructure/express/controllers/health-check.controller";
import { HealthCheckService } from "../api/application";
import { Server } from "./server";
import { Router } from "./router";
import { config } from "../../config";
import { ServerLogger } from "./infrastructure/logger";

export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({
            injectionMode: InjectionMode.CLASSIC
        });

        this.register();
    }

    public register(): void {
        this.container
            .register({
                server: asClass(Server).singleton(),
                config: asValue(config),
                router: asFunction(Router).singleton(),
                logger: asClass(ServerLogger).singleton(),
            })
            .register({
                apiRouter: asFunction(ApiRouter).singleton()
            })
            .register({
                uuidGenerator: asClass(UuidGenerator).singleton()
            })
            .register({
                healthCheckController: asClass(HealthCheckController).singleton(),
                healthCheckService: asClass(HealthCheckService).singleton()
            });
    }

    public invoke(): AwilixContainer {
        return this.container;
    }
}