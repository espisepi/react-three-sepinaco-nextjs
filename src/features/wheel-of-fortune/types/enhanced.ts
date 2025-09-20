// ============================================================================
// ENHANCED TYPE DEFINITIONS WITH STRICT VALIDATION
// ============================================================================

// ============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

export type PanelId = string & { readonly __brand: 'PanelId' }
export type ColorHex = string & { readonly __brand: 'ColorHex' }
export type TextureUrl = string & { readonly __brand: 'TextureUrl' }
export type DurationSeconds = number & { readonly __brand: 'DurationSeconds' }
export type Percentage = number & { readonly __brand: 'Percentage' }
export type ViewportHeight = number & { readonly __brand: 'ViewportHeight' }
export type AngleDegrees = number & { readonly __brand: 'AngleDegrees' }
export type ScaleFactor = number & { readonly __brand: 'ScaleFactor' }
export type OffsetValue = number & { readonly __brand: 'OffsetValue' }

// ============================================================================
// VALIDATION FUNCTIONS FOR BRANDED TYPES
// ============================================================================

export function createPanelId(id: string): PanelId {
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || id.length === 0 || id.length > 50) {
        throw new Error('Invalid panel ID format')
    }
    return id as PanelId
}

export function createColorHex(color: string): ColorHex {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        throw new Error('Invalid color hex format')
    }
    return color as ColorHex
}

export function createTextureUrl(url: string): TextureUrl {
    try {
        new URL(url)
        return url as TextureUrl
    } catch {
        throw new Error('Invalid texture URL format')
    }
}

export function createDurationSeconds(duration: number): DurationSeconds {
    if (duration <= 0 || duration > 60 || !Number.isFinite(duration)) {
        throw new Error('Invalid duration: must be between 0 and 60 seconds')
    }
    return duration as DurationSeconds
}

export function createPercentage(value: number): Percentage {
    if (value < 0 || value > 100 || !Number.isFinite(value)) {
        throw new Error('Invalid percentage: must be between 0 and 100')
    }
    return value as Percentage
}

export function createViewportHeight(value: number): ViewportHeight {
    if (value < 10 || value > 100 || !Number.isFinite(value)) {
        throw new Error('Invalid viewport height: must be between 10 and 100')
    }
    return value as ViewportHeight
}

export function createAngleDegrees(angle: number): AngleDegrees {
    if (angle < 0 || angle > 360 || !Number.isFinite(angle)) {
        throw new Error('Invalid angle: must be between 0 and 360 degrees')
    }
    return angle as AngleDegrees
}

export function createScaleFactor(scale: number): ScaleFactor {
    if (scale < 0.1 || scale > 3 || !Number.isFinite(scale)) {
        throw new Error('Invalid scale factor: must be between 0.1 and 3')
    }
    return scale as ScaleFactor
}

export function createOffsetValue(offset: number): OffsetValue {
    if (offset < -1 || offset > 1 || !Number.isFinite(offset)) {
        throw new Error('Invalid offset value: must be between -1 and 1')
    }
    return offset as OffsetValue
}

// ============================================================================
// ENHANCED WHEEL PANEL INTERFACE
// ============================================================================

export interface WheelPanel {
    readonly id: PanelId
    readonly text: string
    readonly color: ColorHex
    readonly texture?: TextureUrl
    readonly textureScale?: ScaleFactor
    readonly textureRotation?: AngleDegrees
    readonly textureOffsetX?: OffsetValue
    readonly textureOffsetY?: OffsetValue
    readonly textPositionX?: number
    readonly textPositionY?: number
    readonly textPositionZ?: number
    readonly textRotationX?: AngleDegrees
    readonly textRotationY?: AngleDegrees
    readonly textRotationZ?: AngleDegrees
    readonly textScaleX?: ScaleFactor
    readonly textScaleY?: ScaleFactor
    readonly textScaleZ?: ScaleFactor
}

// ============================================================================
// ENHANCED CONFIGURATION INTERFACE
// ============================================================================

export interface WheelConfiguration {
    readonly panels: readonly WheelPanel[]
    readonly spinDuration: DurationSeconds
    readonly enableOrbitControls: boolean
    readonly canvasWidth: Percentage
    readonly canvasHeight: ViewportHeight
    readonly version: string
    readonly createdAt: string
    readonly updatedAt: string
}

// ============================================================================
// ENHANCED UI STATE INTERFACE
// ============================================================================

export interface WheelUIState {
    readonly isSpinning: boolean
    readonly result: WheelPanel | null
    readonly currentPanel: WheelPanel | null
    readonly raycastHitPanel: WheelPanel | null
    readonly remainingTime: DurationSeconds | undefined
    readonly isLoaded: boolean
    readonly isClient: boolean
}

// ============================================================================
// ENHANCED APP STATE INTERFACE
// ============================================================================

export interface WheelAppState {
    readonly config: WheelConfiguration
    readonly ui: WheelUIState
}

// ============================================================================
// TYPE GUARDS FOR RUNTIME VALIDATION
// ============================================================================

export function isPanelId(value: unknown): value is PanelId {
    return typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value) && value.length > 0 && value.length <= 50
}

export function isColorHex(value: unknown): value is ColorHex {
    return typeof value === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
}

export function isTextureUrl(value: unknown): value is TextureUrl {
    if (typeof value !== 'string') return false
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}

export function isDurationSeconds(value: unknown): value is DurationSeconds {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 60
}

export function isPercentage(value: unknown): value is Percentage {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
}

export function isViewportHeight(value: unknown): value is ViewportHeight {
    return typeof value === 'number' && Number.isFinite(value) && value >= 10 && value <= 100
}

export function isAngleDegrees(value: unknown): value is AngleDegrees {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 360
}

export function isScaleFactor(value: unknown): value is ScaleFactor {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0.1 && value <= 3
}

export function isOffsetValue(value: unknown): value is OffsetValue {
    return typeof value === 'number' && Number.isFinite(value) && value >= -1 && value <= 1
}

export function isWheelPanel(value: unknown): value is WheelPanel {
    if (!value || typeof value !== 'object') return false

    const panel = value as Record<string, unknown>

    return (
        isPanelId(panel.id) &&
        typeof panel.text === 'string' &&
        panel.text.length > 0 &&
        panel.text.length <= 100 &&
        isColorHex(panel.color) &&
        (panel.texture === undefined || isTextureUrl(panel.texture)) &&
        (panel.textureScale === undefined || isScaleFactor(panel.textureScale)) &&
        (panel.textureRotation === undefined || isAngleDegrees(panel.textureRotation)) &&
        (panel.textureOffsetX === undefined || isOffsetValue(panel.textureOffsetX)) &&
        (panel.textureOffsetY === undefined || isOffsetValue(panel.textureOffsetY)) &&
        (panel.textPositionX === undefined || typeof panel.textPositionX === 'number') &&
        (panel.textPositionY === undefined || typeof panel.textPositionY === 'number') &&
        (panel.textPositionZ === undefined || typeof panel.textPositionZ === 'number') &&
        (panel.textRotationX === undefined || isAngleDegrees(panel.textRotationX)) &&
        (panel.textRotationY === undefined || isAngleDegrees(panel.textRotationY)) &&
        (panel.textRotationZ === undefined || isAngleDegrees(panel.textRotationZ)) &&
        (panel.textScaleX === undefined || isScaleFactor(panel.textScaleX)) &&
        (panel.textScaleY === undefined || isScaleFactor(panel.textScaleY)) &&
        (panel.textScaleZ === undefined || isScaleFactor(panel.textScaleZ))
    )
}

export function isWheelConfiguration(value: unknown): value is WheelConfiguration {
    if (!value || typeof value !== 'object') return false

    const config = value as Record<string, unknown>

    return (
        Array.isArray(config.panels) &&
        config.panels.every(isWheelPanel) &&
        isDurationSeconds(config.spinDuration) &&
        typeof config.enableOrbitControls === 'boolean' &&
        isPercentage(config.canvasWidth) &&
        isViewportHeight(config.canvasHeight) &&
        typeof config.version === 'string' &&
        typeof config.createdAt === 'string' &&
        typeof config.updatedAt === 'string'
    )
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PartialWheelPanel = Partial<Omit<WheelPanel, 'id'>> & { id: PanelId }
export type PartialWheelConfiguration = Partial<Omit<WheelConfiguration, 'panels' | 'version' | 'createdAt' | 'updatedAt'>> & {
    panels?: readonly WheelPanel[]
}

// ============================================================================
// CONSTANTS WITH STRICT TYPES
// ============================================================================

export const DEFAULT_PANEL_COUNT = 6 as const
export const MIN_PANEL_COUNT = 1 as const
export const MAX_PANEL_COUNT = 100 as const
export const MIN_SPIN_DURATION = 1 as const
export const MAX_SPIN_DURATION = 60 as const
export const MIN_CANVAS_WIDTH = 10 as const
export const MAX_CANVAS_WIDTH = 100 as const
export const MIN_CANVAS_HEIGHT = 10 as const
export const MAX_CANVAS_HEIGHT = 100 as const
export const MIN_TEXTURE_SCALE = 0.1 as const
export const MAX_TEXTURE_SCALE = 3 as const
export const MIN_ANGLE = 0 as const
export const MAX_ANGLE = 360 as const
export const MIN_OFFSET = -1 as const
export const MAX_OFFSET = 1 as const
export const MIN_TEXT_POSITION = -2 as const
export const MAX_TEXT_POSITION = 2 as const
export const MIN_TEXT_SCALE = 0.1 as const
export const MAX_TEXT_SCALE = 3 as const
