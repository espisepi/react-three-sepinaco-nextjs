import React, { useState, useEffect } from 'react'
import { WheelPanel } from '@/types/wheel'
import { useWheelManager } from '../../hooks/useWheelManager'
import {
    PanelList,
    SpinDurationControl,
    SpinControl,
    OrbitControlsToggle,
    WheelResult,
    CurrentPanelDisplay,
    DetectionComparison,
    CanvasSizeControl,
    ConfigurationSummary,
} from './ui'

// ============================================================================
// MAIN WHEEL CONTROLS COMPONENT (Composition of smaller components)
// ============================================================================

interface WheelControlsProps {
    className?: string
}

export function WheelControls({ className = '' }: WheelControlsProps) {
    const wheelManager = useWheelManager()
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

    // Show message helper
    const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage(null), 3000)
    }

    // Handle spin with error handling
    const handleSpin = async () => {
        try {
            wheelManager.startSpin()
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al girar la ruleta')
        }
    }

    // Handle spin complete
    const handleSpinComplete = (selectedPanel: WheelPanel) => {
        wheelManager.completeSpin(selectedPanel)
    }

    // Handle add panel with error handling
    const handleAddPanel = async () => {
        try {
            wheelManager.addPanel()
            showMessage('success', 'Panel agregado exitosamente')
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al agregar panel')
        }
    }

    // Handle remove panel with error handling
    const handleRemovePanel = async (id: string) => {
        try {
            wheelManager.removePanel(id)
            showMessage('success', 'Panel eliminado exitosamente')
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al eliminar panel')
        }
    }

    // Handle panel updates with error handling
    const handleUpdatePanelText = async (id: string, text: string) => {
        try {
            wheelManager.updatePanelText(id, text)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar texto')
        }
    }

    const handleUpdatePanelColor = async (id: string, color: string) => {
        try {
            wheelManager.updatePanelColor(id, color)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar color')
        }
    }

    const handleUpdatePanelTexture = async (id: string, texture: string | null) => {
        try {
            await wheelManager.updatePanelTexture(id, texture)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar textura')
        }
    }

    const handleUpdatePanelTextureScale = async (id: string, scale: number) => {
        try {
            wheelManager.updatePanelTextureScale(id, scale)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar escala')
        }
    }

    const handleUpdatePanelTextureRotation = async (id: string, rotation: number) => {
        try {
            wheelManager.updatePanelTextureRotation(id, rotation)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar rotación')
        }
    }

    const handleUpdatePanelTextureOffset = async (id: string, offsetX: number, offsetY: number) => {
        try {
            wheelManager.updatePanelTextureOffset(id, offsetX, offsetY)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar posición')
        }
    }

    const handleUpdateTextPosition = async (id: string, x: number, y: number, z: number) => {
        try {
            wheelManager.updateTextPosition(id, x, y, z)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar posición del texto')
        }
    }

    const handleUpdateTextRotation = async (id: string, x: number, y: number, z: number) => {
        try {
            wheelManager.updateTextRotation(id, x, y, z)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar rotación del texto')
        }
    }

    const handleUpdateTextScale = async (id: string, x: number, y: number, z: number) => {
        try {
            wheelManager.updateTextScale(id, x, y, z)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar escala del texto')
        }
    }

    // Handle configuration changes with error handling
    const handleSpinDurationChange = async (duration: number) => {
        try {
            wheelManager.updateSpinDuration(duration)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al actualizar duración')
        }
    }

    const handleOrbitControlsToggle = async () => {
        try {
            wheelManager.updateOrbitControls(!wheelManager.config.enableOrbitControls)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al cambiar controles')
        }
    }

    const handleCanvasSizeChange = async (width: number, height: number) => {
        try {
            wheelManager.updateCanvasSize(width, height)
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'Error al cambiar tamaño')
        }
    }

    // Calculate remaining time
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (wheelManager.ui.isSpinning) {
            const startTime = Date.now()
            wheelManager.setRemainingTime(wheelManager.config.spinDuration)

            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000
                const remaining = Math.max(0, wheelManager.config.spinDuration - elapsed)

                if (remaining <= 0) {
                    wheelManager.setRemainingTime(0)
                    if (interval) {
                        clearInterval(interval)
                    }
                } else {
                    wheelManager.setRemainingTime(remaining)
                }
            }, 100)
        } else {
            wheelManager.setRemainingTime(undefined)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [wheelManager.ui.isSpinning, wheelManager.config.spinDuration])

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Message Display */}
            {message && (
                <div className={`rounded-lg p-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Result Display */}
            {wheelManager.ui.result && (
                <WheelResult
                    result={wheelManager.ui.result}
                    raycastResult={wheelManager.ui.raycastHitPanel}
                    onSpinAgain={handleSpin}
                    disabled={wheelManager.ui.isSpinning}
                />
            )}

            {/* Current Panel Display */}
            {wheelManager.ui.currentPanel && (
                <CurrentPanelDisplay
                    panel={wheelManager.ui.currentPanel}
                    detectionMethod="mathematical"
                />
            )}

            {/* Raycast Panel Display */}
            {wheelManager.ui.raycastHitPanel && (
                <CurrentPanelDisplay
                    panel={wheelManager.ui.raycastHitPanel}
                    detectionMethod="raycast"
                />
            )}

            {/* Detection Comparison */}
            {wheelManager.ui.currentPanel && wheelManager.ui.raycastHitPanel && (
                <DetectionComparison
                    mathematicalPanel={wheelManager.ui.currentPanel}
                    raycastPanel={wheelManager.ui.raycastHitPanel}
                />
            )}

            {/* Spin Controls */}
            <SpinControl
                onSpin={handleSpin}
                isSpinning={wheelManager.ui.isSpinning}
                canSpin={wheelManager.canSpin()}
                panelCount={wheelManager.config.panels.length}
                disabled={!wheelManager.ui.isLoaded}
            />

            {/* Orbit Controls Toggle */}
            <OrbitControlsToggle
                enabled={wheelManager.config.enableOrbitControls}
                onToggle={handleOrbitControlsToggle}
                disabled={wheelManager.ui.isSpinning}
            />

            {/* Spin Duration Control */}
            <SpinDurationControl
                duration={wheelManager.config.spinDuration}
                onDurationChange={handleSpinDurationChange}
                isSpinning={wheelManager.ui.isSpinning}
                remainingTime={wheelManager.ui.remainingTime}
                disabled={!wheelManager.ui.isLoaded}
            />

            {/* Panel List */}
            <PanelList
                panels={wheelManager.config.panels}
                onAddPanel={handleAddPanel}
                onUpdateText={handleUpdatePanelText}
                onUpdateColor={handleUpdatePanelColor}
                onUpdateTexture={handleUpdatePanelTexture}
                onUpdateTextureScale={handleUpdatePanelTextureScale}
                onUpdateTextureRotation={handleUpdatePanelTextureRotation}
                onUpdateTextureOffset={handleUpdatePanelTextureOffset}
                onUpdateTextPosition={handleUpdateTextPosition}
                onUpdateTextRotation={handleUpdateTextRotation}
                onUpdateTextScale={handleUpdateTextScale}
                onRemovePanel={handleRemovePanel}
                disabled={wheelManager.ui.isSpinning}
                loading={!wheelManager.ui.isLoaded}
            />

            {/* Canvas Size Control */}
            <CanvasSizeControl
                width={wheelManager.config.canvasWidth}
                height={wheelManager.config.canvasHeight}
                onSizeChange={handleCanvasSizeChange}
                disabled={wheelManager.ui.isSpinning}
            />

            {/* Configuration Summary */}
            <ConfigurationSummary
                panelCount={wheelManager.config.panels.length}
                spinDuration={wheelManager.config.spinDuration}
                enableOrbitControls={wheelManager.config.enableOrbitControls}
                canvasWidth={wheelManager.config.canvasWidth}
                canvasHeight={wheelManager.config.canvasHeight}
                version={wheelManager.config.version}
                lastUpdated={wheelManager.config.updatedAt}
            />
        </div>
    )
}
