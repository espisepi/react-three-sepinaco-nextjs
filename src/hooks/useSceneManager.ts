import { useState, useCallback, useMemo, useEffect } from 'react'
import {
    WheelScene,
    SceneManagerConfig,
    UseSceneManagerReturn,
    DEFAULT_SCENE_CONFIG
} from '@/types/scene-manager'

/**
 * Hook personalizado para gestionar múltiples escenas 3D de la ruleta
 * Implementa el patrón State Manager con persistencia local
 */
export const useSceneManager = (
    initialScenes: WheelScene[] = [],
    initialActiveSceneId?: string
): UseSceneManagerReturn => {
    // Estado del gestor de escenas
    const [config, setConfig] = useState<SceneManagerConfig>(() => {
        // Intentar cargar configuración desde localStorage
        const savedConfig = typeof window !== 'undefined'
            ? localStorage.getItem('wheel-scene-manager-config')
            : null

        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig)
                return {
                    activeSceneId: parsed.activeSceneId || initialActiveSceneId || initialScenes[0]?.id || '',
                    availableScenes: parsed.availableScenes || initialScenes,
                    sceneConfigs: parsed.sceneConfigs || {}
                }
            } catch (error) {
                // Error parsing saved config, using defaults
            }
        }

        return {
            activeSceneId: initialActiveSceneId || initialScenes[0]?.id || '',
            availableScenes: initialScenes,
            sceneConfigs: {}
        }
    })

    // Persistir configuración en localStorage cuando cambie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('wheel-scene-manager-config', JSON.stringify(config))
        }
    }, [config])

    // Escena activa actual
    const activeScene = useMemo(() => {
        return config.availableScenes.find(scene => scene.id === config.activeSceneId) || null
    }, [config.activeSceneId, config.availableScenes])

    // Cambiar escena activa
    const setActiveScene = useCallback((sceneId: string) => {
        const sceneExists = config.availableScenes.some(scene => scene.id === sceneId)
        if (!sceneExists) {
            return
        }

        setConfig(prev => ({
            ...prev,
            activeSceneId: sceneId
        }))
    }, [config.availableScenes])

    // Obtener configuración de una escena específica
    const getSceneConfig = useCallback((sceneId: string): Record<string, any> => {
        return config.sceneConfigs[sceneId] || DEFAULT_SCENE_CONFIG
    }, [config.sceneConfigs])

    // Actualizar configuración de una escena
    const updateSceneConfig = useCallback((sceneId: string, newConfig: Record<string, any>) => {
        setConfig(prev => ({
            ...prev,
            sceneConfigs: {
                ...prev.sceneConfigs,
                [sceneId]: {
                    ...prev.sceneConfigs[sceneId],
                    ...newConfig
                }
            }
        }))
    }, [])

    // Verificar si una escena está activa
    const isSceneActive = useCallback((sceneId: string): boolean => {
        return config.activeSceneId === sceneId
    }, [config.activeSceneId])

    // Escenas disponibles (memoizado para evitar re-renders innecesarios)
    const availableScenes = useMemo(() => config.availableScenes, [config.availableScenes])

    return {
        activeScene,
        setActiveScene,
        getSceneConfig,
        updateSceneConfig,
        availableScenes,
        isSceneActive
    }
}

/**
 * Hook para registrar nuevas escenas dinámicamente
 */
export const useSceneRegistry = () => {
    const [registeredScenes, setRegisteredScenes] = useState<WheelScene[]>([])

    const registerScene = useCallback((scene: WheelScene) => {
        setRegisteredScenes(prev => {
            const exists = prev.some(s => s.id === scene.id)
            if (exists) {
                return prev
            }
            return [...prev, scene]
        })
    }, [])

    const unregisterScene = useCallback((sceneId: string) => {
        setRegisteredScenes(prev => prev.filter(scene => scene.id !== sceneId))
    }, [])

    const getRegisteredScenes = useCallback(() => registeredScenes, [registeredScenes])

    return {
        registerScene,
        unregisterScene,
        getRegisteredScenes
    }
}

/**
 * Hook para crear configuraciones de escena con valores por defecto
 */
export const useSceneConfigFactory = () => {
    const createDefaultConfig = useCallback((sceneId: string, overrides: Record<string, any> = {}) => {
        return {
            ...DEFAULT_SCENE_CONFIG,
            ...overrides,
            sceneId
        }
    }, [])

    const createLightingConfig = useCallback((overrides: Record<string, any> = {}) => {
        return {
            ambientIntensity: 0.4,
            directionalIntensity: 1,
            pointLightIntensity: 0.5,
            pointLightColor: '#4ECDC4',
            ...overrides
        }
    }, [])

    const createCameraConfig = useCallback((overrides: Record<string, any> = {}) => {
        return {
            position: [0, 0, 5],
            target: [0, 0, 0],
            ...overrides
        }
    }, [])

    const createWheelConfig = useCallback((overrides: Record<string, any> = {}) => {
        return {
            radius: 2,
            height: 0.2,
            segments: 8,
            ...overrides
        }
    }, [])

    return {
        createDefaultConfig,
        createLightingConfig,
        createCameraConfig,
        createWheelConfig
    }
}
