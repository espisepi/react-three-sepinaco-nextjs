import React, { memo } from 'react'
import { Stars } from '@react-three/drei'
import { WheelScene } from '@/features/wheel-of-fortune/components/canvas/WheelScene'
import { WheelSceneProps } from '@/types/scene-manager'

/**
 * Escena oscura de la ruleta con efecto de estrellas de fondo
 * TODO: Implementar efectos de neón y ambiente misterioso
 */
export const DarkWheelScene = memo((props: WheelSceneProps) => {
  return <>
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

    {/* Escena original de la ruleta */}
    <WheelScene {...props} />
  </>
})

DarkWheelScene.displayName = 'DarkWheelScene'
