import { useState, useCallback, useMemo, useEffect } from 'react'
import { WheelMaterial, UseMaterialManagerReturn, MaterialManagerConfig } from '@/types/material-manager'
import { allMaterials } from '@/features/wheel-of-fortune/materials'

/**
 * Hook personalizado para gestionar materiales de la ruleta
 * Implementa el patrón State Manager para gestión centralizada con persistencia robusta
 */
export const useMaterialManager = (initialMaterialId?: string): UseMaterialManagerReturn => {
  // Estado del gestor de materiales
  const [config, setConfig] = useState<MaterialManagerConfig>(() => {
    // Intentar cargar configuración desde localStorage
    const savedConfig = typeof window !== 'undefined'
      ? localStorage.getItem('wheel-material-manager-config')
      : null

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)

        // Verificar que el material activo guardado existe en los materiales disponibles
        const savedActiveMaterialId = parsed.activeMaterialId
        const materialExists = allMaterials.some(material => material.id === savedActiveMaterialId)

        return {
          activeMaterialId: materialExists ? savedActiveMaterialId : (initialMaterialId || allMaterials[0]?.id || 'classic'),
          availableMaterials: allMaterials, // Siempre usar los materiales iniciales para evitar inconsistencias
          materialConfigs: parsed.materialConfigs || {}
        }
      } catch (error) {
        // Error parsing saved config, using defaults
        // Silently fallback to default configuration
      }
    }

    return {
      activeMaterialId: initialMaterialId || allMaterials[0]?.id || 'classic',
      availableMaterials: allMaterials,
      materialConfigs: {}
    }
  })

  // Persistir configuración en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined' && config.activeMaterialId) {
      try {
        localStorage.setItem('wheel-material-manager-config', JSON.stringify(config))
      } catch (error) {
        // Silently handle localStorage errors
      }
    }
  }, [config])

  // Material activo actual
  const activeMaterial = useMemo(() => {
    return config.availableMaterials.find(material => material.id === config.activeMaterialId) || null
  }, [config.activeMaterialId, config.availableMaterials])

  // Cambiar material activo
  const setActiveMaterial = useCallback((materialId: string) => {
    const materialExists = config.availableMaterials.some(material => material.id === materialId)
    if (!materialExists) {
      // Material not found, silently ignore
      return
    }

    if (config.activeMaterialId === materialId) {
      // No cambiar si ya es el material activo
      return
    }

    setConfig(prev => ({
      ...prev,
      activeMaterialId: materialId
    }))
  }, [config.availableMaterials, config.activeMaterialId])

  // Obtener configuración de un material
  const getMaterialConfig = useCallback((materialId: string): Record<string, any> => {
    const material = config.availableMaterials.find(m => m.id === materialId)
    const customConfig = config.materialConfigs[materialId] || {}
    const defaultConfig = material?.config || {}

    return { ...defaultConfig, ...customConfig }
  }, [config.materialConfigs, config.availableMaterials])

  // Actualizar configuración de un material
  const updateMaterialConfig = useCallback((materialId: string, newConfig: Record<string, any>) => {
    setConfig(prev => ({
      ...prev,
      materialConfigs: {
        ...prev.materialConfigs,
        [materialId]: {
          ...prev.materialConfigs[materialId],
          ...newConfig
        }
      }
    }))
  }, [])

  // Verificar si un material está activo
  const isMaterialActive = useCallback((materialId: string): boolean => {
    return config.activeMaterialId === materialId
  }, [config.activeMaterialId])

  // Materiales disponibles (memoizado para evitar re-renders innecesarios)
  const availableMaterials = useMemo(() => config.availableMaterials, [config.availableMaterials])

  return {
    activeMaterial,
    setActiveMaterial,
    getMaterialConfig,
    updateMaterialConfig,
    availableMaterials,
    isMaterialActive
  }
}

/**
 * Hook para gestión avanzada de materiales con persistencia
 * Extiende el hook básico con funcionalidades adicionales
 */
export const useAdvancedMaterialManager = () => {
  const basicManager = useMaterialManager()
  const [materialHistory, setMaterialHistory] = useState<string[]>([])
  const [favoriteMaterials, setFavoriteMaterials] = useState<string[]>([])

  // Cargar historial y favoritos desde localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedHistory = localStorage.getItem('wheel-material-history')
      if (savedHistory) {
        setMaterialHistory(JSON.parse(savedHistory))
      }

      const savedFavorites = localStorage.getItem('wheel-favorite-materials')
      if (savedFavorites) {
        setFavoriteMaterials(JSON.parse(savedFavorites))
      }
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [])

  // Persistir historial y favoritos en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('wheel-material-history', JSON.stringify(materialHistory))
      } catch (error) {
        // Silently handle localStorage errors
      }
    }
  }, [materialHistory])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('wheel-favorite-materials', JSON.stringify(favoriteMaterials))
      } catch (error) {
        // Silently handle localStorage errors
      }
    }
  }, [favoriteMaterials])

  // Agregar material al historial
  const addToHistory = useCallback((materialId: string) => {
    setMaterialHistory(prev => {
      const newHistory = [materialId, ...prev.filter(id => id !== materialId)].slice(0, 10)
      return newHistory
    })
  }, [])

  // Cambiar material con historial
  const setActiveMaterialWithHistory = useCallback((materialId: string) => {
    basicManager.setActiveMaterial(materialId)
    addToHistory(materialId)
  }, [basicManager, addToHistory])

  // Agregar/quitar de favoritos
  const toggleFavorite = useCallback((materialId: string) => {
    setFavoriteMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId)
      } else {
        return [...prev, materialId]
      }
    })
  }, [])

  // Obtener materiales favoritos
  const getFavoriteMaterials = useCallback(() => {
    return basicManager.availableMaterials.filter(material =>
      favoriteMaterials.includes(material.id)
    )
  }, [basicManager.availableMaterials, favoriteMaterials])

  // Obtener historial de materiales
  const getMaterialHistory = useCallback(() => {
    return materialHistory.map(id =>
      basicManager.availableMaterials.find(material => material.id === id)
    ).filter(Boolean) as WheelMaterial[]
  }, [materialHistory, basicManager.availableMaterials])

  return {
    ...basicManager,
    setActiveMaterial: setActiveMaterialWithHistory,
    toggleFavorite,
    getFavoriteMaterials,
    getMaterialHistory,
    favoriteMaterials,
    materialHistory
  }
}

/**
 * Hook para crear materiales personalizados
 */
export const useCustomMaterialCreator = () => {
  const [customMaterials, setCustomMaterials] = useState<WheelMaterial[]>([])

  // Crear material personalizado
  const createCustomMaterial = useCallback((
    id: string,
    name: string,
    description: string,
    icon: string,
    config: Record<string, any>
  ) => {
    const customMaterial: WheelMaterial = {
      id,
      name,
      description,
      icon,
      config,
      createMaterial: (panelColor?: string, texture?: any) => {
        return new (window as any).THREE.MeshPhysicalMaterial({
          color: panelColor || '#ffffff',
          map: texture,
          ...config
        })
      }
    }

    setCustomMaterials(prev => [...prev, customMaterial])
    return customMaterial
  }, [])

  // Eliminar material personalizado
  const removeCustomMaterial = useCallback((materialId: string) => {
    setCustomMaterials(prev => prev.filter(material => material.id !== materialId))
  }, [])

  // Obtener todos los materiales (incluyendo personalizados)
  const getAllMaterials = useCallback(() => {
    return [...allMaterials, ...customMaterials]
  }, [customMaterials])

  return {
    createCustomMaterial,
    removeCustomMaterial,
    customMaterials,
    getAllMaterials
  }
}
