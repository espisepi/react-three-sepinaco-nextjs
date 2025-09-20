'use client'

import Image from 'next/image'
import { useState } from 'react'
import { WheelPanel } from '@/types/wheel'

interface WheelControlsProps {
  panels: WheelPanel[]
  isSpinning: boolean
  onSpin: () => void
  onAddPanel: () => void
  onRemovePanel: (id: string) => void
  onUpdatePanel: (id: string, text: string) => void
  onUpdatePanelColor: (id: string, color: string) => void
  onUpdatePanelTexture: (id: string, texture: string | null) => void
  onUpdatePanelTextureScale: (id: string, scale: number) => void
  onUpdatePanelTextureRotation: (id: string, rotation: number) => void
  onUpdatePanelTextureOffset: (id: string, offsetX: number, offsetY: number) => void
  onUpdateTextPosition: (id: string, x: number, y: number, z: number) => void
  onUpdateTextRotation: (id: string, x: number, y: number, z: number) => void
  onUpdateTextScale: (id: string, x: number, y: number, z: number) => void
  spinDuration: number
  onSpinDurationChange: (duration: number) => void
  remainingTime?: number
  result?: WheelPanel | null
  raycastResult?: WheelPanel | null
}

export function WheelControls({
  panels,
  isSpinning,
  onSpin,
  onAddPanel,
  onRemovePanel,
  onUpdatePanel,
  onUpdatePanelColor,
  onUpdatePanelTexture,
  onUpdatePanelTextureScale,
  onUpdatePanelTextureRotation,
  onUpdatePanelTextureOffset,
  onUpdateTextPosition,
  onUpdateTextRotation,
  onUpdateTextScale,
  spinDuration,
  onSpinDurationChange,
  remainingTime,
  result,
  raycastResult
}: WheelControlsProps) {
  const [editingPanel, setEditingPanel] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [editColor, setEditColor] = useState('')
  const [originalColor, setOriginalColor] = useState<string>('')
  const [showTextureControls, setShowTextureControls] = useState<Map<string, boolean>>(new Map())
  const [showTextControls, setShowTextControls] = useState<Record<string, boolean>>({})

  const handleImageUpload = (panelId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onUpdatePanelTexture(panelId, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveTexture = (panelId: string) => {
    onUpdatePanelTexture(panelId, null)
  }

  const toggleTextureControls = (panelId: string) => {
    setShowTextureControls(prev => {
      const newMap = new Map(prev)
      newMap.set(panelId, !newMap.get(panelId))
      return newMap
    })
  }

  const toggleTextControls = (panelId: string) => {
    setShowTextControls(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }))
  }

  const handleEditStart = (panel: WheelPanel) => {
    setEditingPanel(panel.id)
    setEditText(panel.text)
  }

  const handleEditSave = () => {
    if (editingPanel && editText.trim()) {
      onUpdatePanel(editingPanel, editText.trim())
      setEditingPanel(null)
      setEditText('')
    }
  }

  const handleEditCancel = () => {
    setEditingPanel(null)
    setEditText('')
  }

  const handleColorEditStart = (panel: WheelPanel) => {
    setEditingColor(panel.id)
    setEditColor(panel.color)
    setOriginalColor(panel.color)
  }

  const handleColorChange = (newColor: string) => {
    setEditColor(newColor)
    // Actualizar en tiempo real
    if (editingColor) {
      onUpdatePanelColor(editingColor, newColor)
    }
  }

  const handleColorEditSave = () => {
    // El color ya se está actualizando en tiempo real, solo cerramos la edición
    setEditingColor(null)
    setEditColor('')
    setOriginalColor('')
  }

  const handleColorEditCancel = () => {
    // Restaurar el color original
    if (editingColor && originalColor) {
      onUpdatePanelColor(editingColor, originalColor)
    }
    setEditingColor(null)
    setEditColor('')
    setOriginalColor('')
  }

  return (
    <div className='space-y-6'>
      {/* Control de duración del giro */}
      <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
        <h3 className='mb-4 text-xl font-bold text-white'>⏱️ Duración del Giro</h3>
        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-300'>
              Duración: {spinDuration} segundos
            </label>
            <input
              type='range'
              min='1'
              max='10'
              step='0.5'
              value={spinDuration}
              onChange={(e) => onSpinDurationChange(parseFloat(e.target.value))}
              disabled={isSpinning}
              className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
            />
            <div className='mt-1 flex justify-between text-xs text-gray-400'>
              <span>1s</span>
              <span>10s</span>
            </div>
          </div>

          {/* Contador de tiempo restante */}
          {isSpinning && remainingTime !== undefined && (
            <div className='rounded-lg border border-orange-400/30 bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 backdrop-blur-sm'>
              <div className='text-center'>
                <div className='mb-2 text-2xl font-bold text-orange-400'>
                  ⏰ {remainingTime.toFixed(1)}s
                </div>
                <div className='text-sm text-gray-300'>
                  Tiempo restante de giro
                </div>
                <div className='mt-2 h-2 w-full rounded-full bg-gray-700'>
                  <div
                    className='h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100'
                    style={{
                      width: `${Math.max(0, (remainingTime / spinDuration) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <p className='text-sm text-gray-300'>
            Ajusta cuánto tiempo quieres que gire la ruleta. Más tiempo = más vueltas.
          </p>
        </div>
      </div>

      {/* Resultado del giro */}
      {result && (
        <div className='rounded-xl border border-green-400/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-bold text-white'>🏆 Resultado del Giro</h3>
          <div className='text-center'>
            <div className='mb-4'>
              <div
                className='inline-block rounded-xl px-6 py-3 text-lg font-bold text-white shadow-lg'
                style={{ backgroundColor: result.color }}
              >
                🎉 {result.text} 🎉
              </div>
            </div>
            <div className='space-y-2 text-sm text-gray-300'>
              <div className='flex justify-between'>
                <span>Panel Ganador:</span>
                <span className='font-semibold text-white'>{result.text}</span>
              </div>
              <div className='flex justify-between'>
                <span>ID:</span>
                <span className='font-mono text-white'>{result.id}</span>
              </div>
              <div className='flex justify-between'>
                <span>Color:</span>
                <span className='font-mono text-white'>{result.color}</span>
              </div>
            </div>
            <div className='mt-4 rounded-lg border border-green-400/20 bg-green-500/10 p-3'>
              <p className='text-sm font-medium text-green-300'>
                ✅ ¡Felicidades! Has ganado este premio
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gestión de paneles */}
      <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold text-white'>📝 Paneles ({panels.length})</h3>
          <button
            onClick={onAddPanel}
            className='rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600'
          >
            + Agregar
          </button>
        </div>

        <div className='max-h-64 space-y-3 overflow-y-auto'>
          {panels.map((panel) => (
            <div key={panel.id} className='space-y-2'>
              <div className='flex items-center space-x-3 rounded-lg bg-white/5 p-3'>
                {/* Color indicator */}
                {editingColor === panel.id ? (
                  <div className='flex items-center space-x-2'>
                    <input
                      type='color'
                      value={editColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className='size-8 cursor-pointer rounded border border-white/30'
                    />
                    <button
                      onClick={handleColorEditSave}
                      className='rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600'
                      title='Confirmar color'
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleColorEditCancel}
                      className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600'
                      title='Restaurar color anterior'
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div
                    className='size-6 cursor-pointer rounded-full border-2 border-white/30 transition-transform hover:scale-110'
                    style={{ backgroundColor: panel.color }}
                    onClick={() => handleColorEditStart(panel)}
                    title='Haz clic para cambiar el color'
                  />
                )}

                {/* Panel text */}
                {editingPanel === panel.id ? (
                  <div className='flex flex-1 space-x-2'>
                    <input
                      type='text'
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className='flex-1 rounded border border-white/30 bg-white/20 px-3 py-1 text-white focus:border-white/50 focus:outline-none'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave()
                        if (e.key === 'Escape') handleEditCancel()
                      }}
                    />
                    <button
                      onClick={handleEditSave}
                      className='rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600'
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600'
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <>
                    <span className='flex-1 font-medium text-white'>{panel.text}</span>
                    <button
                      onClick={() => handleEditStart(panel)}
                      className='rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600'
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => toggleTextControls(panel.id)}
                      className={`rounded px-2 py-1 text-sm text-white transition-colors ${showTextControls[panel.id]
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                      title={showTextControls[panel.id] ? 'Ocultar controles de texto' : 'Mostrar controles de texto'}
                    >
                      📝
                    </button>
                    <button
                      onClick={() => onRemovePanel(panel.id)}
                      disabled={panels.length <= 1}
                      className={`rounded px-2 py-1 text-sm text-white transition-colors ${panels.length <= 1
                        ? 'cursor-not-allowed bg-gray-500'
                        : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>

              {/* Image upload section */}
              <div className='ml-3 space-y-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1'>
                    <label className='mb-1 block text-xs text-gray-400'>Imagen de textura:</label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(panel.id, e)}
                        className='hidden'
                        id={`image-upload-${panel.id}`}
                      />
                      <label
                        htmlFor={`image-upload-${panel.id}`}
                        className='cursor-pointer rounded bg-purple-500 px-2 py-1 text-xs text-white transition-colors hover:bg-purple-600'
                      >
                        📷 Subir
                      </label>
                      {panel.texture && (
                        <>
                          <div style={{ position: "relative" }} className='size-8 overflow-hidden rounded border border-white/30'>
                            <Image
                              src={panel.texture}
                              alt={`Texture for ${panel.text}`}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <button
                            onClick={() => toggleTextureControls(panel.id)}
                            className={`rounded px-2 py-1 text-xs text-white transition-colors ${showTextureControls.get(panel.id)
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-600 hover:bg-gray-700'
                              }`}
                            title={showTextureControls.get(panel.id) ? 'Ocultar controles' : 'Mostrar controles'}
                          >
                            {showTextureControls.get(panel.id) ? '👁️' : '👁️‍🗨️'}
                          </button>
                          <button
                            onClick={() => handleRemoveTexture(panel.id)}
                            className='rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'
                            title='Eliminar textura'
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Texture scale and rotation controls */}
                {panel.texture && showTextureControls.get(panel.id) && (
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
                          onChange={(e) => onUpdatePanelTextureScale(panel.id, parseFloat(e.target.value))}
                          className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                          style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((panel.textureScale || 1) - 0.1) / (30 - 0.1) * 100}%, #374151 ${((panel.textureScale || 1) - 0.1) / (30 - 0.1) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className='flex space-x-1'>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 0.5)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 0.5 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Pequeña (0.5x)'
                          >
                            🔍-
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 1)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 1 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Normal (1x)'
                          >
                            📐
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 2)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 2 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Grande (2x)'
                          >
                            🔍+
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 5)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 5 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Muy Grande (5x)'
                          >
                            5x
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 10)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 10 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Extra Grande (10x)'
                          >
                            10x
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 20)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 20 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Máximo (20x)'
                          >
                            20x
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 30)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureScale || 1) === 30 ? 'bg-purple-600' : 'bg-gray-600'}`}
                            title='Ultra Máximo (30x)'
                          >
                            30x
                          </button>
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
                          onChange={(e) => onUpdatePanelTextureRotation(panel.id, parseFloat(e.target.value))}
                          className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                          style={{
                            background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className='flex space-x-1'>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 0)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === 0 ? 'bg-green-600' : 'bg-gray-600'}`}
                            title='0° - Sin rotación'
                          >
                            ↕️
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 90)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === 90 ? 'bg-green-600' : 'bg-gray-600'}`}
                            title='90° - Rotación derecha'
                          >
                            ↻
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 180)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === 180 ? 'bg-green-600' : 'bg-gray-600'}`}
                            title='180° - Voltear'
                          >
                            ↕️
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 270)}
                            className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === 270 ? 'bg-green-600' : 'bg-gray-600'}`}
                            title='270° - Rotación izquierda'
                          >
                            ↺
                          </button>
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
                            onChange={(e) => onUpdatePanelTextureOffset(panel.id, parseFloat(e.target.value), panel.textureOffsetY || 0)}
                            className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                          />
                          <div className='flex space-x-1'>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, -1, panel.textureOffsetY || 0)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetX || 0) === -1 ? 'bg-red-600' : 'bg-gray-600'}`}
                              title='Izquierda (-1)'
                            >
                              ←
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, 0, panel.textureOffsetY || 0)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetX || 0) === 0 ? 'bg-red-600' : 'bg-gray-600'}`}
                              title='Centro (0)'
                            >
                              ↕️
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, 1, panel.textureOffsetY || 0)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetX || 0) === 1 ? 'bg-red-600' : 'bg-gray-600'}`}
                              title='Derecha (1)'
                            >
                              →
                            </button>
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
                            onChange={(e) => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, parseFloat(e.target.value))}
                            className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                          />
                          <div className='flex space-x-1'>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, -1)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetY || 0) === -1 ? 'bg-blue-600' : 'bg-gray-600'}`}
                              title='Arriba (-1)'
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, 0)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetY || 0) === 0 ? 'bg-blue-600' : 'bg-gray-600'}`}
                              title='Centro (0)'
                            >
                              ↕️
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, 1)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureOffsetY || 0) === 1 ? 'bg-blue-600' : 'bg-gray-600'}`}
                              title='Abajo (1)'
                            >
                              ↓
                            </button>
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
                )}

                {/* Text controls section */}
                {!!showTextControls[panel.id] && (
                  <div className='ml-3 space-y-3 rounded-lg border border-orange-400/20 bg-orange-500/10 p-3'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-sm font-semibold text-orange-300'>Controles de Texto</h4>
                      <button
                        onClick={() => toggleTextControls(panel.id)}
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
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            X: {(panel.textPositionX || 0).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='-2'
                            max='2'
                            step='0.1'
                            value={panel.textPositionX || 0}
                            onChange={(e) => onUpdateTextPosition(panel.id, parseFloat(e.target.value), panel.textPositionY || 0, panel.textPositionZ || 0)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textPositionX || 0) + 2) / 4 * 100}%, #374151 ${((panel.textPositionX || 0) + 2) / 4 * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Y: {(panel.textPositionY || 0).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='-2'
                            max='2'
                            step='0.1'
                            value={panel.textPositionY || 0}
                            onChange={(e) => onUpdateTextPosition(panel.id, panel.textPositionX || 0, parseFloat(e.target.value), panel.textPositionZ || 0)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textPositionY || 0) + 2) / 4 * 100}%, #374151 ${((panel.textPositionY || 0) + 2) / 4 * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Z: {(panel.textPositionZ || 0).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='-2'
                            max='2'
                            step='0.1'
                            value={panel.textPositionZ || 0}
                            onChange={(e) => onUpdateTextPosition(panel.id, panel.textPositionX || 0, panel.textPositionY || 0, parseFloat(e.target.value))}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textPositionZ || 0) + 2) / 4 * 100}%, #374151 ${((panel.textPositionZ || 0) + 2) / 4 * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rotation controls */}
                    <div className='space-y-2'>
                      <h5 className='text-xs font-medium text-orange-200'>Rotación</h5>
                      <div className='space-y-1'>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            X: {panel.textRotationX || 0}°
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='360'
                            step='15'
                            value={panel.textRotationX || 0}
                            onChange={(e) => onUpdateTextRotation(panel.id, parseFloat(e.target.value), panel.textRotationY || 0, panel.textRotationZ || 0)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textRotationX || 0) / 360) * 100}%, #374151 ${((panel.textRotationX || 0) / 360) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Y: {panel.textRotationY || 0}°
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='360'
                            step='15'
                            value={panel.textRotationY || 0}
                            onChange={(e) => onUpdateTextRotation(panel.id, panel.textRotationX || 0, parseFloat(e.target.value), panel.textRotationZ || 0)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textRotationY || 0) / 360) * 100}%, #374151 ${((panel.textRotationY || 0) / 360) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Z: {panel.textRotationZ || 0}°
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='360'
                            step='15'
                            value={panel.textRotationZ || 0}
                            onChange={(e) => onUpdateTextRotation(panel.id, panel.textRotationX || 0, panel.textRotationY || 0, parseFloat(e.target.value))}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textRotationZ || 0) / 360) * 100}%, #374151 ${((panel.textRotationZ || 0) / 360) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scale controls */}
                    <div className='space-y-2'>
                      <h5 className='text-xs font-medium text-orange-200'>Escala</h5>
                      <div className='space-y-1'>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            X: {(panel.textScaleX || 1).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='0.1'
                            max='3'
                            step='0.1'
                            value={panel.textScaleX || 1}
                            onChange={(e) => onUpdateTextScale(panel.id, parseFloat(e.target.value), panel.textScaleY || 1, panel.textScaleZ || 1)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textScaleX || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 ${((panel.textScaleX || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Y: {(panel.textScaleY || 1).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='0.1'
                            max='3'
                            step='0.1'
                            value={panel.textScaleY || 1}
                            onChange={(e) => onUpdateTextScale(panel.id, panel.textScaleX || 1, parseFloat(e.target.value), panel.textScaleZ || 1)}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textScaleY || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 ${((panel.textScaleY || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='block text-xs text-gray-400'>
                            Z: {(panel.textScaleZ || 1).toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='0.1'
                            max='3'
                            step='0.1'
                            value={panel.textScaleZ || 1}
                            onChange={(e) => onUpdateTextScale(panel.id, panel.textScaleX || 1, panel.textScaleY || 1, parseFloat(e.target.value))}
                            className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                            style={{
                              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textScaleZ || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 ${((panel.textScaleZ || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reset button */}
                    <div className='border-t border-orange-400/20 pt-2'>
                      <button
                        onClick={() => {
                          onUpdateTextPosition(panel.id, 0, 0, 0)
                          onUpdateTextRotation(panel.id, 0, 0, 0)
                          onUpdateTextScale(panel.id, 1, 1, 1)
                        }}
                        className='w-full rounded bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700'
                      >
                        🔄 Restablecer Texto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {panels.length === 0 && (
          <div className='py-8 text-center text-gray-400'>
            <p>No hay paneles en la ruleta</p>
            <p className='text-sm'>Haz clic en &quot;Agregar&quot; para crear el primero</p>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
        <h3 className='mb-4 text-xl font-bold text-white'>ℹ️ Instrucciones</h3>
        <ul className='space-y-2 text-sm text-gray-300'>
          <li>• La ruleta girará automáticamente y se detendrá</li>
          <li>• El panel seleccionado aparecerá en el resultado</li>
          <li>• Puedes agregar, editar o eliminar paneles</li>
          <li>• Haz clic en el círculo de color para cambiarlo</li>
          <li>• Los colores se actualizan en tiempo real</li>
          <li>• Usa ✗ para restaurar el color anterior</li>
          <li>• Sube imágenes como texturas para personalizar paneles</li>
          <li>• Las texturas tienen prioridad sobre los colores</li>
          <li>• Ajusta la escala de la textura: pequeña, normal o grande</li>
          <li>• Rota la textura: 0°, 90°, 180°, 270° o cualquier ángulo</li>
          <li>• Mueve la textura: izquierda/derecha y arriba/abajo</li>
          <li>• Usa los sliders o botones rápidos para ajustar</li>
          <li>• Haz clic en 📝 para mostrar controles de texto</li>
          <li>• Ajusta posición, rotación y escala del texto en tiempo real</li>
          <li>• Los controles de texto permiten personalización completa 3D</li>
          <li>• Usa el botón &quot;Restablecer Texto&quot; para volver a valores por defecto</li>
          <li>• Necesitas al menos un panel para poder girar</li>
        </ul>
      </div>
    </div>
  )
}
