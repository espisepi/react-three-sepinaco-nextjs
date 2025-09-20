import React from 'react'
import { WheelPanel } from '@/types/wheel'

// ============================================================================
// PANEL DISPLAY COMPONENT (Single Responsibility)
// ============================================================================

interface PanelDisplayProps {
  panel: WheelPanel
  showTexture?: boolean
  showText?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function PanelDisplay({
  panel,
  showTexture = true,
  showText = true,
  size = 'medium',
  className = ''
}: PanelDisplayProps) {
  const sizeClasses = {
    small: 'size-8',
    medium: 'size-12',
    large: 'size-16'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Color/Texture Indicator */}
      <div className={`${sizeClasses[size]} rounded-full border-2 border-white/30 flex-shrink-0`}>
        {showTexture && panel.texture ? (
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={panel.texture}
              alt={panel.text}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: panel.color }}
          />
        )}
      </div>

      {/* Text */}
      {showText && (
        <span className={`${textSizeClasses[size]} text-white font-medium truncate`}>
          {panel.text}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// PANEL COLOR PICKER COMPONENT
// ============================================================================

interface PanelColorPickerProps {
  panel: WheelPanel
  onColorChange: (color: string) => void
  disabled?: boolean
  className?: string
}

export function PanelColorPicker({
  panel,
  onColorChange,
  disabled = false,
  className = ''
}: PanelColorPickerProps) {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onColorChange(event.target.value)
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="color"
        value={panel.color}
        onChange={handleColorChange}
        disabled={disabled}
        className={`size-8 cursor-pointer rounded border border-white/30 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/50'
          }`}
        title="Cambiar color del panel"
      />
      <span className="text-xs text-gray-300 font-mono">
        {panel.color}
      </span>
    </div>
  )
}

// ============================================================================
// PANEL TEXTURE UPLOAD COMPONENT
// ============================================================================

interface PanelTextureUploadProps {
  panel: WheelPanel
  onTextureChange: (texture: string | null) => void
  onTextureRemove: () => void
  disabled?: boolean
  className?: string
}

export function PanelTextureUpload({
  panel,
  onTextureChange,
  onTextureRemove,
  disabled = false,
  className = ''
}: PanelTextureUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && !disabled) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          onTextureChange(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={disabled}
        className="hidden"
        id={`texture-upload-${panel.id}`}
      />

      <label
        htmlFor={`texture-upload-${panel.id}`}
        className={`px-2 py-1 text-xs text-white rounded transition-colors ${disabled
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-purple-500 hover:bg-purple-600 cursor-pointer'
          }`}
      >
        📷 Subir
      </label>

      {panel.texture && (
        <>
          <div className="size-8 overflow-hidden rounded border border-white/30">
            <img
              src={panel.texture}
              alt={`Texture for ${panel.text}`}
              className="w-full h-full object-cover"
              style={{ position: "relative" }}
            />
          </div>
          <button
            onClick={onTextureRemove}
            disabled={disabled}
            className={`px-2 py-1 text-xs text-white rounded transition-colors ${disabled
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
              }`}
            title="Eliminar textura"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  )
}

// ============================================================================
// PANEL ACTIONS COMPONENT
// ============================================================================

interface PanelActionsProps {
  panel: WheelPanel
  onEdit: () => void
  onRemove: () => void
  onToggleTextControls: () => void
  onToggleTextureControls: () => void
  showTextControls: boolean
  showTextureControls: boolean
  canRemove: boolean
  disabled?: boolean
  className?: string
}

export function PanelActions({
  panel,
  onEdit,
  onRemove,
  onToggleTextControls,
  onToggleTextureControls,
  showTextControls,
  showTextureControls,
  canRemove,
  disabled = false,
  className = ''
}: PanelActionsProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={onEdit}
        disabled={disabled}
        className={`px-2 py-1 text-sm text-white rounded transition-colors ${disabled
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          }`}
        title="Editar texto"
      >
        ✏️
      </button>

      <button
        onClick={onToggleTextControls}
        disabled={disabled}
        className={`px-2 py-1 text-sm text-white rounded transition-colors ${disabled
          ? 'bg-gray-500 cursor-not-allowed'
          : showTextControls
            ? 'bg-orange-600 hover:bg-orange-700'
            : 'bg-orange-500 hover:bg-orange-600'
          }`}
        title={showTextControls ? 'Ocultar controles de texto' : 'Mostrar controles de texto'}
      >
        📝
      </button>

      <button
        onClick={onToggleTextureControls}
        disabled={disabled}
        className={`px-2 py-1 text-sm text-white rounded transition-colors ${disabled
          ? 'bg-gray-500 cursor-not-allowed'
          : showTextureControls
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-600 hover:bg-gray-700'
          }`}
        title={showTextureControls ? 'Ocultar controles de textura' : 'Mostrar controles de textura'}
      >
        👁️
      </button>

      <button
        onClick={onRemove}
        disabled={disabled || !canRemove}
        className={`px-2 py-1 text-sm text-white rounded transition-colors ${disabled || !canRemove
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600'
          }`}
        title={!canRemove ? 'No se puede eliminar el último panel' : 'Eliminar panel'}
      >
        🗑️
      </button>
    </div>
  )
}
