// src/components/DataTable.tsx
import {useState} from 'react';
import type {DataEntry} from '../types/DataEntry';

type DataTableProps = {
    data: DataEntry[];
    onUpdateEntry: (id: string, field: keyof DataEntry, value: string | number) => void;
    onRemoveEntry: (id: string) => void;
};

export default function DataTable({data, onUpdateEntry, onRemoveEntry}: DataTableProps) {
    const [editingCell, setEditingCell] = useState<{ id: string; field: keyof DataEntry } | null>(null);
    const [tempValue, setTempValue] = useState<string>('');

    const startEditing = (id: string, field: keyof DataEntry, currentValue: string | number) => {
        setTempValue(String(currentValue));
        setEditingCell({id, field});
    };

    const handleSave = () => {
        if (!editingCell) return;
        onUpdateEntry(editingCell.id, editingCell.field, tempValue);
        setEditingCell(null);
    };

    const handleCancel = () => {
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
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
            {data.map((entry) => (
                <tr key={entry.id}>
                    <td
                        onDoubleClick={() => startEditing(entry.id, 'name', entry.name)}
                        className={editingCell?.id === entry.id && editingCell.field === 'name' ? 'editing' : ''}
                    >
                        {editingCell?.id === entry.id && editingCell.field === 'name' ? (
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="editable-input"
                            />
                        ) : (
                            entry.name
                        )}
                    </td>
                    <td
                        onDoubleClick={() => startEditing(entry.id, 'duration', entry.duration)}
                        className={editingCell?.id === entry.id && editingCell.field === 'duration' ? 'editing' : ''}
                    >
                        {editingCell?.id === entry.id && editingCell.field === 'duration' ? (
                            <input
                                type="number"
                                step="0.1"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="editable-input"
                            />
                        ) : (
                            entry.duration
                        )}
                    </td>
                    <td
                        onDoubleClick={() => startEditing(entry.id, 'enterTime', entry.enterTime)}
                        className={editingCell?.id === entry.id && editingCell.field === 'enterTime' ? 'editing' : ''}
                    >
                        {editingCell?.id === entry.id && editingCell.field === 'enterTime' ? (
                            <input
                                type="number"
                                step="0.1"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="editable-input"
                            />
                        ) : (
                            entry.enterTime
                        )}
                    </td>
                    <td>
                        <button
                            type="button"
                            onClick={() => onRemoveEntry(entry.id)}
                            aria-label="Delete"
                        >
                            D
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}