import * as THREE from 'three'
import { WheelMaterial, TextureTransformParams } from '@/types/material-manager'
import vertexShader from '../shaders/transparent-moving.vert'
import fragmentShader from '../shaders/transparent-moving.frag'

/**
 * Material personalizado transparente con efectos de movimiento
 * Utiliza shaders personalizados para crear efectos visuales avanzados
 * Soporta transformaciones de textura (escala, rotación, posición)
 */
export const createTransparentMovingMaterial = (): WheelMaterial => {
    return {
        id: 'transparent-moving',
        name: 'Transparente Animado',
        description: 'Material transparente con efectos de movimiento, ondas y distorsión',
        icon: '🌊',
        config: {
            transparent: true,
            opacity: 0.8,
            speed: 1.0,
            waveIntensity: 0.5,
            transparency: 0.7,
            side: THREE.DoubleSide
        },
        createMaterial: (panelColor?: string, texture?: THREE.Texture, transformParams?: TextureTransformParams) => {
            // Parámetros de transformación por defecto
            const scale = transformParams?.textureScale || 1
            const rotation = transformParams?.textureRotation || 0
            const offsetX = transformParams?.textureOffsetX || 0
            const offsetY = transformParams?.textureOffsetY || 0

            // Crear el material shader personalizado
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(panelColor || '#ffffff') },
                    map: { value: texture || null },
                    opacity: { value: 0.8 },
                    speed: { value: 1.0 },
                    waveIntensity: { value: 0.5 },
                    transparency: { value: 0.7 },
                    // Parámetros de transformación de textura
                    textureScale: { value: scale },
                    textureRotation: { value: (rotation * Math.PI) / 180 }, // Convertir a radianes
                    textureOffsetX: { value: offsetX },
                    textureOffsetY: { value: offsetY }
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false, // Importante para materiales transparentes
                blending: THREE.NormalBlending
            })

                // Función para actualizar el tiempo (se llamará desde el componente)
                ; (material as any).updateTime = (deltaTime: number) => {
                    material.uniforms.time.value += deltaTime
                }

                // Función para actualizar parámetros de transformación
                ; (material as any).updateTextureTransform = (params: TextureTransformParams) => {
                    if (params.textureScale !== undefined) {
                        material.uniforms.textureScale.value = params.textureScale
                    }
                    if (params.textureRotation !== undefined) {
                        material.uniforms.textureRotation.value = (params.textureRotation * Math.PI) / 180
                    }
                    if (params.textureOffsetX !== undefined) {
                        material.uniforms.textureOffsetX.value = params.textureOffsetX
                    }
                    if (params.textureOffsetY !== undefined) {
                        material.uniforms.textureOffsetY.value = params.textureOffsetY
                    }
                }

            return material
        }
    }
}

/**
 * Hook para actualizar el material shader con el tiempo y transformaciones
 */
export const useTransparentMovingMaterial = (material: THREE.Material) => {
    const updateTime = (deltaTime: number) => {
        if (material && (material as any).updateTime) {
            ; (material as any).updateTime(deltaTime)
        }
    }

    const updateTextureTransform = (params: TextureTransformParams) => {
        if (material && (material as any).updateTextureTransform) {
            ; (material as any).updateTextureTransform(params)
        }
    }

    return { updateTime, updateTextureTransform }
}
