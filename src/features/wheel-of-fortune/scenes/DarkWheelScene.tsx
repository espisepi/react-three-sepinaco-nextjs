import React, { memo } from 'react'
import { WheelScene } from '@/features/wheel-of-fortune/components/canvas/WheelScene'
import { WheelSceneProps } from '@/types/scene-manager'

/**
 * Escena oscura de la ruleta - Por ahora usa la escena original
 * TODO: Implementar efectos de neón y ambiente misterioso
 */
export const DarkWheelScene = memo((props: WheelSceneProps) => {
    return <WheelScene {...props} />
})

DarkWheelScene.displayName = 'DarkWheelScene'
