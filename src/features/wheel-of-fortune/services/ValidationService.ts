import { IValidationService, ValidationError } from './interfaces'

// ============================================================================
// VALIDATION SERVICE IMPLEMENTATION
// ============================================================================

export class ValidationService implements IValidationService {
    validateSpinDuration(duration: number): boolean {
        return (
            typeof duration === 'number' &&
            !isNaN(duration) &&
            duration > 0 &&
            duration <= 60 &&
            Number.isFinite(duration)
        )
    }

    validateCanvasSize(width: number, height: number): boolean {
        return (
            typeof width === 'number' &&
            typeof height === 'number' &&
            !isNaN(width) &&
            !isNaN(height) &&
            Number.isFinite(width) &&
            Number.isFinite(height) &&
            width >= 10 &&
            width <= 200 &&
            height >= 10 &&
            height <= 200
        )
    }

    validatePanelCount(count: number): boolean {
        return (
            typeof count === 'number' &&
            !isNaN(count) &&
            Number.isInteger(count) &&
            count > 0 &&
            count <= 100
        )
    }

    validateTextInput(text: string): boolean {
        return (
            typeof text === 'string' &&
            text.trim().length > 0 &&
            text.length <= 100 &&
            text.trim().length <= 100
        )
    }

    /**
     * Validate color format (hex)
     */
    validateColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }

    /**
     * Validate texture scale
     */
    validateTextureScale(scale: number): boolean {
        return (
            typeof scale === 'number' &&
            !isNaN(scale) &&
            Number.isFinite(scale) &&
            scale >= 0.1 &&
            scale <= 3
        )
    }

    /**
     * Validate texture rotation
     */
    validateTextureRotation(rotation: number): boolean {
        return (
            typeof rotation === 'number' &&
            !isNaN(rotation) &&
            Number.isFinite(rotation) &&
            rotation >= 0 &&
            rotation <= 360
        )
    }

    /**
     * Validate texture offset
     */
    validateTextureOffset(offset: number): boolean {
        return (
            typeof offset === 'number' &&
            !isNaN(offset) &&
            Number.isFinite(offset) &&
            offset >= -1 &&
            offset <= 1
        )
    }

    /**
     * Validate text position
     */
    validateTextPosition(position: number): boolean {
        return (
            typeof position === 'number' &&
            !isNaN(position) &&
            Number.isFinite(position) &&
            position >= -2 &&
            position <= 2
        )
    }

    /**
     * Validate text rotation
     */
    validateTextRotation(rotation: number): boolean {
        return (
            typeof rotation === 'number' &&
            !isNaN(rotation) &&
            Number.isFinite(rotation) &&
            rotation >= 0 &&
            rotation <= 360
        )
    }

    /**
     * Validate text scale
     */
    validateTextScale(scale: number): boolean {
        return (
            typeof scale === 'number' &&
            !isNaN(scale) &&
            Number.isFinite(scale) &&
            scale >= 0.1 &&
            scale <= 3
        )
    }

    /**
     * Validate panel ID format
     */
    validatePanelId(id: string): boolean {
        return (
            typeof id === 'string' &&
            id.trim().length > 0 &&
            id.length <= 50 &&
            /^[a-zA-Z0-9_-]+$/.test(id)
        )
    }

    /**
     * Validate configuration object
     */
    validateConfiguration(config: any): boolean {
        if (!config || typeof config !== 'object') {
            return false
        }

        // Check required fields
        const requiredFields = ['panels', 'spinDuration', 'enableOrbitControls', 'canvasWidth', 'canvasHeight']
        for (const field of requiredFields) {
            if (!(field in config)) {
                return false
            }
        }

        // Validate panels array
        if (!Array.isArray(config.panels)) {
            return false
        }

        if (!this.validatePanelCount(config.panels.length)) {
            return false
        }

        // Validate each panel
        for (const panel of config.panels) {
            if (!this.validatePanel(panel)) {
                return false
            }
        }

        // Validate other fields
        if (!this.validateSpinDuration(config.spinDuration)) {
            return false
        }

        if (typeof config.enableOrbitControls !== 'boolean') {
            return false
        }

        if (!this.validateCanvasSize(config.canvasWidth, config.canvasHeight)) {
            return false
        }

        return true
    }

    /**
     * Validate individual panel
     */
    validatePanel(panel: any): boolean {
        if (!panel || typeof panel !== 'object') {
            return false
        }

        // Required fields
        if (!this.validatePanelId(panel.id)) {
            return false
        }

        if (!this.validateTextInput(panel.text)) {
            return false
        }

        if (!this.validateColor(panel.color)) {
            return false
        }

        // Optional fields validation
        if (panel.texture !== undefined && panel.texture !== null && typeof panel.texture !== 'string') {
            return false
        }

        if (panel.textureScale !== undefined && !this.validateTextureScale(panel.textureScale)) {
            return false
        }

        if (panel.textureRotation !== undefined && !this.validateTextureRotation(panel.textureRotation)) {
            return false
        }

        if (panel.textureOffsetX !== undefined && !this.validateTextureOffset(panel.textureOffsetX)) {
            return false
        }

        if (panel.textureOffsetY !== undefined && !this.validateTextureOffset(panel.textureOffsetY)) {
            return false
        }

        if (panel.textPositionX !== undefined && !this.validateTextPosition(panel.textPositionX)) {
            return false
        }

        if (panel.textPositionY !== undefined && !this.validateTextPosition(panel.textPositionY)) {
            return false
        }

        if (panel.textPositionZ !== undefined && !this.validateTextPosition(panel.textPositionZ)) {
            return false
        }

        if (panel.textRotationX !== undefined && !this.validateTextRotation(panel.textRotationX)) {
            return false
        }

        if (panel.textRotationY !== undefined && !this.validateTextRotation(panel.textRotationY)) {
            return false
        }

        if (panel.textRotationZ !== undefined && !this.validateTextRotation(panel.textRotationZ)) {
            return false
        }

        if (panel.textScaleX !== undefined && !this.validateTextScale(panel.textScaleX)) {
            return false
        }

        if (panel.textScaleY !== undefined && !this.validateTextScale(panel.textScaleY)) {
            return false
        }

        if (panel.textScaleZ !== undefined && !this.validateTextScale(panel.textScaleZ)) {
            return false
        }

        return true
    }

    /**
     * Validate file for upload
     */
    validateFile(file: File): boolean {
        if (!file || !(file instanceof File)) {
            return false
        }

        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        const maxSize = 10 * 1024 * 1024 // 10MB

        return (
            supportedTypes.includes(file.type) &&
            file.size > 0 &&
            file.size <= maxSize &&
            file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
        )
    }

    /**
     * Validate URL format
     */
    validateUrl(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Validate numeric range
     */
    validateNumericRange(value: number, min: number, max: number): boolean {
        return (
            typeof value === 'number' &&
            !isNaN(value) &&
            Number.isFinite(value) &&
            value >= min &&
            value <= max
        )
    }

    /**
     * Validate positive integer
     */
    validatePositiveInteger(value: number): boolean {
        return (
            typeof value === 'number' &&
            !isNaN(value) &&
            Number.isInteger(value) &&
            value > 0
        )
    }

    /**
     * Validate non-negative number
     */
    validateNonNegativeNumber(value: number): boolean {
        return (
            typeof value === 'number' &&
            !isNaN(value) &&
            Number.isFinite(value) &&
            value >= 0
        )
    }
}
