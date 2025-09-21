import React, { useMemo, memo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'
import { WheelMaterial } from '@/types/material-manager'
import { useTextureManager } from '../../hooks/useTextureManager'

interface WheelSegmentProps {
    panel: WheelPanel
    index: number
    totalPanels: number
    activeMaterial?: WheelMaterial
}

/**
 * Componente optimizado para cada segmento individual de la ruleta
 * Separado para mejorar la performance y mantenibilidad
 */
export const WheelSegment = memo(({ panel, index, totalPanels, activeMaterial }: WheelSegmentProps) => {
    const { getTexture } = useTextureManager()

    // Calcular ángulos del segmento
    const segmentAngles = useMemo(() => {
        const anglePerSegment = (Math.PI * 2) / totalPanels
        const startAngle = index * anglePerSegment
        const endAngle = (index + 1) * anglePerSegment
        const midAngle = startAngle + anglePerSegment / 2

        return { startAngle, endAngle, midAngle, anglePerSegment }
    }, [index, totalPanels])

    // Crear geometría del segmento
    const segmentGeometry = useMemo(() => {
        return new THREE.CylinderGeometry(
            2.05,
            2.05,
            0.1,
            32,
            1,
            false,
            segmentAngles.startAngle,
            segmentAngles.anglePerSegment
        )
    }, [segmentAngles])

    // Crear material del segmento
    const segmentMaterial = useMemo(() => {
        const texture = getTexture(panel.id)

        // Si hay un material activo, usarlo
        if (activeMaterial) {
            return activeMaterial.createMaterial(panel.color, texture)
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
    }, [panel, activeMaterial, getTexture])

    // Calcular posiciones y rotaciones del texto
    const textTransform = useMemo(() => {
        const textPosition: [number, number, number] = [
            Math.sin(segmentAngles.midAngle) + (panel.textPositionX || 0),
            0.11 + (panel.textPositionY || 0),
            Math.cos(segmentAngles.midAngle) + (panel.textPositionZ || 0)
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

        return { textPosition, textRotation, textScale }
    }, [panel, segmentAngles.midAngle])

    return (
        // @ts-ignore - Three.js JSX elements
        <mesh
            geometry={segmentGeometry}
            material={segmentMaterial}
            rotation={[0, 0, 0]}
            userData={{ panelIndex: index }}
        >
            {/* Texto en cada segmento */}
            <Text
                position={textTransform.textPosition}
                rotation={textTransform.textRotation}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                scale={textTransform.textScale}
            >
                {panel.text}
            </Text>
            {/* @ts-ignore - Three.js JSX elements */}
        </mesh>
    )
})

WheelSegment.displayName = 'WheelSegment'
