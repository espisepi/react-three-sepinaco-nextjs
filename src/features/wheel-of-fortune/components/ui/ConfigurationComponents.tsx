import React from 'react'
import { Slider, Button, Card } from './UIComponents'

// ============================================================================
// CANVAS SIZE CONTROL COMPONENT (Single Responsibility)
// ============================================================================

interface CanvasSizeControlProps {
    width: number
    height: number
    onSizeChange: (width: number, height: number) => void
    disabled?: boolean
    className?: string
}

export function CanvasSizeControl({
    width,
    height,
    onSizeChange,
    disabled = false,
    className = ''
}: CanvasSizeControlProps) {
    const quickSizes = [
        { label: 'Pequeño', width: 75, height: 40 },
        { label: 'Mediano', width: 100, height: 50 },
        { label: 'Grande', width: 100, height: 75 },
        { label: 'Pantalla Completa', width: 100, height: 100 }
    ]

    const handleReset = () => {
        const resetHeight = window.innerWidth >= 1024 ? 72 : 50
        onSizeChange(100, resetHeight)
    }

    return (
        <Card title="📐 Tamaño del Canvas" className={className}>
            <div className="space-y-4">
                {/* Width Slider */}
                <Slider
                    value={width}
                    min={50}
                    max={100}
                    step={5}
                    onChange={(value) => onSizeChange(value, height)}
                    disabled={disabled}
                    label="Ancho"
                    color="#8B5CF6"
                />

                {/* Height Slider */}
                <Slider
                    value={height}
                    min={20}
                    max={100}
                    step={5}
                    onChange={(value) => onSizeChange(width, value)}
                    disabled={disabled}
                    label="Altura"
                    color="#10B981"
                />

                {/* Quick Size Buttons */}
                <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-300">Tamaños Rápidos:</h5>
                    <div className="grid grid-cols-2 gap-2">
                        {quickSizes.map((size) => (
                            <Button
                                key={size.label}
                                onClick={() => onSizeChange(size.width, size.height)}
                                disabled={disabled}
                                variant={width === size.width && height === size.height ? 'primary' : 'secondary'}
                                size="small"
                                title={`${size.label}: ${size.width}% x ${size.height}vh`}
                            >
                                {size.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Reset Button */}
                <Button
                    onClick={handleReset}
                    disabled={disabled}
                    variant="secondary"
                    size="small"
                    className="w-full"
                >
                    🔄 Restablecer Tamaño
                </Button>

                {/* Current Size Display */}
                <div className="rounded-lg bg-white/5 p-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Tamaño actual:</span>
                        <span className="text-white font-semibold">
                            {width}% × {height}vh
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

// ============================================================================
// CONFIGURATION SUMMARY COMPONENT (Single Responsibility)
// ============================================================================

interface ConfigurationSummaryProps {
    panelCount: number
    spinDuration: number
    enableOrbitControls: boolean
    canvasWidth: number
    canvasHeight: number
    version: string
    lastUpdated: string
    className?: string
}

export function ConfigurationSummary({
    panelCount,
    spinDuration,
    enableOrbitControls,
    canvasWidth,
    canvasHeight,
    version,
    lastUpdated,
    className = ''
}: ConfigurationSummaryProps) {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return 'Fecha inválida'
        }
    }

    return (
        <Card title="📊 Resumen de Configuración" className={className}>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Paneles:</span>
                        <span className="text-white font-semibold">{panelCount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Versión:</span>
                        <span className="text-white font-semibold">{version}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Duración:</span>
                        <span className="text-white font-semibold">{spinDuration}s</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Controles:</span>
                        <span className={`font-semibold ${enableOrbitControls ? 'text-green-400' : 'text-gray-400'}`}>
                            {enableOrbitControls ? 'Activados' : 'Desactivados'}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Canvas:</span>
                        <span className="text-white font-semibold">{canvasWidth}% × {canvasHeight}vh</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Actualizado:</span>
                        <span className="text-white font-semibold">{formatDate(lastUpdated)}</span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-300">Estado:</h5>
                    <div className="flex flex-wrap gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${panelCount > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                            {panelCount > 0 ? '✅ Listo para girar' : '❌ Sin paneles'}
                        </div>

                        <div className={`px-2 py-1 rounded text-xs font-medium ${enableOrbitControls ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'
                            }`}>
                            {enableOrbitControls ? '🎮 Controles activos' : '🚫 Controles inactivos'}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
