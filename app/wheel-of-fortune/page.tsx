'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import { WheelControls, WheelResult, WheelConfigManager } from '@/features/wheel-of-fortune/components'
import { WheelPanel } from '@/types/wheel'
import { useWheelPersistence } from '@/hooks/useWheelPersistence'

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
  // Hook de persistencia que maneja toda la configuración
  const {
    config,
    isLoaded,
    updatePanels,
    updateSpinDuration,
    updateOrbitControls,
    updateCanvasSize,
    downloadConfig,
    loadConfigFromFile,
    resetToDefault,
    clearStorage,
    getConfigInfo,
  } = useWheelPersistence()

  // Estados locales para la funcionalidad de la ruleta
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<WheelPanel | null>(null)
  const [currentPanel, setCurrentPanel] = useState<WheelPanel | null>(null)
  const [raycastHitPanel, setRaycastHitPanel] = useState<WheelPanel | null>(null)
  const [remainingTime, setRemainingTime] = useState<number | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)

  // Efecto para detectar cuando estamos en el cliente y ajustar la altura inicial
  useEffect(() => {
    setIsClient(true)
    // Establecer la altura correcta basada en el tamaño de pantalla después de la hidratación
    if (isLoaded && config.canvasHeight === 50) {
      const initialHeight = window.innerWidth >= 1024 ? 72 : 50
      updateCanvasSize(config.canvasWidth, initialHeight)
    }
  }, [isLoaded, config.canvasWidth, config.canvasHeight, updateCanvasSize])

  // Actualizar altura por defecto cuando cambie el tamaño de ventana
  useEffect(() => {
    if (!isClient || !isLoaded) return // Solo ejecutar en el cliente y cuando esté cargado

    const handleResize = () => {
      const newDefaultHeight = window.innerWidth >= 1024 ? 72 : 50
      // Solo actualizar si el usuario no ha modificado manualmente el slider
      if (config.canvasHeight === 50 || config.canvasHeight === 72) {
        updateCanvasSize(config.canvasWidth, newDefaultHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [config.canvasHeight, config.canvasWidth, isClient, isLoaded, updateCanvasSize])

  // Calcular tiempo restante durante el giro
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isSpinning) {
      const startTime = Date.now()
      setRemainingTime(config.spinDuration)

      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, config.spinDuration - elapsed)

        if (remaining <= 0) {
          setRemainingTime(0)
          if (interval) {
            clearInterval(interval)
          }
        } else {
          setRemainingTime(remaining)
        }
      }, 100) // Actualizar cada 100ms para suavidad
    } else {
      setRemainingTime(undefined)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isSpinning, config.spinDuration])

  const handleSpin = () => {
    if (isSpinning || config.panels.length === 0) return
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
    updateOrbitControls(!config.enableOrbitControls)
  }

  const addPanel = () => {
    const newId = (config.panels.length + 1).toString()
    const colors = [
      '#FF4444', // Rojo vibrante
      '#00AA44', // Verde esmeralda
      '#0066FF', // Azul brillante
      '#FF8800', // Naranja intenso
      '#8800FF', // Púrpura vibrante
      '#00CCCC', // Cian brillante
      '#FF0088', // Rosa vibrante
      '#44AA00', // Verde lima
      '#0088FF', // Azul cielo
      '#FF6600', // Naranja rojizo
      '#AA00AA', // Magenta
      '#00AAAA', // Turquesa
      '#FFAA00', // Amarillo dorado
      '#6600FF', // Índigo
      '#AA4400', // Marrón rojizo
      '#00FF88', // Verde lima brillante
      '#FF0044', // Rojo carmesí
      '#0088AA', // Azul verdoso
      '#AA6600', // Marrón dorado
      '#8800AA'  // Púrpura oscuro
    ]
    const newPanel: WheelPanel = {
      id: newId,
      text: `Premio ${newId}`,
      color: colors[config.panels.length % colors.length]
    }
    updatePanels([...config.panels, newPanel])
  }

  const removePanel = (id: string) => {
    if (config.panels.length <= 1) return
    updatePanels(config.panels.filter(panel => panel.id !== id))
  }

  const updatePanel = (id: string, text: string) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, text } : panel
    )
    updatePanels(updatedPanels)

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
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, color } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, color })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, color })
    }
  }

  const updatePanelTexture = (id: string, texture: string | null) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, texture: texture || undefined } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, texture: texture || undefined })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, texture: texture || undefined })
    }
  }

  const updatePanelTextureScale = (id: string, scale: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textureScale: scale } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textureScale: scale })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textureScale: scale })
    }
  }

  const updatePanelTextureRotation = (id: string, rotation: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textureRotation: rotation } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textureRotation: rotation })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textureRotation: rotation })
    }
  }

  const updatePanelTextureOffset = (id: string, offsetX: number, offsetY: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textureOffsetX: offsetX, textureOffsetY: offsetY } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textureOffsetX: offsetX, textureOffsetY: offsetY })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textureOffsetX: offsetX, textureOffsetY: offsetY })
    }
  }

  const updateTextPosition = (id: string, x: number, y: number, z: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textPositionX: x, textPositionY: y, textPositionZ: z } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textPositionX: x, textPositionY: y, textPositionZ: z })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textPositionX: x, textPositionY: y, textPositionZ: z })
    }
  }

  const updateTextRotation = (id: string, x: number, y: number, z: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textRotationX: x, textRotationY: y, textRotationZ: z } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textRotationX: x, textRotationY: y, textRotationZ: z })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textRotationX: x, textRotationY: y, textRotationZ: z })
    }
  }

  const updateTextScale = (id: string, x: number, y: number, z: number) => {
    const updatedPanels = config.panels.map(panel =>
      panel.id === id ? { ...panel, textScaleX: x, textScaleY: y, textScaleZ: z } : panel
    )
    updatePanels(updatedPanels)

    // Si el panel modificado es el resultado actual, actualizar también el resultado
    if (result && result.id === id) {
      setResult({ ...result, textScaleX: x, textScaleY: y, textScaleZ: z })
    }

    // Si el panel modificado es el panel actual, actualizar también el panel actual
    if (currentPanel && currentPanel.id === id) {
      setCurrentPanel({ ...currentPanel, textScaleX: x, textScaleY: y, textScaleZ: z })
    }
  }

  // Mostrar loading mientras se carga la configuración
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
        <div className='text-center'>
          <div className='mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-white'></div>
          <p className='text-lg text-white'>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-white'>🎰 Ruleta de la Suerte</h1>
          <p className='text-xl text-gray-300'>Gira la ruleta y descubre tu premio</p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* 3D Wheel */}
          <div className='lg:col-span-2'>
            <div className='rounded-2xl bg-white/10 p-6 backdrop-blur-sm lg:sticky lg:top-8'>
              <View
                className='flex flex-col items-center justify-center'
                style={{
                  width: `${config.canvasWidth}%`,
                  height: `${config.canvasHeight}vh` // Usar viewport height directamente
                }}
              >
                <Suspense fallback={null}>
                  <WheelScene
                    panels={config.panels}
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    spinDuration={config.spinDuration}
                    onCurrentPanelChange={handleCurrentPanelChange}
                    onRaycastHit={handleRaycastHit}
                    enableOrbitControls={config.enableOrbitControls}
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
            <div className='rounded-2xl bg-white/10 p-6 backdrop-blur-sm'>
              <h3 className='mb-4 text-xl font-bold text-white'>🎯 Control de la Ruleta</h3>
              <div className='space-y-3'>
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || config.panels.length === 0}
                  className={`w-full rounded-lg px-6 py-4 text-lg font-bold text-white transition-all duration-300 ${isSpinning || config.panels.length === 0
                    ? 'cursor-not-allowed bg-gray-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                    }`}
                >
                  {isSpinning ? '🔄 Girando...' : '🎰 ¡GIRAR RULETA!'}
                </button>

                <button
                  onClick={toggleOrbitControls}
                  className={`w-full rounded-lg px-6 py-3 text-base font-bold text-white transition-all duration-300 ${config.enableOrbitControls
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:scale-105 hover:from-amber-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700'
                    }`}
                >
                  {config.enableOrbitControls ? '🎮 Controles Activados' : '🚫 Controles Desactivados'}
                </button>
              </div>
              {config.panels.length === 0 && (
                <p className='mt-2 text-sm text-red-300'>Agrega al menos un panel para poder girar</p>
              )}
            </div>


            {/* Panel detectado por raycasting */}
            {raycastHitPanel && (
              <div className='rounded-2xl bg-white/10 p-6 backdrop-blur-sm'>
                <h3 className='mb-4 text-xl font-bold text-white'>🎯 Panel Detectado</h3>
                <div className='text-center'>
                  <div className='mb-4'>
                    {raycastHitPanel.texture ? (
                      <div style={{ position: "relative" }} className='mx-auto mb-3 size-16 overflow-hidden rounded-full border-4 border-white/30'>
                        <Image
                          src={raycastHitPanel.texture}
                          alt={raycastHitPanel.text}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ) : (
                      <div className='mx-auto mb-3 size-16 rounded-full border-4 border-white/30' style={{ backgroundColor: raycastHitPanel.color }} />
                    )}
                    <h4 className='text-2xl font-bold text-white'>{raycastHitPanel.text}</h4>
                  </div>
                  {/* <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>Color:</span>
                      <span className='text-white font-mono'>{raycastHitPanel.color}</span>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

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

            {/* Gestión de configuraciones */}
            <WheelConfigManager
              config={config}
              onDownloadConfig={downloadConfig}
              onLoadConfigFromFile={loadConfigFromFile}
              onResetToDefault={resetToDefault}
              onClearStorage={clearStorage}
              getConfigInfo={getConfigInfo}
            />

            {/* Controles de la ruleta */}
            <WheelControls
              panels={config.panels}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              onAddPanel={addPanel}
              onRemovePanel={removePanel}
              onUpdatePanel={updatePanel}
              onUpdatePanelColor={updatePanelColor}
              onUpdatePanelTexture={updatePanelTexture}
              onUpdatePanelTextureScale={updatePanelTextureScale}
              onUpdatePanelTextureRotation={updatePanelTextureRotation}
              onUpdatePanelTextureOffset={updatePanelTextureOffset}
              onUpdateTextPosition={updateTextPosition}
              onUpdateTextRotation={updateTextRotation}
              onUpdateTextScale={updateTextScale}
              spinDuration={config.spinDuration}
              onSpinDurationChange={updateSpinDuration}
              remainingTime={remainingTime}
            />

            {/* Controles de tamaño del canvas */}
            <div className='rounded-2xl bg-white/10 p-6 backdrop-blur-sm'>
              <h3 className='mb-4 text-xl font-bold text-white'>📐 Tamaño del Canvas</h3>
              <div className='space-y-4'>
                {/* Slider para el ancho */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-300'>
                    Ancho: {config.canvasWidth}%
                  </label>
                  <input
                    type='range'
                    min='50'
                    max='100'
                    value={config.canvasWidth}
                    onChange={(e) => updateCanvasSize(Number(e.target.value), config.canvasHeight)}
                    className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((config.canvasWidth - 50) / (100 - 50)) * 100}%, #374151 ${((config.canvasWidth - 50) / (100 - 50)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className='mt-1 flex justify-between text-xs text-gray-400'>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Slider para la altura */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-300'>
                    Altura: {config.canvasHeight}vh
                  </label>
                  <input
                    type='range'
                    min='20'
                    max='100'
                    value={config.canvasHeight}
                    onChange={(e) => updateCanvasSize(config.canvasWidth, Number(e.target.value))}
                    className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${((config.canvasHeight - 20) / (100 - 20)) * 100}%, #374151 ${((config.canvasHeight - 20) / (100 - 20)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className='mt-1 flex justify-between text-xs text-gray-400'>
                    <span>20vh</span>
                    <span>100vh</span>
                  </div>
                </div>

                {/* Botón de reset */}
                <button
                  onClick={() => {
                    if (isClient) {
                      const resetHeight = window.innerWidth >= 1024 ? 72 : 50
                      updateCanvasSize(100, resetHeight)
                    } else {
                      updateCanvasSize(100, 50)
                    }
                  }}
                  className='w-full rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-gray-700 hover:to-gray-800'
                >
                  🔄 Restablecer Tamaño
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
