import {type ChangeEvent, useEffect, useMemo, useRef, useState} from 'react'
import type {DataEntry, NewDataEntry} from './types/DataEntry'
import AddDataEntry from './components/AddDataEntry'
import type {AlgorithmState} from './types/Base'
import dataSample from './samples/data'
import {generateId} from "./utils/Id.ts";
import {AlgorithmEnum} from "./types/AlgorithmEnum.ts";
import FCFS from "./class/Algorithms/FCFS.ts";
import NP_LCFS from "./class/Algorithms/NP_LCFS.ts";
import P_LCFS from "./class/Algorithms/P_LCFS.ts";
import RR from "./class/Algorithms/RR.ts";
import DataTable from "./components/DataTable.tsx";
import SJF from "./class/Algorithms/SJF.ts";

function App() {
    const [data, setData] = useState<null | DataEntry[]>(dataSample())
    const [algorithm, setAlgorithm] = useState<AlgorithmEnum>(AlgorithmEnum.SJF)
    const [quantum, setQuantum] = useState<number | undefined>(0.5);

    const allStates = useMemo<null | AlgorithmState[]>(() => {
        if (!data) return null

        const algorithmClass = {
            [AlgorithmEnum.FCFS]: FCFS,
            [AlgorithmEnum.NP_LCFS]: NP_LCFS,
            [AlgorithmEnum.P_LCFS]: P_LCFS,
            [AlgorithmEnum.RR]: RR,
            [AlgorithmEnum.SJF]: SJF,
        }[algorithm]

        if (algorithm === AlgorithmEnum.RR) {
            return (new algorithmClass(data, quantum)).run()
        }
        return (new algorithmClass(data)).run()
    }, [data, algorithm, quantum])

    const [currentStateIndex, setCurrentStateIndex] = useState<number | null>(null)
    const currentState = allStates ? allStates.at(currentStateIndex ?? -1) : null

    const allStatesRef = useRef<AlgorithmState[] | null>(null);
    // Keep ref in sync with state
    useEffect(() => {
        allStatesRef.current = allStates;
    }, [allStates]);

    useEffect(() => {
        setCurrentStateIndex(null)
    }, [data, algorithm, quantum]);

    const guantTotalTime = Math.max(currentState?.guant.reduce((p, c) => p + c.duration, 0), 10)

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
        const currentAllStates = allStatesRef.current;

        if (!currentAllStates?.length) return

        setCurrentStateIndex((index) => {
            if (index === null) return 0
            return Math.min(currentAllStates.length - 1, index! + 1)
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
        setAlgorithm(AlgorithmEnum[value])
        e.target.blur()
    }

    function updateDataEntry(id: string, field: keyof DataEntry, value: string | number) {
        setData((currentData) => {
            if (!currentData) return null;

            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            let finalValue: string | number = value;

            if (field === 'duration' || field === 'enterTime') {
                // Ensure non-negative; duration must be > 0
                if (field === 'duration') {
                    finalValue = Math.max(0.1, isNaN(numValue) ? 0.1 : numValue);
                } else {
                    // enterTime
                    finalValue = Math.max(0, isNaN(numValue) ? 0 : numValue);
                }
            }

            return currentData.map((entry) =>
                entry.id === id ? {...entry, [field]: finalValue} : entry
            );
        });
    }

    return (
        <>
            <div className="main-container">
                <div className="input-container">
                    <div className="input-table-container">
                        <h3>Data</h3>
                        <DataTable
                            data={data}
                            onUpdateEntry={updateDataEntry}
                            onRemoveEntry={removeDataEntry}
                        />

                        <AddDataEntry onAddEntry={addData}/>
                    </div>
                    <div className="algorithm-input-container">
                        <h3>Algorithm</h3>
                        <select className="algorithm-select" onChange={changeAlgorithm} value={algorithm}>
                            {Object.entries(AlgorithmEnum).map(([key, value]) => (<option value={key} key={key}>{value}</option>))}
                        </select>
                        {algorithm === AlgorithmEnum.RR &&
                            <div>
                                <input
                                    onChange={(e) => {
                                        if (e.target.valueAsNumber === 0) setQuantum(1)
                                        else setQuantum(e.target.valueAsNumber)
                                    }}
                                    value={quantum}
                                    type="number"
                                />
                            </div>}
                    </div>
                </div>

                <div className="output-container">
                    <div className="guant-chart" style={{
                        '--guant-total-time': guantTotalTime
                    }}>
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
