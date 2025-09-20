'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { WheelControls, WheelResult, WheelConfigManager, SceneSelector, SceneInfo, SceneAndMaterialSelector } from '@/features/wheel-of-fortune/components'
import { WheelPanel } from '@/types/wheel'
import { useWheelPersistence } from '@/hooks/useWheelPersistence'
import { usePanelUpdates } from '@/hooks/usePanelUpdates'
import { useSceneManager } from '@/hooks/useSceneManager'
import { useMaterialManager } from '@/hooks/useMaterialManager'
import { CollapsibleBlock } from '@/components/ui/CollapsibleBlock'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'
import { getRegisteredScenes } from '@/features/wheel-of-fortune/scenes'
import { allMaterials } from '@/features/wheel-of-fortune/materials'

const WheelScene = dynamic(() => import('@/features/wheel-of-fortune/components/canvas/WheelScene').then((mod) => ({ default: mod.WheelScene })), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center">Cargando escena 3D...</div>
})
const View = dynamic(() => import('@/components/canvas/View').then((mod) => ({ default: mod.View })), {
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
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => ({ default: mod.Common })), { ssr: false })

// Componente para renderizar la escena activa dinámicamente
const ActiveSceneRenderer = ({
  activeScene,
  sceneProps
}: {
  activeScene: any
  sceneProps: any
}) => {
  // Si no hay escena activa o no tiene componente, usar la escena por defecto
  if (!activeScene || !activeScene.component) {
    return <WheelScene {...sceneProps} />
  }

  // Verificar que el componente es una función válida
  if (typeof activeScene.component !== 'function' && !activeScene.component.type) {
    return <WheelScene {...sceneProps} />
  }

  // Renderizar la escena activa
  try {
    const SceneComponent = activeScene.component
    return <SceneComponent {...sceneProps} sceneConfig={activeScene.config} />
  } catch (error) {
    return <WheelScene {...sceneProps} />
  }
}

export default function WheelOfFortunePage() {
  // Hook de persistencia que maneja toda la configuración
  const {
    config,
    isLoaded,
    updatePanels,
    updateSpinDuration,
    updateOrbitControls,
    updateCanvasSize,
    updateBlockVisibility,
    downloadConfig,
    loadConfigFromFile,
    resetToDefault,
    clearStorage,
    getConfigInfo,
  } = useWheelPersistence()

  // Hook de gestión de escenas
  const {
    activeScene,
    setActiveScene,
    getSceneConfig,
    updateSceneConfig,
    availableScenes,
    isSceneActive
  } = useSceneManager(getRegisteredScenes(), 'classic')

  // Hook de gestión de materiales
  const {
    activeMaterial,
    setActiveMaterial,
    getMaterialConfig,
    updateMaterialConfig,
    availableMaterials,
    isMaterialActive
  } = useMaterialManager('classic')

  // Función para limpiar localStorage y reiniciar (temporal para debug)
  const clearSceneStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wheel-scene-manager-config')
      window.location.reload()
    }
  }, [])

  // Función para limpiar configuración de materiales
  const clearMaterialStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wheel-material-manager-config')
      localStorage.removeItem('wheel-material-history')
      localStorage.removeItem('wheel-favorite-materials')
      window.location.reload()
    }
  }, [])

  // Estados locales para la funcionalidad de la ruleta
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<WheelPanel | null>(null)
  const [currentPanel, setCurrentPanel] = useState<WheelPanel | null>(null)
  const [raycastHitPanel, setRaycastHitPanel] = useState<WheelPanel | null>(null)
  const [remainingTime, setRemainingTime] = useState<number | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [showSceneSelector, setShowSceneSelector] = useState(true)
  const [autorotate, setAutorotate] = useState(false)
  const [autorotateSpeed, setAutorotateSpeed] = useState(0.5)

  // Efecto para limpiar automáticamente el storage de escenas al cargar la página
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     // Limpiar el storage de escenas para que siempre use la configuración por defecto
  //     localStorage.removeItem('wheel-scene-manager-config')
  //   }
  // }, [])

  // Efecto para detectar cuando estamos en el cliente y ajustar la altura inicial
  useEffect(() => {
    setIsClient(true)
    // Establecer la altura correcta basada en el tamaño de pantalla después de la hidratación
    if (isLoaded && config.canvasHeight === 50) {
      const initialHeight = window.innerWidth >= 1024 ? 72 : 50
      updateCanvasSize(config.canvasWidth, initialHeight)
    }
  }, [isLoaded, config.canvasWidth, config.canvasHeight, updateCanvasSize])

  // Efecto para asegurar que la escena activa esté correctamente inicializada
  useEffect(() => {
    if (isClient && isLoaded && availableScenes.length > 0 && !activeScene) {
      // Si no hay escena activa pero hay escenas disponibles, establecer la primera
      const firstScene = availableScenes[0]
      if (firstScene) {
        setActiveScene(firstScene.id)
      }
    }
  }, [isClient, isLoaded, availableScenes, activeScene, setActiveScene])

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

  const handleSpin = useCallback(() => {
    if (isSpinning || config.panels.length === 0) return
    setIsSpinning(true)
    setResult(null)
  }, [isSpinning, config.panels.length])

  const handleSpinComplete = useCallback((selectedPanel: WheelPanel) => {
    setIsSpinning(false)
    setResult(selectedPanel)
  }, [])

  const handleCurrentPanelChange = useCallback((panel: WheelPanel | null) => {
    setCurrentPanel(panel)
  }, [])

  const handleRaycastHit = useCallback((panel: WheelPanel | null) => {
    setRaycastHitPanel(panel)
  }, [])

  const toggleOrbitControls = useCallback(() => {
    updateOrbitControls(!config.enableOrbitControls)
  }, [config.enableOrbitControls, updateOrbitControls])

  // Memoizar colores para evitar recreación
  const colors = useMemo(() => [
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
  ], [])

  const addPanel = useCallback(() => {
    const newId = (config.panels.length + 1).toString()
    const newPanel: WheelPanel = {
      id: newId,
      text: `Premio ${newId}`,
      color: colors[config.panels.length % colors.length]
    }
    updatePanels([...config.panels, newPanel])
  }, [config.panels, colors, updatePanels])

  const removePanel = useCallback((id: string) => {
    if (config.panels.length <= 1) return
    updatePanels(config.panels.filter(panel => panel.id !== id))
  }, [config.panels, updatePanels])

  // Usar el hook optimizado para las actualizaciones de paneles
  const {
    updatePanel,
    updatePanelColor,
    updatePanelTexture,
    updatePanelTextureScale,
    updatePanelTextureRotation,
    updatePanelTextureOffset,
    updateTextPosition,
    updateTextRotation,
    updateTextScale
  } = usePanelUpdates({
    panels: config.panels,
    updatePanels,
    result,
    setResult,
    currentPanel,
    setCurrentPanel
  })


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
      {/* Monitor de Performance */}
      <PerformanceMonitor
        enabled={showPerformanceMonitor}
        showDetails={true}
        position="top-right"
      />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-white'>🎰 Ruleta de la Suerte</h1>
          <p className='text-xl text-gray-300'>Gira la ruleta y descubre tu premio</p>

          {/* Botón para activar/desactivar monitor de performance */}
          <button
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${showPerformanceMonitor
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {showPerformanceMonitor ? '📊 Monitor ON' : '📊 Monitor OFF'}
          </button>
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
                  <ActiveSceneRenderer
                    activeScene={activeScene}
                    sceneProps={{
                      panels: config.panels,
                      isSpinning: isSpinning,
                      onSpinComplete: handleSpinComplete,
                      spinDuration: config.spinDuration,
                      onCurrentPanelChange: handleCurrentPanelChange,
                      onRaycastHit: handleRaycastHit,
                      enableOrbitControls: config.enableOrbitControls,
                      autorotate: autorotate,
                      autorotateSpeed: autorotateSpeed,
                      activeMaterial: activeMaterial
                    }}
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
              <CollapsibleBlock
                title="Resultado del Giro"
                icon="🏆"
                isVisible={config.blockVisibility.wheelResult}
                onToggle={() => updateBlockVisibility('wheelResult', !config.blockVisibility.wheelResult)}
              >
                <WheelResult result={result} raycastResult={raycastHitPanel} />
              </CollapsibleBlock>
            )}

            {/* Botón de girar */}
            <CollapsibleBlock
              title="Control de la Ruleta"
              icon="🎯"
              isVisible={config.blockVisibility.wheelControl}
              onToggle={() => updateBlockVisibility('wheelControl', !config.blockVisibility.wheelControl)}
            >
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

                {/* Controles de autorotate */}
                {config.enableOrbitControls && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setAutorotate(!autorotate)}
                      className={`w-full rounded-lg px-6 py-3 text-base font-bold text-white transition-all duration-300 ${autorotate
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:scale-105 hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg hover:scale-105 hover:from-gray-600 hover:to-slate-700'
                        }`}
                    >
                      {autorotate ? '🔄 Autorotación Activada' : '⏸️ Autorotación Desactivada'}
                    </button>

                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-300'>
                        Velocidad de Autorotación: {autorotateSpeed.toFixed(1)}
                      </label>
                      <input
                        type='range'
                        min='0.1'
                        max='2.0'
                        step='0.1'
                        value={autorotateSpeed}
                        onChange={(e) => setAutorotateSpeed(parseFloat(e.target.value))}
                        disabled={!autorotate}
                        className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
                      />
                      <div className='mt-1 flex justify-between text-xs text-gray-400'>
                        <span>0.1x</span>
                        <span>2.0x</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {config.panels.length === 0 && (
                <p className='mt-2 text-sm text-red-300'>Agrega al menos un panel para poder girar</p>
              )}
            </CollapsibleBlock>

            {/* Control de duración del giro */}
            <CollapsibleBlock
              title="Duración del Giro"
              icon="⏱️"
              isVisible={config.blockVisibility.spinDuration}
              onToggle={() => updateBlockVisibility('spinDuration', !config.blockVisibility.spinDuration)}
            >
              <div className='space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-300'>
                    Duración: {config.spinDuration} segundos
                  </label>
                  <input
                    type='range'
                    min='1'
                    max='10'
                    step='0.5'
                    value={config.spinDuration}
                    onChange={(e) => updateSpinDuration(parseFloat(e.target.value))}
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
                            width: `${Math.max(0, (remainingTime / config.spinDuration) * 100)}%`
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
            </CollapsibleBlock>


            {/* Panel detectado por raycasting */}
            {raycastHitPanel && (
              <CollapsibleBlock
                title="Panel Detectado"
                icon="🎯"
                isVisible={config.blockVisibility.panelDetected}
                onToggle={() => updateBlockVisibility('panelDetected', !config.blockVisibility.panelDetected)}
              >
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
                </div>
              </CollapsibleBlock>
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
              result={result}
              raycastResult={raycastHitPanel}
              blockVisibility={{
                panelsManagement: config.blockVisibility.panelsManagement,
                instructions: config.blockVisibility.instructions,
              }}
              onUpdateBlockVisibility={(blockKey, isVisible) => {
                updateBlockVisibility(blockKey, isVisible)
              }}
            />

            {/* Gestión de configuraciones */}
            <CollapsibleBlock
              title="Gestión de Configuraciones"
              icon="⚙️"
              isVisible={config.blockVisibility.configManager}
              onToggle={() => updateBlockVisibility('configManager', !config.blockVisibility.configManager)}
            >
              <WheelConfigManager
                config={config}
                onDownloadConfig={downloadConfig}
                onLoadConfigFromFile={loadConfigFromFile}
                onResetToDefault={resetToDefault}
                onClearStorage={clearStorage}
                getConfigInfo={getConfigInfo}
              />
            </CollapsibleBlock>

            {/* Controles de tamaño del canvas */}
            <CollapsibleBlock
              title="Tamaño del Canvas"
              icon="📐"
              isVisible={config.blockVisibility.canvasSize}
              onToggle={() => updateBlockVisibility('canvasSize', !config.blockVisibility.canvasSize)}
            >
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
            </CollapsibleBlock>

            {/* Selector de Escenas y Materiales */}
            <SceneAndMaterialSelector
              scenes={availableScenes}
              activeSceneId={activeScene?.id || 'classic'}
              onSceneSelect={setActiveScene}
              materials={availableMaterials}
              activeMaterialId={activeMaterial?.id || 'classic'}
              onMaterialSelect={setActiveMaterial}
            />

            {/* Información de Debug */}
            <div className="rounded-lg border border-blue-400/30 bg-blue-500/20 p-4">
              <h4 className="mb-2 text-sm font-semibold text-white">🔍 Debug Info</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Escena activa: <span className="font-semibold text-white">{activeScene?.name || 'Ninguna'}</span></div>
                <div>ID escena: <span className="font-semibold text-white">{activeScene?.id || 'N/A'}</span></div>
                <div>Material activo: <span className="font-semibold text-white">{activeMaterial?.name || 'Ninguno'}</span></div>
                <div>ID material: <span className="font-semibold text-white">{activeMaterial?.id || 'N/A'}</span></div>
                <div>Escenas disponibles: <span className="font-semibold text-white">{availableScenes.length}</span></div>
                <div>Materiales disponibles: <span className="font-semibold text-white">{availableMaterials.length}</span></div>
                <div>Cliente cargado: <span className="font-semibold text-white">{isClient ? 'Sí' : 'No'}</span></div>
                <div>Config cargada: <span className="font-semibold text-white">{isLoaded ? 'Sí' : 'No'}</span></div>
                <div className="mt-2 border-t border-white/10 pt-2">
                  <div className="text-xs text-blue-300">Persistencia:</div>
                  <div>Material guardado: <span className="font-semibold text-white">{typeof window !== 'undefined' ? localStorage.getItem('wheel-material-manager-config') ? 'Sí' : 'No' : 'N/A'}</span></div>
                  <div>Escena guardada: <span className="font-semibold text-white">{typeof window !== 'undefined' ? localStorage.getItem('wheel-scene-manager-config') ? 'Sí' : 'No' : 'N/A'}</span></div>
                </div>
              </div>
            </div>

            {/* Botón temporal para limpiar localStorage */}
            <div className="rounded-lg border border-red-400/30 bg-red-500/20 p-4">
              <div className="space-y-2">
                <button
                  onClick={clearSceneStorage}
                  className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Limpiar localStorage de escenas y reiniciar
                </button>
                <button
                  onClick={clearMaterialStorage}
                  className="w-full rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                >
                  Limpiar localStorage de materiales y reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
