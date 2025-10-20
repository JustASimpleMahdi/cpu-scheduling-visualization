import { useState } from 'react'
import type DataEntry from './types/DataEntry'
import AddDataEntry from './components/AddDataEntry'
import type { NewDataEntry } from './types/DataEntry'
import { getRandomColor } from './utils/Color'

function App() {
    const [data, setData] = useState<null | DataEntry[]>([
        { id: 1, name: 'A', duration: 1, enterTime: 0, color: getRandomColor() },
        { id: 2, name: 'B', duration: 2, enterTime: 2, color: getRandomColor() },
        { id: 3, name: 'C', duration: 1, enterTime: 3, color: getRandomColor() },
    ])
    function addData(entry: NewDataEntry) {
        setData((currentData) => [
            ...(currentData ?? []),
            {
                id: Date.now(),
                color: getRandomColor(),
                ...entry,
            },
        ])
    }
    function removeDataEntry(entryId: number) {
        setData((currentData) => currentData?.filter((entry) => entry.id !== entryId) ?? null)
    }
    return (
        <>
            <div className="main-container">
                <div className="input-container">
                    <div className="input-table-container">
                        <h3>Data</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Duration</th>
                                    <th>Enter Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data &&
                                    data.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.name}</td>
                                            <td>{entry.duration}</td>
                                            <td>{entry.enterTime}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDataEntry(entry.id)}
                                                >
                                                    D
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <AddDataEntry onAddEntry={addData} />
                    </div>
                    <div className="input-table-container">
                        <h3>Algorithm</h3>
                        <select className="algorithm-select">
                            <option value="FCFS">FCFS</option>
                        </select>
                    </div>
                </div>

                <div className="output-container">
                    <div className="guant-chart">
                        {data &&
                            (() => {
                                let elapsedTime = 0
                                return data.map((entry) => {
                                    elapsedTime += entry.duration
                                    return (
                                        <>
                                            <div
                                                className="process"
                                                data-end-time={elapsedTime + 's'}
                                                style={{
                                                    '--width': entry.duration,
                                                    backgroundColor: entry.color,
                                                }}
                                            >
                                                <span className="name">{entry.name}</span>
                                            </div>
                                        </>
                                    )
                                })
                            })()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
