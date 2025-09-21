import React from 'react'
import * as THREE from 'three'
import {
  WheelMaterial,
  MaterialFactory,
  MaterialCreationProps,
  DEFAULT_MATERIAL_CONFIG,
  MaterialPreset,
  MATERIAL_PRESETS,
  MaterialConfig
} from '@/types/material-manager'

/**
 * Factory para crear y gestionar materiales de la ruleta
 * Implementa el patrón Factory con registro dinámico de materiales
 * Refactorizado con tipos mejorados y eliminación de any types
 */
class WheelMaterialFactory implements MaterialFactory {
  private materials: Map<string, WheelMaterial> = new Map()

  /**
   * Crear un nuevo material con configuración por defecto
   */
  createMaterial(materialData: Omit<WheelMaterial, 'createMaterial'>): WheelMaterial {
    const material: WheelMaterial = {
      ...materialData,
      createMaterial: (panelColor?: string, texture?: THREE.Texture) => {
        return this.createThreeMaterial(materialData.id, panelColor, texture, materialData.config)
      }
    }

    this.registerMaterial(material)
    return material
  }

  /**
   * Registrar un material en el factory
   */
  registerMaterial(material: WheelMaterial): void {
    if (this.materials.has(material.id)) {
      // Material already exists, overwriting silently
    }

    this.materials.set(material.id, material)
  }

  /**
   * Obtener un material por su ID
   */
  getMaterial(materialId: string): WheelMaterial | null {
    return this.materials.get(materialId) || null
  }

  /**
   * Listar todos los materiales registrados
   */
  listMaterials(): WheelMaterial[] {
    return Array.from(this.materials.values())
  }

  /**
   * Eliminar un material del registro
   */
  unregisterMaterial(materialId: string): boolean {
    return this.materials.delete(materialId)
  }

  /**
   * Verificar si un material existe
   */
  hasMaterial(materialId: string): boolean {
    return this.materials.has(materialId)
  }

  /**
   * Obtener el número total de materiales registrados
   */
  getMaterialCount(): number {
    return this.materials.size
  }

  /**
   * Limpiar todos los materiales registrados
   */
  clearMaterials(): void {
    this.materials.clear()
  }

  /**
   * Crear material Three.js basado en configuración
   * Refactorizado con tipos seguros
   */
  private createThreeMaterial(
    materialId: string,
    panelColor?: string,
    texture?: THREE.Texture,
    config?: Partial<MaterialConfig>
  ): THREE.Material {
    const baseConfig = { ...DEFAULT_MATERIAL_CONFIG, ...config }

    // Crear objeto de configuración del material solo con propiedades válidas
    const materialConfig: Record<string, unknown> = {
      color: panelColor || '#ffffff',
      metalness: baseConfig.metalness,
      roughness: baseConfig.roughness,
      clearcoat: baseConfig.clearcoat,
      clearcoatRoughness: baseConfig.clearcoatRoughness,
      transparent: baseConfig.transparent,
      side: baseConfig.side
    }

    // Solo agregar propiedades opcionales si tienen valores válidos
    if (texture) {
      materialConfig.map = texture
    }

    if (baseConfig.opacity !== undefined) {
      materialConfig.opacity = baseConfig.opacity
    }

    if (baseConfig.emissive !== undefined) {
      materialConfig.emissive = baseConfig.emissive
    }

    if (baseConfig.emissiveIntensity !== undefined) {
      materialConfig.emissiveIntensity = baseConfig.emissiveIntensity
    }

    // Propiedades avanzadas para materiales físicos
    if (baseConfig.transmission !== undefined) {
      materialConfig.transmission = baseConfig.transmission
    }

    if (baseConfig.thickness !== undefined) {
      materialConfig.thickness = baseConfig.thickness
    }

    if (baseConfig.ior !== undefined) {
      materialConfig.ior = baseConfig.ior
    }

    if (baseConfig.reflectivity !== undefined) {
      materialConfig.reflectivity = baseConfig.reflectivity
    }

    // Crear material físico con configuración
    const material = new THREE.MeshPhysicalMaterial(materialConfig as THREE.MeshPhysicalMaterialParameters)

    return material
  }
}

// Instancia singleton del factory
export const materialFactory = new WheelMaterialFactory()

/**
 * Hook personalizado para usar el factory de materiales
 */
export const useMaterialFactory = () => {
  const registerMaterial = React.useCallback((material: WheelMaterial) => {
    materialFactory.registerMaterial(material)
  }, [])

  const getMaterial = React.useCallback((materialId: string) => {
    return materialFactory.getMaterial(materialId)
  }, [])

  const listMaterials = React.useCallback(() => {
    return materialFactory.listMaterials()
  }, [])

  const unregisterMaterial = React.useCallback((materialId: string) => {
    return materialFactory.unregisterMaterial(materialId)
  }, [])

  const hasMaterial = React.useCallback((materialId: string) => {
    return materialFactory.hasMaterial(materialId)
  }, [])

  const getMaterialCount = React.useCallback(() => {
    return materialFactory.getMaterialCount()
  }, [])

  const clearMaterials = React.useCallback(() => {
    materialFactory.clearMaterials()
  }, [])

  return {
    registerMaterial,
    getMaterial,
    listMaterials,
    unregisterMaterial,
    hasMaterial,
    getMaterialCount,
    clearMaterials
  }
}

/**
 * Función helper para crear un material con preset
 */
export const createMaterialWithPreset = (
  id: string,
  name: string,
  description: string,
  icon: string,
  preset: MaterialPreset,
  customConfig?: Partial<MaterialConfig>
): WheelMaterial => {
  const presetConfig = MATERIAL_PRESETS[preset]
  const finalConfig = { ...presetConfig, ...customConfig }

  return materialFactory.createMaterial({
    id,
    name,
    description,
    icon,
    config: finalConfig
  })
}

/**
 * Builder pattern para crear materiales de forma fluida
 */
export class MaterialBuilder {
  private materialData: Partial<WheelMaterial> = {}

  constructor(id: string, name: string) {
    this.materialData.id = id
    this.materialData.name = name
  }

  /**
   * Establecer descripción del material
   */
  withDescription(description: string): MaterialBuilder {
    this.materialData.description = description
    return this
  }

  /**
   * Establecer icono del material
   */
  withIcon(icon: string): MaterialBuilder {
    this.materialData.icon = icon
    return this
  }

  /**
   * Establecer configuración del material
   */
  withConfig(config: Partial<MaterialConfig>): MaterialBuilder {
    this.materialData.config = {
      ...DEFAULT_MATERIAL_CONFIG,
      ...config
    }
    return this
  }

  /**
   * Usar un preset predefinido
   */
  withPreset(preset: MaterialPreset): MaterialBuilder {
    const presetConfig = MATERIAL_PRESETS[preset]
    this.materialData.config = {
      ...DEFAULT_MATERIAL_CONFIG,
      ...presetConfig,
      ...this.materialData.config
    }
    return this
  }

  /**
   * Construir el material final
   */
  build(): WheelMaterial {
    if (!this.materialData.id || !this.materialData.name) {
      throw new Error('Material ID and name are required')
    }

    const material: WheelMaterial = {
      id: this.materialData.id,
      name: this.materialData.name,
      description: this.materialData.description || '',
      icon: this.materialData.icon || '🎨',
      config: this.materialData.config || DEFAULT_MATERIAL_CONFIG,
      createMaterial: (panelColor?: string, texture?: THREE.Texture) => {
        return materialFactory['createThreeMaterial'](
          this.materialData.id!,
          panelColor,
          texture,
          this.materialData.config
        )
      }
    }

    materialFactory.registerMaterial(material)
    return material
  }
}

/**
 * Función helper para crear un builder de material
 */
export const createMaterialBuilder = (id: string, name: string): MaterialBuilder => {
  return new MaterialBuilder(id, name)
}
