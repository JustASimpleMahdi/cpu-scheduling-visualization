import type {AlgorithmState} from '../types/Base'
import type {DataEntry} from '../types/DataEntry'
import type {GuantEntry} from '../types/GuantEntry'
import type {Queue} from '../types/Queue'
import {getRandomColorByName} from '../utils/Color'
import type Process from "../types/Process.ts";
import {generateId} from "../utils/Id.ts";

export default function NP_LCFS(data: DataEntry[]): AlgorithmState[] {
    const dataSortedByEnterTime = [...data].sort((a, b) => (a.enterTime ?? 0) - (b.enterTime ?? 0))
    const processes: Process[] = dataSortedByEnterTime.map((entry) => ({
        data: entry,
        startTime: null,
        endTime: null,
        remainingTime: entry.duration,
    }))

    const guantData: GuantEntry[] = []
    const stack: Queue[] = []
    let currentTime = 0
    let currentProcess: Process | null = null

    const states: AlgorithmState[] = []

    function addCurrentState(): void {
        states.push({
            guant: [...guantData],
            queue: [...stack],
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

    function addEntryToGuant(entry: DataEntry) {
        guantData.push({
            type: 'Process',
            id: generateId(),
            data: entry,
            color: getRandomColorByName(entry.id),
        })
    }

    function addProcessToStack(process: Process) {
        stack.push({
            type: 'Queue',
            id: generateId(),
            process,
            color: getRandomColorByName(process.data.id),
        })
    }

    addCurrentState()


    while (processes.length || stack.length || currentProcess) {
        // TODO: Simplify without if currentProcess?
        if (currentProcess) {
            // add gap before process
            if (currentProcess.data.enterTime > currentTime) {
                addGapToGuant(currentProcess.data.enterTime - currentTime)
                currentTime = currentProcess.data.enterTime
            }

            // run process (for first time)
            if (currentProcess.startTime === null) {
                currentProcess.startTime = currentTime
                addEntryToGuant(currentProcess.data)
                addCurrentState()
            }

            if (processes.length) {
                if (processes[0].data.enterTime < currentTime + currentProcess.remainingTime) {
                    const process = processes.shift()!;

                    const runTime = process.data.enterTime - currentTime
                    currentTime += runTime
                    currentProcess.remainingTime -= runTime

                    addProcessToStack(process)
                    addCurrentState()
                    continue
                }
            }

            // process is done.
            currentTime += currentProcess.remainingTime
            currentProcess.endTime = currentTime
            currentProcess = null
            addCurrentState()
            continue
        }
        if (!stack.length) {
            currentProcess = processes.shift()!
        } else {
            currentProcess = stack.pop()!.process
        }

    }

    return states
}
