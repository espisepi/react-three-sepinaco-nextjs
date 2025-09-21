'use client'

import Image from 'next/image'
import { useState, useCallback, memo } from 'react'
import { WheelPanel } from '@/types/wheel'
import { CollapsibleBlock } from '@/components/ui/CollapsibleBlock'
// Importaciones temporales comentadas hasta que se creen los componentes
// import { PanelEditor } from './PanelEditor'
// import { TextureControls } from './TextureControls'
// import { TextControls } from './TextControls'

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
  result?: WheelPanel | null
  raycastResult?: WheelPanel | null
  blockVisibility: {
    panelsManagement: boolean
    instructions: boolean
  }
  onUpdateBlockVisibility: (blockKey: 'panelsManagement' | 'instructions', isVisible: boolean) => void
}

/**
 * Componente optimizado para los controles de la ruleta
 * Refactorizado aplicando principios de clean code y separación de responsabilidades
 */
export const WheelControls = memo(({
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
  result,
  raycastResult,
  blockVisibility,
  onUpdateBlockVisibility
}: WheelControlsProps) => {
  const [editingPanel, setEditingPanel] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [editColor, setEditColor] = useState('')
  const [originalColor, setOriginalColor] = useState<string>('')
  const [showTextureControls, setShowTextureControls] = useState<Map<string, boolean>>(new Map())
  const [showTextControls, setShowTextControls] = useState<Record<string, boolean>>({})

  const handleImageUpload = useCallback((panelId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onUpdatePanelTexture(panelId, result)
      }
      reader.readAsDataURL(file)

      // Reset the input value to allow uploading the same file again
      event.target.value = ''
    }
  }, [onUpdatePanelTexture])

  const handleRemoveTexture = useCallback((panelId: string) => {
    onUpdatePanelTexture(panelId, null)
  }, [onUpdatePanelTexture])

  const toggleTextureControls = useCallback((panelId: string) => {
    setShowTextureControls(prev => {
      const newMap = new Map(prev)
      newMap.set(panelId, !newMap.get(panelId))
      return newMap
    })
  }, [])

  const toggleTextControls = useCallback((panelId: string) => {
    setShowTextControls(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }))
  }, [])

  const handleEditStart = useCallback((panel: WheelPanel) => {
    setEditingPanel(panel.id)
    setEditText(panel.text)
  }, [])

  const handleEditSave = useCallback(() => {
    if (editingPanel && editText.trim()) {
      onUpdatePanel(editingPanel, editText.trim())
      setEditingPanel(null)
      setEditText('')
    }
  }, [editingPanel, editText, onUpdatePanel])

  const handleEditCancel = useCallback(() => {
    setEditingPanel(null)
    setEditText('')
  }, [])

  const handleColorEditStart = useCallback((panel: WheelPanel) => {
    setEditingColor(panel.id)
    setEditColor(panel.color)
    setOriginalColor(panel.color)
  }, [])

  const handleColorChange = useCallback((newColor: string) => {
    setEditColor(newColor)
    // Actualizar en tiempo real
    if (editingColor) {
      onUpdatePanelColor(editingColor, newColor)
    }
  }, [editingColor, onUpdatePanelColor])

  const handleColorEditSave = useCallback(() => {
    // El color ya se está actualizando en tiempo real, solo cerramos la edición
    setEditingColor(null)
    setEditColor('')
    setOriginalColor('')
  }, [])

  const handleColorEditCancel = useCallback(() => {
    // Restaurar el color original
    if (editingColor && originalColor) {
      onUpdatePanelColor(editingColor, originalColor)
    }
    setEditingColor(null)
    setEditColor('')
    setOriginalColor('')
  }, [editingColor, originalColor, onUpdatePanelColor])

  return (
    <div className='space-y-6'>
      {/* Gestión de paneles */}
      <CollapsibleBlock
        title={`Paneles (${panels.length})`}
        icon="📝"
        isVisible={blockVisibility.panelsManagement}
        onToggle={() => onUpdateBlockVisibility('panelsManagement', !blockVisibility.panelsManagement)}
      >
        <div className='mb-4 flex items-center justify-between'>
          <button
            onClick={onAddPanel}
            className='rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600'
          >
            + Agregar
          </button>
        </div>

        <div className='max-h-96 space-y-3 overflow-y-auto'>
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

                {/* Texture Controls */}
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
                          {[0.5, 1, 2, 5, 10, 20, 30].map(scale => (
                            <button
                              key={scale}
                              onClick={() => onUpdatePanelTextureScale(panel.id, scale)}
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
                          onChange={(e) => onUpdatePanelTextureRotation(panel.id, parseFloat(e.target.value))}
                          className='slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700'
                          style={{
                            background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className='flex space-x-1'>
                          {[0, 90, 180, 270].map(rotation => (
                            <button
                              key={rotation}
                              onClick={() => onUpdatePanelTextureRotation(panel.id, rotation)}
                              className={`rounded px-2 py-1 text-xs text-white ${(panel.textureRotation || 0) === rotation ? 'bg-green-600' : 'bg-gray-600'}`}
                              title={`${rotation}°`}
                            >
                              {rotation === 0 ? '↕️' : rotation === 90 ? '↻' : rotation === 180 ? '↕️' : '↺'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Controls */}
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
                        {[
                          { axis: 'X', value: panel.textPositionX || 0, color: '#EF4444', min: -2, max: 2 },
                          { axis: 'Y', value: panel.textPositionY || 0, color: '#10B981', min: -2, max: 2 },
                          { axis: 'Z', value: panel.textPositionZ || 0, color: '#3B82F6', min: -2, max: 2 }
                        ].map(({ axis, value, color, min, max }) => (
                          <div key={axis} className='space-y-1'>
                            <label className='block text-xs text-gray-400'>
                              {axis}: {value.toFixed(2)}
                            </label>
                            <input
                              type='range'
                              min={min}
                              max={max}
                              step='0.1'
                              value={value}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value)
                                if (axis === 'X') {
                                  onUpdateTextPosition(panel.id, newValue, panel.textPositionY || 0, panel.textPositionZ || 0)
                                } else if (axis === 'Y') {
                                  onUpdateTextPosition(panel.id, panel.textPositionX || 0, newValue, panel.textPositionZ || 0)
                                } else {
                                  onUpdateTextPosition(panel.id, panel.textPositionX || 0, panel.textPositionY || 0, newValue)
                                }
                              }}
                              className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                              style={{
                                background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
                              }}
                            />
                          </div>
                        ))}
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
      </CollapsibleBlock>

      {/* Instrucciones */}
      <CollapsibleBlock
        title="Instrucciones"
        icon="ℹ️"
        isVisible={blockVisibility.instructions}
        onToggle={() => onUpdateBlockVisibility('instructions', !blockVisibility.instructions)}
      >
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
      </CollapsibleBlock>
    </div>
  )
})

WheelControls.displayName = 'WheelControls'
