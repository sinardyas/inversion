import type { IUuidGenerator } from "../../domain/IUuidGenerator";
import { v4 as uuidV4 } from "uuid";

export class UuidGenerator implements IUuidGenerator {
    private uuid: typeof uuidV4;

    constructor() {
        this.uuid = uuidV4;
    }

    public generate(): string {
        return this.uuid();
    }
}