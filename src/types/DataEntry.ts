export default interface DataEntry {
    id: number
    name: string
    duration: number
    enterTime: number | undefined
    color: string
}

export interface NewDataEntry {
    name: string
    duration: number
    enterTime: number | undefined
}
