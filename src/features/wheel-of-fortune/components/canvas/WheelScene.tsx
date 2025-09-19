import * as THREE from 'three'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { WheelPanel } from '@/types/wheel'

interface WheelSceneProps {
  panels: WheelPanel[]
  isSpinning: boolean
  onSpinComplete: (panel: WheelPanel) => void
  spinDuration: number
  onCurrentPanelChange?: (panel: WheelPanel | null) => void
  onRaycastHit?: (panel: WheelPanel | null) => void
  enableOrbitControls?: boolean
}

interface WheelProps extends WheelSceneProps {
  pointerRef: React.RefObject<THREE.Mesh | null>
}

// Componente para mostrar los ejes X, Y, Z visualmente
function AxesHelper() {
  return (
    // @ts-ignore - Three.js JSX elements
    <group position={[0, 0, 0]}>
      {/* Eje X - Rojo */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <coneGeometry args={[0.1, 0.3, 8]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="red" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="red" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        <Text position={[1.5, 0, 0]} fontSize={0.2} color="red">
          X
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>

      {/* Eje Y - Verde */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <coneGeometry args={[0.1, 0.3, 8]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="green" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="green" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        <Text position={[0, 1.5, 0]} fontSize={0.2} color="green">
          Y
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>

      {/* Eje Z - Azul */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <coneGeometry args={[0.1, 0.3, 8]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="blue" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          {/* @ts-ignore - Three.js JSX elements */}
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          {/* @ts-ignore - Three.js JSX elements */}
          <meshBasicMaterial color="blue" />
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
        <Text position={[0, 0, 1.5]} fontSize={0.2} color="blue">
          Z
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>
      {/* @ts-ignore - Three.js JSX elements */}
    </group>
  )
}

function Wheel({ panels, isSpinning, onSpinComplete, spinDuration, onCurrentPanelChange, onRaycastHit, pointerRef }: WheelProps) {
  const wheelRef = useRef<THREE.Group>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [isDecelerating, setIsDecelerating] = useState(false)
  const [isSlowingDown, setIsSlowingDown] = useState(false)
  const spinStartTime = useRef<number>(0)
  const spinTimer = useRef<NodeJS.Timeout | null>(null)
  const slowDownTimer = useRef<NodeJS.Timeout | null>(null)
  const hasStartedSpinning = useRef<boolean>(false)
  const hasLoggedSegments = useRef<boolean>(false)

  // Referencias para raycasting
  const { raycaster, camera, scene } = useThree()

  // Aplicar rotación inicial aleatoria SOLO cuando se monta el componente
  useEffect(() => {
    if (wheelRef.current) {
      const randomInitialRotation = Math.random() * Math.PI * 2 // Rotación aleatoria completa (0 a 2π)
      wheelRef.current.rotation.y = randomInitialRotation
      console.log('🎲 Rotación inicial aleatoria aplicada:', randomInitialRotation.toFixed(3), 'radianes')
      console.log('🎲 Rotación inicial aleatoria aplicada:', (randomInitialRotation * 180 / Math.PI).toFixed(1), 'grados')
    }
  }, []) // Solo se ejecuta una vez al montar el componente

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

    // Debug inicial solo una vez
    if (!hasLoggedSegments.current) {
      console.log('🏗️ CREANDO SEGMENTOS:')
      console.log('  📊 Total de paneles:', segments)
      console.log('  📐 Ángulo por segmento:', anglePerSegment.toFixed(3), 'radianes')
      console.log('  📐 Ángulo por segmento:', (anglePerSegment * 180 / Math.PI).toFixed(1), 'grados')

      panels.forEach((panel, index) => {
        const startAngle = index * anglePerSegment
        const endAngle = (index + 1) * anglePerSegment
        const midAngle = startAngle + anglePerSegment / 2
        console.log(`  🎯 Panel ${index + 1} (${panel.text}):`)
        console.log(`    📐 Ángulo inicio: ${startAngle.toFixed(3)} rad (${(startAngle * 180 / Math.PI).toFixed(1)}°)`)
        console.log(`    📐 Ángulo final: ${endAngle.toFixed(3)} rad (${(endAngle * 180 / Math.PI).toFixed(1)}°)`)
        console.log(`    📐 Ángulo medio: ${midAngle.toFixed(3)} rad (${(midAngle * 180 / Math.PI).toFixed(1)}°)`)
      })

      hasLoggedSegments.current = true
    }

    return panels.map((panel, index) => {
      const startAngle = index * anglePerSegment
      const endAngle = (index + 1) * anglePerSegment
      const midAngle = startAngle + anglePerSegment / 2

      // Crear geometría de cilindro para cada segmento (orientación correcta)
      const segmentGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32, 1, false, startAngle, anglePerSegment)

      return (
        // @ts-ignore - Three.js JSX elements
        <mesh
          key={panel.id}
          geometry={segmentGeometry}
          material={materials[index]}
          rotation={[0, 0, 0]}
          userData={{ panelIndex: index }}
        >
          {/* Texto en cada segmento */}
          <Text
            position={[Math.cos(midAngle) * 1.2, 0.11, Math.sin(midAngle) * 1.2]}
            rotation={[0, 0, midAngle + Math.PI / 2]}
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

  // Lógica de rotación con física realista
  useEffect(() => {
    if (isSpinning && !isDecelerating && !hasStartedSpinning.current) {
      console.log('🚀 Iniciando giro con duración:', spinDuration, 'segundos')
      hasStartedSpinning.current = true

      // Calcular velocidad inicial basada en la duración (más tiempo = más fuerza = más velocidad)
      // Fórmula más realista: velocidad moderada y proporcional
      const baseSpeed = 2.0 // Velocidad base moderada
      const durationFactor = Math.pow(spinDuration, 0.8) * 0.4 // Curva más suave
      const randomVariation = (Math.random() - 0.5) * 0.2 // Variación aleatoria pequeña
      const initialSpeed = baseSpeed + durationFactor + randomVariation

      // Limitar velocidad máxima para evitar giros demasiado rápidos
      const maxSpeed = Math.min(5, 2.5 + spinDuration * 0.3)
      const finalSpeed = Math.min(initialSpeed, maxSpeed)

      console.log('💪 Velocidad inicial calculada:', finalSpeed.toFixed(2), 'rad/s')
      console.log('📏 Duración:', spinDuration, 's - Factor:', durationFactor.toFixed(2))
      setRotationSpeed(finalSpeed)
      setIsDecelerating(true)
      setIsSlowingDown(false)
      spinStartTime.current = Date.now()

      // Timer único para parar completamente
      spinTimer.current = setTimeout(() => {
        console.log('⏰ Parando completamente')
        setIsDecelerating(false)
        setIsSlowingDown(false)
        setRotationSpeed(0)
        hasStartedSpinning.current = false

        // Determinar qué panel está seleccionado
        if (wheelRef.current) {
          const normalizedRotation = ((wheelRef.current.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          const anglePerSegment = (Math.PI * 2) / panels.length
          // Compensación: el puntero está desfasado aproximadamente 240° (4/6 de vuelta)
          // Añadimos 2π/3 (120°) para compensar el desfase visual
          const compensatedRotation = (normalizedRotation + (2 * Math.PI / 3)) % (Math.PI * 2)
          const selectedIndex = Math.floor(compensatedRotation / anglePerSegment) % panels.length
          const selectedPanel = panels[selectedIndex]

          console.log('🎯 Panel seleccionado:', selectedPanel)
          console.log('🔄 Rotación normalizada:', normalizedRotation.toFixed(3))
          console.log('🔧 Rotación compensada:', compensatedRotation.toFixed(3))
          console.log('📐 Ángulo por segmento:', anglePerSegment.toFixed(3))
          console.log('🎲 Índice seleccionado:', selectedIndex)
          console.log('📊 Cálculo directo:', (compensatedRotation / anglePerSegment).toFixed(3))
          console.log('🎯 Panel que debería estar arriba:', panels[0])
          if (selectedPanel) {
            onSpinComplete(selectedPanel)
          }
        }
      }, spinDuration * 1000)
    }

    // Reset cuando no está girando
    if (!isSpinning) {
      hasStartedSpinning.current = false
      setIsDecelerating(false)
      setIsSlowingDown(false)
      setRotationSpeed(0)
      if (spinTimer.current) {
        clearTimeout(spinTimer.current)
        spinTimer.current = null
      }
      if (slowDownTimer.current) {
        clearTimeout(slowDownTimer.current)
        slowDownTimer.current = null
      }
    }
  }, [isSpinning]) // Solo depende de isSpinning

  // Cleanup del timer solo cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (spinTimer.current) {
        console.log('🧹 Limpiando timer al desmontar')
        clearTimeout(spinTimer.current)
        spinTimer.current = null
      }
      if (slowDownTimer.current) {
        console.log('🧹 Limpiando slowDown timer al desmontar')
        clearTimeout(slowDownTimer.current)
        slowDownTimer.current = null
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (wheelRef.current) {
      // Raycasting para detectar el panel con el que choca el cono
      if (pointerRef.current && onRaycastHit) {
        // Crear un rayo desde la posición del cono hacia el centro de la ruleta
        const pointerPosition = pointerRef.current.position.clone()
        const centerPosition = new THREE.Vector3(0, 0, 0)
        const direction = centerPosition.clone().sub(pointerPosition).normalize()

        raycaster.set(pointerPosition, direction)

        // Obtener todos los meshes de los paneles
        const panelMeshes = wheelRef.current.children.filter(child =>
          child instanceof THREE.Mesh && child.userData.panelIndex !== undefined
        ) as THREE.Mesh[]

        const intersects = raycaster.intersectObjects(panelMeshes)

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh
          const panelIndex = hitMesh.userData.panelIndex
          const hitPanel = panels[panelIndex]

          if (hitPanel) {
            onRaycastHit(hitPanel)
          }
        } else {
          onRaycastHit(null)
        }
      }

      // Actualizar panel actual en tiempo real (siempre, no solo cuando está girando)
      if (onCurrentPanelChange) {
        const normalizedRotation = ((wheelRef.current.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const anglePerSegment = (Math.PI * 2) / panels.length
        // Compensación: el puntero está desfasado aproximadamente 240° (4/6 de vuelta)
        // Añadimos 2π/3 (120°) para compensar el desfase visual
        const compensatedRotation = (normalizedRotation + (2 * Math.PI / 3)) % (Math.PI * 2)
        const selectedIndex = Math.floor(compensatedRotation / anglePerSegment) % panels.length
        const currentPanel = panels[selectedIndex]

        // Debug detallado solo cuando está girando y cada 2 segundos
        if (isDecelerating && Math.floor(state.clock.elapsedTime * 0.5) % 1 === 0) {
          console.log('🔍 DEBUG DETALLADO (GIRANDO):')
          console.log('  📐 Rotación Y:', wheelRef.current.rotation.y.toFixed(3))
          console.log('  🔄 Rotación normalizada:', normalizedRotation.toFixed(3))
          console.log('  🔧 Rotación compensada:', compensatedRotation.toFixed(3))
          console.log('  📏 Ángulo por segmento:', anglePerSegment.toFixed(3))
          console.log('  🎯 Índice calculado:', selectedIndex)
          console.log('  🎪 Panel detectado:', currentPanel?.text)
          console.log('  📊 Cálculo directo:', (compensatedRotation / anglePerSegment).toFixed(3))
          console.log('  🎲 Posición del puntero: [0, 2.2, 0]')
        }

        onCurrentPanelChange(currentPanel)
      }

      // Lógica de rotación solo cuando está girando
      if (isDecelerating) {
        const timeSinceStart = (Date.now() - spinStartTime.current) / 1000
        const totalDuration = spinDuration

        // Calcular progreso del giro completo (0 a 1)
        const totalProgress = Math.min(1, timeSinceStart / totalDuration)

        // Física más realista: velocidad constante hasta el 80%, luego desaceleración gradual
        let decelerationFactor = 1

        if (totalProgress > 0.8) {
          // Solo en los últimos 20% del tiempo aplicar desaceleración
          const slowDownProgress = (totalProgress - 0.8) / 0.2
          const easeOutProgress = 1 - Math.pow(1 - slowDownProgress, 3) // Curva cúbica suave
          decelerationFactor = 1 - (easeOutProgress * 0.85) // Reduce hasta 85%
        }
        // En los primeros 80% del tiempo, mantener velocidad constante (decelerationFactor = 1)

        setRotationSpeed(prev => {
          const newSpeed = prev * decelerationFactor
          // Velocidad mínima más alta para evitar paro muy rápido
          const minSpeed = Math.max(0.05, prev * 0.02)
          return Math.max(newSpeed, minSpeed)
        })

        // Debug menos frecuente para evitar spam
        if (Math.floor(timeSinceStart * 5) % 5 === 0) { // Cada 0.2 segundos
          console.log(`🔄 Progreso: ${(totalProgress * 100).toFixed(1)}% - Velocidad: ${rotationSpeed.toFixed(3)} - Factor: ${decelerationFactor.toFixed(3)}`)
        }

        // Rotación con la velocidad actual (cambiar dirección para que coincida con la detección)
        wheelRef.current.rotation.y -= rotationSpeed * delta
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
      {/* @ts-ignore - Three.js JSX elements */}
    </group>
  )
}

export function WheelScene({ panels, isSpinning, onSpinComplete, spinDuration, onCurrentPanelChange, onRaycastHit, enableOrbitControls = false }: WheelSceneProps) {
  const pointerRef = useRef<THREE.Mesh | null>(null)
  const { camera } = useThree()

  // Configurar posición inicial de la cámara más alejada
  useEffect(() => {
    camera.position.set(0, 0, 8) // Posición inicial más alejada en el eje Z
    camera.lookAt(0, 0, 0) // Mirar hacia el centro de la ruleta
  }, [camera])

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
        spinDuration={spinDuration}
        onCurrentPanelChange={onCurrentPanelChange}
        onRaycastHit={onRaycastHit}
        pointerRef={pointerRef}
      />

      {/* Puntero fijo - Fuera del grupo de la ruleta para que no gire */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh ref={pointerRef} position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <coneGeometry args={[0.1, 0.3]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial color="#red" metalness={0.8} roughness={0.2} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>

      {/* Círculo wireframe alrededor del cono para debug - DESACTIVADO */}
      {/* @ts-ignore - Three.js JSX elements */}
      {/* <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        @ts-ignore - Three.js JSX elements */}
      {/* <ringGeometry args={[0.15, 0.2, 32]} />
        @ts-ignore - Three.js JSX elements */}
      {/* <meshBasicMaterial color="#00ff00" wireframe={true} />
        @ts-ignore - Three.js JSX elements */}
      {/* </mesh> */}

      {/* Línea de raycasting para debug */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <cylinderGeometry args={[0.005, 0.005, 2.2]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshBasicMaterial color="#ffff00" />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>

      {/* Controles de cámara */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={12}
          target={[0, 0, 0]}
        />
      )}

      {/* Helper de orientación 3D personalizado */}
      {/* <AxesHelper /> */}
    </>
  )
}
