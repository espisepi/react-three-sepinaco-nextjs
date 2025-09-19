'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { WheelControls, WheelResult } from '@/features/wheel-of-fortune/components'
import { WheelPanel } from '@/types/wheel'

const WheelScene = dynamic(() => import('@/features/wheel-of-fortune/components/canvas/WheelScene').then((mod) => mod.WheelScene), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function WheelOfFortunePage() {
  const [panels, setPanels] = useState<WheelPanel[]>([
    { id: '1', text: 'Premio 1', color: '#FF6B6B' },
    { id: '2', text: 'Premio 2', color: '#4ECDC4' },
    { id: '3', text: 'Premio 3', color: '#45B7D1' },
    { id: '4', text: 'Premio 4', color: '#96CEB4' },
    { id: '5', text: 'Premio 5', color: '#FFEAA7' },
    { id: '6', text: 'Premio 6', color: '#DDA0DD' },
  ])
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<WheelPanel | null>(null)
  const [spinDuration, setSpinDuration] = useState(3) // Duración en segundos
  const [currentPanel, setCurrentPanel] = useState<WheelPanel | null>(null) // Panel actual que apunta el puntero
  const [raycastHitPanel, setRaycastHitPanel] = useState<WheelPanel | null>(null) // Panel detectado por raycasting
  const [enableOrbitControls, setEnableOrbitControls] = useState(false) // Control de OrbitControls - desactivado por defecto
  const [canvasWidth, setCanvasWidth] = useState(100) // Ancho del canvas en porcentaje
  const [canvasHeight, setCanvasHeight] = useState(96) // Altura del canvas en unidades Tailwind (h-96 = 24rem = 384px)

  const handleSpin = () => {
    if (isSpinning || panels.length === 0) return
    setIsSpinning(true)
    setResult(null)
  }

  const handleSpinComplete = (selectedPanel: WheelPanel) => {
    setIsSpinning(false)
    setResult(selectedPanel)
  }

  const handleCurrentPanelChange = (panel: WheelPanel | null) => {
    setCurrentPanel(panel)
  }

  const handleRaycastHit = (panel: WheelPanel | null) => {
    setRaycastHitPanel(panel)
  }

  const toggleOrbitControls = () => {
    setEnableOrbitControls(!enableOrbitControls)
  }

  const addPanel = () => {
    const newId = (panels.length + 1).toString()
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3']
    const newPanel: WheelPanel = {
      id: newId,
      text: `Premio ${newId}`,
      color: colors[panels.length % colors.length]
    }
    setPanels([...panels, newPanel])
  }

  const removePanel = (id: string) => {
    if (panels.length <= 1) return
    setPanels(panels.filter(panel => panel.id !== id))
  }

  const updatePanel = (id: string, text: string) => {
    setPanels(panels.map(panel =>
      panel.id === id ? { ...panel, text } : panel
    ))

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, text })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, text })
    }
  }

  const updatePanelColor = (id: string, color: string) => {
    setPanels(panels.map(panel =>
      panel.id === id ? { ...panel, color } : panel
    ))

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, color })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, color })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-bold text-white mb-4'>🎰 Ruleta de la Suerte</h1>
          <p className='text-xl text-gray-300'>Gira la ruleta y descubre tu premio</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 3D Wheel */}
          <div className='lg:col-span-2'>
            <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
              <View
                className='flex flex-col items-center justify-center'
                style={{
                  width: `${canvasWidth}%`,
                  height: `${canvasHeight * 4}px` // Convertir unidades Tailwind a píxeles (h-96 = 24rem = 384px)
                }}
              >
                <Suspense fallback={null}>
                  <WheelScene
                    panels={panels}
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    spinDuration={spinDuration}
                    onCurrentPanelChange={handleCurrentPanelChange}
                    onRaycastHit={handleRaycastHit}
                    enableOrbitControls={enableOrbitControls}
                  />
                  <Common color={'#1a1a2e'} />
                </Suspense>
              </View>
            </div>
          </div>

          {/* Controls */}
          <div className='space-y-6'>
            {/* Resultado del giro */}
            {result && (
              <WheelResult result={result} raycastResult={raycastHitPanel} />
            )}

            {/* Botón de girar */}
            <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
              <h3 className='text-xl font-bold text-white mb-4'>🎯 Control de la Ruleta</h3>
              <div className='space-y-3'>
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || panels.length === 0}
                  className={`w-full rounded-lg px-6 py-4 text-lg font-bold text-white transition-all duration-300 ${isSpinning || panels.length === 0
                    ? 'cursor-not-allowed bg-gray-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                    }`}
                >
                  {isSpinning ? '🔄 Girando...' : '🎰 ¡GIRAR RULETA!'}
                </button>

                <button
                  onClick={toggleOrbitControls}
                  className={`w-full rounded-lg px-6 py-3 text-base font-bold text-white transition-all duration-300 ${enableOrbitControls
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:scale-105 hover:from-amber-600 hover:to-orange-700'
                    }`}
                >
                  {enableOrbitControls ? '🎮 Controles Activados' : '🚫 Controles Desactivados'}
                </button>
              </div>
              {panels.length === 0 && (
                <p className='mt-2 text-sm text-red-300'>Agrega al menos un panel para poder girar</p>
              )}
            </div>


            {/* Panel detectado por raycasting */}
            {raycastHitPanel && (
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>🎯 Panel Detectado</h3>
                <div className='text-center'>
                  <div
                    className='inline-block px-4 py-2 rounded-lg text-white font-semibold mb-3'
                    style={{ backgroundColor: raycastHitPanel.color }}
                  >
                    {raycastHitPanel.text}
                  </div>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>Color:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.color}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de tamaño del canvas */}
            <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
              <h3 className='text-xl font-bold text-white mb-4'>📐 Tamaño del Canvas</h3>
              <div className='space-y-4'>
                {/* Slider para el ancho */}
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Ancho: {canvasWidth}%
                  </label>
                  <input
                    type='range'
                    min='50'
                    max='100'
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((canvasWidth - 50) / (100 - 50)) * 100}%, #374151 ${((canvasWidth - 50) / (100 - 50)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className='flex justify-between text-xs text-gray-400 mt-1'>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Slider para la altura */}
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Altura: {canvasHeight * 4}px ({canvasHeight} unidades)
                  </label>
                  <input
                    type='range'
                    min='48'
                    max='128'
                    step='4'
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${((canvasHeight - 48) / (128 - 48)) * 100}%, #374151 ${((canvasHeight - 48) / (128 - 48)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className='flex justify-between text-xs text-gray-400 mt-1'>
                    <span>192px</span>
                    <span>512px</span>
                  </div>
                </div>

                {/* Botón de reset */}
                <button
                  onClick={() => {
                    setCanvasWidth(100)
                    setCanvasHeight(96)
                  }}
                  className='w-full rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-300'
                >
                  🔄 Restablecer Tamaño
                </button>
              </div>
            </div>

            {/* Panel detectado por raycasting */}
            {/* {raycastHitPanel && (
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>🎯 Panel Detectado por Raycasting</h3>
                <div className='text-center'>
                  <div
                    className='inline-block px-4 py-2 rounded-lg text-white font-semibold mb-3'
                    style={{ backgroundColor: raycastHitPanel.color }}
                  >
                    {raycastHitPanel.text}
                  </div>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>ID del Panel:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.id}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Color:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.color}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Método:</span>
                      <span className='text-green-400 font-semibold'>Raycasting 3D</span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Resultado por raycasting */}
            {/* {raycastHitPanel && (
              <div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30'>
                <h3 className='text-xl font-bold text-white mb-4'>🏆 Resultado por Raycasting</h3>
                <div className='text-center'>
                  <div className='mb-4'>
                    <div
                      className='inline-block px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg'
                      style={{ backgroundColor: raycastHitPanel.color }}
                    >
                      🎉 {raycastHitPanel.text} 🎉
                    </div>
                  </div>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>Panel Ganador:</span>
                      <span className='text-white font-semibold'>{raycastHitPanel.text}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>ID:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.id}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Color:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.color}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Método de Detección:</span>
                      <span className='text-green-400 font-semibold'>Raycasting 3D</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Precisión:</span>
                      <span className='text-green-400 font-semibold'>Alta</span>
                    </div>
                  </div>
                  <div className='mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/20'>
                    <p className='text-green-300 text-sm font-medium'>
                      ✅ Panel detectado mediante intersección de rayos 3D
                    </p>
                  </div>
                </div>
              </div>
            )} */}

            {/* Panel actual que apunta el puntero */}
            {/* {currentPanel && (
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>🎯 Panel Actual (Matemático)</h3>
                <div className='text-center'>
                  <div
                    className='inline-block px-4 py-2 rounded-lg text-white font-semibold mb-3'
                    style={{ backgroundColor: currentPanel.color }}
                  >
                    {currentPanel.text}
                  </div>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>ID del Panel:</span>
                      <span className='text-white font-mono'>{currentPanel.id}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Color:</span>
                      <span className='text-white font-mono'>{currentPanel.color}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Método:</span>
                      <span className='text-blue-400 font-semibold'>Cálculo Angular</span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Comparación de métodos de detección */}
            {/* {currentPanel && raycastHitPanel && (
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                <h3 className='text-xl font-bold text-white mb-4'>⚖️ Comparación de Métodos</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-3 bg-white/5 rounded-lg'>
                    <span className='text-gray-300'>Coincidencia:</span>
                    <span className={`font-semibold ${currentPanel.id === raycastHitPanel.id ? 'text-green-400' : 'text-red-400'}`}>
                      {currentPanel.id === raycastHitPanel.id ? '✅ Sí' : '❌ No'}
                    </span>
                  </div>
                  {currentPanel.id === raycastHitPanel.id ? (
                    <div className='text-center text-green-400 text-sm'>
                      Ambos métodos detectan el mismo panel correctamente
                    </div>
                  ) : (
                    <div className='text-center text-red-400 text-sm'>
                      Los métodos detectan paneles diferentes
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* Controles de la ruleta */}
            <WheelControls
              panels={panels}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              onAddPanel={addPanel}
              onRemovePanel={removePanel}
              onUpdatePanel={updatePanel}
              onUpdatePanelColor={updatePanelColor}
              spinDuration={spinDuration}
              onSpinDurationChange={setSpinDuration}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
