import type {DataEntry} from '../types/DataEntry'

export default function dataSample() {
    return dataSample6()
}

export function dataSample7(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 4, enterTime: 0},
        {id: 2, name: 'B', duration: 1, enterTime: 1},
        {id: 3, name: 'C', duration: 2, enterTime: 2},
        {id: 4, name: 'D', duration: 2, enterTime: 3},
        {id: 5, name: 'E', duration: 8, enterTime: 2},
    ]
}

export function dataSample6(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 4, enterTime: 0},
        {id: 2, name: 'B', duration: 1, enterTime: 1},
        {id: 3, name: 'C', duration: 2, enterTime: 2},
        {id: 4, name: 'D', duration: 2, enterTime: 3},
    ]
}

export function dataSample5(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 1, enterTime: 0},
        {id: 2, name: 'B', duration: 1, enterTime: 0},
        {id: 3, name: 'C', duration: 2, enterTime: 1},
        {id: 4, name: 'D', duration: 2, enterTime: 1},
    ]
}

export function dataSample4(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 1, enterTime: 0},
        {id: 2, name: 'B', duration: 1, enterTime: 0},
    ]
}

export function dataSample3(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 1, enterTime: 2},
        {id: 2, name: 'B', duration: 1, enterTime: 4},
    ]
}

export function dataSample2(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 1, enterTime: 2},
        {id: 2, name: 'B', duration: 1, enterTime: 3},
    ]
}

export function dataSample1(): DataEntry[] {
    return [
        {id: 1, name: 'A', duration: 1, enterTime: 0},
        {id: 2, name: 'B', duration: 1, enterTime: 1},
        {id: 3, name: 'C', duration: 1, enterTime: 2},
    ]
}
