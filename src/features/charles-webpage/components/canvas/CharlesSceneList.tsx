import * as THREE from 'three'
import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, useGLTF, Html } from '@react-three/drei'

// React Three Fiber ya incluye estos elementos por defecto

// Interfaz para definir los datos de cada esfera
interface SphereData {
  id: string
  name: string
  image: string
  texture: string
  normalMap: string
  displacementMap: string
  envMap: string
  modelPath: string
  position: [number, number, number]
}

// Datos de ejemplo para las esferas
const defaultSpheresData: SphereData[] = [
  {
    id: 'sphere1',
    name: 'Esfera 1',
    image: 'img/1.png',
    texture: 'img/1.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene.glb',
    position: [0, 0, 0]
  },
  {
    id: 'sphere2',
    name: 'Esfera 2',
    image: 'img/2.png',
    texture: 'img/2.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene2.glb',
    position: [3, 0, 0]
  },
  {
    id: 'sphere3',
    name: 'Esfera 3',
    image: 'img/2.png',
    texture: 'img/2.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene3.glb',
    position: [-3, 0, 0]
  }
]

// Componente para una esfera individual
function Sphere({ sphereData, onClick }: { sphereData: SphereData, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, texture_disp, texture_norm] = useLoader(THREE.TextureLoader, [
    sphereData.texture,
    sphereData.displacementMap,
    sphereData.normalMap
  ])
  const [text_env] = useLoader(THREE.TextureLoader, [sphereData.envMap])

  // Configurar las texturas
  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
    }
    if (texture_norm) {
      texture_norm.wrapS = texture_norm.wrapT = THREE.RepeatWrapping
      texture_norm.flipY = false
    }
    if (text_env) {
      text_env.mapping = THREE.EquirectangularReflectionMapping
    }
  }, [texture, texture_norm, text_env])

  useFrame((state, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= dt * 0.05;
    }
  })

  return (
    // @ts-ignore - React Three Fiber JSX elements
    <mesh
      ref={meshRef}
      position={sphereData.position}
      onClick={onClick}
      onPointerOver={(e: any) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation()
        document.body.style.cursor = 'auto'
      }}
    >
      {/* @ts-ignore - React Three Fiber JSX elements */}
      <sphereGeometry args={[1, 32, 32]} />
      {/* @ts-ignore - React Three Fiber JSX elements */}
      <meshPhysicalMaterial
        clearcoat={1.0}
        metalness={0.0}
        roughness={0.0}
        map={texture}
        normalMap={texture_norm}
        envMap={text_env}
        side={THREE.DoubleSide}
        transparent={false}
        opacity={1.0}
      />
      {/* @ts-ignore - React Three Fiber JSX elements */}
    </mesh>
  )
}

// Componente para el modelo 3D dentro de la esfera
function ModelScene({ sphereData }: { sphereData: SphereData }) {
  const gltf = useGLTF(sphereData.modelPath);
  const [texture, texture_disp, texture_norm] = useLoader(THREE.TextureLoader, [
    sphereData.texture,
    sphereData.displacementMap,
    sphereData.normalMap
  ]);
  const [text_env] = useLoader(THREE.TextureLoader, [sphereData.envMap]);

  // Configurar las texturas
  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
    }
    if (texture_norm) {
      texture_norm.wrapS = texture_norm.wrapT = THREE.RepeatWrapping
      texture_norm.flipY = false
    }
    if (text_env) {
      text_env.mapping = THREE.EquirectangularReflectionMapping
    }
  }, [texture, texture_norm, text_env])

  // Aplicar materiales a los objetos del modelo
  useEffect(() => {
    if (!texture || !texture_norm || !text_env) return;

    console.log('Aplicando texturas al modelo:', sphereData.modelPath);
    console.log('Texturas cargadas:', { texture, texture_norm, text_env });

    gltf.scene.traverse((o: THREE.Object3D) => {
      console.log('Objeto encontrado:', o.name, o.type);
      if (o instanceof THREE.Mesh) {
        console.log('Aplicando material a mesh:', o.name);
        // Aplicar material a cualquier mesh, no solo los llamados 'Sphere'
        o.material = new THREE.MeshPhysicalMaterial({
          clearcoat: 1.0,
          metalness: 0.0,
          roughness: 0.0,
          map: texture,
          normalMap: texture_norm,
          envMap: text_env,
          side: THREE.DoubleSide,
          transparent: false,
          opacity: 1.0
        });

        // Forzar actualización del material
        o.material.needsUpdate = true;
      }
    });
  }, [gltf.scene, texture, texture_norm, text_env, sphereData.modelPath]);

  const sphere = useMemo(() => {
    return gltf.nodes?.Sphere as THREE.Mesh;
  }, [gltf.nodes]);

  useFrame((state, dt) => {
    if (sphere) {
      sphere.rotation.y -= dt * 0.05;
    }
  })

  const { scene, gl, camera } = useThree();
  useEffect(() => {
    scene.background = text_env;
    gl.toneMapping = THREE.LinearToneMapping;
    camera.position.z = 1.4;
    camera.position.y = 0.1;
  }, [scene, gl, camera, text_env])

  // @ts-ignore - Three.js JSX elements
  return <primitive object={gltf.scene} />;
}



// Componente principal que maneja la navegación
function SceneManager({
  spheresData,
  onEnterSphere,
  onExitSphere,
  onNavigateToSphere,
  orbitTarget,
  isAnimating
}: {
  spheresData: SphereData[]
  onEnterSphere: (sphereId: string) => void
  onExitSphere: () => void
  onNavigateToSphere: (sphereId: string) => void
  orbitTarget: THREE.Vector3
  isAnimating: boolean
}) {
  const { camera } = useThree()

  // Función para entrar dentro de una esfera
  const enterSphere = (sphereId: string) => {
    // Posicionar la cámara dentro de la esfera
    const sphere = spheresData.find(s => s.id === sphereId)
    if (sphere) {
      camera.position.set(sphere.position[0], sphere.position[1], sphere.position[2])
    }
    onEnterSphere(sphereId)
  }

  // Configurar la cámara inicial
  useEffect(() => {
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Manejar tecla Escape para salir
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExitSphere()
        // Posicionar la cámara para ver todas las esferas
        camera.position.set(0, 2, 8)
        camera.lookAt(0, 0, 0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onExitSphere, camera])

  return (
    <>
      {/* Vista exterior con todas las esferas */}
      <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      {spheresData.map((sphereData) => (
        <Sphere
          key={sphereData.id}
          sphereData={sphereData}
          onClick={() => enterSphere(sphereData.id)}
        />
      ))}
      <DynamicOrbitControls target={orbitTarget} isAnimating={isAnimating} />
    </>
  )
}

// Componente para el botón de salir usando Html de drei
function ExitButton({ onExit }: { onExit: () => void }) {
  return (
    <Html
      position={[0, 0, 0]}
      center
      style={{
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          zIndex: 1000
        }}
        onClick={onExit}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
        }}
      >
        ← Salir de la esfera
      </div>
    </Html>
  )
}

// Componente para los botones de navegación
function NavigationButtons({
  spheresData,
  currentSphereIndex,
  onNavigateToSphere,
  onShowAllSpheres
}: {
  spheresData: SphereData[]
  currentSphereIndex: number
  onNavigateToSphere: (sphereId: string) => void
  onShowAllSpheres: () => void
}) {
  const goToPrevious = () => {
    const prevIndex = currentSphereIndex > 0 ? currentSphereIndex - 1 : spheresData.length - 1
    onNavigateToSphere(spheresData[prevIndex].id)
  }

  const goToNext = () => {
    const nextIndex = currentSphereIndex < spheresData.length - 1 ? currentSphereIndex + 1 : 0
    onNavigateToSphere(spheresData[nextIndex].id)
  }

  return (
    <Html
      position={[0, 0, 0]}
      center
      style={{
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onClick={goToPrevious}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          ← Anterior
        </button>

        <button
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onClick={onShowAllSpheres}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          🏠 Ver Todas
        </button>

        <button
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onClick={goToNext}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          Siguiente →
        </button>
      </div>
    </Html>
  )
}

// Componente para animar la cámara con lerp
function CameraAnimator({
  targetPosition,
  targetLookAt,
  isAnimating,
  onAnimationComplete
}: {
  targetPosition: THREE.Vector3 | null
  targetLookAt: THREE.Vector3 | null
  isAnimating: boolean
  onAnimationComplete: () => void
}) {
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (isAnimating && targetPosition && targetLookAt) {
      // Lerp para posición de la cámara
      camera.position.lerp(targetPosition, delta * 2)

      // Verificar si la animación ha terminado
      if (camera.position.distanceTo(targetPosition) < 0.1) {
        camera.position.copy(targetPosition)
        onAnimationComplete()
      }
    }
  })

  return null
}

// Componente OrbitControls personalizado con target animado
function DynamicOrbitControls({ target, isAnimating }: { target: THREE.Vector3, isAnimating: boolean }) {
  const controlsRef = useRef<any>(null)
  const currentTarget = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (controlsRef.current) {
      if (isAnimating) {
        // Animar el target con lerp
        currentTarget.current.lerp(target, delta * 2)
        controlsRef.current.target.copy(currentTarget.current)
        controlsRef.current.update()
      } else {
        // Cuando no está animando, mantener el target actual
        controlsRef.current.target.copy(currentTarget.current)
      }
    }
  })

  // Inicializar el target cuando cambia
  useEffect(() => {
    if (controlsRef.current) {
      currentTarget.current.copy(target)
      controlsRef.current.target.copy(target)
      controlsRef.current.update()
    }
  }, [target])

  return <OrbitControls ref={controlsRef} target={currentTarget.current} />
}

// Componente para la vista interior de la esfera
function InsideSphereView({ sphereData, onExit }: { sphereData: SphereData, onExit: () => void }) {
  return (
    <>
      <ModelScene sphereData={sphereData} />
      <DynamicOrbitControls target={new THREE.Vector3(0, 0.1, 0)} isAnimating={false} />
      <ExitButton onExit={onExit} />
    </>
  )
}

// Componente principal exportado
export function CharlesSceneList({ spheresData = defaultSpheresData }: { spheresData?: SphereData[] }) {
  const [isInsideSphere, setIsInsideSphere] = useState(false)
  const [selectedSphereId, setSelectedSphereId] = useState<string | null>(null)
  const [currentSphereIndex, setCurrentSphereIndex] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null)
  const [orbitTarget, setOrbitTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  const selectedSphere = spheresData.find(sphere => sphere.id === selectedSphereId)

  const exitSphere = () => {
    setIsInsideSphere(false)
    setSelectedSphereId(null)
    setCurrentSphereIndex(-1)
  }

  const navigateToSphere = (sphereId: string) => {
    const sphereIndex = spheresData.findIndex(s => s.id === sphereId)
    if (sphereIndex !== -1) {
      setCurrentSphereIndex(sphereIndex)
      setIsAnimating(true)

      // Calcular posición de la cámara para enfocar la esfera
      const sphere = spheresData[sphereIndex]
      const cameraPosition = new THREE.Vector3(
        sphere.position[0],
        sphere.position[1] + 1,
        sphere.position[2] + 3
      )

      setTargetPosition(cameraPosition)
      setOrbitTarget(new THREE.Vector3(sphere.position[0], sphere.position[1], sphere.position[2]))
    }
  }

  const showAllSpheres = () => {
    setCurrentSphereIndex(-1)
    setIsAnimating(true)

    // Posición para ver todas las esferas
    const allSpheresPosition = new THREE.Vector3(0, 2, 8)

    setTargetPosition(allSpheresPosition)
    setOrbitTarget(new THREE.Vector3(0, 0, 0))
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  return (
    <Suspense fallback={null}>
      {isInsideSphere && selectedSphere ? (
        <InsideSphereView sphereData={selectedSphere} onExit={exitSphere} />
      ) : (
        <>
          <SceneManager
            spheresData={spheresData}
            onEnterSphere={(sphereId) => {
              setSelectedSphereId(sphereId)
              setIsInsideSphere(true)
            }}
            onExitSphere={exitSphere}
            onNavigateToSphere={navigateToSphere}
            orbitTarget={orbitTarget}
            isAnimating={isAnimating}
          />
          <CameraAnimator
            targetPosition={targetPosition}
            targetLookAt={orbitTarget}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
          />
          <NavigationButtons
            spheresData={spheresData}
            currentSphereIndex={currentSphereIndex}
            onNavigateToSphere={navigateToSphere}
            onShowAllSpheres={showAllSpheres}
          />
        </>
      )}
    </Suspense>
  )
}
