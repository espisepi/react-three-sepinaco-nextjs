// ============================================================================
// SERVICE EXPORTS
// ============================================================================

// Interfaces
export type {
    IPanelService,
    IColorService,
    IWheelCalculationService,
    ITextureService,
    IPersistenceService,
    IValidationService,
} from './interfaces'

export {
    WheelError,
    ValidationError,
    PersistenceError,
    TextureError,
} from './interfaces'

// Service Implementations
export { PanelService } from './PanelService'
export { ColorService } from './ColorService'
export { WheelCalculationService } from './WheelCalculationService'
export { TextureService } from './TextureService'
export { PersistenceService } from './PersistenceService'
export { ValidationService } from './ValidationService'

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export class ServiceFactory {
    private static instances: Map<string, any> = new Map()

    static getPanelService(): IPanelService {
        if (!this.instances.has('panelService')) {
            this.instances.set('panelService', new PanelService())
        }
        return this.instances.get('panelService')
    }

    static getColorService(): IColorService {
        if (!this.instances.has('colorService')) {
            this.instances.set('colorService', new ColorService())
        }
        return this.instances.get('colorService')
    }

    static getWheelCalculationService(): IWheelCalculationService {
        if (!this.instances.has('wheelCalculationService')) {
            this.instances.set('wheelCalculationService', new WheelCalculationService())
        }
        return this.instances.get('wheelCalculationService')
    }

    static getTextureService(): ITextureService {
        if (!this.instances.has('textureService')) {
            this.instances.set('textureService', new TextureService())
        }
        return this.instances.get('textureService')
    }

    static getPersistenceService(): IPersistenceService {
        if (!this.instances.has('persistenceService')) {
            this.instances.set('persistenceService', new PersistenceService())
        }
        return this.instances.get('persistenceService')
    }

    static getValidationService(): IValidationService {
        if (!this.instances.has('validationService')) {
            this.instances.set('validationService', new ValidationService())
        }
        return this.instances.get('validationService')
    }

    static resetInstances(): void {
        this.instances.clear()
    }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const panelService = ServiceFactory.getPanelService()
export const colorService = ServiceFactory.getColorService()
export const wheelCalculationService = ServiceFactory.getWheelCalculationService()
export const textureService = ServiceFactory.getTextureService()
export const persistenceService = ServiceFactory.getPersistenceService()
export const validationService = ServiceFactory.getValidationService()
