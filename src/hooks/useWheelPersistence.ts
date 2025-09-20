import { useState, useEffect, useCallback, useMemo } from 'react'
import { WheelPanel } from '@/types/wheel'

export interface WheelConfiguration {
  panels: WheelPanel[]
  spinDuration: number
  enableOrbitControls: boolean
  canvasWidth: number
  canvasHeight: number
  blockVisibility: {
    wheelControl: boolean
    panelDetected: boolean
    wheelResult: boolean
    panelsManagement: boolean
    spinDuration: boolean
    canvasSize: boolean
    configManager: boolean
    instructions: boolean
  }
  version: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'wheel-of-fortune-config'
const DEFAULT_CONFIG: WheelConfiguration = {
  panels: [
    { id: '1', text: 'Premio 1', color: '#FF4444' },
    { id: '2', text: 'Premio 2', color: '#00AA44' },
    { id: '3', text: 'Premio 3', color: '#0066FF' },
    { id: '4', text: 'Premio 4', color: '#FF8800' },
    { id: '5', text: 'Premio 5', color: '#8800FF' },
    { id: '6', text: 'Premio 6', color: '#00CCCC' },
  ],
  spinDuration: 3,
  enableOrbitControls: false,
  canvasWidth: 100,
  canvasHeight: 50,
  blockVisibility: {
    wheelControl: true,
    panelDetected: true,
    wheelResult: true,
    panelsManagement: true,
    spinDuration: true,
    canvasSize: true,
    configManager: true,
    instructions: true,
  },
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function useWheelPersistence() {
  const [config, setConfig] = useState<WheelConfiguration>(DEFAULT_CONFIG)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true)
      return
    }

    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY)
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig) as WheelConfiguration
        // Validar que la configuración tenga la estructura correcta
        if (isValidConfiguration(parsedConfig)) {
          setConfig(parsedConfig)
        } else {
          // console.warn('Configuración inválida encontrada, usando configuración por defecto')
        }
      }
    } catch (error) {
      // console.error('Error al cargar configuración desde localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Función para validar la estructura de la configuración
  const isValidConfiguration = (config: any): config is WheelConfiguration => {
    return (
      config &&
      typeof config === 'object' &&
      Array.isArray(config.panels) &&
      typeof config.spinDuration === 'number' &&
      typeof config.enableOrbitControls === 'boolean' &&
      typeof config.canvasWidth === 'number' &&
      typeof config.canvasHeight === 'number' &&
      config.blockVisibility &&
      typeof config.blockVisibility === 'object' &&
      typeof config.blockVisibility.wheelControl === 'boolean' &&
      typeof config.blockVisibility.panelDetected === 'boolean' &&
      typeof config.blockVisibility.wheelResult === 'boolean' &&
      typeof config.blockVisibility.panelsManagement === 'boolean' &&
      typeof config.blockVisibility.spinDuration === 'boolean' &&
      typeof config.blockVisibility.canvasSize === 'boolean' &&
      typeof config.blockVisibility.configManager === 'boolean' &&
      typeof config.blockVisibility.instructions === 'boolean' &&
      typeof config.version === 'string' &&
      typeof config.createdAt === 'string' &&
      typeof config.updatedAt === 'string'
    )
  }

  // Guardar en localStorage
  const saveToLocalStorage = useCallback((configToSave: WheelConfiguration) => {
    if (typeof window === 'undefined') return

    try {
      const configWithTimestamp = {
        ...configToSave,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configWithTimestamp))
    } catch (error) {
      // console.error('Error al guardar en localStorage:', error)
    }
  }, [])

  // Guardar automáticamente en localStorage cuando cambie la configuración
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(config)
    }
  }, [config, isLoaded, saveToLocalStorage])

  // Actualizar configuración
  const updateConfig = useCallback((updates: Partial<WheelConfiguration>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  // Actualizar paneles
  const updatePanels = useCallback((panels: WheelPanel[]) => {
    updateConfig({ panels })
  }, [updateConfig])

  // Actualizar duración del giro
  const updateSpinDuration = useCallback((spinDuration: number) => {
    updateConfig({ spinDuration })
  }, [updateConfig])

  // Actualizar controles de órbita
  const updateOrbitControls = useCallback((enableOrbitControls: boolean) => {
    updateConfig({ enableOrbitControls })
  }, [updateConfig])

  // Actualizar tamaño del canvas
  const updateCanvasSize = useCallback((canvasWidth: number, canvasHeight: number) => {
    updateConfig({ canvasWidth, canvasHeight })
  }, [updateConfig])

  // Actualizar visibilidad de bloques
  const updateBlockVisibility = useCallback((blockKey: keyof WheelConfiguration['blockVisibility'], isVisible: boolean) => {
    updateConfig({
      blockVisibility: {
        ...config.blockVisibility,
        [blockKey]: isVisible,
      },
    })
  }, [config.blockVisibility, updateConfig])

  // Descargar configuración como archivo JSON
  const downloadConfig = useCallback(() => {
    try {
      const configToDownload = {
        ...config,
        downloadedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(configToDownload, null, 2)], {
        type: 'application/json',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ruleta-config-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      // console.error('Error al descargar configuración:', error)
      return false
    }
  }, [config])

  // Cargar configuración desde archivo JSON
  const loadConfigFromFile = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsedConfig = JSON.parse(content) as WheelConfiguration

          if (isValidConfiguration(parsedConfig)) {
            setConfig(parsedConfig)
            resolve(true)
          } else {
            // console.error('Archivo de configuración inválido')
            resolve(false)
          }
        } catch (error) {
          // console.error('Error al parsear archivo de configuración:', error)
          resolve(false)
        }
      }

      reader.onerror = () => {
        // console.error('Error al leer archivo')
        resolve(false)
      }

      reader.readAsText(file)
    })
  }, [])

  // Resetear a configuración por defecto
  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
  }, [])

  // Limpiar localStorage
  const clearStorage = useCallback(() => {
    if (typeof window === 'undefined') return false

    try {
      localStorage.removeItem(STORAGE_KEY)
      setConfig(DEFAULT_CONFIG)
      return true
    } catch (error) {
      // console.error('Error al limpiar localStorage:', error)
      return false
    }
  }, [])

  // Memoizar información de la configuración para evitar recálculos
  const configInfo = useMemo(() => ({
    hasLocalStorage: typeof window !== 'undefined' ? !!localStorage.getItem(STORAGE_KEY) : false,
    panelCount: config.panels.length,
    lastUpdated: config.updatedAt,
    version: config.version,
  }), [config.panels.length, config.updatedAt, config.version])

  // Obtener información de la configuración
  const getConfigInfo = useCallback(() => configInfo, [configInfo])

  return {
    config,
    isLoaded,
    updateConfig,
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
  }
}
