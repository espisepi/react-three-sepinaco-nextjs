import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { Water } from 'three-stdlib'

extend({ Water })

export function Ocean() {
  const ref = useRef<THREE.Mesh>(null)
  const gl = useThree((state) => state.gl)
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
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />
}

export function Box() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y = 10 + Math.sin(state.clock.elapsedTime) * 20
      ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += delta
    }
  })
  return (
    // @ts-ignore - Three.js JSX elements
    <mesh ref={ref} scale={20}>
      {/* @ts-ignore - Three.js JSX elements */}
      <boxGeometry />
      {/* @ts-ignore - Three.js JSX elements */}
      <meshStandardMaterial />
      {/* @ts-ignore - Three.js JSX elements */}
    </mesh>
  )
}

export function OceanScene() {
  return (
    <>
      {/* @ts-ignore - Three.js JSX elements */}
      <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight decay={0} position={[100, 100, 100]} />
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight decay={0.5} position={[-100, -100, -100]} />
      <Ocean />
      <Box />
      <OrbitControls />
    </>
  )
}

export default function OceanApp() {
  return (
    <Canvas camera={{ position: [0, 5, 100], fov: 55, near: 1, far: 20000 }}>
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight decay={0} position={[100, 100, 100]} />
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight decay={0.5} position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
        <Box />
      </Suspense>
      {/* @ts-ignore - Three.js JSX elements */}
      <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </Canvas>
  )
}
