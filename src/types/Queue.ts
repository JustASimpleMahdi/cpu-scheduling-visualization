import type Process from "./Process.ts";

export interface Queue {
    type: 'Queue'
    id: string
    process: Process
    color: string
}
