import type { GuantEntry } from './GuantEntry'
import type { Queue } from './Queue'

export interface AlgorithmState {
    guant: GuantEntry[]
    queue: Queue[]
    currentTime: number
}
