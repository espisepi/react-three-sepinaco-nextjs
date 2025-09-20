import { WheelPanel } from '@/types/wheel'
import { IWheelCalculationService, ValidationError } from './interfaces'

// ============================================================================
// WHEEL CALCULATION SERVICE IMPLEMENTATION
// ============================================================================

export class WheelCalculationService implements IWheelCalculationService {
    private readonly COMPENSATION_ANGLE = (2 * Math.PI) / 3 // 120 degrees compensation

    calculateSelectedPanel(rotation: number, panels: WheelPanel[]): WheelPanel {
        if (!this.validatePanelCount(panels.length)) {
            throw new ValidationError('Invalid panel count')
        }

        const normalizedRotation = this.normalizeRotation(rotation)
        const compensatedRotation = this.calculateCompensatedRotation(normalizedRotation)
        const anglePerSegment = this.calculateAnglePerSegment(panels.length)
        const selectedIndex = Math.floor(compensatedRotation / anglePerSegment) % panels.length

        return panels[selectedIndex]
    }

    normalizeRotation(rotation: number): number {
        return ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    }

    calculateAnglePerSegment(panelCount: number): number {
        if (!this.validatePanelCount(panelCount)) {
            throw new ValidationError('Panel count must be positive')
        }

        return (Math.PI * 2) / panelCount
    }

    calculateCompensatedRotation(rotation: number): number {
        return (rotation + this.COMPENSATION_ANGLE) % (Math.PI * 2)
    }

    /**
     * Calculate the exact angle for a panel at a given index
     */
    calculatePanelAngle(panelIndex: number, panelCount: number): number {
        if (!this.validatePanelCount(panelCount) || panelIndex < 0 || panelIndex >= panelCount) {
            throw new ValidationError('Invalid panel index or count')
        }

        const anglePerSegment = this.calculateAnglePerSegment(panelCount)
        return panelIndex * anglePerSegment
    }

    /**
     * Calculate the midpoint angle for a panel
     */
    calculatePanelMidpointAngle(panelIndex: number, panelCount: number): number {
        const startAngle = this.calculatePanelAngle(panelIndex, panelCount)
        const anglePerSegment = this.calculateAnglePerSegment(panelCount)
        return startAngle + anglePerSegment / 2
    }

    /**
     * Calculate rotation needed to center a specific panel
     */
    calculateRotationToCenterPanel(panelIndex: number, panelCount: number): number {
        const midpointAngle = this.calculatePanelMidpointAngle(panelIndex, panelCount)
        return -midpointAngle + this.COMPENSATION_ANGLE
    }

    /**
     * Calculate spin velocity based on duration and desired rotations
     */
    calculateSpinVelocity(duration: number, rotations: number = 3): number {
        if (duration <= 0) {
            throw new ValidationError('Duration must be positive')
        }

        if (rotations <= 0) {
            throw new ValidationError('Rotations must be positive')
        }

        return (rotations * Math.PI * 2) / duration
    }

    /**
     * Calculate deceleration curve for smooth stopping
     */
    calculateDecelerationCurve(
        initialVelocity: number,
        duration: number,
        currentTime: number
    ): number {
        if (currentTime >= duration) {
            return 0
        }

        // Use ease-out cubic curve for smooth deceleration
        const progress = currentTime / duration
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        return initialVelocity * (1 - easedProgress)
    }

    /**
     * Calculate probability distribution for weighted panels
     */
    calculateWeightedProbabilities(panels: WheelPanel[]): number[] {
        if (!this.validatePanelCount(panels.length)) {
            throw new ValidationError('Invalid panel count')
        }

        // For now, equal probability for all panels
        // This can be extended to support weighted panels
        const probability = 1 / panels.length
        return panels.map(() => probability)
    }

    /**
     * Calculate the panel that would be selected with a given rotation
     */
    calculatePanelAtRotation(rotation: number, panels: WheelPanel[]): WheelPanel | null {
        try {
            return this.calculateSelectedPanel(rotation, panels)
        } catch {
            return null
        }
    }

    /**
     * Calculate distance between two rotations (in radians)
     */
    calculateRotationDistance(rotation1: number, rotation2: number): number {
        const diff = Math.abs(rotation1 - rotation2)
        return Math.min(diff, Math.PI * 2 - diff)
    }

    /**
     * Check if a rotation is within a panel's range
     */
    isRotationInPanelRange(
        rotation: number,
        panelIndex: number,
        panelCount: number
    ): boolean {
        try {
            const normalizedRotation = this.normalizeRotation(rotation)
            const compensatedRotation = this.calculateCompensatedRotation(normalizedRotation)
            const anglePerSegment = this.calculateAnglePerSegment(panelCount)

            const startAngle = panelIndex * anglePerSegment
            const endAngle = (panelIndex + 1) * anglePerSegment

            return compensatedRotation >= startAngle && compensatedRotation < endAngle
        } catch {
            return false
        }
    }

    private validatePanelCount(count: number): boolean {
        return Number.isInteger(count) && count > 0 && count <= 100
    }
}
