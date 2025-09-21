import React, { Suspense, lazy, memo } from 'react'
import { WheelSceneProps } from '@/types/scene-manager'

/**
 * Componentes lazy-loaded para mejorar la performance
 * Solo se cargan cuando son necesarios
 */

// Lazy load de componentes pesados
const WheelSegment = lazy(() => import('./canvas/WheelSegment').then(module => ({ default: module.WheelSegment })))
const WheelPointer = lazy(() => import('./canvas/WheelPointer').then(module => ({ default: module.WheelPointer })))
const WheelCenter = lazy(() => import('./canvas/WheelCenter').then(module => ({ default: module.WheelCenter })))

// Componente de loading para los componentes lazy
const LazyLoadingFallback = memo(() => (
    // @ts-ignore - Three.js JSX elements
    <mesh>
        {/* @ts-ignore - Three.js JSX elements */}
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        {/* @ts-ignore - Three.js JSX elements */}
        <meshBasicMaterial color="#666666" />
        {/* @ts-ignore - Three.js JSX elements */}
    </mesh>
))

LazyLoadingFallback.displayName = 'LazyLoadingFallback'

/**
 * Hook para manejar lazy loading con error boundaries
 */
export const useLazyLoading = () => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)

    const handleLoad = React.useCallback(() => {
        setIsLoaded(true)
        setError(null)
    }, [])

    const handleError = React.useCallback((error: Error) => {
        setError(error)
        setIsLoaded(false)
    }, [])

    return {
        isLoaded,
        error,
        handleLoad,
        handleError
    }
}

/**
 * Componente wrapper para lazy loading con Suspense
 */
export const LazyWheelSegment = memo((props: any) => (
    <Suspense fallback={<LazyLoadingFallback />}>
        <WheelSegment {...props} />
    </Suspense>
))
LazyWheelSegment.displayName = 'LazyWheelSegment'

export const LazyWheelPointer = memo((props: any) => (
    <Suspense fallback={<LazyLoadingFallback />}>
        <WheelPointer {...props} />
    </Suspense>
))
LazyWheelPointer.displayName = 'LazyWheelPointer'

export const LazyWheelCenter = memo((props: any) => (
    <Suspense fallback={<LazyLoadingFallback />}>
        <WheelCenter {...props} />
    </Suspense>
))
LazyWheelCenter.displayName = 'LazyWheelCenter'

/**
 * Hook para precargar componentes críticos
 */
export const usePreloadComponents = () => {
    React.useEffect(() => {
        // Precargar componentes críticos en el background
        const preloadPromises = [
            import('./canvas/WheelSegment'),
            import('./canvas/WheelPointer'),
            import('./canvas/WheelCenter')
        ]

        Promise.all(preloadPromises).catch(() => {
            // Silently handle preload errors
        })
    }, [])
}

/**
 * Componente de error boundary para manejar errores de lazy loading
 */
export class LazyLoadingErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Silently handle lazy loading errors
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <LazyLoadingFallback />
        }

        return this.props.children
    }
}
