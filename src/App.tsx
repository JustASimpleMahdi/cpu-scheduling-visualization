import {type ChangeEvent, useEffect, useMemo, useState} from 'react'
import type {DataEntry, NewDataEntry} from './types/DataEntry'
import AddDataEntry from './components/AddDataEntry'
import type {AlgorithmState} from './types/Base'
import dataSample from './samples/data'
import {generateId} from "./utils/Id.ts";
import {Algorithm} from "./types/Algorithm.ts";
import FCFS from "./class/Algorithms/FCFS.ts";
import NP_LCFS from "./class/Algorithms/NP_LCFS.ts";
import P_LCFS from "./class/Algorithms/P_LCFS.ts";

function App() {
    const [data, setData] = useState<null | DataEntry[]>(dataSample())
    const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.P_LCFS)

    const allStates = useMemo<null | AlgorithmState[]>(() => {
        if (!data) return null

        const algorithmClass = {
            [Algorithm.FCFS]: FCFS,
            [Algorithm.NP_LCFS]: NP_LCFS,
            [Algorithm.P_LCFS]: P_LCFS,
        }[algorithm]
        
        return (new algorithmClass(data)).run()
    }, [data, algorithm])

    const [currentStateIndex, setCurrentStateIndex] = useState<number | null>(null)
    const currentState = allStates ? allStates.at(currentStateIndex ?? -1) : null

    console.log({allStates, currentState})

    useEffect(() => {
        setCurrentStateIndex(null)
    }, [data, algorithm]);

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
        /*BUGFIX: when the data is removed the length isn't right*/

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

    function changeAlgorithm(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value as string;
        setAlgorithm(Algorithm[value])
        e.target.blur()
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
                        <select className="algorithm-select" onChange={changeAlgorithm} value={algorithm}>
                            {Object.values(Algorithm).map((entry) => (<option value={entry} key={entry}>{entry}</option>))}
                        </select>
                    </div>
                </div>

                <div className="output-container">
                    <div className="guant-chart">
                        {currentState &&
                            (() => {
                                let elapsedTime = 0
                                return currentState.guant.map((entry) => {
                                    elapsedTime += entry.duration
                                    if (entry.type === 'EnterTimeGap') {
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

                                    return (
                                        <div
                                            key={entry.id}
                                            className="item process"
                                            data-end-time={elapsedTime + 's'}
                                            style={{
                                                '--width': entry.duration,
                                                backgroundColor: entry.options?.color,
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
                    {/*TODO: Change queue chart*/}
                    <div className="guant-chart">
                        {currentState &&
                            (() => {
                                let elapsedTime = 0
                                return currentState.queue.map((entry) => {
                                    elapsedTime += entry.duration
                                    return (
                                        <div
                                            key={entry.id}
                                            className="item process"
                                            data-end-time={elapsedTime + 's'}
                                            style={{
                                                '--width': entry.duration,
                                                backgroundColor: entry.options?.color,
                                            }}
                                        >
                                            <span className="name">{entry.data.name}</span>
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
