import type { Configuration } from "config";
import { Container } from "../src/shared/container";
import type { Server } from "../src/shared/server";

const container = new Container();
const server = container.invoke().resolve<Server>('server');
const config = container.invoke().resolve<Configuration>('config');

server
    .start()
    .then(() => {
        console.log(`Environment: ${config.NODE_ENV}`);
        console.log(`Log level: ${config.APP_LOG_LEVEL}`);
    })
    .catch((err: Error) => {
        console.log(err);
        process.exit(1);
    });