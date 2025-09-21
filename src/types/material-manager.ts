import React from 'react'
import * as THREE from 'three'

/**
 * Tipos mejorados para el sistema de materiales
 * Eliminando any types y mejorando la seguridad de tipos
 */

export interface MaterialConfig {
  metalness: number
  roughness: number
  clearcoat: number
  clearcoatRoughness: number
  transparent: boolean
  side: THREE.Side
  opacity?: number
  emissive?: string
  emissiveIntensity?: number
  transmission?: number
  thickness?: number
  ior?: number
  reflectivity?: number
}

export interface WheelMaterial {
  id: string
  name: string
  description: string
  icon: string
  config?: Partial<MaterialConfig>
  createMaterial: (panelColor?: string, texture?: THREE.Texture) => THREE.Material
}

export interface MaterialFactory {
  createMaterial(materialData: Omit<WheelMaterial, 'createMaterial'>): WheelMaterial
  registerMaterial(material: WheelMaterial): void
  getMaterial(materialId: string): WheelMaterial | null
  listMaterials(): WheelMaterial[]
  unregisterMaterial(materialId: string): boolean
  hasMaterial(materialId: string): boolean
  getMaterialCount(): number
  clearMaterials(): void
}

export interface MaterialCreationProps {
  panelColor?: string
  texture?: THREE.Texture
  config?: Partial<MaterialConfig>
}

/**
 * Interfaz para el hook useMaterialManager
 */
export interface UseMaterialManagerReturn {
  materials: WheelMaterial[]
  activeMaterial: WheelMaterial | null
  setActiveMaterial: (material: WheelMaterial | null) => void
  getMaterialById: (id: string) => WheelMaterial | null
  hasMaterial: (id: string) => boolean
  getMaterialCount: () => number
  clearMaterials: () => void
  getMaterialConfig: (materialId: string) => Partial<MaterialConfig> | null
  updateMaterialConfig: (materialId: string, config: Partial<MaterialConfig>) => void
  availableMaterials: WheelMaterial[]
  isMaterialActive: (materialId: string) => boolean
}

/**
 * Configuración para el manager de materiales
 */
export interface MaterialManagerConfig {
  autoLoad: boolean
  cacheSize: number
  preloadMaterials: boolean
}

export type MaterialPreset = 'CLASSIC' | 'METALLIC' | 'GLASS' | 'NEON' | 'MATTE' | 'SHINY' | 'TRANSPARENT' | 'EMISSIVE'

export const DEFAULT_MATERIAL_CONFIG: MaterialConfig = {
  metalness: 0.1,
  roughness: 0.3,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  transparent: false,
  side: THREE.DoubleSide
}

export const MATERIAL_PRESETS: Record<MaterialPreset, Partial<MaterialConfig>> = {
  CLASSIC: {
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    transparent: false
  },
  METALLIC: {
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.0,
    transparent: false
  },
  GLASS: {
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    transparent: true,
    opacity: 0.3,
    transmission: 0.9,
    thickness: 0.1,
    ior: 1.5
  },
  NEON: {
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transparent: false,
    emissive: '#ffffff',
    emissiveIntensity: 0.5
  },
  MATTE: {
    metalness: 0.0,
    roughness: 1.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transparent: false
  },
  SHINY: {
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    transparent: false
  },
  TRANSPARENT: {
    metalness: 0.0,
    roughness: 0.1,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transparent: true,
    opacity: 0.7
  },
  EMISSIVE: {
    metalness: 0.0,
    roughness: 0.2,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transparent: false,
    emissive: '#444444',
    emissiveIntensity: 0.2
  }
}
