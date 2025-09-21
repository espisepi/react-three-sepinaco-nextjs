import { useRef, useState, useEffect, useCallback } from 'react'
import { WheelPanel } from '@/types/wheel'

interface UseWheelRotationProps {
    isSpinning: boolean
    spinDuration: number
    onSpinComplete: (panel: WheelPanel) => void
    panels: WheelPanel[]
}

/**
 * Hook personalizado para manejar la lógica de rotación de la ruleta
 * Separado para mejorar la separación de responsabilidades y reutilización
 */
export const useWheelRotation = ({
    isSpinning,
    spinDuration,
    onSpinComplete,
    panels
}: UseWheelRotationProps) => {
    const [rotationSpeed, setRotationSpeed] = useState(0)
    const [isDecelerating, setIsDecelerating] = useState(false)
    const spinStartTime = useRef<number>(0)
    const spinTimer = useRef<NodeJS.Timeout | null>(null)
    const hasStartedSpinning = useRef<boolean>(false)

    // Memoizar callback para evitar recreaciones
    const handleSpinComplete = useCallback((selectedPanel: WheelPanel) => {
        onSpinComplete(selectedPanel)
    }, [onSpinComplete])

    // Lógica de rotación continua durante toda la duración
    useEffect(() => {
        if (isSpinning && !hasStartedSpinning.current) {
            hasStartedSpinning.current = true

            // Velocidad constante basada en la duración
            const baseSpeed = 3.0 // Velocidad base constante
            const durationFactor = Math.min(spinDuration * 0.5, 2.0) // Factor limitado
            const constantSpeed = baseSpeed + durationFactor

            setRotationSpeed(constantSpeed)
            setIsDecelerating(true) // Mantener el estado para la lógica de rotación
            spinStartTime.current = Date.now()

            // Timer único para parar completamente
            spinTimer.current = setTimeout(() => {
                setIsDecelerating(false)
                setRotationSpeed(0)
                hasStartedSpinning.current = false

                // Determinar qué panel está seleccionado
                // Esta lógica debería estar en el componente que tiene acceso al wheelRef
                // Por ahora mantenemos la estructura original
                const randomPanel = panels[Math.floor(Math.random() * panels.length)]
                if (randomPanel) {
                    handleSpinComplete(randomPanel)
                }
            }, spinDuration * 1000)
        }

        // Reset cuando no está girando
        if (!isSpinning) {
            hasStartedSpinning.current = false
            setIsDecelerating(false)
            setRotationSpeed(0)
            if (spinTimer.current) {
                clearTimeout(spinTimer.current)
                spinTimer.current = null
            }
        }
    }, [isSpinning, spinDuration, handleSpinComplete, panels])

    // Cleanup del timer solo cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if (spinTimer.current) {
                clearTimeout(spinTimer.current)
                spinTimer.current = null
            }
        }
    }, [])

    return {
        rotationSpeed,
        isDecelerating,
        spinStartTime
    }
}

