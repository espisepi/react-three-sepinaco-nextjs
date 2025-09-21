import React, { memo } from 'react'
import { WheelPanel } from '@/types/wheel'

interface PanelEditorProps {
    panel: WheelPanel
    editingPanel: string | null
    editText: string
    setEditText: (text: string) => void
    editingColor: string | null
    editColor: string
    originalColor: string
    panels: WheelPanel[]
    onEditStart: (panel: WheelPanel) => void
    onEditSave: () => void
    onEditCancel: () => void
    onColorEditStart: (panel: WheelPanel) => void
    onColorChange: (color: string) => void
    onColorEditSave: () => void
    onColorEditCancel: () => void
    onRemovePanel: (id: string) => void
    onToggleTextControls: (id: string) => void
    showTextControls: Record<string, boolean>
}

/**
 * Componente optimizado para la edición de paneles
 * Separado para mejorar la mantenibilidad y reutilización
 */
export const PanelEditor = memo(({
    panel,
    editingPanel,
    editText,
    setEditText,
    editingColor,
    editColor,
    originalColor,
    panels,
    onEditStart,
    onEditSave,
    onEditCancel,
    onColorEditStart,
    onColorChange,
    onColorEditSave,
    onColorEditCancel,
    onRemovePanel,
    onToggleTextControls,
    showTextControls
}: PanelEditorProps) => {
    return (
        <>
            {/* Color indicator */}
            {editingColor === panel.id ? (
                <div className='flex items-center space-x-2'>
                    <input
                        type='color'
                        value={editColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className='size-8 cursor-pointer rounded border border-white/30'
                    />
                    <button
                        onClick={onColorEditSave}
                        className='rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600'
                        title='Confirmar color'
                    >
                        ✓
                    </button>
                    <button
                        onClick={onColorEditCancel}
                        className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600'
                        title='Restaurar color anterior'
                    >
                        ✗
                    </button>
                </div>
            ) : (
                <div
                    className='size-6 cursor-pointer rounded-full border-2 border-white/30 transition-transform hover:scale-110'
                    style={{ backgroundColor: panel.color }}
                    onClick={() => onColorEditStart(panel)}
                    title='Haz clic para cambiar el color'
                />
            )}

            {/* Panel text */}
            {editingPanel === panel.id ? (
                <div className='flex flex-1 space-x-2'>
                    <input
                        type='text'
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className='flex-1 rounded border border-white/30 bg-white/20 px-3 py-1 text-white focus:border-white/50 focus:outline-none'
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onEditSave()
                            if (e.key === 'Escape') onEditCancel()
                        }}
                    />
                    <button
                        onClick={onEditSave}
                        className='rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600'
                    >
                        ✓
                    </button>
                    <button
                        onClick={onEditCancel}
                        className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600'
                    >
                        ✗
                    </button>
                </div>
            ) : (
                <>
                    <span className='flex-1 font-medium text-white'>{panel.text}</span>
                    <button
                        onClick={() => onEditStart(panel)}
                        className='rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600'
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => onToggleTextControls(panel.id)}
                        className={`rounded px-2 py-1 text-sm text-white transition-colors ${showTextControls[panel.id]
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        title={showTextControls[panel.id] ? 'Ocultar controles de texto' : 'Mostrar controles de texto'}
                    >
                        📝
                    </button>
                    <button
                        onClick={() => onRemovePanel(panel.id)}
                        disabled={panels.length <= 1}
                        className={`rounded px-2 py-1 text-sm text-white transition-colors ${panels.length <= 1
                            ? 'cursor-not-allowed bg-gray-500'
                            : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        🗑️
                    </button>
                </>
            )}
        </>
    )
})

PanelEditor.displayName = 'PanelEditor'

