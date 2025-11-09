import type {DataEntry} from "../types/DataEntry.ts";
import type {AlgorithmState} from "../types/Base.ts";
import type Process from "../types/Process.ts";
import {deepClone} from "../utils/Base.ts";
import type {GuantEntry} from "../types/GuantEntry.ts";
import type {Queue} from "../types/Queue.ts";
import {generateId} from "../utils/Id.ts";
import {getRandomColorByName} from "../utils/Color.ts";

export default abstract class Algorithm {
    protected processes: Process[];

    protected guantData: GuantEntry[] = []
    protected queueData: Queue[] = []

    protected currentTime = 0
    protected currentProcess: Process | null = null

    protected queue: Process[] = []
    protected states: AlgorithmState[] = []

    constructor(public data: DataEntry[], public options: AlgorithmOptions | undefined) {
        this.processes = this.sortedDataByEnterTime.map((entry) => ({
            data: entry,
            time: {
                start: null,
                end: null,
                remaining: entry.duration
            }
        }))
    }

    get sortedDataByEnterTime() {
        return deepClone(this.data).sort((a, b) => (a.enterTime ?? 0) - (b.enterTime ?? 0))
    }

    public abstract run(): AlgorithmState[];

    protected addCurrentState(): void {
        this.states.push(this.getCurrentState())
    }

    protected getCurrentState() {
        return {
            guant: deepClone(this.guantData),
            queue: deepClone(this.queueData),
            currentTime: this.currentTime,
        }
    }

    protected addGapToGuant(duration: number) {
        this.guantData.push({
            type: 'EnterTimeGap',
            id: generateId(),
            duration,
        })
    }

    protected addEntryToGuant({data, duration}: { duration: number, data: DataEntry }) {
        if (this.options?.switchContext && this.guantData.filter(entry => entry.type === "Process").length !== 0) {
            this.guantData.push({
                type: 'SwitchContext',
                id: generateId(),
                duration: this.options.switchContext
            })
            this.currentTime += this.options.switchContext
        }
        this.guantData.push({
            type: 'Process',
            id: generateId(),
            duration: duration,
            data: data,
            options: {
                color: getRandomColorByName(data.id),
            },
        })
    }

    protected addEntryToQueue({data, duration}: { duration: number; data: DataEntry }) {
        this.queueData.push({
            id: generateId(),
            duration: duration,
            data: data,
            options: {
                color: getRandomColorByName(data.id),
            }
        })
    }

    protected popGuantEntry() {
        this.guantData.pop()
        if (this.guantData.at(-1)?.type === 'SwitchContext') {
            const {duration} = this.guantData.pop()
            this.currentTime -= duration
        }
    }

    protected pushQueue(process: Process) {
        this.addEntryToQueue({duration: process.time.remaining, data: process.data})
        this.queue.push(process)
    }

    protected popQueue() {
        if (!this.queue.length) return null
        this.queueData.pop()
        return this.queue.pop()!
    }


    protected shiftQueue() {
        if (!this.queue.length) return null
        this.queueData.shift()
        return this.queue.shift()!
    }
}

export interface AlgorithmOptions {
    switchContext: number | undefined
}