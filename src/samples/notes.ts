import type {DataEntry} from '../types/DataEntry'
import {generateId} from "../utils/Id.ts";

export default function notesDataSample() {
    return dataSample1()
}

// Page 24
export function dataSample1(): DataEntry[] {
    return [
        {id: generateId(), name: 'P1', duration: 8, enterTime: 0},
        {id: generateId(), name: 'P2', duration: 4, enterTime: 1},
        {id: generateId(), name: 'P3', duration: 9, enterTime: 2},
        {id: generateId(), name: 'P4', duration: 5, enterTime: 3},
    ]
}
