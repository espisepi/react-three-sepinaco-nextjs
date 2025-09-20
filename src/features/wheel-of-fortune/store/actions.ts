import { WheelActionType, WheelActionUnion } from './types'

// ============================================================================
// ACTION CREATORS
// ============================================================================

// Configuration Actions
export const updateConfig = (payload: Partial<any>) => ({
    type: WheelActionType.UPDATE_CONFIG,
    payload,
} as const)

export const updatePanels = (payload: any[]) => ({
    type: WheelActionType.UPDATE_PANELS,
    payload,
} as const)

export const updateSpinDuration = (payload: number) => ({
    type: WheelActionType.UPDATE_SPIN_DURATION,
    payload,
} as const)

export const updateOrbitControls = (payload: boolean) => ({
    type: WheelActionType.UPDATE_ORBIT_CONTROLS,
    payload,
} as const)

export const updateCanvasSize = (width: number, height: number) => ({
    type: WheelActionType.UPDATE_CANVAS_SIZE,
    payload: { width, height },
} as const)

// Panel Actions
export const addPanel = (payload: any) => ({
    type: WheelActionType.ADD_PANEL,
    payload,
} as const)

export const removePanel = (payload: string) => ({
    type: WheelActionType.REMOVE_PANEL,
    payload,
} as const)

export const updatePanelText = (id: string, text: string) => ({
    type: WheelActionType.UPDATE_PANEL_TEXT,
    payload: { id, text },
} as const)

export const updatePanelColor = (id: string, color: string) => ({
    type: WheelActionType.UPDATE_PANEL_COLOR,
    payload: { id, color },
} as const)

export const updatePanelTexture = (id: string, texture: string | null) => ({
    type: WheelActionType.UPDATE_PANEL_TEXTURE,
    payload: { id, texture },
} as const)

export const updatePanelTextureScale = (id: string, scale: number) => ({
    type: WheelActionType.UPDATE_PANEL_TEXTURE_SCALE,
    payload: { id, scale },
} as const)

export const updatePanelTextureRotation = (id: string, rotation: number) => ({
    type: WheelActionType.UPDATE_PANEL_TEXTURE_ROTATION,
    payload: { id, rotation },
} as const)

export const updatePanelTextureOffset = (id: string, offsetX: number, offsetY: number) => ({
    type: WheelActionType.UPDATE_PANEL_TEXTURE_OFFSET,
    payload: { id, offsetX, offsetY },
} as const)

export const updateTextPosition = (id: string, x: number, y: number, z: number) => ({
    type: WheelActionType.UPDATE_TEXT_POSITION,
    payload: { id, x, y, z },
} as const)

export const updateTextRotation = (id: string, x: number, y: number, z: number) => ({
    type: WheelActionType.UPDATE_TEXT_ROTATION,
    payload: { id, x, y, z },
} as const)

export const updateTextScale = (id: string, x: number, y: number, z: number) => ({
    type: WheelActionType.UPDATE_TEXT_SCALE,
    payload: { id, x, y, z },
} as const)

// UI Actions
export const setSpinning = (payload: boolean) => ({
    type: WheelActionType.SET_SPINNING,
    payload,
} as const)

export const setResult = (payload: any) => ({
    type: WheelActionType.SET_RESULT,
    payload,
} as const)

export const setCurrentPanel = (payload: any) => ({
    type: WheelActionType.SET_CURRENT_PANEL,
    payload,
} as const)

export const setRaycastHitPanel = (payload: any) => ({
    type: WheelActionType.SET_RAYCAST_HIT_PANEL,
    payload,
} as const)

export const setRemainingTime = (payload: number | undefined) => ({
    type: WheelActionType.SET_REMAINING_TIME,
    payload,
} as const)

export const setLoaded = (payload: boolean) => ({
    type: WheelActionType.SET_LOADED,
    payload,
} as const)

export const setClient = (payload: boolean) => ({
    type: WheelActionType.SET_CLIENT,
    payload,
} as const)

// Persistence Actions
export const loadConfig = (payload: any) => ({
    type: WheelActionType.LOAD_CONFIG,
    payload,
} as const)

export const resetToDefault = () => ({
    type: WheelActionType.RESET_TO_DEFAULT,
} as const)

export const clearStorage = () => ({
    type: WheelActionType.CLEAR_STORAGE,
} as const)

// ============================================================================
// COMPOUND ACTION CREATORS
// ============================================================================

export const startSpin = () => {
    return [
        setSpinning(true),
        setResult(null),
    ]
}

export const completeSpin = (selectedPanel: any) => {
    return [
        setSpinning(false),
        setResult(selectedPanel),
    ]
}

export const updatePanel = (id: string, updates: Partial<any>) => {
    const actions: WheelActionUnion[] = []

    if (updates.text !== undefined) {
        actions.push(updatePanelText(id, updates.text))
    }
    if (updates.color !== undefined) {
        actions.push(updatePanelColor(id, updates.color))
    }
    if (updates.texture !== undefined) {
        actions.push(updatePanelTexture(id, updates.texture))
    }
    if (updates.textureScale !== undefined) {
        actions.push(updatePanelTextureScale(id, updates.textureScale))
    }
    if (updates.textureRotation !== undefined) {
        actions.push(updatePanelTextureRotation(id, updates.textureRotation))
    }
    if (updates.textureOffsetX !== undefined || updates.textureOffsetY !== undefined) {
        actions.push(updatePanelTextureOffset(
            id,
            updates.textureOffsetX ?? 0,
            updates.textureOffsetY ?? 0
        ))
    }
    if (updates.textPositionX !== undefined || updates.textPositionY !== undefined || updates.textPositionZ !== undefined) {
        actions.push(updateTextPosition(
            id,
            updates.textPositionX ?? 0,
            updates.textPositionY ?? 0,
            updates.textPositionZ ?? 0
        ))
    }
    if (updates.textRotationX !== undefined || updates.textRotationY !== undefined || updates.textRotationZ !== undefined) {
        actions.push(updateTextRotation(
            id,
            updates.textRotationX ?? 0,
            updates.textRotationY ?? 0,
            updates.textRotationZ ?? 0
        ))
    }
    if (updates.textScaleX !== undefined || updates.textScaleY !== undefined || updates.textScaleZ !== undefined) {
        actions.push(updateTextScale(
            id,
            updates.textScaleX ?? 1,
            updates.textScaleY ?? 1,
            updates.textScaleZ ?? 1
        ))
    }

    return actions
}
