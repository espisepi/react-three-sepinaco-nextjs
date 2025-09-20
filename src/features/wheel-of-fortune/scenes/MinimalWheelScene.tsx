import React, { memo } from 'react'
import { WheelScene } from '@/features/wheel-of-fortune/components/canvas/WheelScene'
import { WheelSceneProps } from '@/types/scene-manager'

/**
 * Escena minimalista de la ruleta - Por ahora usa la escena original
 * TODO: Implementar diseño limpio y elegante
 */
export const MinimalWheelScene = memo((props: WheelSceneProps) => {
    return <WheelScene {...props} />
})

MinimalWheelScene.displayName = 'MinimalWheelScene'
