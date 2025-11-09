import type {DataEntry} from "./DataEntry.ts";

export interface Process {
    type: 'Process'
    id: string
    duration: number,
    data: DataEntry
    options?: GauntItemOptions
}

export interface EnterTimeGap {
    type: 'EnterTimeGap'
    id: string
    duration: number
    options?: GauntItemOptions
}

export interface SwitchContext {
    type: 'SwitchContext'
    id: string
    duration: number
    options?: GauntItemOptions
}

export interface GauntItemOptions {
    color?: string
}

export type GuantEntry = (Process | EnterTimeGap | SwitchContext)