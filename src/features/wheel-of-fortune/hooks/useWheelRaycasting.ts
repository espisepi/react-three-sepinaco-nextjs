import { useRef, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'

interface UseWheelRaycastingProps {
    wheelRef: React.RefObject<THREE.Group>
    pointerRef: React.RefObject<THREE.Mesh | null>
    panels: WheelPanel[]
    onRaycastHit?: (panel: WheelPanel | null) => void
    onCurrentPanelChange?: (panel: WheelPanel | null) => void
}

/**
 * Hook personalizado para manejar el raycasting optimizado de la ruleta
 * Separado para mejorar la performance y separación de responsabilidades
 */
export const useWheelRaycasting = ({
    wheelRef,
    pointerRef,
    panels,
    onRaycastHit,
    onCurrentPanelChange
}: UseWheelRaycastingProps) => {
    const { raycaster, camera, scene } = useThree()

    // Variables para throttling del raycasting
    const lastRaycastTime = useRef(0)
    const RAYCAST_THROTTLE = 100 // ms

    // Memoizar cálculos de ángulos para evitar recálculos
    const anglePerSegment = useMemo(() => (Math.PI * 2) / panels.length, [panels.length])
    const compensationAngle = useMemo(() => (2 * Math.PI / 3), [])

    // Memoizar callbacks para evitar recreaciones
    const handleRaycastHit = useCallback((panel: WheelPanel | null) => {
        onRaycastHit?.(panel)
    }, [onRaycastHit])

    const handleCurrentPanelChange = useCallback((panel: WheelPanel | null) => {
        onCurrentPanelChange?.(panel)
    }, [onCurrentPanelChange])

    // Función para determinar el panel actual basado en la rotación
    const getCurrentPanel = useCallback((rotation: number): WheelPanel | null => {
        const normalizedRotation = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const compensatedRotation = (normalizedRotation + compensationAngle) % (Math.PI * 2)
        const selectedIndex = Math.floor(compensatedRotation / anglePerSegment) % panels.length
        return panels[selectedIndex] || null
    }, [panels, anglePerSegment, compensationAngle])

    useFrame(() => {
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
            const currentPanel = getCurrentPanel(wheelRef.current.rotation.y)
            handleCurrentPanelChange(currentPanel)
        }
    })

    return {
        getCurrentPanel
    }
}
