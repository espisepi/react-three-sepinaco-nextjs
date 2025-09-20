'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Componente para optimizar la configuración del renderer Three.js
 * Mejora significativamente la calidad visual de los materiales físicos
 */
export const RendererOptimizer = () => {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    // Configuración del renderer para mejor calidad
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limitar pixel ratio para performance
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.shadowMap.autoUpdate = true

    // Configuración de sombras más suaves
    // gl.shadowMap.bias = -0.0001  // No disponible en WebGLShadowMap
    // gl.shadowMap.normalBias = 0.02  // No disponible en WebGLShadowMap

    // Configuración de renderizado
    // gl.physicallyCorrectLights = true  // No disponible en WebGLRenderer
    // gl.useLegacyLights = false  // No disponible en WebGLRenderer

    // Configuración de la cámara para mejor perspectiva
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = 0.1
      camera.far = 1000
      camera.updateProjectionMatrix()
    }

    // Configuración del fondo de la escena
    scene.background = new THREE.Color('#1a1a2e')
    scene.fog = new THREE.Fog('#1a1a2e', 50, 200)

  }, [gl, scene, camera])

  return null
}

/**
 * Componente para iluminación optimizada para materiales físicos
 */
export const OptimizedLighting = () => {
  return (
    <>
      {/* Luz ambiental suave */}
      {/* @ts-ignore - Three.js JSX elements */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Luz direccional principal (sol) */}
      {/* @ts-ignore - Three.js JSX elements */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Luz de relleno suave */}
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight
        position={[-5, 5, 5]}
        intensity={0.8}
        color="#4ECDC4"
        distance={20}
        decay={2}
      />

      {/* Luz de acento */}
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight
        position={[5, -5, -5]}
        intensity={0.6}
        color="#FF6B6B"
        distance={15}
        decay={2}
      />

      {/* Luz hemisférica para iluminación ambiental */}
      {/* @ts-ignore - Three.js JSX elements */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#8B4513"
        intensity={0.4}
      />
    </>
  )
}
