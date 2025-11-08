import type {AlgorithmState} from '../types/Base'
import type {DataEntry} from '../types/DataEntry'
import type {GuantEntry} from '../types/GuantEntry'
import type {Queue} from '../types/Queue'
import {getRandomColorByName} from '../utils/Color'
import type Process from "../types/Process.ts";
import {generateId} from "../utils/Id.ts";
import {deepClone} from "../utils/Base.ts";

export default function P_LCFS(data: DataEntry[]): AlgorithmState[] {
    const dataSortedByEnterTime = [...data].sort((a, b) => (a.enterTime ?? 0) - (b.enterTime ?? 0))
    const processes: Process[] = dataSortedByEnterTime.map((entry) => ({
        data: entry,
        time: {
            total: {
                start: null,
                end: null,
            },
            start: null,
            end: null,
            remaining: entry.duration
        },
    }))

    const guantData: GuantEntry[] = []
    const queueData: Queue[] = []
    const stack: Process[] = []
    let currentTime = 0
    let currentProcess: Process | null = null

    const states: AlgorithmState[] = []

    function addCurrentState(): void {
        states.push({
            guant: deepClone(guantData),
            queue: deepClone(queueData),
            currentTime,
        })
    }

    function addGapToGuant(duration: number) {
        guantData.push({
            type: 'EnterTimeGap',
            id: generateId(),
            duration,
        })
    }

    function addEntryToGuant({data, duration}: { duration: number, data: DataEntry }) {
        guantData.push({
            type: 'Process',
            id: generateId(),
            duration: duration,
            data: data,
            options: {
                color: getRandomColorByName(data.id),
            },
        })
    }

    function addEntryToQueue({data, duration}: { duration: number; data: DataEntry }) {
        queueData.push({
            id: generateId(),
            duration: duration,
            data: data,
            options: {
                color: getRandomColorByName(data.id),
            }
        })
    }

    function popStack() {
        if (!stack.length) return null
        queueData.pop()
        return stack.pop()!
    }

    function pushStack(process: Process) {
        stack.push(process)
        addEntryToQueue({duration: process.time.remaining, data: process.data})
    }

    addCurrentState()


    while (processes.length || stack.length || currentProcess) {
        if (!currentProcess) {
            currentProcess = stack.length ? popStack()! : processes.shift()!;
        }
        // add gap before process
        if (currentProcess.data.enterTime > currentTime) {
            addGapToGuant(currentProcess.data.enterTime - currentTime)
            currentTime = currentProcess.data.enterTime
        }

        if (currentProcess.time.start === null) {
            currentProcess.time.start = currentTime
        }

        addEntryToGuant({data: currentProcess.data, duration: currentProcess.time.remaining})
        addCurrentState()


        if (processes.length && processes[0].data.enterTime < currentTime + currentProcess.time.remaining) {
            const process = processes.shift()!;

            const runTime = process.data.enterTime - currentTime
            currentTime += runTime
            currentProcess.time.remaining -= runTime

            pushStack(currentProcess)
            guantData.at(-1)!.duration = runTime
            if (!guantData.at(-1)!.duration) {
                guantData.pop()
            }

            currentProcess = process
            continue
        }


        // process is done.
        currentTime += currentProcess.time.remaining
        currentProcess.time.remaining = 0
        currentProcess.time.end = currentTime
        currentProcess = null
        addCurrentState()
    }

    return states
}
