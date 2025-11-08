import Algorithm from "../Algorithm.ts";
import type {DataEntry} from "../../types/DataEntry.ts";

export default class RR extends Algorithm {
    protected availableProcessTime: number;

    constructor(data: DataEntry[], public quantum: number) {
        super(data);
    }

    public run() {
        this.addCurrentState()

        this.setAvailableProcessTime()
        while (this.processes.length || this.queue.length || this.currentProcess) {
            if (!this.currentProcess) {
                this.currentProcess = this.queue.length ? this.shiftQueue()! : this.processes.shift()!;
            }

            // add gap before process
            if (this.currentProcess.data.enterTime > this.currentTime) {
                this.addGapToGuant(this.currentProcess.data.enterTime - this.currentTime)
                this.currentTime = this.currentProcess.data.enterTime
            }

            // run process (for first time)
            if (this.currentProcess.time.start === null) {
                this.currentProcess.time.start = this.currentTime
            }
            this.addEntryToGuant({data: this.currentProcess.data, duration: this.currentProcess.time.remaining})
            this.addCurrentState()

            const addToQueue = this.processes.filter(process => process.data.enterTime < this.currentTime + Math.min(this.currentProcess.time.remaining, this.availableProcessTime))
            addToQueue.forEach((process) => {
                const runTime = process.data.enterTime - this.currentTime
                this.currentTime += runTime
                this.currentProcess.time.remaining -= runTime
                this.availableProcessTime -= runTime
                this.pushQueue(process)
                this.addCurrentState()
            })
            this.processes = this.processes.filter(process => !addToQueue.find(p => p.data.id === process.data.id))

            if (this.currentProcess.time.remaining > this.availableProcessTime) {
                this.currentTime += this.availableProcessTime
                this.currentProcess.time.remaining -= this.availableProcessTime
                this.pushQueue(this.currentProcess)
                this.guantData.at(-1)!.duration = this.quantum
                this.currentProcess = null
                this.availableProcessTime = this.quantum
                this.addCurrentState()
                continue
            }
            // process is done.
            this.currentTime += this.currentProcess.time.remaining
            this.currentProcess.time.end = this.currentTime
            this.currentProcess = null
            this.availableProcessTime = this.quantum
            this.addCurrentState()
        }

        return this.states
    }

    protected setAvailableProcessTime() {
        this.availableProcessTime = this.quantum
    }
}