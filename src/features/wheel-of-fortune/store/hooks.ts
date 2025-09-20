import { useEffect, useState } from 'react'
import { WheelStore, WheelAppState } from './types'
import { getWheelStore } from './store'

// ============================================================================
// HOOKS FOR STORE ACCESS
// ============================================================================

/**
 * Hook to access the entire wheel store state
 */
export function useWheelStore(): WheelAppState {
    const [state, setState] = useState<WheelAppState>(() => getWheelStore().getState())

    useEffect(() => {
        const store = getWheelStore()

        const unsubscribe = store.subscribe(() => {
            setState(store.getState())
        })

        return unsubscribe
    }, [])

    return state
}

/**
 * Hook to access only the configuration state
 */
export function useWheelConfig() {
    const state = useWheelStore()
    return state.config
}

/**
 * Hook to access only the UI state
 */
export function useWheelUI() {
    const state = useWheelStore()
    return state.ui
}

/**
 * Hook to access panels from the store
 */
export function useWheelPanels() {
    const config = useWheelConfig()
    return config.panels
}

/**
 * Hook to access spin duration from the store
 */
export function useSpinDuration() {
    const config = useWheelConfig()
    return config.spinDuration
}

/**
 * Hook to access orbit controls setting from the store
 */
export function useOrbitControls() {
    const config = useWheelConfig()
    return config.enableOrbitControls
}

/**
 * Hook to access canvas size from the store
 */
export function useCanvasSize() {
    const config = useWheelConfig()
    return { width: config.canvasWidth, height: config.canvasHeight }
}

/**
 * Hook to access spinning state from the store
 */
export function useIsSpinning() {
    const ui = useWheelUI()
    return ui.isSpinning
}

/**
 * Hook to access result from the store
 */
export function useWheelResult() {
    const ui = useWheelUI()
    return ui.result
}

/**
 * Hook to access current panel from the store
 */
export function useCurrentPanel() {
    const ui = useWheelUI()
    return ui.currentPanel
}

/**
 * Hook to access raycast hit panel from the store
 */
export function useRaycastHitPanel() {
    const ui = useWheelUI()
    return ui.raycastHitPanel
}

/**
 * Hook to access remaining time from the store
 */
export function useRemainingTime() {
    const ui = useWheelUI()
    return ui.remainingTime
}

/**
 * Hook to access loaded state from the store
 */
export function useIsLoaded() {
    const ui = useWheelUI()
    return ui.isLoaded
}

/**
 * Hook to access client state from the store
 */
export function useIsClient() {
    const ui = useWheelUI()
    return ui.isClient
}

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

/**
 * Hook to select specific data from the store using a selector function
 */
export function useWheelSelector<T>(selector: (state: WheelAppState) => T): T {
    const [selectedState, setSelectedState] = useState<T>(() =>
        selector(getWheelStore().getState())
    )

    useEffect(() => {
        const store = getWheelStore()

        const unsubscribe = store.subscribe(() => {
            const newSelectedState = selector(store.getState())
            setSelectedState(newSelectedState)
        })

        return unsubscribe
    }, [selector])

    return selectedState
}

/**
 * Hook to get a specific panel by ID
 */
export function useWheelPanel(panelId: string) {
    return useWheelSelector(state =>
        state.config.panels.find(panel => panel.id === panelId)
    )
}

/**
 * Hook to get panel count
 */
export function usePanelCount() {
    return useWheelSelector(state => state.config.panels.length)
}

/**
 * Hook to check if wheel can spin (has panels and not currently spinning)
 */
export function useCanSpin() {
    return useWheelSelector(state =>
        state.config.panels.length > 0 && !state.ui.isSpinning
    )
}

/**
 * Hook to get configuration info
 */
export function useConfigInfo() {
    return useWheelSelector(state => ({
        hasLocalStorage: !!localStorage.getItem('wheel-of-fortune-config'),
        panelCount: state.config.panels.length,
        lastUpdated: state.config.updatedAt,
        version: state.config.version,
    }))
}
