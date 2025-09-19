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
  spinDuration: number
  onSpinDurationChange: (duration: number) => void
  remainingTime?: number
}

export function WheelControls({
  panels,
  isSpinning,
  onSpin,
  onAddPanel,
  onRemovePanel,
  onUpdatePanel,
  onUpdatePanelColor,
  spinDuration,
  onSpinDurationChange,
  remainingTime
}: WheelControlsProps) {
  const [editingPanel, setEditingPanel] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [editColor, setEditColor] = useState('')
  const [originalColor, setOriginalColor] = useState<string>('')

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
            <div
              key={panel.id}
              className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg'
            >
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
          <li>• Necesitas al menos un panel para poder girar</li>
        </ul>
      </div>
    </div>
  )
}
