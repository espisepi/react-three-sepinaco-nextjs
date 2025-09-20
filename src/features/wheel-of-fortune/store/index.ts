// ============================================================================
// STORE EXPORTS
// ============================================================================

// Types
export type {
    WheelState,
    WheelUIState,
    WheelAppState,
    WheelAction,
    WheelActionUnion,
    WheelStore,
    UpdateConfigAction,
    UpdatePanelsAction,
    UpdateSpinDurationAction,
    UpdateOrbitControlsAction,
    UpdateCanvasSizeAction,
    AddPanelAction,
    RemovePanelAction,
    UpdatePanelTextAction,
    UpdatePanelColorAction,
    UpdatePanelTextureAction,
    UpdatePanelTextureScaleAction,
    UpdatePanelTextureRotationAction,
    UpdatePanelTextureOffsetAction,
    UpdateTextPositionAction,
    UpdateTextRotationAction,
    UpdateTextScaleAction,
    SetSpinningAction,
    SetResultAction,
    SetCurrentPanelAction,
    SetRaycastHitPanelAction,
    SetRemainingTimeAction,
    SetLoadedAction,
    SetClientAction,
    LoadConfigAction,
    ResetToDefaultAction,
    ClearStorageAction,
} from './types'

export { WheelActionType, DEFAULT_WHEEL_STATE, DEFAULT_UI_STATE, DEFAULT_APP_STATE } from './types'

// Store
export { createWheelStore, getWheelStore, resetStore, getStoreState, dispatchAction } from './store'

// Reducer
export { wheelReducer } from './reducer'

// Actions
export {
    updateConfig,
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
    startSpin,
    completeSpin,
    updatePanel,
} from './actions'

// Hooks
export {
    useWheelStore,
    useWheelConfig,
    useWheelUI,
    useWheelPanels,
    useSpinDuration,
    useOrbitControls,
    useCanvasSize,
    useIsSpinning,
    useWheelResult,
    useCurrentPanel,
    useRaycastHitPanel,
    useRemainingTime,
    useIsLoaded,
    useIsClient,
    useWheelSelector,
    useWheelPanel,
    usePanelCount,
    useCanSpin,
    useConfigInfo,
} from './hooks'
