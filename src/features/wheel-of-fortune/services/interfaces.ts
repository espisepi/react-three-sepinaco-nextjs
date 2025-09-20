import { WheelPanel } from '@/types/wheel'

// ============================================================================
// INTERFACES FOR SERVICES (Dependency Inversion Principle)
// ============================================================================

export interface IPanelService {
    createPanel(text: string, color: string): WheelPanel
    updatePanelText(panel: WheelPanel, text: string): WheelPanel
    updatePanelColor(panel: WheelPanel, color: string): WheelPanel
    updatePanelTexture(panel: WheelPanel, texture: string | null): WheelPanel
    updatePanelTextureScale(panel: WheelPanel, scale: number): WheelPanel
    updatePanelTextureRotation(panel: WheelPanel, rotation: number): WheelPanel
    updatePanelTextureOffset(panel: WheelPanel, offsetX: number, offsetY: number): WheelPanel
    updateTextPosition(panel: WheelPanel, x: number, y: number, z: number): WheelPanel
    updateTextRotation(panel: WheelPanel, x: number, y: number, z: number): WheelPanel
    updateTextScale(panel: WheelPanel, x: number, y: number, z: number): WheelPanel
    validatePanel(panel: WheelPanel): boolean
}

export interface IColorService {
    getDefaultColors(): string[]
    getRandomColor(): string
    getNextColor(currentIndex: number): string
    validateColor(color: string): boolean
}

export interface IWheelCalculationService {
    calculateSelectedPanel(rotation: number, panels: WheelPanel[]): WheelPanel
    normalizeRotation(rotation: number): number
    calculateAnglePerSegment(panelCount: number): number
    calculateCompensatedRotation(rotation: number): number
}

export interface ITextureService {
    loadTexture(url: string): Promise<string>
    validateTextureUrl(url: string): boolean
    createTextureFromFile(file: File): Promise<string>
}

export interface IPersistenceService {
    saveConfig(config: any): boolean
    loadConfig(): any | null
    clearConfig(): boolean
    downloadConfig(config: any): boolean
    loadConfigFromFile(file: File): Promise<any | null>
    validateConfig(config: any): boolean
}

export interface IValidationService {
    validateSpinDuration(duration: number): boolean
    validateCanvasSize(width: number, height: number): boolean
    validatePanelCount(count: number): boolean
    validateTextInput(text: string): boolean
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class WheelError extends Error {
    constructor(
        message: string,
        public code: string,
        public context?: any
    ) {
        super(message)
        this.name = 'WheelError'
    }
}

export class ValidationError extends WheelError {
    constructor(message: string, context?: any) {
        super(message, 'VALIDATION_ERROR', context)
        this.name = 'ValidationError'
    }
}

export class PersistenceError extends WheelError {
    constructor(message: string, context?: any) {
        super(message, 'PERSISTENCE_ERROR', context)
        this.name = 'PersistenceError'
    }
}

export class TextureError extends WheelError {
    constructor(message: string, context?: any) {
        super(message, 'TEXTURE_ERROR', context)
        this.name = 'TextureError'
    }
}
