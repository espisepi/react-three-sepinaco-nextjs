import { useCallback } from 'react'
import { WheelPanel } from '@/types/wheel'

interface UsePanelUpdatesProps {
    panels: WheelPanel[]
    updatePanels: (panels: WheelPanel[]) => void
    result: WheelPanel | null
    setResult: (result: WheelPanel | null) => void
    currentPanel: WheelPanel | null
    setCurrentPanel: (panel: WheelPanel | null) => void
}

export function usePanelUpdates({
    panels,
    updatePanels,
    result,
    setResult,
    currentPanel,
    setCurrentPanel
}: UsePanelUpdatesProps) {

    const updatePanel = useCallback((id: string, text: string) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, text } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, text })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, text })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updatePanelColor = useCallback((id: string, color: string) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, color } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, color })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, color })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updatePanelTexture = useCallback((id: string, texture: string | null) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, texture: texture || undefined } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, texture: texture || undefined })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, texture: texture || undefined })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updatePanelTextureScale = useCallback((id: string, scale: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textureScale: scale } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textureScale: scale })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textureScale: scale })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updatePanelTextureRotation = useCallback((id: string, rotation: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textureRotation: rotation } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textureRotation: rotation })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textureRotation: rotation })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updatePanelTextureOffset = useCallback((id: string, offsetX: number, offsetY: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textureOffsetX: offsetX, textureOffsetY: offsetY } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textureOffsetX: offsetX, textureOffsetY: offsetY })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textureOffsetX: offsetX, textureOffsetY: offsetY })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updateTextPosition = useCallback((id: string, x: number, y: number, z: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textPositionX: x, textPositionY: y, textPositionZ: z } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textPositionX: x, textPositionY: y, textPositionZ: z })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textPositionX: x, textPositionY: y, textPositionZ: z })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updateTextRotation = useCallback((id: string, x: number, y: number, z: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textRotationX: x, textRotationY: y, textRotationZ: z } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textRotationX: x, textRotationY: y, textRotationZ: z })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textRotationX: x, textRotationY: y, textRotationZ: z })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    const updateTextScale = useCallback((id: string, x: number, y: number, z: number) => {
        const updatedPanels = panels.map(panel =>
            panel.id === id ? { ...panel, textScaleX: x, textScaleY: y, textScaleZ: z } : panel
        )
        updatePanels(updatedPanels)

        // Si el panel modificado es el resultado actual, actualizar también el resultado
        if (result && result.id === id) {
            setResult({ ...result, textScaleX: x, textScaleY: y, textScaleZ: z })
        }

        // Si el panel modificado es el panel actual, actualizar también el panel actual
        if (currentPanel && currentPanel.id === id) {
            setCurrentPanel({ ...currentPanel, textScaleX: x, textScaleY: y, textScaleZ: z })
        }
    }, [panels, updatePanels, result, setResult, currentPanel, setCurrentPanel])

    return {
        updatePanel,
        updatePanelColor,
        updatePanelTexture,
        updatePanelTextureScale,
        updatePanelTextureRotation,
        updatePanelTextureOffset,
        updateTextPosition,
        updateTextRotation,
        updateTextScale
    }
}
