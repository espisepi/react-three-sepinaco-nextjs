import { useCallback, useEffect } from 'react'
import { WheelPanel } from '@/types/wheel'
import {
    useWheelStore,
    useWheelConfig,
    useWheelUI,
    dispatchAction,
    updatePanels,
    updateSpinDuration,
    updateOrbitControls,
    updateCanvasSize,
    addPanel,
    removePanel,
    updatePanelText,
    updatePanelColor,
    updatePanelTexture,
    updatePanelTextureScale,
    updatePanelTextureRotation,
    updatePanelTextureOffset,
    updateTextPosition,
    updateTextRotation,
    updateTextScale,
    setSpinning,
    setResult,
    setCurrentPanel,
    setRaycastHitPanel,
    setRemainingTime,
    setLoaded,
    setClient,
    loadConfig,
    resetToDefault,
    clearStorage,
} from '../store'
import {
    ServiceFactory,
    ValidationError,
    PersistenceError,
    TextureError,
} from '../services'

// ============================================================================
// ENHANCED WHEEL HOOK WITH SERVICES
// ============================================================================

export function useWheelManager() {
    const store = useWheelStore()
    const config = useWheelConfig()
    const ui = useWheelUI()

    // Get service instances
    const panelService = ServiceFactory.getPanelService()
    const colorService = ServiceFactory.getColorService()
    const persistenceService = ServiceFactory.getPersistenceService()
    const validationService = ServiceFactory.getValidationService()

    // ============================================================================
    // CONFIGURATION METHODS
    // ============================================================================

    const updateConfig = useCallback((updates: Partial<typeof config>) => {
        try {
            // Validate updates before applying
            if (updates.spinDuration !== undefined) {
                if (!validationService.validateSpinDuration(updates.spinDuration)) {
                    throw new ValidationError('Invalid spin duration')
                }
            }

            if (updates.canvasWidth !== undefined || updates.canvasHeight !== undefined) {
                const width = updates.canvasWidth ?? config.canvasWidth
                const height = updates.canvasHeight ?? config.canvasHeight
                if (!validationService.validateCanvasSize(width, height)) {
                    throw new ValidationError('Invalid canvas size')
                }
            }

            dispatchAction({
                type: 'UPDATE_CONFIG' as any,
                payload: updates,
            })
        } catch (error) {
            console.error('Failed to update config:', error)
            throw error
        }
    }, [config, validationService])

    const updateSpinDurationAction = useCallback((duration: number) => {
        if (!validationService.validateSpinDuration(duration)) {
            throw new ValidationError('Invalid spin duration')
        }
        dispatchAction(updateSpinDuration(duration))
    }, [validationService])

    const updateOrbitControlsAction = useCallback((enabled: boolean) => {
        dispatchAction(updateOrbitControls(enabled))
    }, [])

    const updateCanvasSizeAction = useCallback((width: number, height: number) => {
        if (!validationService.validateCanvasSize(width, height)) {
            throw new ValidationError('Invalid canvas size')
        }
        dispatchAction(updateCanvasSize(width, height))
    }, [validationService])

    // ============================================================================
    // PANEL METHODS
    // ============================================================================

    const addPanelAction = useCallback((text?: string, color?: string) => {
        try {
            const panelText = text || `Premio ${config.panels.length + 1}`
            const panelColor = color || colorService.getNextColor(config.panels.length)

            const newPanel = panelService.createPanel(panelText, panelColor)
            dispatchAction(addPanel(newPanel))
        } catch (error) {
            console.error('Failed to add panel:', error)
            throw error
        }
    }, [config.panels.length, panelService, colorService])

    const removePanelAction = useCallback((id: string) => {
        if (config.panels.length <= 1) {
            throw new ValidationError('Cannot remove the last panel')
        }
        dispatchAction(removePanel(id))
    }, [config.panels.length])

    const updatePanelTextAction = useCallback((id: string, text: string) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelText(panel, text)
            dispatchAction(updatePanelText(id, text))
        } catch (error) {
            console.error('Failed to update panel text:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updatePanelColorAction = useCallback((id: string, color: string) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelColor(panel, color)
            dispatchAction(updatePanelColor(id, color))
        } catch (error) {
            console.error('Failed to update panel color:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updatePanelTextureAction = useCallback(async (id: string, texture: string | null) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelTexture(panel, texture)
            dispatchAction(updatePanelTexture(id, texture))
        } catch (error) {
            console.error('Failed to update panel texture:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updatePanelTextureScaleAction = useCallback((id: string, scale: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelTextureScale(panel, scale)
            dispatchAction(updatePanelTextureScale(id, scale))
        } catch (error) {
            console.error('Failed to update panel texture scale:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updatePanelTextureRotationAction = useCallback((id: string, rotation: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelTextureRotation(panel, rotation)
            dispatchAction(updatePanelTextureRotation(id, rotation))
        } catch (error) {
            console.error('Failed to update panel texture rotation:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updatePanelTextureOffsetAction = useCallback((id: string, offsetX: number, offsetY: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updatePanelTextureOffset(panel, offsetX, offsetY)
            dispatchAction(updatePanelTextureOffset(id, offsetX, offsetY))
        } catch (error) {
            console.error('Failed to update panel texture offset:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updateTextPositionAction = useCallback((id: string, x: number, y: number, z: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updateTextPosition(panel, x, y, z)
            dispatchAction(updateTextPosition(id, x, y, z))
        } catch (error) {
            console.error('Failed to update text position:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updateTextRotationAction = useCallback((id: string, x: number, y: number, z: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updateTextRotation(panel, x, y, z)
            dispatchAction(updateTextRotation(id, x, y, z))
        } catch (error) {
            console.error('Failed to update text rotation:', error)
            throw error
        }
    }, [config.panels, panelService])

    const updateTextScaleAction = useCallback((id: string, x: number, y: number, z: number) => {
        try {
            const panel = config.panels.find(p => p.id === id)
            if (!panel) {
                throw new ValidationError('Panel not found')
            }

            const updatedPanel = panelService.updateTextScale(panel, x, y, z)
            dispatchAction(updateTextScale(id, x, y, z))
        } catch (error) {
            console.error('Failed to update text scale:', error)
            throw error
        }
    }, [config.panels, panelService])

    // ============================================================================
    // UI METHODS
    // ============================================================================

    const startSpinAction = useCallback(() => {
        if (config.panels.length === 0) {
            throw new ValidationError('Cannot spin with no panels')
        }
        if (ui.isSpinning) {
            throw new ValidationError('Wheel is already spinning')
        }

        dispatchAction(setSpinning(true))
        dispatchAction(setResult(null))
    }, [config.panels.length, ui.isSpinning])

    const completeSpinAction = useCallback((selectedPanel: WheelPanel) => {
        dispatchAction(setSpinning(false))
        dispatchAction(setResult(selectedPanel))
    }, [])

    const setCurrentPanelAction = useCallback((panel: WheelPanel | null) => {
        dispatchAction(setCurrentPanel(panel))
    }, [])

    const setRaycastHitPanelAction = useCallback((panel: WheelPanel | null) => {
        dispatchAction(setRaycastHitPanel(panel))
    }, [])

    const setRemainingTimeAction = useCallback((time: number | undefined) => {
        dispatchAction(setRemainingTime(time))
    }, [])

    const setLoadedAction = useCallback((loaded: boolean) => {
        dispatchAction(setLoaded(loaded))
    }, [])

    const setClientAction = useCallback((client: boolean) => {
        dispatchAction(setClient(client))
    }, [])

    // ============================================================================
    // PERSISTENCE METHODS
    // ============================================================================

    const saveConfig = useCallback(() => {
        try {
            return persistenceService.saveConfig(config)
        } catch (error) {
            console.error('Failed to save config:', error)
            throw error
        }
    }, [config, persistenceService])

    const loadConfigAction = useCallback(() => {
        try {
            const loadedConfig = persistenceService.loadConfig()
            if (loadedConfig) {
                dispatchAction(loadConfig(loadedConfig))
            }
        } catch (error) {
            console.error('Failed to load config:', error)
            throw error
        }
    }, [persistenceService])

    const downloadConfig = useCallback(() => {
        try {
            return persistenceService.downloadConfig(config)
        } catch (error) {
            console.error('Failed to download config:', error)
            throw error
        }
    }, [config, persistenceService])

    const loadConfigFromFile = useCallback(async (file: File) => {
        try {
            const loadedConfig = await persistenceService.loadConfigFromFile(file)
            if (loadedConfig) {
                dispatchAction(loadConfig(loadedConfig))
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to load config from file:', error)
            throw error
        }
    }, [persistenceService])

    const resetToDefaultAction = useCallback(() => {
        dispatchAction(resetToDefault())
    }, [])

    const clearStorageAction = useCallback(() => {
        try {
            persistenceService.clearConfig()
            dispatchAction(clearStorage())
            return true
        } catch (error) {
            console.error('Failed to clear storage:', error)
            throw error
        }
    }, [persistenceService])

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    const getConfigInfo = useCallback(() => {
        return {
            hasLocalStorage: !!persistenceService.loadConfig(),
            panelCount: config.panels.length,
            lastUpdated: config.updatedAt,
            version: config.version,
        }
    }, [config, persistenceService])

    const canSpin = useCallback(() => {
        return config.panels.length > 0 && !ui.isSpinning
    }, [config.panels.length, ui.isSpinning])

    const getPanelById = useCallback((id: string) => {
        return config.panels.find(panel => panel.id === id)
    }, [config.panels])

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        if (ui.isLoaded) {
            try {
                saveConfig()
            } catch (error) {
                console.warn('Auto-save failed:', error)
            }
        }
    }, [config, ui.isLoaded, saveConfig])

    // ============================================================================
    // RETURN INTERFACE
    // ============================================================================

    return {
        // State
        store,
        config,
        ui,

        // Configuration methods
        updateConfig,
        updateSpinDuration: updateSpinDurationAction,
        updateOrbitControls: updateOrbitControlsAction,
        updateCanvasSize: updateCanvasSizeAction,

        // Panel methods
        addPanel: addPanelAction,
        removePanel: removePanelAction,
        updatePanelText: updatePanelTextAction,
        updatePanelColor: updatePanelColorAction,
        updatePanelTexture: updatePanelTextureAction,
        updatePanelTextureScale: updatePanelTextureScaleAction,
        updatePanelTextureRotation: updatePanelTextureRotationAction,
        updatePanelTextureOffset: updatePanelTextureOffsetAction,
        updateTextPosition: updateTextPositionAction,
        updateTextRotation: updateTextRotationAction,
        updateTextScale: updateTextScaleAction,

        // UI methods
        startSpin: startSpinAction,
        completeSpin: completeSpinAction,
        setCurrentPanel: setCurrentPanelAction,
        setRaycastHitPanel: setRaycastHitPanelAction,
        setRemainingTime: setRemainingTimeAction,
        setLoaded: setLoadedAction,
        setClient: setClientAction,

        // Persistence methods
        saveConfig,
        loadConfig: loadConfigAction,
        downloadConfig,
        loadConfigFromFile,
        resetToDefault: resetToDefaultAction,
        clearStorage: clearStorageAction,

        // Utility methods
        getConfigInfo,
        canSpin,
        getPanelById,
    }
}
