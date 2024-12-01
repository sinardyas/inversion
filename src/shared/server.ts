import express from "express";
import type * as http from "node:http";
import type { ServerLogger } from "./infrastructure/logger";
import type { Configuration } from "config";

export class Server {
    private readonly express: express.Application;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    private http: http.Server | any;

    constructor(
        private router: express.Router,
        private logger: ServerLogger,
        private config: Configuration
    ) {
        this.express = express();
        this.express.use(this.logger.stream())
        this.express.use(this.router);
    }

    public start = async () => {
        return await new Promise<void>((resolve) => {
            this.http = this.express.listen(this.config.PORT, () => {
                const { port } = this.http.address();
                this.logger.info(`🚀 Application ${this.config.APP_NAME} running on PORT ${port}`);
                resolve();
            })
        })
    }

    public stop = async () => {
        this.logger.info('Stopping http server...');
        await this.http.close();
    }

    public invoke = (): express.Application => this.express;
}