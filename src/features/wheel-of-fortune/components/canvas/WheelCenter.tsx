import React, { useMemo, memo } from 'react'
import * as THREE from 'three'

/**
 * Componente optimizado para el centro de la ruleta
 * Separado para mejorar la performance y reutilización
 */
export const WheelCenter = memo(() => {
    // Memoizar geometría y material para mejor performance
    const centerGeometry = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 0.2), [])
    const centerMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#FFD700",
        metalness: 0.9,
        roughness: 0.1
    }), [])

    return (
        // @ts-ignore - Three.js JSX elements
        <mesh position={[0, 0, 0.1]} geometry={centerGeometry} material={centerMaterial} />
    )
})

WheelCenter.displayName = 'WheelCenter'
