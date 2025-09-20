import React from 'react'
import { WheelScene, SceneFactory, WheelSceneProps, DEFAULT_SCENE_CONFIG } from '@/types/scene-manager'

/**
 * Factory para crear y gestionar escenas de la ruleta
 * Implementa el patrón Factory con registro dinámico de escenas
 */
class WheelSceneFactory implements SceneFactory {
    private scenes: Map<string, WheelScene> = new Map()

    /**
     * Crear una nueva escena con configuración por defecto
     */
    createScene(sceneData: Omit<WheelScene, 'component'>): WheelScene {
        // Esta función requiere que se proporcione el componente
        throw new Error('createScene requires a component. Use createSceneWithPreset or SceneBuilder instead.')
    }

    /**
     * Registrar una escena en el factory
     */
    registerScene(scene: WheelScene): void {
        if (this.scenes.has(scene.id)) {
            // Scene already exists, overwriting silently
        }

        this.scenes.set(scene.id, scene)
    }

    /**
     * Obtener una escena por su ID
     */
    getScene(sceneId: string): WheelScene | null {
        return this.scenes.get(sceneId) || null
    }

    /**
     * Listar todas las escenas registradas
     */
    listScenes(): WheelScene[] {
        return Array.from(this.scenes.values())
    }

    /**
     * Eliminar una escena del registro
     */
    unregisterScene(sceneId: string): boolean {
        return this.scenes.delete(sceneId)
    }

    /**
     * Verificar si una escena existe
     */
    hasScene(sceneId: string): boolean {
        return this.scenes.has(sceneId)
    }

    /**
     * Obtener el número total de escenas registradas
     */
    getSceneCount(): number {
        return this.scenes.size
    }

    /**
     * Limpiar todas las escenas registradas
     */
    clearScenes(): void {
        this.scenes.clear()
    }
}

// Instancia singleton del factory
export const sceneFactory = new WheelSceneFactory()

/**
 * Hook para usar el factory de escenas
 */
export const useSceneFactory = () => {
    const createScene = React.useCallback((sceneData: Omit<WheelScene, 'component'>) => {
        return sceneFactory.createScene(sceneData)
    }, [])

    const registerScene = React.useCallback((scene: WheelScene) => {
        sceneFactory.registerScene(scene)
    }, [])

    const getScene = React.useCallback((sceneId: string) => {
        return sceneFactory.getScene(sceneId)
    }, [])

    const listScenes = React.useCallback(() => {
        return sceneFactory.listScenes()
    }, [])

    const unregisterScene = React.useCallback((sceneId: string) => {
        return sceneFactory.unregisterScene(sceneId)
    }, [])

    const hasScene = React.useCallback((sceneId: string) => {
        return sceneFactory.hasScene(sceneId)
    }, [])

    const getSceneCount = React.useCallback(() => {
        return sceneFactory.getSceneCount()
    }, [])

    const clearScenes = React.useCallback(() => {
        sceneFactory.clearScenes()
    }, [])

    return {
        createScene,
        registerScene,
        getScene,
        listScenes,
        unregisterScene,
        hasScene,
        getSceneCount,
        clearScenes
    }
}

/**
 * Builder pattern para crear escenas de forma fluida
 */
export class SceneBuilder {
    private sceneData: Partial<WheelScene> = {}

    constructor(id: string, name: string) {
        this.sceneData.id = id
        this.sceneData.name = name
    }

    /**
     * Establecer descripción de la escena
     */
    withDescription(description: string): SceneBuilder {
        this.sceneData.description = description
        return this
    }

    /**
     * Establecer icono de la escena
     */
    withIcon(icon: string): SceneBuilder {
        this.sceneData.icon = icon
        return this
    }

    /**
     * Establecer componente de la escena
     */
    withComponent(component: React.ComponentType<WheelSceneProps>): SceneBuilder {
        this.sceneData.component = component
        return this
    }

    /**
     * Establecer configuración de la escena
     */
    withConfig(config: Record<string, any>): SceneBuilder {
        this.sceneData.config = {
            ...DEFAULT_SCENE_CONFIG,
            ...config
        }
        return this
    }

    /**
     * Construir la escena final
     */
    build(): WheelScene {
        if (!this.sceneData.component) {
            throw new Error('Scene component is required')
        }

        const scene: WheelScene = {
            id: this.sceneData.id!,
            name: this.sceneData.name!,
            description: this.sceneData.description || '',
            icon: this.sceneData.icon || '🎬',
            component: this.sceneData.component,
            config: this.sceneData.config || DEFAULT_SCENE_CONFIG
        }

        sceneFactory.registerScene(scene)
        return scene
    }
}

/**
 * Función helper para crear un builder de escena
 */
export const createSceneBuilder = (id: string, name: string): SceneBuilder => {
    return new SceneBuilder(id, name)
}

/**
 * Configuraciones predefinidas para diferentes tipos de escenas
 */
export const SCENE_PRESETS = {
    CLASSIC: {
        lighting: {
            ambientIntensity: 0.4,
            directionalIntensity: 1,
            pointLightIntensity: 0.5,
            pointLightColor: '#4ECDC4'
        },
        camera: {
            position: [0, 0, 5],
            target: [0, 0, 0]
        },
        wheel: {
            radius: 2,
            height: 0.2,
            segments: 8
        }
    },
    DARK: {
        lighting: {
            ambientIntensity: 0.2,
            directionalIntensity: 0.8,
            pointLightIntensity: 0.3,
            pointLightColor: '#FF6B6B'
        },
        camera: {
            position: [0, 0, 6],
            target: [0, 0, 0]
        },
        wheel: {
            radius: 2.2,
            height: 0.3,
            segments: 12
        }
    },
    BRIGHT: {
        lighting: {
            ambientIntensity: 0.6,
            directionalIntensity: 1.2,
            pointLightIntensity: 0.8,
            pointLightColor: '#4ECDC4'
        },
        camera: {
            position: [0, 0, 4],
            target: [0, 0, 0]
        },
        wheel: {
            radius: 1.8,
            height: 0.15,
            segments: 6
        }
    },
    NEON: {
        lighting: {
            ambientIntensity: 0.1,
            directionalIntensity: 0.5,
            pointLightIntensity: 1.0,
            pointLightColor: '#00FFFF'
        },
        camera: {
            position: [0, 0, 7],
            target: [0, 0, 0]
        },
        wheel: {
            radius: 2.5,
            height: 0.4,
            segments: 16
        }
    }
} as const

/**
 * Función helper para crear escenas con presets
 */
export const createSceneWithPreset = (
    id: string,
    name: string,
    component: React.ComponentType<WheelSceneProps>,
    preset: keyof typeof SCENE_PRESETS = 'CLASSIC'
): WheelScene => {
    return createSceneBuilder(id, name)
        .withComponent(component)
        .withConfig(SCENE_PRESETS[preset])
        .build()
}
