import {useEffect, useMemo, useState} from 'react'
import type {DataEntry, NewDataEntry} from './types/DataEntry'
import AddDataEntry from './components/AddDataEntry'
import FCFS from './algorithms/FCFS'
import type {AlgorithmState} from './types/Base'
import dataSample from './samples/data'
import {generateId} from "./utils/Id.ts";

function App() {
    const [data, setData] = useState<null | DataEntry[]>(dataSample())

    const allStates = useMemo<null | AlgorithmState[]>(() => {
        if (!data) return null
        return FCFS(data)
    }, [data])

    const [currentStateIndex, setCurrentStateIndex] = useState<number | null>(null)
    const currentState = allStates ? allStates.at(currentStateIndex ?? -1) : null


    useEffect(() => {
        setCurrentStateIndex(null)
    }, [data]);

    // TODO: fix guant totalTime

    function addData(entry: NewDataEntry) {
        setData((currentData) => [
            ...(currentData ?? []),
            {
                id: generateId(),
                ...entry,
            },
        ])
    }

    function removeDataEntry(entryId: string) {
        setData((currentData) => currentData?.filter((entry) => entry.id !== entryId) ?? null)
    }

    function onKeyboardPress(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            nextState()
        } else if (event.key === 'ArrowLeft') {
            previousState()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyboardPress)
        return () => {
            document.removeEventListener('keydown', onKeyboardPress)
        }
    }, [])

    function nextState() {
        if (!allStates?.length) return

        setCurrentStateIndex((index) => {
            if (index === null) return 0
            return Math.min(allStates.length - 1, index! + 1)
        })
    }

    function previousState() {
        if (!allStates?.length) return
        setCurrentStateIndex((index) => {
            if (index === null) return 0
            return Math.max(0, index! - 1)
        })
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
                        <AddDataEntry onAddEntry={addData}/>
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
                        {currentState &&
                            (() => {
                                let elapsedTime = 0
                                return currentState.guant.map((entry) => {
                                    if (entry.type === 'EnterTimeGap') {
                                        elapsedTime += entry.duration
                                        return (
                                            <div
                                                key={entry.id}
                                                className="item gap"
                                                data-end-time={elapsedTime + 's'}
                                                style={{
                                                    '--width': entry.duration,
                                                }}
                                            ></div>
                                        )
                                    }
                                    elapsedTime += entry.data.duration
                                    return (
                                        <div
                                            key={entry.id}
                                            className="item process"
                                            data-end-time={elapsedTime + 's'}
                                            style={{
                                                '--width': entry.data.duration,
                                                backgroundColor: entry.color,
                                            }}
                                        >
                                            <span className="name">{entry.data.name}</span>
                                        </div>
                                    )
                                })
                            })()}
                        <div
                            className="current-time"
                            data-current-time={!currentState ? '' : currentState.currentTime + 's'}
                            style={{
                                '--left': currentState?.currentTime,
                            }}
                        ></div>
                    </div>
                    <div className="guant-chart">
                        {currentState &&
                            (() => {
                                let elapsedTime = 0
                                return currentState.queue.map((entry) => {
                                    elapsedTime += entry.process.data.duration
                                    return (
                                        <div
                                            key={entry.id}
                                            className="item process"
                                            data-end-time={elapsedTime + 's'}
                                            style={{
                                                '--width': entry.process.data.duration,
                                                backgroundColor: entry.color,
                                            }}
                                        >
                                            <span className="name">{entry.process.data.name}</span>
                                        </div>
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
