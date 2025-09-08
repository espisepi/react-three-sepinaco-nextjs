import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'
import { forwardRef, useImperativeHandle, useRef, ReactNode } from 'react'

const ShaderImpl = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.05, 0.0, 0.025),
  },
  vertex,
  fragment,
)

extend({ ShaderImpl })

interface ShaderProps {
  children?: ReactNode
  [key: string]: any
}

// eslint-disable-next-line react/display-name
const Shader = forwardRef<THREE.Material, ShaderProps>(({ children, ...props }, ref) => {
  const localRef = useRef<THREE.Material>(null)

  useImperativeHandle(ref, () => localRef.current!)

  useFrame((_, delta) => {
    if (localRef.current) {
      (localRef.current as any).time += delta
    }
  })
  // @ts-ignore - Three.js JSX elements
  return <shaderImpl ref={localRef} glsl={THREE.GLSL3} {...props} attach='material' />
})

export default Shader
