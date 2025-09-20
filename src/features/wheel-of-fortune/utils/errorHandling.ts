import { WheelError, ValidationError, PersistenceError, TextureError } from '../services/interfaces'

// ============================================================================
// ERROR HANDLING SYSTEM
// ============================================================================

export interface ErrorContext {
    component?: string
    action?: string
    data?: any
    timestamp?: string
    userId?: string
    sessionId?: string
}

export interface ErrorReport {
    error: Error
    context: ErrorContext
    severity: 'low' | 'medium' | 'high' | 'critical'
    recoverable: boolean
    userMessage: string
    technicalMessage: string
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export class ErrorHandler {
    private static instance: ErrorHandler
    private errorLog: ErrorReport[] = []
    private maxLogSize = 100

    private constructor() { }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler()
        }
        return ErrorHandler.instance
    }

    // ============================================================================
    // ERROR REPORTING METHODS
    // ============================================================================

    reportError(
        error: Error,
        context: ErrorContext = {},
        severity: ErrorReport['severity'] = 'medium',
        recoverable: boolean = true
    ): ErrorReport {
        const errorReport: ErrorReport = {
            error,
            context: {
                ...context,
                timestamp: new Date().toISOString(),
            },
            severity,
            recoverable,
            userMessage: this.getUserMessage(error),
            technicalMessage: this.getTechnicalMessage(error),
        }

        this.addToLog(errorReport)
        this.logToConsole(errorReport)

        if (severity === 'critical') {
            this.reportToExternalService(errorReport)
        }

        return errorReport
    }

    reportValidationError(
        message: string,
        context: ErrorContext = {},
        data?: any
    ): ValidationError {
        const error = new ValidationError(message, data)
        this.reportError(error, context, 'medium', true)
        return error
    }

    reportPersistenceError(
        message: string,
        context: ErrorContext = {},
        data?: any
    ): PersistenceError {
        const error = new PersistenceError(message, data)
        this.reportError(error, context, 'high', true)
        return error
    }

    reportTextureError(
        message: string,
        context: ErrorContext = {},
        data?: any
    ): TextureError {
        const error = new TextureError(message, data)
        this.reportError(error, context, 'medium', true)
        return error
    }

    reportWheelError(
        message: string,
        code: string,
        context: ErrorContext = {},
        data?: any
    ): WheelError {
        const error = new WheelError(message, code, data)
        this.reportError(error, context, 'high', true)
        return error
    }

    // ============================================================================
    // ERROR RECOVERY METHODS
    // ============================================================================

    async handleErrorWithRecovery<T>(
        operation: () => Promise<T>,
        fallback: () => T,
        context: ErrorContext = {}
    ): Promise<T> {
        try {
            return await operation()
        } catch (error) {
            const errorReport = this.reportError(
                error instanceof Error ? error : new Error(String(error)),
                context,
                'medium',
                true
            )

            if (errorReport.recoverable) {
                console.warn('Operation failed, using fallback:', errorReport.technicalMessage)
                return fallback()
            } else {
                throw error
            }
        }
    }

    async handleCriticalError<T>(
        operation: () => Promise<T>,
        context: ErrorContext = {}
    ): Promise<T> {
        try {
            return await operation()
        } catch (error) {
            const errorReport = this.reportError(
                error instanceof Error ? error : new Error(String(error)),
                context,
                'critical',
                false
            )

            // For critical errors, we might want to reset the application state
            this.handleCriticalFailure(errorReport)
            throw error
        }
    }

    // ============================================================================
    // ERROR ANALYSIS METHODS
    // ============================================================================

    getErrorStats(): {
        total: number
        bySeverity: Record<ErrorReport['severity'], number>
        byType: Record<string, number>
        recent: ErrorReport[]
    } {
        const bySeverity = this.errorLog.reduce((acc, report) => {
            acc[report.severity] = (acc[report.severity] || 0) + 1
            return acc
        }, {} as Record<ErrorReport['severity'], number>)

        const byType = this.errorLog.reduce((acc, report) => {
            const type = report.error.constructor.name
            acc[type] = (acc[type] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const recent = this.errorLog.slice(-10)

        return {
            total: this.errorLog.length,
            bySeverity,
            byType,
            recent,
        }
    }

    getErrorsByComponent(component: string): ErrorReport[] {
        return this.errorLog.filter(report => report.context.component === component)
    }

    getErrorsBySeverity(severity: ErrorReport['severity']): ErrorReport[] {
        return this.errorLog.filter(report => report.severity === severity)
    }

    // ============================================================================
    // PRIVATE METHODS
    // ============================================================================

    private addToLog(errorReport: ErrorReport): void {
        this.errorLog.push(errorReport)

        // Keep only the most recent errors
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize)
        }
    }

    private logToConsole(errorReport: ErrorReport): void {
        const logLevel = this.getLogLevel(errorReport.severity)
        const message = `[${errorReport.context.component || 'Unknown'}] ${errorReport.technicalMessage}`

        switch (logLevel) {
            case 'error':
                console.error(message, errorReport.error, errorReport.context)
                break
            case 'warn':
                console.warn(message, errorReport.error, errorReport.context)
                break
            case 'info':
                console.info(message, errorReport.error, errorReport.context)
                break
            default:
                console.log(message, errorReport.error, errorReport.context)
        }
    }

    private getLogLevel(severity: ErrorReport['severity']): 'error' | 'warn' | 'info' | 'log' {
        switch (severity) {
            case 'critical':
            case 'high':
                return 'error'
            case 'medium':
                return 'warn'
            case 'low':
                return 'info'
            default:
                return 'log'
        }
    }

    private getUserMessage(error: Error): string {
        if (error instanceof ValidationError) {
            return 'Los datos ingresados no son válidos. Por favor, verifica la información.'
        }

        if (error instanceof PersistenceError) {
            return 'Error al guardar o cargar datos. Intenta nuevamente.'
        }

        if (error instanceof TextureError) {
            return 'Error al procesar la imagen. Verifica que el archivo sea válido.'
        }

        if (error instanceof WheelError) {
            switch (error.code) {
                case 'VALIDATION_ERROR':
                    return 'Los datos ingresados no son válidos.'
                case 'PERSISTENCE_ERROR':
                    return 'Error al guardar o cargar datos.'
                case 'TEXTURE_ERROR':
                    return 'Error al procesar la imagen.'
                default:
                    return 'Ha ocurrido un error inesperado.'
            }
        }

        return 'Ha ocurrido un error inesperado. Intenta nuevamente.'
    }

    private getTechnicalMessage(error: Error): string {
        return `${error.constructor.name}: ${error.message}`
    }

    private reportToExternalService(errorReport: ErrorReport): void {
        // In a real application, you would send this to an external error tracking service
        // like Sentry, LogRocket, or Bugsnag
        console.error('CRITICAL ERROR - Should be reported to external service:', errorReport)
    }

    private handleCriticalFailure(errorReport: ErrorReport): void {
        // For critical errors, we might want to:
        // 1. Reset the application state
        // 2. Show an error boundary
        // 3. Redirect to a safe state
        console.error('Critical failure detected:', errorReport)

        // Example: Reset to default state
        // This would be implemented based on your application's needs
    }

    // ============================================================================
    // CLEANUP METHODS
    // ============================================================================

    clearErrorLog(): void {
        this.errorLog = []
    }

    exportErrorLog(): ErrorReport[] {
        return [...this.errorLog]
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const errorHandler = ErrorHandler.getInstance()

export function reportError(
    error: Error,
    context: ErrorContext = {},
    severity: ErrorReport['severity'] = 'medium'
): ErrorReport {
    return errorHandler.reportError(error, context, severity)
}

export function reportValidationError(
    message: string,
    context: ErrorContext = {},
    data?: any
): ValidationError {
    return errorHandler.reportValidationError(message, context, data)
}

export function reportPersistenceError(
    message: string,
    context: ErrorContext = {},
    data?: any
): PersistenceError {
    return errorHandler.reportPersistenceError(message, context, data)
}

export function reportTextureError(
    message: string,
    context: ErrorContext = {},
    data?: any
): TextureError {
    return errorHandler.reportTextureError(message, context, data)
}

export function reportWheelError(
    message: string,
    code: string,
    context: ErrorContext = {},
    data?: any
): WheelError {
    return errorHandler.reportWheelError(message, code, context, data)
}

export async function handleErrorWithRecovery<T>(
    operation: () => Promise<T>,
    fallback: () => T,
    context: ErrorContext = {}
): Promise<T> {
    return errorHandler.handleErrorWithRecovery(operation, fallback, context)
}

export async function handleCriticalError<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {}
): Promise<T> {
    return errorHandler.handleCriticalError(operation, context)
}
