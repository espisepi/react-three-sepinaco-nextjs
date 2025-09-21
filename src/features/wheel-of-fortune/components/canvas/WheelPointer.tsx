import React, { forwardRef, useMemo, memo } from 'react'
import * as THREE from 'three'

/**
 * Componente optimizado para el puntero de la ruleta
 * Separado para mejorar la performance y reutilización
 */
export const WheelPointer = memo(forwardRef<THREE.Mesh>((props, ref) => {
    // Memoizar geometrías y materiales para mejor performance
    const coneGeometry = useMemo(() => new THREE.ConeGeometry(0.1, 0.3), [])
    const pointerMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#FF0000",
        metalness: 0.8,
        roughness: 0.2
    }), [])

    return (
        // @ts-ignore - Three.js JSX elements
        <mesh
            ref={ref}
            position={[0, 2.2, 0]}
            rotation={[Math.PI, 0, 0]}
            geometry={coneGeometry}
            material={pointerMaterial}
            castShadow
        />
    )
}))

WheelPointer.displayName = 'WheelPointer'
