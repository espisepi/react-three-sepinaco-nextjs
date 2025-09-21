import React, { memo } from 'react'
import { WheelPanel } from '@/types/wheel'

interface TextControlsProps {
    panel: WheelPanel
    onUpdateTextPosition: (id: string, x: number, y: number, z: number) => void
    onUpdateTextRotation: (id: string, x: number, y: number, z: number) => void
    onUpdateTextScale: (id: string, x: number, y: number, z: number) => void
    onToggleTextControls: (id: string) => void
}

/**
 * Componente optimizado para los controles de texto
 * Separado para mejorar la mantenibilidad y reutilización
 */
export const TextControls = memo(({
    panel,
    onUpdateTextPosition,
    onUpdateTextRotation,
    onUpdateTextScale,
    onToggleTextControls
}: TextControlsProps) => {
    const handleReset = () => {
        onUpdateTextPosition(panel.id, 0, 0, 0)
        onUpdateTextRotation(panel.id, 0, 0, 0)
        onUpdateTextScale(panel.id, 1, 1, 1)
    }

    return (
        <div className='ml-3 space-y-3 rounded-lg border border-orange-400/20 bg-orange-500/10 p-3'>
            <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold text-orange-300'>Controles de Texto</h4>
                <button
                    onClick={() => onToggleTextControls(panel.id)}
                    className='rounded bg-orange-600 px-2 py-1 text-xs text-white hover:bg-orange-700'
                    title='Ocultar controles de texto'
                >
                    ✕
                </button>
            </div>

            {/* Position controls */}
            <div className='space-y-2'>
                <h5 className='text-xs font-medium text-orange-200'>Posición</h5>
                <div className='space-y-1'>
                    {[
                        { axis: 'X', value: panel.textPositionX || 0, color: '#EF4444', min: -2, max: 2 },
                        { axis: 'Y', value: panel.textPositionY || 0, color: '#10B981', min: -2, max: 2 },
                        { axis: 'Z', value: panel.textPositionZ || 0, color: '#3B82F6', min: -2, max: 2 }
                    ].map(({ axis, value, color, min, max }) => (
                        <div key={axis} className='space-y-1'>
                            <label className='block text-xs text-gray-400'>
                                {axis}: {value.toFixed(2)}
                            </label>
                            <input
                                type='range'
                                min={min}
                                max={max}
                                step='0.1'
                                value={value}
                                onChange={(e) => {
                                    const newValue = parseFloat(e.target.value)
                                    if (axis === 'X') {
                                        onUpdateTextPosition(panel.id, newValue, panel.textPositionY || 0, panel.textPositionZ || 0)
                                    } else if (axis === 'Y') {
                                        onUpdateTextPosition(panel.id, panel.textPositionX || 0, newValue, panel.textPositionZ || 0)
                                    } else {
                                        onUpdateTextPosition(panel.id, panel.textPositionX || 0, panel.textPositionY || 0, newValue)
                                    }
                                }}
                                className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                                style={{
                                    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rotation controls */}
            <div className='space-y-2'>
                <h5 className='text-xs font-medium text-orange-200'>Rotación</h5>
                <div className='space-y-1'>
                    {[
                        { axis: 'X', value: panel.textRotationX || 0, color: '#EF4444' },
                        { axis: 'Y', value: panel.textRotationY || 0, color: '#10B981' },
                        { axis: 'Z', value: panel.textRotationZ || 0, color: '#3B82F6' }
                    ].map(({ axis, value, color }) => (
                        <div key={axis} className='space-y-1'>
                            <label className='block text-xs text-gray-400'>
                                {axis}: {value}°
                            </label>
                            <input
                                type='range'
                                min='0'
                                max='360'
                                step='15'
                                value={value}
                                onChange={(e) => {
                                    const newValue = parseFloat(e.target.value)
                                    if (axis === 'X') {
                                        onUpdateTextRotation(panel.id, newValue, panel.textRotationY || 0, panel.textRotationZ || 0)
                                    } else if (axis === 'Y') {
                                        onUpdateTextRotation(panel.id, panel.textRotationX || 0, newValue, panel.textRotationZ || 0)
                                    } else {
                                        onUpdateTextRotation(panel.id, panel.textRotationX || 0, panel.textRotationY || 0, newValue)
                                    }
                                }}
                                className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                                style={{
                                    background: `linear-gradient(to right, ${color} 0%, ${color} ${(value / 360) * 100}%, #374151 ${(value / 360) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Scale controls */}
            <div className='space-y-2'>
                <h5 className='text-xs font-medium text-orange-200'>Escala</h5>
                <div className='space-y-1'>
                    {[
                        { axis: 'X', value: panel.textScaleX || 1, color: '#EF4444' },
                        { axis: 'Y', value: panel.textScaleY || 1, color: '#10B981' },
                        { axis: 'Z', value: panel.textScaleZ || 1, color: '#3B82F6' }
                    ].map(({ axis, value, color }) => (
                        <div key={axis} className='space-y-1'>
                            <label className='block text-xs text-gray-400'>
                                {axis}: {value.toFixed(2)}
                            </label>
                            <input
                                type='range'
                                min='0.1'
                                max='3'
                                step='0.1'
                                value={value}
                                onChange={(e) => {
                                    const newValue = parseFloat(e.target.value)
                                    if (axis === 'X') {
                                        onUpdateTextScale(panel.id, newValue, panel.textScaleY || 1, panel.textScaleZ || 1)
                                    } else if (axis === 'Y') {
                                        onUpdateTextScale(panel.id, panel.textScaleX || 1, newValue, panel.textScaleZ || 1)
                                    } else {
                                        onUpdateTextScale(panel.id, panel.textScaleX || 1, panel.textScaleY || 1, newValue)
                                    }
                                }}
                                className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                                style={{
                                    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - 0.1) / (3 - 0.1)) * 100}%, #374151 ${((value - 0.1) / (3 - 0.1)) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset button */}
            <div className='border-t border-orange-400/20 pt-2'>
                <button
                    onClick={handleReset}
                    className='w-full rounded bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700'
                >
                    🔄 Restablecer Texto
                </button>
            </div>
        </div>
    )
})

TextControls.displayName = 'TextControls'

