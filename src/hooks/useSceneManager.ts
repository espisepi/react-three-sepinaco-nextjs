import { useState, useCallback, useMemo } from 'react'
import { UseSceneManagerReturn } from '@/types/scene-manager'
import { getRegisteredScenes } from '@/features/wheel-of-fortune/scenes'

/**
 * Hook personalizado para gestionar múltiples escenas 3D de la ruleta
 * Versión simplificada que funciona correctamente
 */
export const useSceneManager = (initialSceneId?: string): UseSceneManagerReturn => {
  // Estado de la escena activa
  const [activeSceneId, setActiveSceneId] = useState<string>(() => {
    const savedConfig = typeof window !== 'undefined'
      ? localStorage.getItem('wheel-scene-manager-config')
      : null

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        const savedActiveSceneId = parsed.activeSceneId
        const scenes = getRegisteredScenes()
        const sceneExists = scenes.some(scene => scene.id === savedActiveSceneId)
        return sceneExists ? savedActiveSceneId : (initialSceneId || scenes[0]?.id || 'classic')
      } catch {
        // Fallback to default
      }
    }

    const scenes = getRegisteredScenes()
    return initialSceneId || scenes[0]?.id || 'classic'
  })

  // Escenas disponibles
  const scenes = useMemo(() => getRegisteredScenes(), [])

  // Escena activa actual
  const activeScene = useMemo(() => {
    return scenes.find(scene => scene.id === activeSceneId) || null
  }, [scenes, activeSceneId])

  // Cambiar escena activa
  const setActiveScene = useCallback((scene: any) => {
    if (scene) {
      setActiveSceneId(scene.id)
      // Persistir en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('wheel-scene-manager-config', JSON.stringify({
            activeSceneId: scene.id
          }))
        } catch {
          // Silently handle localStorage errors
        }
      }
    }
  }, [])

  // Obtener escena por ID
  const getSceneById = useCallback((id: string) => {
    return scenes.find(scene => scene.id === id) || null
  }, [scenes])

  // Verificar si una escena existe
  const hasScene = useCallback((id: string) => {
    return scenes.some(scene => scene.id === id)
  }, [scenes])

  // Verificar si una escena está activa
  const isSceneActive = useCallback((sceneId: string) => {
    return activeSceneId === sceneId
  }, [activeSceneId])

  // Limpiar escenas (no implementado en esta versión simplificada)
  const clearScenes = useCallback(() => {
    // No implementado en esta versión simplificada
  }, [])

  // Obtener configuración de una escena
  const getSceneConfig = useCallback((sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId)
    return scene?.config || null
  }, [scenes])

  // Actualizar configuración de una escena (no implementado en esta versión simplificada)
  const updateSceneConfig = useCallback((sceneId: string, config: any) => {
    // No implementado en esta versión simplificada
  }, [])

  return {
    scenes,
    activeScene,
    setActiveScene,
    getSceneById,
    hasScene,
    getSceneCount: () => scenes.length,
    clearScenes,
    availableScenes: scenes,
    isSceneActive,
    getSceneConfig,
    updateSceneConfig
  }
}
