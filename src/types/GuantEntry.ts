import type {DataEntry} from './DataEntry'

export interface Process {
    type: 'Process'
    data: DataEntry
    color: string
}

export interface EnterTimeGap {
    type: 'EnterTimeGap'
    duration: number
}

export type GuantEntry = Process | EnterTimeGap
