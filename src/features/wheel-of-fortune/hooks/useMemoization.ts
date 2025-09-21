import React, { useMemo, useCallback, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'

/**
 * Hook para memoización avanzada de geometrías Three.js
 * Evita recreaciones innecesarias de objetos costosos
 */
export const useMemoizedGeometry = () => {
    const geometriesRef = useRef<Map<string, THREE.BufferGeometry>>(new Map())

    const getCylinderGeometry = useCallback((radius: number, height: number, segments: number) => {
        const key = `cylinder-${radius}-${height}-${segments}`

        if (!geometriesRef.current.has(key)) {
            geometriesRef.current.set(key, new THREE.CylinderGeometry(radius, radius, height, segments))
        }

        return geometriesRef.current.get(key)!
    }, [])

    const getConeGeometry = useCallback((radius: number, height: number, segments: number) => {
        const key = `cone-${radius}-${height}-${segments}`

        if (!geometriesRef.current.has(key)) {
            geometriesRef.current.set(key, new THREE.ConeGeometry(radius, height, segments))
        }

        return geometriesRef.current.get(key)!
    }, [])

    const getBoxGeometry = useCallback((width: number, height: number, depth: number) => {
        const key = `box-${width}-${height}-${depth}`

        if (!geometriesRef.current.has(key)) {
            geometriesRef.current.set(key, new THREE.BoxGeometry(width, height, depth))
        }

        return geometriesRef.current.get(key)!
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        const geometries = geometriesRef.current
        return () => {
            geometries.forEach(geometry => geometry.dispose())
            geometries.clear()
        }
    }, [])

    return {
        getCylinderGeometry,
        getConeGeometry,
        getBoxGeometry
    }
}

/**
 * Hook para memoización de materiales Three.js
 * Reutiliza materiales con las mismas propiedades
 */
export const useMemoizedMaterials = () => {
    const materialsRef = useRef<Map<string, THREE.Material>>(new Map())

    const getBasicMaterial = useCallback((color: string) => {
        const key = `basic-${color}`

        if (!materialsRef.current.has(key)) {
            materialsRef.current.set(key, new THREE.MeshBasicMaterial({ color }))
        }

        return materialsRef.current.get(key)!
    }, [])

    const getPhysicalMaterial = useCallback((config: {
        color?: string
        metalness?: number
        roughness?: number
        clearcoat?: number
        clearcoatRoughness?: number
        transparent?: boolean
        opacity?: number
        emissive?: string
        emissiveIntensity?: number
    }) => {
        const key = `physical-${JSON.stringify(config)}`

        if (!materialsRef.current.has(key)) {
            materialsRef.current.set(key, new THREE.MeshPhysicalMaterial(config))
        }

        return materialsRef.current.get(key)!
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        const materials = materialsRef.current
        return () => {
            materials.forEach(material => material.dispose())
            materials.clear()
        }
    }, [])

    return {
        getBasicMaterial,
        getPhysicalMaterial
    }
}

/**
 * Hook para memoización de cálculos matemáticos costosos
 */
export const useMemoizedCalculations = () => {
    const calculationsRef = useRef<Map<string, any>>(new Map())

    const calculateSegmentAngles = useCallback((totalPanels: number) => {
        const key = `segmentAngles-${totalPanels}`

        if (!calculationsRef.current.has(key)) {
            const anglePerSegment = (Math.PI * 2) / totalPanels
            const angles = Array.from({ length: totalPanels }, (_, i) => ({
                startAngle: i * anglePerSegment,
                endAngle: (i + 1) * anglePerSegment,
                midAngle: i * anglePerSegment + anglePerSegment / 2,
                anglePerSegment
            }))

            calculationsRef.current.set(key, angles)
        }

        return calculationsRef.current.get(key)
    }, [])

    const calculateTextTransform = useCallback((panel: WheelPanel, midAngle: number) => {
        const key = `textTransform-${panel.id}-${midAngle}-${panel.textPositionX}-${panel.textPositionY}-${panel.textPositionZ}-${panel.textRotationX}-${panel.textRotationY}-${panel.textRotationZ}-${panel.textScaleX}-${panel.textScaleY}-${panel.textScaleZ}`

        if (!calculationsRef.current.has(key)) {
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

            calculationsRef.current.set(key, { textPosition, textRotation, textScale })
        }

        return calculationsRef.current.get(key)
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        const calculations = calculationsRef.current
        return () => {
            calculations.clear()
        }
    }, [])

    return {
        calculateSegmentAngles,
        calculateTextTransform
    }
}

/**
 * Hook para memoización de callbacks con dependencias optimizadas
 */
export const useOptimizedCallbacks = () => {
    const callbacksRef = useRef<Map<string, Function>>(new Map())

    const createCallback = useCallback(<T extends (...args: any[]) => any>(
        key: string,
        callback: T,
        deps: React.DependencyList
    ): T => {
        const depKey = `${key}-${JSON.stringify(deps)}`

        if (!callbacksRef.current.has(depKey)) {
            callbacksRef.current.set(depKey, callback)
        }

        return callbacksRef.current.get(depKey) as T
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        const callbacks = callbacksRef.current
        return () => {
            callbacks.clear()
        }
    }, [])

    return {
        createCallback
    }
}

/**
 * Hook para memoización de arrays y objetos complejos
 */
export const useMemoizedData = () => {
    const dataRef = useRef<Map<string, any>>(new Map())

    const getMemoizedData = useCallback(<T>(key: string, factory: () => T, deps: React.DependencyList): T => {
        const depKey = `${key}-${JSON.stringify(deps)}`

        if (!dataRef.current.has(depKey)) {
            dataRef.current.set(depKey, factory())
        }

        return dataRef.current.get(depKey)
    }, [])

    const clearMemoizedData = useCallback((pattern?: string) => {
        if (pattern) {
            const keysToDelete = Array.from(dataRef.current.keys()).filter(key => key.includes(pattern))
            keysToDelete.forEach(key => dataRef.current.delete(key))
        } else {
            dataRef.current.clear()
        }
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        const data = dataRef.current
        return () => {
            data.clear()
        }
    }, [])

    return {
        getMemoizedData,
        clearMemoizedData
    }
}
