import type {DataEntry} from "./DataEntry.ts";

export interface Queue {
    id: string
    duration: number
    data: DataEntry
    options?: {
        color: string
    }
}
