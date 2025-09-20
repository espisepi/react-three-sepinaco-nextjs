import React from 'react'
import { Slider, Button, Card, Message } from './UIComponents'

// ============================================================================
// SPIN DURATION CONTROL COMPONENT (Single Responsibility)
// ============================================================================

interface SpinDurationControlProps {
    duration: number
    onDurationChange: (duration: number) => void
    isSpinning: boolean
    remainingTime?: number
    disabled?: boolean
    className?: string
}

export function SpinDurationControl({
    duration,
    onDurationChange,
    isSpinning,
    remainingTime,
    disabled = false,
    className = ''
}: SpinDurationControlProps) {
    const quickDurations = [1, 2, 3, 5, 10]

    return (
        <Card title="⏱️ Duración del Giro" className={className}>
            <div className="space-y-4">
                {/* Duration Slider */}
                <Slider
                    value={duration}
                    min={1}
                    max={10}
                    step={0.5}
                    onChange={onDurationChange}
                    disabled={disabled || isSpinning}
                    label="Duración"
                    color="#8B5CF6"
                />

                {/* Quick Duration Buttons */}
                <div className="flex flex-wrap gap-2">
                    {quickDurations.map(quickDuration => (
                        <Button
                            key={quickDuration}
                            onClick={() => onDurationChange(quickDuration)}
                            disabled={disabled || isSpinning}
                            variant={duration === quickDuration ? 'primary' : 'secondary'}
                            size="small"
                            title={`${quickDuration} segundo${quickDuration !== 1 ? 's' : ''}`}
                        >
                            {quickDuration}s
                        </Button>
                    ))}
                </div>

                {/* Remaining Time Display */}
                {isSpinning && remainingTime !== undefined && (
                    <div className="rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 border border-orange-400/30">
                        <div className="text-center">
                            <div className="mb-2 text-2xl font-bold text-orange-400">
                                ⏰ {remainingTime.toFixed(1)}s
                            </div>
                            <div className="text-sm text-gray-300">
                                Tiempo restante de giro
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100"
                                    style={{
                                        width: `${Math.max(0, (remainingTime / duration) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-sm text-gray-300">
                        Ajusta cuánto tiempo quieres que gire la ruleta. Más tiempo = más vueltas.
                    </p>
                </div>
            </div>
        </Card>
    )
}

// ============================================================================
// SPIN CONTROL COMPONENT (Single Responsibility)
// ============================================================================

interface SpinControlProps {
    onSpin: () => void
    isSpinning: boolean
    canSpin: boolean
    panelCount: number
    disabled?: boolean
    className?: string
}

export function SpinControl({
    onSpin,
    isSpinning,
    canSpin,
    panelCount,
    disabled = false,
    className = ''
}: SpinControlProps) {
    const handleSpin = () => {
        if (canSpin && !disabled) {
            onSpin()
        }
    }

    return (
        <Card title="🎯 Control de la Ruleta" className={className}>
            <div className="space-y-3">
                <Button
                    onClick={handleSpin}
                    disabled={disabled || !canSpin}
                    variant={isSpinning ? 'secondary' : 'primary'}
                    size="large"
                    className="w-full"
                >
                    {isSpinning ? '🔄 Girando...' : '🎰 ¡GIRAR RULETA!'}
                </Button>

                {!canSpin && panelCount === 0 && (
                    <Message type="warning">
                        Agrega al menos un panel para poder girar
                    </Message>
                )}

                {!canSpin && panelCount > 0 && isSpinning && (
                    <Message type="info">
                        La ruleta está girando, espera a que termine
                    </Message>
                )}
            </div>
        </Card>
    )
}

// ============================================================================
// ORBIT CONTROLS TOGGLE COMPONENT (Single Responsibility)
// ============================================================================

interface OrbitControlsToggleProps {
    enabled: boolean
    onToggle: () => void
    disabled?: boolean
    className?: string
}

export function OrbitControlsToggle({
    enabled,
    onToggle,
    disabled = false,
    className = ''
}: OrbitControlsToggleProps) {
    return (
        <Card title="🎮 Controles de Cámara" className={className}>
            <div className="space-y-3">
                <Button
                    onClick={onToggle}
                    disabled={disabled}
                    variant={enabled ? 'warning' : 'primary'}
                    size="medium"
                    className="w-full"
                >
                    {enabled ? '🎮 Controles Activados' : '🚫 Controles Desactivados'}
                </Button>

                <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-sm text-gray-300">
                        {enabled
                            ? 'Puedes rotar, hacer zoom y mover la cámara con el mouse'
                            : 'Los controles de cámara están desactivados'
                        }
                    </p>
                </div>
            </div>
        </Card>
    )
}
