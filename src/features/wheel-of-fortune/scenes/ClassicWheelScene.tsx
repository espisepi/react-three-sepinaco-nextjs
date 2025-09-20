import React, { memo, useRef, useMemo } from 'react'
import { Stars, Sky } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three-stdlib'
import { WheelScene } from '@/features/wheel-of-fortune/components/canvas/WheelScene'
import { WheelSceneProps } from '@/types/scene-manager'

extend({ Water })

/**
 * Componente Ocean para la escena clásica
 */
function Ocean() {
  const ref = useRef<THREE.Mesh>(null)
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    }),
    [waterNormals]
  )

  useFrame((state, delta) => {
    if (ref.current?.material) {
      (ref.current.material as any).uniforms.time.value += delta
    }
  })

  // @ts-ignore - Three.js JSX elements
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position-y={-50} />
}

/**
 * Escena clásica de la ruleta con cielo, océano y estrellas de fondo
 * Extiende la escena original añadiendo elementos atmosféricos
 */
export const ClassicWheelScene = memo((props: WheelSceneProps) => {
  return (
    <>
      {/* Cielo atmosférico */}
      <Sky
        sunPosition={[300, 150, -1000]}
        turbidity={0.1}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Niebla atmosférica */}
      {/* @ts-ignore - Three.js JSX elements */}
      <fog attach="fog" args={['#87CEEB', 50, 200]} />

      {/* Océano */}
      <Ocean />

      {/* Efecto de estrellas de fondo */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade={true}
        speed={1}
      />

      {/* Iluminación adicional para el océano */}
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight
        position={[100, 100, 100]}
        intensity={0.5}
        decay={0}
      />
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight
        position={[-100, -100, -100]}
        intensity={0.3}
        decay={0.5}
      />

      {/* Escena original de la ruleta */}
      <WheelScene {...props} />
    </>
  )
})

ClassicWheelScene.displayName = 'ClassicWheelScene'
