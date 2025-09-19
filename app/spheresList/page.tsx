'use client'

import { Canvas } from '@react-three/fiber'
import { CharlesSceneList } from '@/features/charles-webpage/components/canvas/CharlesSceneList'

// Datos personalizados para las esferas (opcional)
const customSpheresData = [
  {
    id: 'sphere1',
    name: 'Esfera Principal',
    image: 'img/1.png',
    texture: 'img/1.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene.glb',
    position: [0, 0, 0] as [number, number, number]
  },
  {
    id: 'sphere2',
    name: 'Esfera Secundaria',
    image: 'img/2.png',
    texture: 'img/2.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene2.glb',
    position: [4, 0, 0] as [number, number, number]
  },
  {
    id: 'sphere3',
    name: 'Esfera Terciaria',
    image: 'img/2.png',
    texture: 'img/2.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene3.glb',
    position: [-4, 0, 0] as [number, number, number]
  },
  {
    id: 'sphere4',
    name: 'Esfera Superior',
    image: 'img/1.png',
    texture: 'img/1.png',
    normalMap: 'img/1_norm.png',
    displacementMap: 'img/1_disp.png',
    envMap: 'img/2_new.png',
    modelPath: 'obj/scene.glb',
    position: [0, 3, 0] as [number, number, number]
  }
]

export default function SpheresListPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <CharlesSceneList spheresData={customSpheresData} />
      </Canvas>

      {/* Información adicional en overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🌐 Navegación de Esferas</h3>
        <p style={{ margin: '5px 0' }}>• Haz click en cualquier esfera para entrar</p>
        <p style={{ margin: '5px 0' }}>• Usa OrbitControls para navegar</p>
        <p style={{ margin: '5px 0' }}>• Presiona <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 4px', borderRadius: '3px' }}>ESC</kbd> o el botón para salir</p>
        <p style={{ margin: '5px 0' }}>• Cada esfera tiene su propio modelo 3D</p>
      </div>
    </div>
  )
}
