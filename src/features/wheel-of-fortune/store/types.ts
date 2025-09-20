import { WheelPanel } from '@/types/wheel'

// ============================================================================
// STATE TYPES
// ============================================================================

export interface WheelState {
  panels: WheelPanel[]
  spinDuration: number
  enableOrbitControls: boolean
  canvasWidth: number
  canvasHeight: number
  version: string
  createdAt: string
  updatedAt: string
}

export interface WheelUIState {
  isSpinning: boolean
  result: WheelPanel | null
  currentPanel: WheelPanel | null
  raycastHitPanel: WheelPanel | null
  remainingTime: number | undefined
  isLoaded: boolean
  isClient: boolean
}

export interface WheelAppState {
  config: WheelState
  ui: WheelUIState
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export enum WheelActionType {
  // Configuration Actions
  UPDATE_CONFIG = 'UPDATE_CONFIG',
  UPDATE_PANELS = 'UPDATE_PANELS',
  UPDATE_SPIN_DURATION = 'UPDATE_SPIN_DURATION',
  UPDATE_ORBIT_CONTROLS = 'UPDATE_ORBIT_CONTROLS',
  UPDATE_CANVAS_SIZE = 'UPDATE_CANVAS_SIZE',

  // Panel Actions
  ADD_PANEL = 'ADD_PANEL',
  REMOVE_PANEL = 'REMOVE_PANEL',
  UPDATE_PANEL_TEXT = 'UPDATE_PANEL_TEXT',
  UPDATE_PANEL_COLOR = 'UPDATE_PANEL_COLOR',
  UPDATE_PANEL_TEXTURE = 'UPDATE_PANEL_TEXTURE',
  UPDATE_PANEL_TEXTURE_SCALE = 'UPDATE_PANEL_TEXTURE_SCALE',
  UPDATE_PANEL_TEXTURE_ROTATION = 'UPDATE_PANEL_TEXTURE_ROTATION',
  UPDATE_PANEL_TEXTURE_OFFSET = 'UPDATE_PANEL_TEXTURE_OFFSET',
  UPDATE_TEXT_POSITION = 'UPDATE_TEXT_POSITION',
  UPDATE_TEXT_ROTATION = 'UPDATE_TEXT_ROTATION',
  UPDATE_TEXT_SCALE = 'UPDATE_TEXT_SCALE',

  // UI Actions
  SET_SPINNING = 'SET_SPINNING',
  SET_RESULT = 'SET_RESULT',
  SET_CURRENT_PANEL = 'SET_CURRENT_PANEL',
  SET_RAYCAST_HIT_PANEL = 'SET_RAYCAST_HIT_PANEL',
  SET_REMAINING_TIME = 'SET_REMAINING_TIME',
  SET_LOADED = 'SET_LOADED',
  SET_CLIENT = 'SET_CLIENT',

  // Persistence Actions
  LOAD_CONFIG = 'LOAD_CONFIG',
  RESET_TO_DEFAULT = 'RESET_TO_DEFAULT',
  CLEAR_STORAGE = 'CLEAR_STORAGE',
}

// ============================================================================
// ACTION INTERFACES
// ============================================================================

export interface WheelAction {
  type: WheelActionType
  payload?: any
}

export interface UpdateConfigAction extends WheelAction {
  type: WheelActionType.UPDATE_CONFIG
  payload: Partial<WheelState>
}

export interface UpdatePanelsAction extends WheelAction {
  type: WheelActionType.UPDATE_PANELS
  payload: WheelPanel[]
}

export interface UpdateSpinDurationAction extends WheelAction {
  type: WheelActionType.UPDATE_SPIN_DURATION
  payload: number
}

export interface UpdateOrbitControlsAction extends WheelAction {
  type: WheelActionType.UPDATE_ORBIT_CONTROLS
  payload: boolean
}

export interface UpdateCanvasSizeAction extends WheelAction {
  type: WheelActionType.UPDATE_CANVAS_SIZE
  payload: { width: number; height: number }
}

export interface AddPanelAction extends WheelAction {
  type: WheelActionType.ADD_PANEL
  payload: WheelPanel
}

export interface RemovePanelAction extends WheelAction {
  type: WheelActionType.REMOVE_PANEL
  payload: string // panel id
}

export interface UpdatePanelTextAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_TEXT
  payload: { id: string; text: string }
}

export interface UpdatePanelColorAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_COLOR
  payload: { id: string; color: string }
}

export interface UpdatePanelTextureAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_TEXTURE
  payload: { id: string; texture: string | null }
}

export interface UpdatePanelTextureScaleAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_TEXTURE_SCALE
  payload: { id: string; scale: number }
}

export interface UpdatePanelTextureRotationAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_TEXTURE_ROTATION
  payload: { id: string; rotation: number }
}

export interface UpdatePanelTextureOffsetAction extends WheelAction {
  type: WheelActionType.UPDATE_PANEL_TEXTURE_OFFSET
  payload: { id: string; offsetX: number; offsetY: number }
}

export interface UpdateTextPositionAction extends WheelAction {
  type: WheelActionType.UPDATE_TEXT_POSITION
  payload: { id: string; x: number; y: number; z: number }
}

export interface UpdateTextRotationAction extends WheelAction {
  type: WheelActionType.UPDATE_TEXT_ROTATION
  payload: { id: string; x: number; y: number; z: number }
}

export interface UpdateTextScaleAction extends WheelAction {
  type: WheelActionType.UPDATE_TEXT_SCALE
  payload: { id: string; x: number; y: number; z: number }
}

export interface SetSpinningAction extends WheelAction {
  type: WheelActionType.SET_SPINNING
  payload: boolean
}

export interface SetResultAction extends WheelAction {
  type: WheelActionType.SET_RESULT
  payload: WheelPanel | null
}

export interface SetCurrentPanelAction extends WheelAction {
  type: WheelActionType.SET_CURRENT_PANEL
  payload: WheelPanel | null
}

export interface SetRaycastHitPanelAction extends WheelAction {
  type: WheelActionType.SET_RAYCAST_HIT_PANEL
  payload: WheelPanel | null
}

export interface SetRemainingTimeAction extends WheelAction {
  type: WheelActionType.SET_REMAINING_TIME
  payload: number | undefined
}

export interface SetLoadedAction extends WheelAction {
  type: WheelActionType.SET_LOADED
  payload: boolean
}

export interface SetClientAction extends WheelAction {
  type: WheelActionType.SET_CLIENT
  payload: boolean
}

export interface LoadConfigAction extends WheelAction {
  type: WheelActionType.LOAD_CONFIG
  payload: WheelState
}

export interface ResetToDefaultAction extends WheelAction {
  type: WheelActionType.RESET_TO_DEFAULT
}

export interface ClearStorageAction extends WheelAction {
  type: WheelActionType.CLEAR_STORAGE
}

// ============================================================================
// UNION TYPE FOR ALL ACTIONS
// ============================================================================

export type WheelActionUnion =
  | UpdateConfigAction
  | UpdatePanelsAction
  | UpdateSpinDurationAction
  | UpdateOrbitControlsAction
  | UpdateCanvasSizeAction
  | AddPanelAction
  | RemovePanelAction
  | UpdatePanelTextAction
  | UpdatePanelColorAction
  | UpdatePanelTextureAction
  | UpdatePanelTextureScaleAction
  | UpdatePanelTextureRotationAction
  | UpdatePanelTextureOffsetAction
  | UpdateTextPositionAction
  | UpdateTextRotationAction
  | UpdateTextScaleAction
  | SetSpinningAction
  | SetResultAction
  | SetCurrentPanelAction
  | SetRaycastHitPanelAction
  | SetRemainingTimeAction
  | SetLoadedAction
  | SetClientAction
  | LoadConfigAction
  | ResetToDefaultAction
  | ClearStorageAction

// ============================================================================
// STORE INTERFACE
// ============================================================================

export interface WheelStore {
  getState(): WheelAppState
  dispatch(action: WheelActionUnion): void
  subscribe(listener: () => void): () => void
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_WHEEL_STATE: WheelState = {
  panels: [
    { id: '1', text: 'Premio 1', color: '#FF4444' },
    { id: '2', text: 'Premio 2', color: '#00AA44' },
    { id: '3', text: 'Premio 3', color: '#0066FF' },
    { id: '4', text: 'Premio 4', color: '#FF8800' },
    { id: '5', text: 'Premio 5', color: '#8800FF' },
    { id: '6', text: 'Premio 6', color: '#00CCCC' },
  ],
  spinDuration: 3,
  enableOrbitControls: false,
  canvasWidth: 100,
  canvasHeight: 50,
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const DEFAULT_UI_STATE: WheelUIState = {
  isSpinning: false,
  result: null,
  currentPanel: null,
  raycastHitPanel: null,
  remainingTime: undefined,
  isLoaded: false,
  isClient: false,
}

export const DEFAULT_APP_STATE: WheelAppState = {
  config: DEFAULT_WHEEL_STATE,
  ui: DEFAULT_UI_STATE,
}
