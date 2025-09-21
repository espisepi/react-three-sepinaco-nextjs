import { useState, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'

/**
 * Hook personalizado para manejar la carga y gestión de texturas
 * Separado para mejorar la performance y reutilización
 */
export const useTextureManager = () => {
  const [textures, setTextures] = useState<Map<string, THREE.Texture>>(new Map())

  // Cargar texturas cuando cambien los paneles - optimizado
  const loadTextures = useCallback(async (panels: WheelPanel[]) => {
    const newTextures = new Map<string, THREE.Texture>()
    const textureLoader = new THREE.TextureLoader()

    // Procesar texturas en paralelo para mejor performance
    const texturePromises = panels
      .filter(panel => panel.texture)
      .map(async (panel) => {
        try {
          const texture = await new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(
              panel.texture!,
              resolve,
              undefined,
              reject
            )
          })

          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.generateMipmaps = false // Mejorar performance
          texture.minFilter = THREE.LinearFilter

          // Aplicar propiedades de textura
          const scale = panel.textureScale || 1
          texture.repeat.set(scale, scale)

          const rotation = panel.textureRotation || 0
          texture.rotation = (rotation * Math.PI) / 180

          const offsetX = panel.textureOffsetX || 0
          const offsetY = panel.textureOffsetY || 0
          texture.offset.set(offsetX, offsetY)

          return { id: panel.id, texture }
        } catch (error) {
          // Silently handle texture loading errors
          return null
        }
      })

    const results = await Promise.all(texturePromises)
    results.forEach(result => {
      if (result) {
        newTextures.set(result.id, result.texture)
      }
    })

    setTextures(newTextures)
  }, [])

  // Función para obtener una textura por ID
  const getTexture = useCallback((panelId: string): THREE.Texture | undefined => {
    return textures.get(panelId)
  }, [textures])

  // Función para limpiar texturas
  const clearTextures = useCallback(() => {
    textures.forEach(texture => texture.dispose())
    setTextures(new Map())
  }, [textures])

  // Función para verificar si una textura existe
  const hasTexture = useCallback((panelId: string): boolean => {
    return textures.has(panelId)
  }, [textures])

  // Función para obtener el número de texturas cargadas
  const getTextureCount = useCallback((): number => {
    return textures.size
  }, [textures])

  return {
    textures,
    loadTextures,
    getTexture,
    clearTextures,
    hasTexture,
    getTextureCount
  }
}
