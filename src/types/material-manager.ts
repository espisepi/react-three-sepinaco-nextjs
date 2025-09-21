import * as THREE from 'three'

/**
 * Interfaz para parámetros de transformación de textura
 */
export interface TextureTransformParams {
    /** Escala de la textura (0.1 = pequeña, 1 = normal, 30 = máxima) */
    textureScale?: number
    /** Rotación de la textura en grados (0-360) */
    textureRotation?: number
    /** Desplazamiento horizontal de la textura (-1 a 1) */
    textureOffsetX?: number
    /** Desplazamiento vertical de la textura (-1 a 1) */
    textureOffsetY?: number
}

/**
 * Interfaz base para todos los materiales de la ruleta
 * Define el contrato que deben cumplir todos los materiales
 */
export interface WheelMaterial {
    /** Identificador único del material */
    id: string
    /** Nombre descriptivo del material */
    name: string
    /** Descripción del material */
    description: string
    /** Icono para representar el material en la UI */
    icon: string
    /** Función que crea el material Three.js */
    createMaterial: (panelColor?: string, texture?: THREE.Texture, transformParams?: TextureTransformParams) => THREE.Material
    /** Configuración específica del material */
    config?: Record<string, any>
}

/**
 * Props que recibe cada función de creación de material
 */
export interface MaterialCreationProps {
    /** Color del panel */
    panelColor?: string
    /** Textura del panel */
    texture?: THREE.Texture
    /** Configuración adicional */
    config?: Record<string, any>
}

/**
 * Configuración del gestor de materiales
 */
export interface MaterialManagerConfig {
    /** Material activo actualmente */
    activeMaterialId: string
    /** Materiales disponibles */
    availableMaterials: WheelMaterial[]
    /** Configuración personalizada por material */
    materialConfigs: Record<string, Record<string, any>>
}

/**
 * Hook de gestión de materiales
 */
export interface UseMaterialManagerReturn {
    /** Material activo actual */
    activeMaterial: WheelMaterial | null
    /** Cambiar a un material específico */
    setActiveMaterial: (materialId: string) => void
    /** Obtener configuración de un material */
    getMaterialConfig: (materialId: string) => Record<string, any>
    /** Actualizar configuración de un material */
    updateMaterialConfig: (materialId: string, config: Record<string, any>) => void
    /** Materiales disponibles */
    availableMaterials: WheelMaterial[]
    /** Verificar si un material está activo */
    isMaterialActive: (materialId: string) => boolean
}

/**
 * Factory para crear materiales dinámicamente
 */
export interface MaterialFactory {
    /** Crear un nuevo material */
    createMaterial: (materialData: Omit<WheelMaterial, 'createMaterial'>) => WheelMaterial
    /** Registrar un material */
    registerMaterial: (material: WheelMaterial) => void
    /** Obtener material por ID */
    getMaterial: (materialId: string) => WheelMaterial | null
    /** Listar todos los materiales registrados */
    listMaterials: () => WheelMaterial[]
}

/**
 * Configuración por defecto para nuevos materiales
 */
export const DEFAULT_MATERIAL_CONFIG = {
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    transparent: false,
    side: THREE.DoubleSide
} as const

/**
 * Tipos de materiales predefinidos
 */
export type MaterialPreset =
    | 'CLASSIC'
    | 'METALLIC'
    | 'GLASS'
    | 'NEON'
    | 'MATTE'
    | 'SHINY'
    | 'TRANSPARENT'
    | 'EMISSIVE'

/**
 * Configuraciones predefinidas para cada tipo de material
 * Optimizadas para renderizado físico con mejor calidad visual
 */
export const MATERIAL_PRESETS: Record<MaterialPreset, Record<string, any>> = {
    CLASSIC: {
        metalness: 0.2,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        transparent: false,
        reflectivity: 0.5
    },
    METALLIC: {
        metalness: 0.95,
        roughness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.02,
        transparent: false,
        reflectivity: 0.9
    },
    GLASS: {
        metalness: 0.0,
        roughness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.85,
        transmission: 0.9,
        thickness: 0.5,
        ior: 1.5
    },
    NEON: {
        metalness: 0.0,
        roughness: 0.0,
        emissive: '#ffffff',
        emissiveIntensity: 0.8,
        transparent: false,
        reflectivity: 0.0
    },
    MATTE: {
        metalness: 0.0,
        roughness: 0.9,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        transparent: false,
        reflectivity: 0.1
    },
    SHINY: {
        metalness: 0.3,
        roughness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: false,
        reflectivity: 0.8
    },
    TRANSPARENT: {
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.75,
        transmission: 0.3
    },
    EMISSIVE: {
        metalness: 0.0,
        roughness: 0.1,
        emissive: '#ffffff',
        emissiveIntensity: 0.4,
        transparent: false,
        reflectivity: 0.2
    }
} as const
