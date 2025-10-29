import type {DataEntry} from "./DataEntry.ts";

export default interface Process {
    data: DataEntry
    startTime: number | null,
    endTime: number | null,
    remainingTime: number,
}
