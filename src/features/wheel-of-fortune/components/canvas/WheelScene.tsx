import * as THREE from 'three'
import React, { useRef, useMemo, useEffect, useState, useCallback, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { WheelPanel } from '@/types/wheel'
import { WheelMaterial } from '@/types/material-manager'
import { OptimizedLighting } from '@/components/canvas/RendererOptimizer'

interface WheelSceneProps {
  panels: WheelPanel[]
  isSpinning: boolean
  onSpinComplete: (panel: WheelPanel) => void
  spinDuration: number
  onCurrentPanelChange?: (panel: WheelPanel | null) => void
  onRaycastHit?: (panel: WheelPanel | null) => void
  enableOrbitControls?: boolean
  autorotate?: boolean
  autorotateSpeed?: number
  /** Material activo para los paneles */
  activeMaterial?: WheelMaterial
}

interface WheelProps extends WheelSceneProps {
  pointerRef: React.RefObject<THREE.Mesh | null>
}

// Componente optimizado para mostrar los ejes X, Y, Z visualmente
const AxesHelper = memo(() => {
  const axesGeometry = useMemo(() => new THREE.ConeGeometry(0.1, 0.3, 8), [])
  const cylinderGeometry = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 1), [])

  const redMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "red" }), [])
  const greenMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "green" }), [])
  const blueMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "blue" }), [])

  return (
    // @ts-ignore - Three.js JSX elements
    <group position={[0, 0, 0]}>
      {/* Eje X - Rojo */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} geometry={axesGeometry} material={redMaterial} />
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={cylinderGeometry} material={redMaterial} />
        <Text position={[1.5, 0, 0]} fontSize={0.2} color="red">
          X
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>

      {/* Eje Y - Verde */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 1, 0]} rotation={[0, 0, 0]} geometry={axesGeometry} material={greenMaterial} />
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]} geometry={cylinderGeometry} material={greenMaterial} />
        <Text position={[0, 1.5, 0]} fontSize={0.2} color="green">
          Y
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>

      {/* Eje Z - Azul */}
      {/* @ts-ignore - Three.js JSX elements */}
      <group>
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]} geometry={axesGeometry} material={blueMaterial} />
        {/* @ts-ignore - Three.js JSX elements */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} geometry={cylinderGeometry} material={blueMaterial} />
        <Text position={[0, 0, 1.5]} fontSize={0.2} color="blue">
          Z
        </Text>
        {/* @ts-ignore - Three.js JSX elements */}
      </group>
      {/* @ts-ignore - Three.js JSX elements */}
    </group>
  )
})

AxesHelper.displayName = 'AxesHelper'

const Wheel = memo(({ panels, isSpinning, onSpinComplete, spinDuration, onCurrentPanelChange, onRaycastHit, pointerRef, activeMaterial }: WheelProps) => {
  const wheelRef = useRef<THREE.Group>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [isDecelerating, setIsDecelerating] = useState(false)
  const [textures, setTextures] = useState<Map<string, THREE.Texture>>(new Map())
  const spinStartTime = useRef<number>(0)
  const spinTimer = useRef<NodeJS.Timeout | null>(null)
  const hasStartedSpinning = useRef<boolean>(false)
  const hasLoggedSegments = useRef<boolean>(false)

  // Referencias para raycasting optimizadas
  const { raycaster, camera, scene } = useThree()

  // Memoizar callbacks para evitar recreaciones
  const handleSpinComplete = useCallback((selectedPanel: WheelPanel) => {
    onSpinComplete(selectedPanel)
  }, [onSpinComplete])

  const handleCurrentPanelChange = useCallback((panel: WheelPanel | null) => {
    onCurrentPanelChange?.(panel)
  }, [onCurrentPanelChange])

  const handleRaycastHit = useCallback((panel: WheelPanel | null) => {
    onRaycastHit?.(panel)
  }, [onRaycastHit])

  // Cargar texturas cuando cambien los paneles - optimizado
  useEffect(() => {
    const loadTextures = async () => {
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
            // console.warn(`Error loading texture for panel ${panel.id}:`, error)
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
    }

    loadTextures()
  }, [panels])

  // Aplicar rotación inicial aleatoria SOLO cuando se monta el componente
  useEffect(() => {
    if (wheelRef.current) {
      const randomInitialRotation = Math.random() * Math.PI * 2 // Rotación aleatoria completa (0 a 2π)
      wheelRef.current.rotation.y = randomInitialRotation
      // console.log('🎲 Rotación inicial aleatoria aplicada:', randomInitialRotation.toFixed(3), 'radianes')
      // console.log('🎲 Rotación inicial aleatoria aplicada:', (randomInitialRotation * 180 / Math.PI).toFixed(1), 'grados')
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

  // Crear materiales para cada segmento usando el sistema de materiales
  const materials = useMemo(() => {
    return panels.map(panel => {
      const texture = textures.get(panel.id)

      // Si hay un material activo, usarlo
      if (activeMaterial) {
        const transformParams = {
          textureScale: panel.textureScale,
          textureRotation: panel.textureRotation,
          textureOffsetX: panel.textureOffsetX,
          textureOffsetY: panel.textureOffsetY
        }
        return activeMaterial.createMaterial(panel.color, texture, transformParams)
      }

      // Fallback al sistema original si no hay material activo
      if (texture) {
        // Actualizar propiedades de textura de forma eficiente
        const scale = panel.textureScale || 1
        const rotation = panel.textureRotation || 0
        const offsetX = panel.textureOffsetX || 0
        const offsetY = panel.textureOffsetY || 0

        // Solo actualizar si han cambiado para evitar recálculos innecesarios
        if (texture.repeat.x !== scale || texture.repeat.y !== scale) {
          texture.repeat.set(scale, scale)
        }
        if (texture.rotation !== (rotation * Math.PI) / 180) {
          texture.rotation = (rotation * Math.PI) / 180
        }
        if (texture.offset.x !== offsetX || texture.offset.y !== offsetY) {
          texture.offset.set(offsetX, offsetY)
        }

        // Usar textura si está disponible
        return new THREE.MeshPhysicalMaterial({
          map: texture,
          metalness: 0.1,
          roughness: 0.3,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          transparent: false,
          side: THREE.DoubleSide
        })
      } else {
        // Usar color si no hay textura
        return new THREE.MeshPhysicalMaterial({
          color: panel.color,
          metalness: 0.1,
          roughness: 0.3,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          transparent: false,
          side: THREE.DoubleSide
        })
      }
    })
  }, [panels, textures, activeMaterial])

  // Memoizar geometrías base para evitar recreaciones
  const baseCylinderGeometry = useMemo(() => new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32, 1), [])

  // Crear mesh para cada segmento usando cilindros individuales (mejor orientación) - optimizado
  const wheelSegments = useMemo(() => {
    const segments = panels.length
    const anglePerSegment = (Math.PI * 2) / segments

    return panels.map((panel, index) => {
      const startAngle = index * anglePerSegment
      const endAngle = (index + 1) * anglePerSegment
      const midAngle = startAngle + anglePerSegment / 2

      // Crear geometría de cilindro para cada segmento (orientación correcta)
      const segmentGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32, 1, false, startAngle, anglePerSegment)

      // Calcular posiciones y rotaciones del texto directamente
      const textPosition: [number, number, number] = [
        Math.sin(midAngle) + (panel.textPositionX || 0),
        0.11 + (panel.textPositionY || 0),
        Math.cos(midAngle) + (panel.textPositionZ || 0)
      ]

      const textRotation: [number, number, number] = [
        ((panel.textRotationX ? (panel.textRotationX + 90) : 90) * Math.PI) / 180,
        Math.PI + ((panel.textRotationY ?? 0) * Math.PI) / 180,
        ((panel.textRotationZ ? (panel.textRotationZ + 30) : 30) * Math.PI) / 180
      ]

      const textScale: [number, number, number] = [
        panel.textScaleX || 1,
        panel.textScaleY || 1,
        panel.textScaleZ || 1
      ]

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
            position={textPosition}
            rotation={textRotation}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            scale={textScale}
          >
            {panel.text}
          </Text>
          {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
      )
    })
  }, [panels, materials])

  // Lógica de rotación continua durante toda la duración
  useEffect(() => {
    if (isSpinning && !hasStartedSpinning.current) {
      // console.log('🚀 Iniciando giro continuo con duración:', spinDuration, 'segundos')
      hasStartedSpinning.current = true

      // Velocidad constante basada en la duración
      // Más tiempo = más vueltas, pero velocidad constante
      const baseSpeed = 3.0 // Velocidad base constante
      const durationFactor = Math.min(spinDuration * 0.5, 2.0) // Factor limitado
      const constantSpeed = baseSpeed + durationFactor

      // console.log('💪 Velocidad constante calculada:', constantSpeed.toFixed(2), 'rad/s')
      // console.log('📏 Duración:', spinDuration, 's - Factor:', durationFactor.toFixed(2))
      setRotationSpeed(constantSpeed)
      setIsDecelerating(true) // Mantener el estado para la lógica de rotación
      spinStartTime.current = Date.now()

      // Timer único para parar completamente
      spinTimer.current = setTimeout(() => {
        // console.log('⏰ Parando completamente')
        setIsDecelerating(false)
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

          // console.log('🎯 Panel seleccionado:', selectedPanel)
          // console.log('🔄 Rotación normalizada:', normalizedRotation.toFixed(3))
          // console.log('🔧 Rotación compensada:', compensatedRotation.toFixed(3))
          // console.log('📐 Ángulo por segmento:', anglePerSegment.toFixed(3))
          // console.log('🎲 Índice seleccionado:', selectedIndex)
          // console.log('📊 Cálculo directo:', (compensatedRotation / anglePerSegment).toFixed(3))
          // console.log('🎯 Panel que debería estar arriba:', panels[0])
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
      setRotationSpeed(0)
      if (spinTimer.current) {
        clearTimeout(spinTimer.current)
        spinTimer.current = null
      }
    }
  }, [isSpinning, spinDuration, onSpinComplete, panels]) // Depende de isSpinning, spinDuration, onSpinComplete y panels

  // Cleanup del timer solo cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (spinTimer.current) {
        // console.log('🧹 Limpiando timer al desmontar')
        clearTimeout(spinTimer.current)
        spinTimer.current = null
      }
    }
  }, [])

  // Variables para throttling del raycasting
  const lastRaycastTime = useRef(0)
  const RAYCAST_THROTTLE = 100 // ms

  // Memoizar cálculos de ángulos para evitar recálculos
  const anglePerSegment = useMemo(() => (Math.PI * 2) / panels.length, [panels.length])
  const compensationAngle = useMemo(() => (2 * Math.PI / 3), [])

  useFrame((state, delta) => {
    if (!wheelRef.current) return

    const currentTime = Date.now()

    // Raycasting con throttling para mejor performance
    if (pointerRef.current && onRaycastHit && (currentTime - lastRaycastTime.current) > RAYCAST_THROTTLE) {
      lastRaycastTime.current = currentTime

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
          handleRaycastHit(hitPanel)
        }
      } else {
        handleRaycastHit(null)
      }
    }

    // Actualizar panel actual en tiempo real con throttling
    if (onCurrentPanelChange && (currentTime - lastRaycastTime.current) > RAYCAST_THROTTLE) {
      const normalizedRotation = ((wheelRef.current.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const compensatedRotation = (normalizedRotation + compensationAngle) % (Math.PI * 2)
      const selectedIndex = Math.floor(compensatedRotation / anglePerSegment) % panels.length
      const currentPanel = panels[selectedIndex]

      handleCurrentPanelChange(currentPanel)
    }

    // Lógica de rotación continua - velocidad constante durante toda la duración
    if (isDecelerating) {
      const timeSinceStart = (Date.now() - spinStartTime.current) / 1000
      const totalDuration = spinDuration

      // Calcular progreso del giro completo (0 a 1)
      const totalProgress = Math.min(1, timeSinceStart / totalDuration)

      // Rotación con velocidad constante durante toda la duración
      wheelRef.current.rotation.y -= rotationSpeed * delta
    }
  })

  return (
    // @ts-ignore - Three.js JSX elements
    <group ref={wheelRef} rotation={[Math.PI / 2, 0, 0]}> {/* Rotación de 90° en X para orientar la ruleta frontalmente */}
      {/* Segmentos de la ruleta */}
      {wheelSegments}

      {/* Centro de la ruleta */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh position={[0, 0, 0.1]}>
        {/* @ts-ignore - Three.js JSX elements */}
        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshPhysicalMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        {/* @ts-ignore - Three.js JSX elements */}
      </mesh>
      {/* @ts-ignore - Three.js JSX elements */}
    </group>
  )
})

Wheel.displayName = 'Wheel'

export const WheelScene = memo(({ panels, isSpinning, onSpinComplete, spinDuration, onCurrentPanelChange, onRaycastHit, enableOrbitControls = false, autorotate = false, autorotateSpeed = 0.5, activeMaterial }: WheelSceneProps) => {
  const pointerRef = useRef<THREE.Mesh | null>(null)
  const { camera } = useThree()

  // Memoizar callbacks para evitar recreaciones
  const handleSpinComplete = useCallback((panel: WheelPanel) => {
    onSpinComplete(panel)
  }, [onSpinComplete])

  const handleCurrentPanelChange = useCallback((panel: WheelPanel | null) => {
    onCurrentPanelChange?.(panel)
  }, [onCurrentPanelChange])

  const handleRaycastHit = useCallback((panel: WheelPanel | null) => {
    onRaycastHit?.(panel)
  }, [onRaycastHit])

  // Configurar posición inicial de la cámara más alejada
  useEffect(() => {
    camera.position.set(0, 0, 8) // Posición inicial más alejada en el eje Z
    camera.lookAt(0, 0, 0) // Mirar hacia el centro de la ruleta
  }, [camera])

  // Memoizar geometrías y materiales para mejor performance
  const coneGeometry = useMemo(() => new THREE.ConeGeometry(0.1, 0.3), [])
  const pointerMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#FF0000",
    metalness: 0.8,
    roughness: 0.2
  }), [])

  return (
    <>
      {/* Iluminación optimizada para materiales físicos */}
      <OptimizedLighting />

      {/* Ruleta */}
      <Wheel
        panels={panels}
        isSpinning={isSpinning}
        onSpinComplete={handleSpinComplete}
        spinDuration={spinDuration}
        onCurrentPanelChange={handleCurrentPanelChange}
        onRaycastHit={handleRaycastHit}
        pointerRef={pointerRef}
        activeMaterial={activeMaterial}
      />

      {/* Puntero fijo - Fuera del grupo de la ruleta para que no gire */}
      {/* @ts-ignore - Three.js JSX elements */}
      <mesh ref={pointerRef} position={[0, 2.2, 0]} rotation={[Math.PI, 0, 0]} geometry={coneGeometry} material={pointerMaterial} castShadow />


      {/* Controles de cámara */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={12}
          target={[0, 0, 0]}
          autoRotate={autorotate}
          autoRotateSpeed={autorotateSpeed}
        />
      )}

      {/* Helper de orientación 3D personalizado */}
      {/* <AxesHelper /> */}
    </>
  )
})

WheelScene.displayName = 'WheelScene'
