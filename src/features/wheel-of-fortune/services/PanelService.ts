import { WheelPanel } from '@/types/wheel'
import { IPanelService, ValidationError } from './interfaces'

// ============================================================================
// PANEL SERVICE IMPLEMENTATION
// ============================================================================

export class PanelService implements IPanelService {
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    createPanel(text: string, color: string): WheelPanel {
        if (!this.validateTextInput(text)) {
            throw new ValidationError('Panel text must be non-empty and less than 100 characters')
        }

        if (!this.validateColor(color)) {
            throw new ValidationError('Invalid color format')
        }

        return {
            id: this.generateId(),
            text: text.trim(),
            color,
        }
    }

    updatePanelText(panel: WheelPanel, text: string): WheelPanel {
        if (!this.validateTextInput(text)) {
            throw new ValidationError('Panel text must be non-empty and less than 100 characters')
        }

        return {
            ...panel,
            text: text.trim(),
        }
    }

    updatePanelColor(panel: WheelPanel, color: string): WheelPanel {
        if (!this.validateColor(color)) {
            throw new ValidationError('Invalid color format')
        }

        return {
            ...panel,
            color,
        }
    }

    updatePanelTexture(panel: WheelPanel, texture: string | null): WheelPanel {
        return {
            ...panel,
            texture: texture || undefined,
        }
    }

    updatePanelTextureScale(panel: WheelPanel, scale: number): WheelPanel {
        if (scale < 0.1 || scale > 3) {
            throw new ValidationError('Texture scale must be between 0.1 and 3')
        }

        return {
            ...panel,
            textureScale: scale,
        }
    }

    updatePanelTextureRotation(panel: WheelPanel, rotation: number): WheelPanel {
        if (rotation < 0 || rotation > 360) {
            throw new ValidationError('Texture rotation must be between 0 and 360 degrees')
        }

        return {
            ...panel,
            textureRotation: rotation,
        }
    }

    updatePanelTextureOffset(panel: WheelPanel, offsetX: number, offsetY: number): WheelPanel {
        if (offsetX < -1 || offsetX > 1 || offsetY < -1 || offsetY > 1) {
            throw new ValidationError('Texture offset must be between -1 and 1')
        }

        return {
            ...panel,
            textureOffsetX: offsetX,
            textureOffsetY: offsetY,
        }
    }

    updateTextPosition(panel: WheelPanel, x: number, y: number, z: number): WheelPanel {
        if (x < -2 || x > 2 || y < -2 || y > 2 || z < -2 || z > 2) {
            throw new ValidationError('Text position must be between -2 and 2')
        }

        return {
            ...panel,
            textPositionX: x,
            textPositionY: y,
            textPositionZ: z,
        }
    }

    updateTextRotation(panel: WheelPanel, x: number, y: number, z: number): WheelPanel {
        if (x < 0 || x > 360 || y < 0 || y > 360 || z < 0 || z > 360) {
            throw new ValidationError('Text rotation must be between 0 and 360 degrees')
        }

        return {
            ...panel,
            textRotationX: x,
            textRotationY: y,
            textRotationZ: z,
        }
    }

    updateTextScale(panel: WheelPanel, x: number, y: number, z: number): WheelPanel {
        if (x < 0.1 || x > 3 || y < 0.1 || y > 3 || z < 0.1 || z > 3) {
            throw new ValidationError('Text scale must be between 0.1 and 3')
        }

        return {
            ...panel,
            textScaleX: x,
            textScaleY: y,
            textScaleZ: z,
        }
    }

    validatePanel(panel: WheelPanel): boolean {
        try {
            return (
                this.validateTextInput(panel.text) &&
                this.validateColor(panel.color) &&
                (panel.textureScale === undefined || (panel.textureScale >= 0.1 && panel.textureScale <= 3)) &&
                (panel.textureRotation === undefined || (panel.textureRotation >= 0 && panel.textureRotation <= 360)) &&
                (panel.textureOffsetX === undefined || (panel.textureOffsetX >= -1 && panel.textureOffsetX <= 1)) &&
                (panel.textureOffsetY === undefined || (panel.textureOffsetY >= -1 && panel.textureOffsetY <= 1)) &&
                (panel.textPositionX === undefined || (panel.textPositionX >= -2 && panel.textPositionX <= 2)) &&
                (panel.textPositionY === undefined || (panel.textPositionY >= -2 && panel.textPositionY <= 2)) &&
                (panel.textPositionZ === undefined || (panel.textPositionZ >= -2 && panel.textPositionZ <= 2)) &&
                (panel.textRotationX === undefined || (panel.textRotationX >= 0 && panel.textRotationX <= 360)) &&
                (panel.textRotationY === undefined || (panel.textRotationY >= 0 && panel.textRotationY <= 360)) &&
                (panel.textRotationZ === undefined || (panel.textRotationZ >= 0 && panel.textRotationZ <= 360)) &&
                (panel.textScaleX === undefined || (panel.textScaleX >= 0.1 && panel.textScaleX <= 3)) &&
                (panel.textScaleY === undefined || (panel.textScaleY >= 0.1 && panel.textScaleY <= 3)) &&
                (panel.textScaleZ === undefined || (panel.textScaleZ >= 0.1 && panel.textScaleZ <= 3))
            )
        } catch {
            return false
        }
    }

    private validateTextInput(text: string): boolean {
        return typeof text === 'string' && text.trim().length > 0 && text.length <= 100
    }

    private validateColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }
}
