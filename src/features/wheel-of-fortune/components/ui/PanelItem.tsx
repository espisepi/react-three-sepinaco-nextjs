import React, { useState } from 'react'
import { WheelPanel } from '@/types/wheel'
import { Input, Button, Card, Message } from './UIComponents'
import { PanelDisplay, PanelColorPicker, PanelTextureUpload, PanelActions } from './PanelComponents'
import { TextureControls, TextControls } from './ControlComponents'

// ============================================================================
// PANEL ITEM COMPONENT (Composition of smaller components)
// ============================================================================

interface PanelItemProps {
    panel: WheelPanel
    onUpdateText: (id: string, text: string) => void
    onUpdateColor: (id: string, color: string) => void
    onUpdateTexture: (id: string, texture: string | null) => void
    onUpdateTextureScale: (id: string, scale: number) => void
    onUpdateTextureRotation: (id: string, rotation: number) => void
    onUpdateTextureOffset: (id: string, offsetX: number, offsetY: number) => void
    onUpdateTextPosition: (id: string, x: number, y: number, z: number) => void
    onUpdateTextRotation: (id: string, x: number, y: number, z: number) => void
    onUpdateTextScale: (id: string, x: number, y: number, z: number) => void
    onRemove: (id: string) => void
    canRemove: boolean
    disabled?: boolean
    className?: string
}

export function PanelItem({
    panel,
    onUpdateText,
    onUpdateColor,
    onUpdateTexture,
    onUpdateTextureScale,
    onUpdateTextureRotation,
    onUpdateTextureOffset,
    onUpdateTextPosition,
    onUpdateTextRotation,
    onUpdateTextScale,
    onRemove,
    canRemove,
    disabled = false,
    className = ''
}: PanelItemProps) {
    const [editingText, setEditingText] = useState(false)
    const [editText, setEditText] = useState(panel.text)
    const [editingColor, setEditingColor] = useState(false)
    const [editColor, setEditColor] = useState(panel.color)
    const [showTextureControls, setShowTextureControls] = useState(false)
    const [showTextControls, setShowTextControls] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEditText = () => {
        setEditingText(true)
        setEditText(panel.text)
    }

    const handleSaveText = () => {
        try {
            if (editText.trim()) {
                onUpdateText(panel.id, editText.trim())
                setEditingText(false)
                setError(null)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el texto')
        }
    }

    const handleCancelText = () => {
        setEditingText(false)
        setEditText(panel.text)
        setError(null)
    }

    const handleEditColor = () => {
        setEditingColor(true)
        setEditColor(panel.color)
    }

    const handleColorChange = (newColor: string) => {
        setEditColor(newColor)
        try {
            onUpdateColor(panel.id, newColor)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el color')
        }
    }

    const handleSaveColor = () => {
        setEditingColor(false)
        setError(null)
    }

    const handleCancelColor = () => {
        setEditingColor(false)
        setEditColor(panel.color)
        onUpdateColor(panel.id, panel.color)
        setError(null)
    }

    const handleTextureChange = async (texture: string | null) => {
        try {
            await onUpdateTexture(panel.id, texture)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar la textura')
        }
    }

    const handleTextureRemove = () => {
        try {
            onUpdateTexture(panel.id, null)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la textura')
        }
    }

    const handleRemove = () => {
        try {
            onRemove(panel.id)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el panel')
        }
    }

    const handleResetText = () => {
        try {
            onUpdateTextPosition(panel.id, 0, 0, 0)
            onUpdateTextRotation(panel.id, 0, 0, 0)
            onUpdateTextScale(panel.id, 1, 1, 1)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al restablecer el texto')
        }
    }

    return (
        <Card className={`space-y-3 ${className}`}>
            {/* Error Message */}
            {error && (
                <Message type="error" onClose={() => setError(null)}>
                    {error}
                </Message>
            )}

            {/* Panel Header */}
            <div className="flex items-center space-x-3">
                {/* Color/Texture Display */}
                {editingColor ? (
                    <div className="flex items-center space-x-2">
                        <PanelColorPicker
                            panel={{ ...panel, color: editColor }}
                            onColorChange={handleColorChange}
                            disabled={disabled}
                        />
                        <Button onClick={handleSaveColor} size="small" variant="success">
                            ✓
                        </Button>
                        <Button onClick={handleCancelColor} size="small" variant="danger">
                            ✗
                        </Button>
                    </div>
                ) : (
                    <div
                        className="size-6 cursor-pointer rounded-full border-2 border-white/30 transition-transform hover:scale-110"
                        style={{ backgroundColor: panel.color }}
                        onClick={handleEditColor}
                        title="Haz clic para cambiar el color"
                    />
                )}

                {/* Text Display/Edit */}
                {editingText ? (
                    <div className="flex flex-1 space-x-2">
                        <Input
                            value={editText}
                            onChange={setEditText}
                            disabled={disabled}
                            className="flex-1"
                        />
                        <Button onClick={handleSaveText} size="small" variant="success">
                            ✓
                        </Button>
                        <Button onClick={handleCancelText} size="small" variant="danger">
                            ✗
                        </Button>
                    </div>
                ) : (
                    <>
                        <span className="flex-1 text-white font-medium">{panel.text}</span>
                        <PanelActions
                            panel={panel}
                            onEdit={handleEditText}
                            onRemove={handleRemove}
                            onToggleTextControls={() => setShowTextControls(!showTextControls)}
                            onToggleTextureControls={() => setShowTextureControls(!showTextureControls)}
                            showTextControls={showTextControls}
                            showTextureControls={showTextureControls}
                            canRemove={canRemove}
                            disabled={disabled}
                        />
                    </>
                )}
            </div>

            {/* Texture Upload */}
            <div className="ml-3">
                <PanelTextureUpload
                    panel={panel}
                    onTextureChange={handleTextureChange}
                    onTextureRemove={handleTextureRemove}
                    disabled={disabled}
                />
            </div>

            {/* Texture Controls */}
            {panel.texture && showTextureControls && (
                <div className="ml-3 rounded-lg bg-purple-500/10 p-3 border border-purple-400/20">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-purple-300">Controles de Textura</h4>
                        <Button
                            onClick={() => setShowTextureControls(false)}
                            size="small"
                            variant="secondary"
                        >
                            ✕
                        </Button>
                    </div>

                    <TextureControls
                        panel={panel}
                        onScaleChange={(scale) => onUpdateTextureScale(panel.id, scale)}
                        onRotationChange={(rotation) => onUpdateTextureRotation(panel.id, rotation)}
                        onOffsetChange={(offsetX, offsetY) => onUpdateTextureOffset(panel.id, offsetX, offsetY)}
                        disabled={disabled}
                    />
                </div>
            )}

            {/* Text Controls */}
            {showTextControls && (
                <div className="ml-3 rounded-lg bg-orange-500/10 p-3 border border-orange-400/20">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-orange-300">Controles de Texto</h4>
                        <Button
                            onClick={() => setShowTextControls(false)}
                            size="small"
                            variant="secondary"
                        >
                            ✕
                        </Button>
                    </div>

                    <TextControls
                        panel={panel}
                        onPositionChange={(x, y, z) => onUpdateTextPosition(panel.id, x, y, z)}
                        onRotationChange={(x, y, z) => onUpdateTextRotation(panel.id, x, y, z)}
                        onScaleChange={(x, y, z) => onUpdateTextScale(panel.id, x, y, z)}
                        onReset={handleResetText}
                        disabled={disabled}
                    />
                </div>
            )}
        </Card>
    )
}
