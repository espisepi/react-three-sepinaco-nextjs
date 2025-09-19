'use client'

import { useState } from 'react'
import { WheelPanel } from '@/types/wheel'

interface WheelControlsProps {
    panels: WheelPanel[]
    isSpinning: boolean
    onSpin: () => void
    onAddPanel: () => void
    onRemovePanel: (id: string) => void
    onUpdatePanel: (id: string, text: string) => void
}

export function WheelControls({
    panels,
    isSpinning,
    onSpin,
    onAddPanel,
    onRemovePanel,
    onUpdatePanel
}: WheelControlsProps) {
    const [editingPanel, setEditingPanel] = useState<string | null>(null)
    const [editText, setEditText] = useState('')

    const handleEditStart = (panel: WheelPanel) => {
        setEditingPanel(panel.id)
        setEditText(panel.text)
    }

    const handleEditSave = () => {
        if (editingPanel && editText.trim()) {
            onUpdatePanel(editingPanel, editText.trim())
            setEditingPanel(null)
            setEditText('')
        }
    }

    const handleEditCancel = () => {
        setEditingPanel(null)
        setEditText('')
    }

    return (
        <div className='space-y-6'>
            {/* Botón de girar */}
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>🎯 Control de la Ruleta</h3>
                <button
                    onClick={onSpin}
                    disabled={isSpinning || panels.length === 0}
                    className={`w-full rounded-lg px-6 py-4 text-lg font-bold text-white transition-all duration-300 ${isSpinning || panels.length === 0
                            ? 'cursor-not-allowed bg-gray-500'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                        }`}
                >
                    {isSpinning ? '🔄 Girando...' : '🎰 ¡GIRAR RULETA!'}
                </button>
                {panels.length === 0 && (
                    <p className='mt-2 text-sm text-red-300'>Agrega al menos un panel para poder girar</p>
                )}
            </div>

            {/* Gestión de paneles */}
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-bold text-white'>📝 Paneles ({panels.length})</h3>
                    <button
                        onClick={onAddPanel}
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors'
                    >
                        + Agregar
                    </button>
                </div>

                <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {panels.map((panel) => (
                        <div
                            key={panel.id}
                            className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg'
                        >
                            {/* Color indicator */}
                            <div
                                className='w-6 h-6 rounded-full border-2 border-white/30'
                                style={{ backgroundColor: panel.color }}
                            />

                            {/* Panel text */}
                            {editingPanel === panel.id ? (
                                <div className='flex-1 flex space-x-2'>
                                    <input
                                        type='text'
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className='flex-1 px-3 py-1 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-white/50'
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleEditSave()
                                            if (e.key === 'Escape') handleEditCancel()
                                        }}
                                    />
                                    <button
                                        onClick={handleEditSave}
                                        className='px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm'
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={handleEditCancel}
                                        className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                                    >
                                        ✗
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className='flex-1 text-white font-medium'>{panel.text}</span>
                                    <button
                                        onClick={() => handleEditStart(panel)}
                                        className='px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm'
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => onRemovePanel(panel.id)}
                                        disabled={panels.length <= 1}
                                        className={`px-2 py-1 rounded text-sm transition-colors ${panels.length <= 1
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600'
                                            } text-white`}
                                    >
                                        🗑️
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {panels.length === 0 && (
                    <div className='text-center py-8 text-gray-400'>
                        <p>No hay paneles en la ruleta</p>
                        <p className='text-sm'>Haz clic en &quot;Agregar&quot; para crear el primero</p>
                    </div>
                )}
            </div>

            {/* Instrucciones */}
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>ℹ️ Instrucciones</h3>
                <ul className='space-y-2 text-sm text-gray-300'>
                    <li>• Haz clic en &quot;¡GIRAR RULETA!&quot; para comenzar</li>
                    <li>• La ruleta girará automáticamente y se detendrá</li>
                    <li>• El panel seleccionado aparecerá en el resultado</li>
                    <li>• Puedes agregar, editar o eliminar paneles</li>
                    <li>• Necesitas al menos un panel para poder girar</li>
                </ul>
            </div>
        </div>
    )
}
