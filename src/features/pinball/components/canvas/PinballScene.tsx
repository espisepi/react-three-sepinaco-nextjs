import * as THREE from 'three'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, Sky, useGLTF, PerspectiveCamera, RoundedBox, Environment, useTexture, useAspect, Stats } from '@react-three/drei'
import { Physics, useSphere, useBox, usePlane, Api, PublicApi } from "@react-three/cannon"


function BallAndCollisions({ args = [1.2, 32, 32], v = new THREE.Vector3() }) {
  // const cam = useRef()

  const [ref, api] = useSphere(() => ({ args: [1.2], mass: 1, material: { restitution: 0.95 } }))
  usePlane(() => ({ position: [0, -15, 0], rotation: [-Math.PI / 2, 0, 0], onCollide: () => (api.position.set(0, 0, 0), api.velocity.set(0, 0, 0)) }))
  usePlane(() => ({ position: [-15, 0, 0], rotation: [-Math.PI / 2, Math.PI / 2, 0] }))
  usePlane(() => ({ position: [15, 0, 0], rotation: [Math.PI / 2, -Math.PI / 2, 0] }))
  // useEffect(
  //   () => api.position.subscribe((p) => (cam.current.position.lerp(v.set(p[0], p[1], 18 + Math.max(0, p[1]) / 2), 0.05), cam.current.lookAt(0, 0, 0))),
  //   [],
  // )
  return (
    <>
      {/* <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 12]} fov={50} /> */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh ref={ref}>
        {/* @ts-ignore - Three.js JSX elements */}
        <sphereGeometry args={args} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial transmission={1} roughness={0} thickness={10} envMapIntensity={1} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>
    </>
  )
}

interface BlockProps {
  shake?: number
  args?: [number, number, number]
  vec?: THREE.Vector3
  material?: { restitution?: number }
  [key: string]: any
}

const Block = forwardRef<PublicApi, BlockProps>(({ shake = 0, args = [1, 1.5, 4], vec = new THREE.Vector3(), ...props }, ref) => {
  const [block, api] = useBox(() => ({ args, ...props, onCollide: (e) => (shake += e.contact.impactVelocity / 12.5) }))
  useFrame(() => {
    if (block.current) {
      block.current.position.lerp(vec.set(0, (shake = THREE.MathUtils.lerp(shake, 0, 0.1)), 0), 0.2)
    }
  })
  useImperativeHandle(ref, () => api, [api])
  return (
    <>
      <RoundedBox ref={block as any} args={args} radius={0.4} smoothness={10}>
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial transmission={1} roughness={0} thickness={3} envMapIntensity={4} />
      </RoundedBox>
    </>
  )
})

Block.displayName = 'Block'

interface PaddleProps {
  args?: [number, number, number]
}

function Paddle({ args = [5, 1.5, 4] }: PaddleProps) {
  const api = useRef<PublicApi>(null)
  useFrame((state) => {
    if (api.current) {
      api.current.position.set(state.mouse.x * 10, -5, 0)
      api.current.rotation.set(0, 0, (state.mouse.x * Math.PI) / 4)
    }
  })
  return <Block ref={api} args={args} material={{ restitution: 1.3 }} />
}


export function PinballScene() {
  return (
    <>
      {/* <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} /> */}
      <OrbitControls target={new THREE.Vector3(0, 0.1, 0)} />
      <Box />
      <Stats />
      <Physics iterations={5} gravity={[0, -30, 0]}>
        <BallAndCollisions />
        <Paddle />
        {/* <Block /> */}
      </Physics>
    </>
  )
}
