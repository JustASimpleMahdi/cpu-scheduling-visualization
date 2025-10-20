import { useState } from 'react'
import type { NewDataEntry } from '../types/DataEntry'
export interface IAddDataEntry {
    onAddEntry: (entry: NewDataEntry) => void
}
export default function AddDataEntry({ onAddEntry }: IAddDataEntry) {
    const [name, setName] = useState<string>('')
    const [duration, setDuration] = useState<number>(0)
    const [enterTime, setEnterTime] = useState<number>(0)
    function onSubmit(event: any): void {
        event.preventDefault()
        if (!(name && duration)) return
        onAddEntry({
            name,
            duration,
            enterTime,
        } as NewDataEntry)

        resetForm()
    }
    function resetForm() {
        setName('')
        setDuration(0)
        setEnterTime(0)
    }
    return (
        <form onSubmit={onSubmit} className="data-input">
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
            />
            <input
                onChange={(e) => setDuration(e.target.valueAsNumber)}
                value={duration}
                type="number"
                placeholder="Duration"
            />
            <input
                onChange={(e) => setEnterTime(e.target.valueAsNumber)}
                value={enterTime}
                type="number"
                placeholder="Enter Time"
            />
            <button type="submit">+</button>
        </form>
    )
}
