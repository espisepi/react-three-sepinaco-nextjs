import { WheelAppState, WheelActionUnion, WheelActionType, DEFAULT_APP_STATE } from './types'

// ============================================================================
// REDUCER FUNCTION
// ============================================================================

export function wheelReducer(state: WheelAppState, action: WheelActionUnion): WheelAppState {
    switch (action.type) {
        // Configuration Actions
        case WheelActionType.UPDATE_CONFIG:
            return {
                ...state,
                config: {
                    ...state.config,
                    ...action.payload,
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.UPDATE_PANELS:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: action.payload,
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.UPDATE_SPIN_DURATION:
            return {
                ...state,
                config: {
                    ...state.config,
                    spinDuration: action.payload,
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.UPDATE_ORBIT_CONTROLS:
            return {
                ...state,
                config: {
                    ...state.config,
                    enableOrbitControls: action.payload,
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.UPDATE_CANVAS_SIZE:
            return {
                ...state,
                config: {
                    ...state.config,
                    canvasWidth: action.payload.width,
                    canvasHeight: action.payload.height,
                    updatedAt: new Date().toISOString(),
                },
            }

        // Panel Actions
        case WheelActionType.ADD_PANEL:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: [...state.config.panels, action.payload],
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.REMOVE_PANEL:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.filter(panel => panel.id !== action.payload),
                    updatedAt: new Date().toISOString(),
                },
            }

        case WheelActionType.UPDATE_PANEL_TEXT:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? { ...panel, text: action.payload.text }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? { ...state.ui.result, text: action.payload.text }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? { ...state.ui.currentPanel, text: action.payload.text }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? { ...state.ui.raycastHitPanel, text: action.payload.text }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_PANEL_COLOR:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? { ...panel, color: action.payload.color }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? { ...state.ui.result, color: action.payload.color }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? { ...state.ui.currentPanel, color: action.payload.color }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? { ...state.ui.raycastHitPanel, color: action.payload.color }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_PANEL_TEXTURE:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? { ...panel, texture: action.payload.texture || undefined }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? { ...state.ui.result, texture: action.payload.texture || undefined }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? { ...state.ui.currentPanel, texture: action.payload.texture || undefined }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? { ...state.ui.raycastHitPanel, texture: action.payload.texture || undefined }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_PANEL_TEXTURE_SCALE:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? { ...panel, textureScale: action.payload.scale }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? { ...state.ui.result, textureScale: action.payload.scale }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? { ...state.ui.currentPanel, textureScale: action.payload.scale }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? { ...state.ui.raycastHitPanel, textureScale: action.payload.scale }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_PANEL_TEXTURE_ROTATION:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? { ...panel, textureRotation: action.payload.rotation }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? { ...state.ui.result, textureRotation: action.payload.rotation }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? { ...state.ui.currentPanel, textureRotation: action.payload.rotation }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? { ...state.ui.raycastHitPanel, textureRotation: action.payload.rotation }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_PANEL_TEXTURE_OFFSET:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? {
                                ...panel,
                                textureOffsetX: action.payload.offsetX,
                                textureOffsetY: action.payload.offsetY
                            }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? {
                            ...state.ui.result,
                            textureOffsetX: action.payload.offsetX,
                            textureOffsetY: action.payload.offsetY
                        }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? {
                            ...state.ui.currentPanel,
                            textureOffsetX: action.payload.offsetX,
                            textureOffsetY: action.payload.offsetY
                        }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? {
                            ...state.ui.raycastHitPanel,
                            textureOffsetX: action.payload.offsetX,
                            textureOffsetY: action.payload.offsetY
                        }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_TEXT_POSITION:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? {
                                ...panel,
                                textPositionX: action.payload.x,
                                textPositionY: action.payload.y,
                                textPositionZ: action.payload.z
                            }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? {
                            ...state.ui.result,
                            textPositionX: action.payload.x,
                            textPositionY: action.payload.y,
                            textPositionZ: action.payload.z
                        }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? {
                            ...state.ui.currentPanel,
                            textPositionX: action.payload.x,
                            textPositionY: action.payload.y,
                            textPositionZ: action.payload.z
                        }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? {
                            ...state.ui.raycastHitPanel,
                            textPositionX: action.payload.x,
                            textPositionY: action.payload.y,
                            textPositionZ: action.payload.z
                        }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_TEXT_ROTATION:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? {
                                ...panel,
                                textRotationX: action.payload.x,
                                textRotationY: action.payload.y,
                                textRotationZ: action.payload.z
                            }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? {
                            ...state.ui.result,
                            textRotationX: action.payload.x,
                            textRotationY: action.payload.y,
                            textRotationZ: action.payload.z
                        }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? {
                            ...state.ui.currentPanel,
                            textRotationX: action.payload.x,
                            textRotationY: action.payload.y,
                            textRotationZ: action.payload.z
                        }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? {
                            ...state.ui.raycastHitPanel,
                            textRotationX: action.payload.x,
                            textRotationY: action.payload.y,
                            textRotationZ: action.payload.z
                        }
                        : state.ui.raycastHitPanel,
                },
            }

        case WheelActionType.UPDATE_TEXT_SCALE:
            return {
                ...state,
                config: {
                    ...state.config,
                    panels: state.config.panels.map(panel =>
                        panel.id === action.payload.id
                            ? {
                                ...panel,
                                textScaleX: action.payload.x,
                                textScaleY: action.payload.y,
                                textScaleZ: action.payload.z
                            }
                            : panel
                    ),
                    updatedAt: new Date().toISOString(),
                },
                // Update UI state if the panel is currently displayed
                ui: {
                    ...state.ui,
                    result: state.ui.result?.id === action.payload.id
                        ? {
                            ...state.ui.result,
                            textScaleX: action.payload.x,
                            textScaleY: action.payload.y,
                            textScaleZ: action.payload.z
                        }
                        : state.ui.result,
                    currentPanel: state.ui.currentPanel?.id === action.payload.id
                        ? {
                            ...state.ui.currentPanel,
                            textScaleX: action.payload.x,
                            textScaleY: action.payload.y,
                            textScaleZ: action.payload.z
                        }
                        : state.ui.currentPanel,
                    raycastHitPanel: state.ui.raycastHitPanel?.id === action.payload.id
                        ? {
                            ...state.ui.raycastHitPanel,
                            textScaleX: action.payload.x,
                            textScaleY: action.payload.y,
                            textScaleZ: action.payload.z
                        }
                        : state.ui.raycastHitPanel,
                },
            }

        // UI Actions
        case WheelActionType.SET_SPINNING:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    isSpinning: action.payload,
                },
            }

        case WheelActionType.SET_RESULT:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    result: action.payload,
                },
            }

        case WheelActionType.SET_CURRENT_PANEL:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    currentPanel: action.payload,
                },
            }

        case WheelActionType.SET_RAYCAST_HIT_PANEL:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    raycastHitPanel: action.payload,
                },
            }

        case WheelActionType.SET_REMAINING_TIME:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    remainingTime: action.payload,
                },
            }

        case WheelActionType.SET_LOADED:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    isLoaded: action.payload,
                },
            }

        case WheelActionType.SET_CLIENT:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    isClient: action.payload,
                },
            }

        // Persistence Actions
        case WheelActionType.LOAD_CONFIG:
            return {
                ...state,
                config: action.payload,
            }

        case WheelActionType.RESET_TO_DEFAULT:
            return DEFAULT_APP_STATE

        case WheelActionType.CLEAR_STORAGE:
            return DEFAULT_APP_STATE

        default:
            return state
    }
}
