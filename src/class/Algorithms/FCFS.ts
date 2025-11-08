import Algorithm from "../Algorithm.ts";

export default class FCFS extends Algorithm {
    public run() {
        this.addCurrentState()

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
                this.addEntryToGuant({data: this.currentProcess.data, duration: this.currentProcess.time.remaining})
                this.addCurrentState()
            }

            if (this.processes.length) {
                if (this.processes[0].data.enterTime < this.currentTime + this.currentProcess.time.remaining) {
                    const process = this.processes.shift()!;

                    const runTime = process.data.enterTime - this.currentTime
                    this.currentTime += runTime
                    this.currentProcess.time.remaining -= runTime

                    this.pushQueue(process)
                    this.addCurrentState()
                    continue
                }
            }

            // process is done.
            this.currentTime += this.currentProcess.time.remaining
            this.currentProcess.time.end = this.currentTime
            this.currentProcess = null
            this.addCurrentState()
        }

        return this.states
    }
}