import { WheelPanel } from './wheel'

/**
 * Interfaz base para todas las escenas 3D de la ruleta
 * Define el contrato que deben cumplir todas las escenas
 */
export interface WheelScene {
    /** Identificador único de la escena */
    id: string
    /** Nombre descriptivo de la escena */
    name: string
    /** Descripción de la escena */
    description: string
    /** Icono para representar la escena en la UI */
    icon: string
    /** Componente React que renderiza la escena */
    component: React.ComponentType<WheelSceneProps>
    /** Configuración específica de la escena */
    config?: Record<string, any>
}

/**
 * Props que recibe cada escena de la ruleta
 */
export interface WheelSceneProps {
    /** Paneles de la ruleta */
    panels: WheelPanel[]
    /** Estado de giro de la ruleta */
    isSpinning: boolean
    /** Callback cuando se completa el giro */
    onSpinComplete: (panel: WheelPanel) => void
    /** Duración del giro en milisegundos */
    spinDuration: number
    /** Callback cuando cambia el panel actual */
    onCurrentPanelChange?: (panel: WheelPanel | null) => void
    /** Callback para raycast hit */
    onRaycastHit?: (panel: WheelPanel | null) => void
    /** Habilitar controles de órbita */
    enableOrbitControls?: boolean
    /** Configuración específica de la escena */
    sceneConfig?: Record<string, any>
}

/**
 * Configuración del gestor de escenas
 */
export interface SceneManagerConfig {
    /** Escena activa actualmente */
    activeSceneId: string
    /** Escenas disponibles */
    availableScenes: WheelScene[]
    /** Configuración personalizada por escena */
    sceneConfigs: Record<string, Record<string, any>>
}

/**
 * Hook de gestión de escenas
 */
export interface UseSceneManagerReturn {
    /** Escena activa actual */
    activeScene: WheelScene | null
    /** Cambiar a una escena específica */
    setActiveScene: (sceneId: string) => void
    /** Obtener configuración de una escena */
    getSceneConfig: (sceneId: string) => Record<string, any>
    /** Actualizar configuración de una escena */
    updateSceneConfig: (sceneId: string, config: Record<string, any>) => void
    /** Escenas disponibles */
    availableScenes: WheelScene[]
    /** Verificar si una escena está activa */
    isSceneActive: (sceneId: string) => boolean
}

/**
 * Factory para crear escenas dinámicamente
 */
export interface SceneFactory {
    /** Crear una nueva escena */
    createScene: (sceneData: Omit<WheelScene, 'component'>) => WheelScene
    /** Registrar una escena */
    registerScene: (scene: WheelScene) => void
    /** Obtener escena por ID */
    getScene: (sceneId: string) => WheelScene | null
    /** Listar todas las escenas registradas */
    listScenes: () => WheelScene[]
}

/**
 * Configuración por defecto para nuevas escenas
 */
export const DEFAULT_SCENE_CONFIG = {
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
} as const
