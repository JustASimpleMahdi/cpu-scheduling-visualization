import type {DataEntry} from "./DataEntry.ts";

export default interface Process {
    data: DataEntry
    time: {
        start: number | null
        end: number | null
        remaining: number
    }
}
