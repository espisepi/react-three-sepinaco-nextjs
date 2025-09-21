import { useState, useCallback, useMemo } from 'react'
import { WheelMaterial, UseMaterialManagerReturn } from '@/types/material-manager'
import { allMaterials } from '@/features/wheel-of-fortune/materials'

/**
 * Hook personalizado para gestionar materiales de la ruleta
 * Versión simplificada que funciona correctamente
 */
export const useMaterialManager = (initialMaterialId?: string): UseMaterialManagerReturn => {
  // Estado del material activo
  const [activeMaterialId, setActiveMaterialId] = useState<string>(() => {
    const savedConfig = typeof window !== 'undefined'
      ? localStorage.getItem('wheel-material-manager-config')
      : null

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        const savedActiveMaterialId = parsed.activeMaterialId
        const materialExists = allMaterials.some(material => material.id === savedActiveMaterialId)
        return materialExists ? savedActiveMaterialId : (initialMaterialId || allMaterials[0]?.id || 'classic')
      } catch {
        // Fallback to default
      }
    }

    return initialMaterialId || allMaterials[0]?.id || 'classic'
  })

  // Material activo actual
  const activeMaterial = useMemo(() => {
    return allMaterials.find(material => material.id === activeMaterialId) || null
  }, [activeMaterialId])

  // Cambiar material activo
  const setActiveMaterial = useCallback((material: WheelMaterial | null) => {
    if (material) {
      setActiveMaterialId(material.id)
      // Persistir en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('wheel-material-manager-config', JSON.stringify({
            activeMaterialId: material.id
          }))
        } catch {
          // Silently handle localStorage errors
        }
      }
    }
  }, [])

  // Obtener material por ID
  const getMaterialById = useCallback((id: string) => {
    return allMaterials.find(material => material.id === id) || null
  }, [])

  // Verificar si un material existe
  const hasMaterial = useCallback((id: string) => {
    return allMaterials.some(material => material.id === id)
  }, [])

  // Obtener configuración de un material
  const getMaterialConfig = useCallback((materialId: string) => {
    const material = allMaterials.find(m => m.id === materialId)
    return material?.config || null
  }, [])

  // Actualizar configuración de un material (no implementado en esta versión simplificada)
  const updateMaterialConfig = useCallback((materialId: string, config: any) => {
    // No implementado en esta versión simplificada
  }, [])

  // Verificar si un material está activo
  const isMaterialActive = useCallback((materialId: string) => {
    return activeMaterialId === materialId
  }, [activeMaterialId])

  // Limpiar materiales (no implementado en esta versión simplificada)
  const clearMaterials = useCallback(() => {
    // No implementado en esta versión simplificada
  }, [])

  return {
    materials: allMaterials,
    activeMaterial,
    setActiveMaterial,
    getMaterialById,
    hasMaterial,
    getMaterialCount: () => allMaterials.length,
    clearMaterials,
    getMaterialConfig,
    updateMaterialConfig,
    availableMaterials: allMaterials,
    isMaterialActive
  }
}
