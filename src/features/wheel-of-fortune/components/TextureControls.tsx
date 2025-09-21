import React, { memo } from 'react'
import { WheelPanel } from '@/types/wheel'

interface TextureControlsProps {
    panel: WheelPanel
    onUpdateTextureScale: (id: string, scale: number) => void
    onUpdateTextureRotation: (id: string, rotation: number) => void
    onUpdateTextureOffset: (id: string, offsetX: number, offsetY: number) => void
}

/**
 * Componente optimizado para los controles de textura
 * Separado para mejorar la mantenibilidad y reutilización
 */
export const TextureControls = memo(({
    panel,
    onUpdateTextureScale,
    onUpdateTextureRotation,
    onUpdateTextureOffset
}: TextureControlsProps) => {
    return (
        <div className='space-y-2'>
            {/* Scale controls */}
            <div className='space-y-1'>
                <label className='block text-xs text-gray-400'>
                    Escala: {panel.textureScale || 1}x
                </label>
                <div className='flex items-center space-x-2'>
                    <input
                        type='range'
                        min='0.1'
                        max='30'
                        step='0.1'
                        value={panel.textureScale || 1}
                        onChange={(e) => onUpdateTextureScale(panel.id, parseFloat(e.target.value))}
                        className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                        style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((panel.textureScale || 1) - 0.1) / (30 - 0.1) * 100}%, #374151 ${((panel.textureScale || 1) - 0.1) / (30 - 0.1) * 100}%, #374151 100%)`
                        }}
                    />
                    <div className='flex space-x-1'>
                        {[0.5, 1, 2, 5, 10, 20, 30].map(scale => (
                            <button
                                key={scale}
                                onClick={() => onUpdateTextureScale(panel.id, scale)}
                                className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === scale ? 'bg-purple-600' : 'bg-gray-600'}`}
                                title={`${scale}x`}
                            >
                                {scale === 0.5 ? '🔍-' : scale === 1 ? '📐' : scale === 2 ? '🔍+' : `${scale}x`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rotation controls */}
            <div className='space-y-1'>
                <label className='block text-xs text-gray-400'>
                    Rotación: {panel.textureRotation || 0}°
                </label>
                <div className='flex items-center space-x-2'>
                    <input
                        type='range'
                        min='0'
                        max='360'
                        step='15'
                        value={panel.textureRotation || 0}
                        onChange={(e) => onUpdateTextureRotation(panel.id, parseFloat(e.target.value))}
                        className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                        style={{
                            background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 100%)`
                        }}
                    />
                    <div className='flex space-x-1'>
                        {[0, 90, 180, 270].map(rotation => (
                            <button
                                key={rotation}
                                onClick={() => onUpdateTextureRotation(panel.id, rotation)}
                                className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === rotation ? 'bg-green-600' : 'bg-gray-600'}`}
                                title={`${rotation}°`}
                            >
                                {rotation === 0 ? '↕️' : rotation === 90 ? '↻' : rotation === 180 ? '↕️' : '↺'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='flex justify-between text-xs text-gray-500'>
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                    <span>270°</span>
                    <span>360°</span>
                </div>
            </div>

            {/* Translation controls */}
            <div className='space-y-2'>
                <div className='space-y-1'>
                    <label className='block text-xs text-gray-400'>
                        Posición X: {(panel.textureOffsetX || 0).toFixed(2)}
                    </label>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='range'
                            min='-1'
                            max='1'
                            step='0.1'
                            value={panel.textureOffsetX || 0}
                            onChange={(e) => onUpdateTextureOffset(panel.id, parseFloat(e.target.value), panel.textureOffsetY || 0)}
                            className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                                background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                        />
                        <div className='flex space-x-1'>
                            {[-1, 0, 1].map(offset => (
                                <button
                                    key={offset}
                                    onClick={() => onUpdateTextureOffset(panel.id, offset, panel.textureOffsetY || 0)}
                                    className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetX || 0) === offset ? 'bg-red-600' : 'bg-gray-600'}`}
                                    title={offset === -1 ? 'Izquierda (-1)' : offset === 0 ? 'Centro (0)' : 'Derecha (1)'}
                                >
                                    {offset === -1 ? '←' : offset === 0 ? '↕️' : '→'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='space-y-1'>
                    <label className='block text-xs text-gray-400'>
                        Posición Y: {(panel.textureOffsetY || 0).toFixed(2)}
                    </label>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='range'
                            min='-1'
                            max='1'
                            step='0.1'
                            value={panel.textureOffsetY || 0}
                            onChange={(e) => onUpdateTextureOffset(panel.id, panel.textureOffsetX || 0, parseFloat(e.target.value))}
                            className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                        />
                        <div className='flex space-x-1'>
                            {[-1, 0, 1].map(offset => (
                                <button
                                    key={offset}
                                    onClick={() => onUpdateTextureOffset(panel.id, panel.textureOffsetX || 0, offset)}
                                    className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetY || 0) === offset ? 'bg-blue-600' : 'bg-gray-600'}`}
                                    title={offset === -1 ? 'Arriba (-1)' : offset === 0 ? 'Centro (0)' : 'Abajo (1)'}
                                >
                                    {offset === -1 ? '↑' : offset === 0 ? '↕️' : '↓'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex justify-between text-xs text-gray-500'>
                    <span>Izquierda</span>
                    <span>Centro</span>
                    <span>Derecha</span>
                </div>
                <div className='flex justify-between text-xs text-gray-500'>
                    <span>Arriba</span>
                    <span>Centro</span>
                    <span>Abajo</span>
                </div>
            </div>
        </div>
    )
})

TextureControls.displayName = 'TextureControls'
