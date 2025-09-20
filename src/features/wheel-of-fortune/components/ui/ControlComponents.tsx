import React from 'react'
import { WheelPanel } from '@/types/wheel'
import { Slider, Button } from './UIComponents'

// ============================================================================
// TEXTURE CONTROLS COMPONENT (Single Responsibility)
// ============================================================================

interface TextureControlsProps {
    panel: WheelPanel
    onScaleChange: (scale: number) => void
    onRotationChange: (rotation: number) => void
    onOffsetChange: (offsetX: number, offsetY: number) => void
    disabled?: boolean
    className?: string
}

export function TextureControls({
    panel,
    onScaleChange,
    onRotationChange,
    onOffsetChange,
    disabled = false,
    className = ''
}: TextureControlsProps) {
    const quickScaleValues = [0.5, 1, 2]
    const quickRotationValues = [0, 90, 180, 270]
    const quickOffsetValues = [-1, 0, 1]

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Scale Controls */}
            <div className="space-y-2">
                <Slider
                    value={panel.textureScale || 1}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={onScaleChange}
                    disabled={disabled}
                    label="Escala"
                    color="#8B5CF6"
                />

                <div className="flex space-x-1">
                    {quickScaleValues.map(scale => (
                        <Button
                            key={scale}
                            onClick={() => onScaleChange(scale)}
                            disabled={disabled}
                            variant={(panel.textureScale || 1) === scale ? 'primary' : 'secondary'}
                            size="small"
                            title={`Escala ${scale}x`}
                        >
                            {scale === 0.5 ? '🔍-' : scale === 1 ? '📐' : '🔍+'}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-2">
                <Slider
                    value={panel.textureRotation || 0}
                    min={0}
                    max={360}
                    step={15}
                    onChange={onRotationChange}
                    disabled={disabled}
                    label="Rotación"
                    color="#10B981"
                />

                <div className="flex space-x-1">
                    {quickRotationValues.map(rotation => (
                        <Button
                            key={rotation}
                            onClick={() => onRotationChange(rotation)}
                            disabled={disabled}
                            variant={(panel.textureRotation || 0) === rotation ? 'success' : 'secondary'}
                            size="small"
                            title={`${rotation}° - ${rotation === 0 ? 'Sin rotación' : rotation === 90 ? 'Rotación derecha' : rotation === 180 ? 'Voltear' : 'Rotación izquierda'}`}
                        >
                            {rotation === 0 ? '↕️' : rotation === 90 ? '↻' : rotation === 180 ? '↕️' : '↺'}
                        </Button>
                    ))}
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                    <span>270°</span>
                    <span>360°</span>
                </div>
            </div>

            {/* Translation Controls */}
            <div className="space-y-3">
                <h5 className="text-xs font-medium text-gray-300">Posición</h5>

                {/* X Offset */}
                <div className="space-y-1">
                    <Slider
                        value={panel.textureOffsetX || 0}
                        min={-1}
                        max={1}
                        step={0.1}
                        onChange={(value) => onOffsetChange(value, panel.textureOffsetY || 0)}
                        disabled={disabled}
                        label="X"
                        color="#EF4444"
                    />

                    <div className="flex space-x-1">
                        {quickOffsetValues.map(offset => (
                            <Button
                                key={`x-${offset}`}
                                onClick={() => onOffsetChange(offset, panel.textureOffsetY || 0)}
                                disabled={disabled}
                                variant={(panel.textureOffsetX || 0) === offset ? 'danger' : 'secondary'}
                                size="small"
                                title={offset === -1 ? 'Izquierda' : offset === 0 ? 'Centro' : 'Derecha'}
                            >
                                {offset === -1 ? '←' : offset === 0 ? '↕️' : '→'}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Y Offset */}
                <div className="space-y-1">
                    <Slider
                        value={panel.textureOffsetY || 0}
                        min={-1}
                        max={1}
                        step={0.1}
                        onChange={(value) => onOffsetChange(panel.textureOffsetX || 0, value)}
                        disabled={disabled}
                        label="Y"
                        color="#3B82F6"
                    />

                    <div className="flex space-x-1">
                        {quickOffsetValues.map(offset => (
                            <Button
                                key={`y-${offset}`}
                                onClick={() => onOffsetChange(panel.textureOffsetX || 0, offset)}
                                disabled={disabled}
                                variant={(panel.textureOffsetY || 0) === offset ? 'primary' : 'secondary'}
                                size="small"
                                title={offset === -1 ? 'Arriba' : offset === 0 ? 'Centro' : 'Abajo'}
                            >
                                {offset === -1 ? '↑' : offset === 0 ? '↕️' : '↓'}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                    <span>Izquierda</span>
                    <span>Centro</span>
                    <span>Derecha</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Arriba</span>
                    <span>Centro</span>
                    <span>Abajo</span>
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// TEXT CONTROLS COMPONENT (Single Responsibility)
// ============================================================================

interface TextControlsProps {
    panel: WheelPanel
    onPositionChange: (x: number, y: number, z: number) => void
    onRotationChange: (x: number, y: number, z: number) => void
    onScaleChange: (x: number, y: number, z: number) => void
    onReset: () => void
    disabled?: boolean
    className?: string
}

export function TextControls({
    panel,
    onPositionChange,
    onRotationChange,
    onScaleChange,
    onReset,
    disabled = false,
    className = ''
}: TextControlsProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Position Controls */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-orange-200">Posición</h5>

                <Slider
                    value={panel.textPositionX || 0}
                    min={-2}
                    max={2}
                    step={0.1}
                    onChange={(value) => onPositionChange(value, panel.textPositionY || 0, panel.textPositionZ || 0)}
                    disabled={disabled}
                    label="X"
                    color="#EF4444"
                />

                <Slider
                    value={panel.textPositionY || 0}
                    min={-2}
                    max={2}
                    step={0.1}
                    onChange={(value) => onPositionChange(panel.textPositionX || 0, value, panel.textPositionZ || 0)}
                    disabled={disabled}
                    label="Y"
                    color="#10B981"
                />

                <Slider
                    value={panel.textPositionZ || 0}
                    min={-2}
                    max={2}
                    step={0.1}
                    onChange={(value) => onPositionChange(panel.textPositionX || 0, panel.textPositionY || 0, value)}
                    disabled={disabled}
                    label="Z"
                    color="#3B82F6"
                />
            </div>

            {/* Rotation Controls */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-orange-200">Rotación</h5>

                <Slider
                    value={panel.textRotationX || 0}
                    min={0}
                    max={360}
                    step={15}
                    onChange={(value) => onRotationChange(value, panel.textRotationY || 0, panel.textRotationZ || 0)}
                    disabled={disabled}
                    label="X"
                    color="#EF4444"
                />

                <Slider
                    value={panel.textRotationY || 0}
                    min={0}
                    max={360}
                    step={15}
                    onChange={(value) => onRotationChange(panel.textRotationX || 0, value, panel.textRotationZ || 0)}
                    disabled={disabled}
                    label="Y"
                    color="#10B981"
                />

                <Slider
                    value={panel.textRotationZ || 0}
                    min={0}
                    max={360}
                    step={15}
                    onChange={(value) => onRotationChange(panel.textRotationX || 0, panel.textRotationY || 0, value)}
                    disabled={disabled}
                    label="Z"
                    color="#3B82F6"
                />
            </div>

            {/* Scale Controls */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-orange-200">Escala</h5>

                <Slider
                    value={panel.textScaleX || 1}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={(value) => onScaleChange(value, panel.textScaleY || 1, panel.textScaleZ || 1)}
                    disabled={disabled}
                    label="X"
                    color="#EF4444"
                />

                <Slider
                    value={panel.textScaleY || 1}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={(value) => onScaleChange(panel.textScaleX || 1, value, panel.textScaleZ || 1)}
                    disabled={disabled}
                    label="Y"
                    color="#10B981"
                />

                <Slider
                    value={panel.textScaleZ || 1}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={(value) => onScaleChange(panel.textScaleX || 1, panel.textScaleY || 1, value)}
                    disabled={disabled}
                    label="Z"
                    color="#3B82F6"
                />
            </div>

            {/* Reset Button */}
            <div className="border-t border-orange-400/20 pt-2">
                <Button
                    onClick={onReset}
                    disabled={disabled}
                    variant="warning"
                    size="small"
                    className="w-full"
                >
                    🔄 Restablecer Texto
                </Button>
            </div>
        </div>
    )
}
