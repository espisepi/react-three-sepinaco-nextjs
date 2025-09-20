'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import { CanvasProps } from '@react-three/fiber'
import { RendererOptimizer } from './RendererOptimizer'

interface SceneProps extends CanvasProps { }

export default function Scene({ ...props }: SceneProps) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}
      onCreated={(state) => {
        // Configuración básica del renderer
        state.gl.toneMapping = THREE.ACESFilmicToneMapping
        state.gl.toneMappingExposure = 1.2
        state.gl.outputColorSpace = THREE.SRGBColorSpace
        state.gl.shadowMap.enabled = true
        state.gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
      shadows
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <RendererOptimizer />
      {/* @ts-ignore */}
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
}
