'use client'

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
      <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
        <h3 className='text-xl font-bold text-white mb-4'>⏱️ Duración del Giro</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
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
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
            />
            <div className='flex justify-between text-xs text-gray-400 mt-1'>
              <span>1s</span>
              <span>10s</span>
            </div>
          </div>

          {/* Contador de tiempo restante */}
          {isSpinning && remainingTime !== undefined && (
            <div className='bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-orange-400/30'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-400 mb-2'>
                  ⏰ {remainingTime.toFixed(1)}s
                </div>
                <div className='text-sm text-gray-300'>
                  Tiempo restante de giro
                </div>
                <div className='mt-2 w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-100'
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
        <div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30'>
          <h3 className='text-xl font-bold text-white mb-4'>🏆 Resultado del Giro</h3>
          <div className='text-center'>
            <div className='mb-4'>
              <div
                className='inline-block px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg'
                style={{ backgroundColor: result.color }}
              >
                🎉 {result.text} 🎉
              </div>
            </div>
            <div className='space-y-2 text-sm text-gray-300'>
              <div className='flex justify-between'>
                <span>Panel Ganador:</span>
                <span className='text-white font-semibold'>{result.text}</span>
              </div>
              <div className='flex justify-between'>
                <span>ID:</span>
                <span className='text-white font-mono'>{result.id}</span>
              </div>
              <div className='flex justify-between'>
                <span>Color:</span>
                <span className='text-white font-mono'>{result.color}</span>
              </div>
            </div>
            <div className='mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/20'>
              <p className='text-green-300 text-sm font-medium'>
                ✅ ¡Felicidades! Has ganado este premio
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gestión de paneles */}
      <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold text-white'>📝 Paneles ({panels.length})</h3>
          <button
            onClick={onAddPanel}
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors'
          >
            + Agregar
          </button>
        </div>

        <div className='space-y-3 max-h-64 overflow-y-auto'>
          {panels.map((panel) => (
            <div key={panel.id} className='space-y-2'>
              <div className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg'>
                {/* Color indicator */}
                {editingColor === panel.id ? (
                  <div className='flex items-center space-x-2'>
                    <input
                      type='color'
                      value={editColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className='w-8 h-8 rounded border border-white/30 cursor-pointer'
                    />
                    <button
                      onClick={handleColorEditSave}
                      className='px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm'
                      title='Confirmar color'
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleColorEditCancel}
                      className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                      title='Restaurar color anterior'
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div
                    className='w-6 h-6 rounded-full border-2 border-white/30 cursor-pointer hover:scale-110 transition-transform'
                    style={{ backgroundColor: panel.color }}
                    onClick={() => handleColorEditStart(panel)}
                    title='Haz clic para cambiar el color'
                  />
                )}

                {/* Panel text */}
                {editingPanel === panel.id ? (
                  <div className='flex-1 flex space-x-2'>
                    <input
                      type='text'
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className='flex-1 px-3 py-1 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-white/50'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave()
                        if (e.key === 'Escape') handleEditCancel()
                      }}
                    />
                    <button
                      onClick={handleEditSave}
                      className='px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm'
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <>
                    <span className='flex-1 text-white font-medium'>{panel.text}</span>
                    <button
                      onClick={() => handleEditStart(panel)}
                      className='px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm'
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onRemovePanel(panel.id)}
                      disabled={panels.length <= 1}
                      className={`px-2 py-1 rounded text-sm transition-colors ${panels.length <= 1
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
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
                    <label className='block text-xs text-gray-400 mb-1'>Imagen de textura:</label>
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
                        className='px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs cursor-pointer transition-colors'
                      >
                        📷 Subir
                      </label>
                      {panel.texture && (
                        <>
                          <div className='w-8 h-8 rounded border border-white/30 overflow-hidden'>
                            <img
                              src={panel.texture}
                              alt={`Texture for ${panel.text}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <button
                            onClick={() => toggleTextureControls(panel.id)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${showTextureControls.get(panel.id)
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-600 hover:bg-gray-700'
                              } text-white`}
                            title={showTextureControls.get(panel.id) ? 'Ocultar controles' : 'Mostrar controles'}
                          >
                            {showTextureControls.get(panel.id) ? '👁️' : '👁️‍🗨️'}
                          </button>
                          <button
                            onClick={() => handleRemoveTexture(panel.id)}
                            className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs'
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
                          max='3'
                          step='0.1'
                          value={panel.textureScale || 1}
                          onChange={(e) => onUpdatePanelTextureScale(panel.id, parseFloat(e.target.value))}
                          className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                          style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((panel.textureScale || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 ${((panel.textureScale || 1) - 0.1) / (3 - 0.1) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className='flex space-x-1'>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 0.5)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureScale || 1) === 0.5 ? 'bg-purple-600' : 'bg-gray-600'} text-white`}
                            title='Pequeña (0.5x)'
                          >
                            🔍-
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 1)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureScale || 1) === 1 ? 'bg-purple-600' : 'bg-gray-600'} text-white`}
                            title='Normal (1x)'
                          >
                            📐
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureScale(panel.id, 2)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureScale || 1) === 2 ? 'bg-purple-600' : 'bg-gray-600'} text-white`}
                            title='Grande (2x)'
                          >
                            🔍+
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
                          className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                          style={{
                            background: `linear-gradient(to right, #10B981 0%, #10B981 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 ${((panel.textureRotation || 0) / 360) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className='flex space-x-1'>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 0)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureRotation || 0) === 0 ? 'bg-green-600' : 'bg-gray-600'} text-white`}
                            title='0° - Sin rotación'
                          >
                            ↕️
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 90)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureRotation || 0) === 90 ? 'bg-green-600' : 'bg-gray-600'} text-white`}
                            title='90° - Rotación derecha'
                          >
                            ↻
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 180)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureRotation || 0) === 180 ? 'bg-green-600' : 'bg-gray-600'} text-white`}
                            title='180° - Voltear'
                          >
                            ↕️
                          </button>
                          <button
                            onClick={() => onUpdatePanelTextureRotation(panel.id, 270)}
                            className={`px-2 py-1 rounded text-xs ${(panel.textureRotation || 0) === 270 ? 'bg-green-600' : 'bg-gray-600'} text-white`}
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
                            className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                            style={{
                              background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetX || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                          />
                          <div className='flex space-x-1'>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, -1, panel.textureOffsetY || 0)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetX || 0) === -1 ? 'bg-red-600' : 'bg-gray-600'} text-white`}
                              title='Izquierda (-1)'
                            >
                              ←
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, 0, panel.textureOffsetY || 0)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetX || 0) === 0 ? 'bg-red-600' : 'bg-gray-600'} text-white`}
                              title='Centro (0)'
                            >
                              ↕️
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, 1, panel.textureOffsetY || 0)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetX || 0) === 1 ? 'bg-red-600' : 'bg-gray-600'} text-white`}
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
                            className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                            style={{
                              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 ${((panel.textureOffsetY || 0) + 1) / 2 * 100}%, #374151 100%)`
                            }}
                          />
                          <div className='flex space-x-1'>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, -1)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetY || 0) === -1 ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
                              title='Arriba (-1)'
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, 0)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetY || 0) === 0 ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
                              title='Centro (0)'
                            >
                              ↕️
                            </button>
                            <button
                              onClick={() => onUpdatePanelTextureOffset(panel.id, panel.textureOffsetX || 0, 1)}
                              className={`px-2 py-1 rounded text-xs ${(panel.textureOffsetY || 0) === 1 ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
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
              </div>
            </div>
          ))}
        </div>

        {panels.length === 0 && (
          <div className='text-center py-8 text-gray-400'>
            <p>No hay paneles en la ruleta</p>
            <p className='text-sm'>Haz clic en &quot;Agregar&quot; para crear el primero</p>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
        <h3 className='text-xl font-bold text-white mb-4'>ℹ️ Instrucciones</h3>
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
          <li>• Necesitas al menos un panel para poder girar</li>
        </ul>
      </div>
    </div>
  )
}
