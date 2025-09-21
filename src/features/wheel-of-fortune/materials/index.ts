import { WheelMaterial } from '@/types/material-manager'
import { createMaterialWithPreset, createMaterialBuilder } from '../factories/MaterialFactory'

/**
 * Registro automático de todos los materiales disponibles
 * Este archivo centraliza el registro de materiales para facilitar la gestión
 */

// Crear materiales directamente usando presets predefinidos
const classicMaterial: WheelMaterial = createMaterialWithPreset(
    'classic',
    'Clásico',
    'Material tradicional con acabado equilibrado y reflejos suaves',
    '🎯',
    'CLASSIC'
)

const metallicMaterial: WheelMaterial = createMaterialWithPreset(
    'metallic',
    'Metálico',
    'Acabado metálico brillante con alta reflectividad',
    '⚡',
    'METALLIC'
)

const glassMaterial: WheelMaterial = createMaterialWithPreset(
    'glass',
    'Cristal',
    'Material transparente tipo cristal con refracción',
    '🔮',
    'GLASS'
)

const neonMaterial: WheelMaterial = createMaterialWithPreset(
    'neon',
    'Neón',
    'Material brillante con efecto de luz propia',
    '💡',
    'NEON'
)

const matteMaterial: WheelMaterial = createMaterialWithPreset(
    'matte',
    'Mate',
    'Acabado mate sin reflejos para un look minimalista',
    '⚪',
    'MATTE'
)

const shinyMaterial: WheelMaterial = createMaterialWithPreset(
    'shiny',
    'Brillante',
    'Superficie muy pulida con máximo brillo',
    '✨',
    'SHINY'
)

const transparentMaterial: WheelMaterial = createMaterialWithPreset(
    'transparent',
    'Transparente',
    'Material semi-transparente con visibilidad parcial',
    '👻',
    'TRANSPARENT'
)

const emissiveMaterial: WheelMaterial = createMaterialWithPreset(
    'emissive',
    'Emisivo',
    'Material que emite luz propia de forma sutil',
    '🌟',
    'EMISSIVE'
)

// Material personalizado usando el builder pattern
const holographicMaterial: WheelMaterial = createMaterialBuilder('holographic', 'Holográfico')
    .withDescription('Efecto holográfico con colores cambiantes')
    .withIcon('🌈')
    .withConfig({
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.9,
        emissive: '#00ffff',
        emissiveIntensity: 0.2
    })
    .build()

// Material de madera usando el builder pattern
const woodMaterial: WheelMaterial = createMaterialBuilder('wood', 'Madera')
    .withDescription('Acabado natural de madera con textura orgánica')
    .withIcon('🪵')
    .withConfig({
        metalness: 0.0,
        roughness: 0.8,
        clearcoat: 0.1,
        clearcoatRoughness: 0.3,
        transparent: false
    })
    .build()

// Material de piedra usando el builder pattern
const stoneMaterial: WheelMaterial = createMaterialBuilder('stone', 'Piedra')
    .withDescription('Textura rugosa de piedra natural')
    .withIcon('🪨')
    .withConfig({
        metalness: 0.0,
        roughness: 1.0,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        transparent: false
    })
    .build()

// Array de todos los materiales disponibles
const allMaterials = [
    classicMaterial,
    metallicMaterial,
    glassMaterial,
    neonMaterial,
    matteMaterial,
    shinyMaterial,
    transparentMaterial,
    emissiveMaterial,
    holographicMaterial,
    woodMaterial,
    stoneMaterial
]

/**
 * Exportar materiales individuales para uso específico
 */
export {
    classicMaterial,
    metallicMaterial,
    glassMaterial,
    neonMaterial,
    matteMaterial,
    shinyMaterial,
    transparentMaterial,
    emissiveMaterial,
    holographicMaterial,
    woodMaterial,
    stoneMaterial
}

/**
 * Exportar array completo de materiales
 */
export { allMaterials }

/**
 * Función helper para obtener un material por ID
 */
export const getMaterialById = (id: string): WheelMaterial | undefined => {
    return allMaterials.find(material => material.id === id)
}

/**
 * Función helper para obtener materiales por categoría
 */
export const getMaterialsByCategory = (category: 'basic' | 'special' | 'natural'): WheelMaterial[] => {
    const categories = {
        basic: ['classic', 'metallic', 'matte', 'shiny'],
        special: ['glass', 'neon', 'transparent', 'emissive', 'holographic'],
        natural: ['wood', 'stone']
    }

    return allMaterials.filter(material =>
        categories[category].includes(material.id)
    )
}

/**
 * Función helper para obtener materiales con propiedades específicas
 */
export const getMaterialsByProperty = (property: 'transparent' | 'emissive' | 'metallic'): WheelMaterial[] => {
    return allMaterials.filter(material => {
        const config = material.config || {}

        switch (property) {
            case 'transparent':
                return config.transparent === true
            case 'emissive':
                return config.emissive !== undefined
            case 'metallic':
                return (config.metalness || 0) > 0.5
            default:
                return false
        }
    })
}

