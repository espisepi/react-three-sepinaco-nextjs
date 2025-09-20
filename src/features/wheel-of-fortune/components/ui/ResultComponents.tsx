import React from 'react'
import Image from 'next/image'
import { WheelPanel } from '@/types/wheel'
import { Card, Button } from './UIComponents'

// ============================================================================
// WHEEL RESULT COMPONENT (Single Responsibility)
// ============================================================================

interface WheelResultProps {
    result: WheelPanel
    raycastResult?: WheelPanel | null
    onSpinAgain?: () => void
    disabled?: boolean
    className?: string
}

export function WheelResult({
    result,
    raycastResult,
    onSpinAgain,
    disabled = false,
    className = ''
}: WheelResultProps) {
    // Use raycast result if available, otherwise use mathematical result
    const displayResult = raycastResult || result
    const detectionMethod = raycastResult ? 'Raycasting 3D' : 'Cálculo Matemático'

    return (
        <Card
            title="🏆 Resultado del Giro"
            variant="gradient"
            className={`animate-pulse ${className}`}
        >
            <div className="text-center space-y-4">
                {/* Result Display */}
                <div className="mb-4">
                    {displayResult.texture ? (
                        <div className="mx-auto mb-3 size-16 overflow-hidden rounded-full border-4 border-white/30">
                            <Image
                                src={displayResult.texture}
                                alt={displayResult.text}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className="mx-auto mb-3 size-16 rounded-full border-4 border-white/30"
                            style={{ backgroundColor: displayResult.color }}
                        />
                    )}

                    <div
                        className="inline-block rounded-xl px-6 py-3 text-lg font-bold text-white shadow-lg"
                        style={{ backgroundColor: displayResult.color }}
                    >
                        🎉 {displayResult.text} 🎉
                    </div>
                </div>

                {/* Result Details */}
                <div className="rounded-lg bg-white/5 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Panel Ganador:</span>
                        <span className="text-white font-semibold">{displayResult.text}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">ID:</span>
                        <span className="text-white font-mono">{displayResult.id}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Color:</span>
                        <span className="text-white font-mono">{displayResult.color}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Método:</span>
                        <span className={`font-semibold ${detectionMethod === 'Raycasting 3D' ? 'text-green-400' : 'text-blue-400'
                            }`}>
                            {detectionMethod}
                        </span>
                    </div>
                </div>

                {/* Success Message */}
                <div className="rounded-lg bg-green-500/10 p-3 border border-green-400/20">
                    <p className="text-sm font-medium text-green-300">
                        ✅ ¡Felicidades! Has ganado este premio
                    </p>
                </div>

                {/* Spin Again Button */}
                {onSpinAgain && (
                    <Button
                        onClick={onSpinAgain}
                        disabled={disabled}
                        variant="success"
                        size="medium"
                        className="w-full"
                    >
                        🎰 Girar Otra Vez
                    </Button>
                )}
            </div>
        </Card>
    )
}

// ============================================================================
// CURRENT PANEL DISPLAY COMPONENT (Single Responsibility)
// ============================================================================

interface CurrentPanelDisplayProps {
    panel: WheelPanel | null
    detectionMethod?: 'raycast' | 'mathematical'
    className?: string
}

export function CurrentPanelDisplay({
    panel,
    detectionMethod = 'mathematical',
    className = ''
}: CurrentPanelDisplayProps) {
    if (!panel) {
        return null
    }

    const methodLabels = {
        raycast: 'Raycasting 3D',
        mathematical: 'Cálculo Matemático'
    }

    const methodColors = {
        raycast: 'text-green-400',
        mathematical: 'text-blue-400'
    }

    return (
        <Card title="🎯 Panel Actual" className={className}>
            <div className="text-center space-y-3">
                <div
                    className="inline-block rounded-lg px-4 py-2 font-semibold text-white"
                    style={{ backgroundColor: panel.color }}
                >
                    {panel.text}
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>ID:</span>
                        <span className="text-white font-mono">{panel.id}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Color:</span>
                        <span className="text-white font-mono">{panel.color}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Método:</span>
                        <span className={`font-semibold ${methodColors[detectionMethod]}`}>
                            {methodLabels[detectionMethod]}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

// ============================================================================
// DETECTION COMPARISON COMPONENT (Single Responsibility)
// ============================================================================

interface DetectionComparisonProps {
    mathematicalPanel: WheelPanel | null
    raycastPanel: WheelPanel | null
    className?: string
}

export function DetectionComparison({
    mathematicalPanel,
    raycastPanel,
    className = ''
}: DetectionComparisonProps) {
    if (!mathematicalPanel || !raycastPanel) {
        return null
    }

    const isMatch = mathematicalPanel.id === raycastPanel.id

    return (
        <Card title="⚖️ Comparación de Métodos" className={className}>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Coincidencia:</span>
                    <span className={`font-semibold ${isMatch ? 'text-green-400' : 'text-red-400'}`}>
                        {isMatch ? '✅ Sí' : '❌ No'}
                    </span>
                </div>

                {isMatch ? (
                    <div className="text-center text-green-400 text-sm">
                        Ambos métodos detectan el mismo panel correctamente
                    </div>
                ) : (
                    <div className="text-center text-red-400 text-sm">
                        Los métodos detectan paneles diferentes
                    </div>
                )}

                {/* Method Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-blue-500/10 p-2 rounded border border-blue-400/20">
                        <div className="font-semibold text-blue-300 mb-1">Matemático</div>
                        <div className="text-gray-300">{mathematicalPanel.text}</div>
                    </div>

                    <div className="bg-green-500/10 p-2 rounded border border-green-400/20">
                        <div className="font-semibold text-green-300 mb-1">Raycasting</div>
                        <div className="text-gray-300">{raycastPanel.text}</div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
