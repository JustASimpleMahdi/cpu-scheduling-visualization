import type {DataEntry} from './DataEntry'

export interface Process {
    type: 'Process'
    id: string
    data: DataEntry
    color: string
}

export interface EnterTimeGap {
    type: 'EnterTimeGap'
    id: string
    duration: number
}

export type GuantEntry = Process | EnterTimeGap
