import React from 'react'
import { WheelPanel } from '@/types/wheel'
import { Button, Card, Loading } from './UIComponents'
import { PanelItem } from './PanelItem'

// ============================================================================
// PANEL LIST COMPONENT (Single Responsibility)
// ============================================================================

interface PanelListProps {
    panels: WheelPanel[]
    onAddPanel: () => void
    onUpdateText: (id: string, text: string) => void
    onUpdateColor: (id: string, color: string) => void
    onUpdateTexture: (id: string, texture: string | null) => void
    onUpdateTextureScale: (id: string, scale: number) => void
    onUpdateTextureRotation: (id: string, rotation: number) => void
    onUpdateTextureOffset: (id: string, offsetX: number, offsetY: number) => void
    onUpdateTextPosition: (id: string, x: number, y: number, z: number) => void
    onUpdateTextRotation: (id: string, x: number, y: number, z: number) => void
    onUpdateTextScale: (id: string, x: number, y: number, z: number) => void
    onRemovePanel: (id: string) => void
    disabled?: boolean
    loading?: boolean
    className?: string
}

export function PanelList({
    panels,
    onAddPanel,
    onUpdateText,
    onUpdateColor,
    onUpdateTexture,
    onUpdateTextureScale,
    onUpdateTextureRotation,
    onUpdateTextureOffset,
    onUpdateTextPosition,
    onUpdateTextRotation,
    onUpdateTextScale,
    onRemovePanel,
    disabled = false,
    loading = false,
    className = ''
}: PanelListProps) {
    if (loading) {
        return (
            <Card title="📝 Paneles" className={className}>
                <Loading text="Cargando paneles..." />
            </Card>
        )
    }

    return (
        <Card title="📝 Paneles" className={className}>
            {/* Header with Add Button */}
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-300">
                    Total: {panels.length} panel{panels.length !== 1 ? 'es' : ''}
                </span>
                <Button
                    onClick={onAddPanel}
                    disabled={disabled}
                    variant="success"
                    size="small"
                >
                    + Agregar Panel
                </Button>
            </div>

            {/* Panels List */}
            <div className="max-h-96 space-y-3 overflow-y-auto">
                {panels.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p>No hay paneles en la ruleta</p>
                        <p className="text-sm">Haz clic en "Agregar Panel" para crear el primero</p>
                    </div>
                ) : (
                    panels.map((panel) => (
                        <PanelItem
                            key={panel.id}
                            panel={panel}
                            onUpdateText={onUpdateText}
                            onUpdateColor={onUpdateColor}
                            onUpdateTexture={onUpdateTexture}
                            onUpdateTextureScale={onUpdateTextureScale}
                            onUpdateTextureRotation={onUpdateTextureRotation}
                            onUpdateTextureOffset={onUpdateTextureOffset}
                            onUpdateTextPosition={onUpdateTextPosition}
                            onUpdateTextRotation={onUpdateTextRotation}
                            onUpdateTextScale={onUpdateTextScale}
                            onRemove={onRemovePanel}
                            canRemove={panels.length > 1}
                            disabled={disabled}
                        />
                    ))
                )}
            </div>

            {/* Instructions */}
            <div className="mt-4 rounded-lg bg-white/5 p-3">
                <h4 className="mb-2 text-sm font-semibold text-white">ℹ️ Instrucciones</h4>
                <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Haz clic en el círculo de color para cambiarlo</li>
                    <li>• Haz clic en ✏️ para editar el texto del panel</li>
                    <li>• Sube imágenes como texturas para personalizar paneles</li>
                    <li>• Usa 📝 para mostrar controles de texto 3D</li>
                    <li>• Usa 👁️ para mostrar controles de textura</li>
                    <li>• Necesitas al menos un panel para poder girar</li>
                </ul>
            </div>
        </Card>
    )
}

// ============================================================================
// PANEL SUMMARY COMPONENT (Single Responsibility)
// ============================================================================

interface PanelSummaryProps {
    panels: WheelPanel[]
    className?: string
}

export function PanelSummary({ panels, className = '' }: PanelSummaryProps) {
    const colorCounts = panels.reduce((acc, panel) => {
        acc[panel.color] = (acc[panel.color] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const textureCount = panels.filter(panel => panel.texture).length

    return (
        <Card title="📊 Resumen de Paneles" className={className}>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Total:</span>
                        <span className="text-white font-semibold">{panels.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Con textura:</span>
                        <span className="text-white font-semibold">{textureCount}</span>
                    </div>
                </div>

                {Object.keys(colorCounts).length > 0 && (
                    <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-300">Colores utilizados:</h5>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(colorCounts).map(([color, count]) => (
                                <div key={color} className="flex items-center space-x-1">
                                    <div
                                        className="size-4 rounded-full border border-white/30"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-gray-300">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
