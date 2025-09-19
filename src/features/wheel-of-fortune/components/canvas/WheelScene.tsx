import * as THREE from 'three'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { WheelPanel } from '@/types/wheel'

interface WheelSceneProps {
  panels: WheelPanel[]
  isSpinning: boolean
  onSpinComplete: (panel: WheelPanel) => void
}

function Wheel({ panels, isSpinning, onSpinComplete }: WheelSceneProps) {
  const wheelRef = useRef<THREE.Group>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [isDecelerating, setIsDecelerating] = useState(false)

  // Crear geometría de la ruleta
  const wheelGeometry = useMemo(() => {
    const segments = panels.length
    const anglePerSegment = (Math.PI * 2) / segments

    const shape = new THREE.Shape()
    shape.moveTo(0, 0)

    for (let i = 0; i < segments; i++) {
      const startAngle = i * anglePerSegment
      const endAngle = (i + 1) * anglePerSegment

      shape.lineTo(Math.cos(startAngle) * 2, Math.sin(startAngle) * 2)
      shape.arc(0, 0, 2, startAngle, endAngle, false)
      shape.lineTo(0, 0)
    }

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3
    })
  }, [panels])

  // Crear materiales para cada segmento
  const materials = useMemo(() => {
    return panels.map(panel =>
      new THREE.MeshPhysicalMaterial({
        color: panel.color,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      })
    )
  }, [panels])

  // Crear mesh para cada segmento usando cilindros individuales (mejor orientación)
  const wheelSegments = useMemo(() => {
    const segments = panels.length
    const anglePerSegment = (Math.PI * 2) / segments

    return panels.map((panel, index) => {
      const startAngle = index * anglePerSegment
      const endAngle = (index + 1) * anglePerSegment
      const midAngle = startAngle + anglePerSegment / 2

      // Crear geometría de cilindro para cada segmento (orientación correcta)
      const segmentGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32, 1, false, startAngle, anglePerSegment)

      return (
        // @ts-ignore - Three.js JSX elements
        <mesh key={panel.id} geometry={segmentGeometry} material={materials[index]} rotation={[0, 0, 0]}>
          {/* Texto en cada segmento */}
          <Text
            position={[Math.cos(midAngle) * 1.2, Math.sin(midAngle) * 1.2, 0.11]}
            rotation={[0, 0, midAngle]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {panel.text}
          </Text>
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
      )
    })
  }, [panels, materials])

  // Lógica de rotación optimizada para mayor velocidad y emoción
  useEffect(() => {
    if (isSpinning && !isDecelerating) {
      setRotationSpeed(2.5) // Velocidad inicial más rápida (era 0.3)
      setIsDecelerating(true)

      // Calcular rotación objetivo aleatoria
      const randomAngle = Math.random() * Math.PI * 2
      const currentRotation = wheelRef.current?.rotation.z || 0
      const fullRotations = 8 + Math.random() * 7 // 8-15 vueltas completas para más emoción (era 5-10)
      setTargetRotation(currentRotation + fullRotations * Math.PI * 2 + randomAngle)
    }
  }, [isSpinning, isDecelerating])

  useFrame((state, delta) => {
    if (wheelRef.current && isDecelerating) {
      const currentRotation = wheelRef.current.rotation.z
      const rotationDiff = targetRotation - currentRotation

      if (Math.abs(rotationDiff) > 0.01) {
        // Desaceleración más gradual para mantener velocidad más tiempo (era 0.95)
        const deceleration = 0.98
        setRotationSpeed(prev => prev * deceleration)

        wheelRef.current.rotation.z += rotationSpeed * delta

        // Asegurar que la velocidad mínima sea suficiente para llegar al objetivo (era 0.01)
        if (rotationSpeed < 0.05 && Math.abs(rotationDiff) > 0.1) {
          setRotationSpeed(0.05)
        }
      } else {
        // Detener la ruleta
        wheelRef.current.rotation.z = targetRotation
        setIsDecelerating(false)
        setRotationSpeed(0)

        // Determinar qué panel está seleccionado
        const normalizedRotation = ((wheelRef.current.rotation.z % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const anglePerSegment = (Math.PI * 2) / panels.length
        const selectedIndex = Math.floor((Math.PI * 2 - normalizedRotation) / anglePerSegment) % panels.length
        const selectedPanel = panels[selectedIndex]

        if (selectedPanel) {
          onSpinComplete(selectedPanel)
        }
      }
    }
  })

  return (
    // @ts-ignore - Three.js JSX elements
    <group ref={wheelRef} rotation={[Math.PI / 2, 0, 0]}> {/* Rotación de 90° en X para orientar la ruleta frontalmente */}
      {/* Base de la ruleta */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh position={[0, 0, -0.1]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <cylinderGeometry args={[2.05, 2.05, 0.05]} /> {/* Tamaño ajustado para coincidir con paneles - era 2.1 */}
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.2} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>

      {/* Segmentos de la ruleta */}
      {wheelSegments}

      {/* Centro de la ruleta */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh position={[0, 0, 0.1]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial color="#gold" metalness={0.9} roughness={0.1} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>

      {/* Puntero - Posición ajustada para la nueva orientación */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh position={[0, 0, 2.2]} rotation={[0, 0, 0]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <coneGeometry args={[0.1, 0.3]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial color="#red" metalness={0.8} roughness={0.2} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>
      {/* @ts-ignore - Three.js JSX elements */}
    </group>
  )
}

export function WheelScene({ panels, isSpinning, onSpinComplete }: WheelSceneProps) {
  return (
    <>
      {/* Iluminación */}
      {/* @ts-ignore - Three.js JSX elements */}
      <ambientLight intensity={0.4} />
      {/* @ts-ignore - Three.js JSX elements */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* @ts-ignore - Three.js JSX elements */}
      <pointLight position={[-10, -10, -10]} color="#4ECDC4" intensity={0.5} />

      {/* Ruleta */}
      <Wheel
        panels={panels}
        isSpinning={isSpinning}
        onSpinComplete={onSpinComplete}
      />

      {/* Controles de cámara */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        target={[0, 0, 0]}
      />
    </>
  )
}
