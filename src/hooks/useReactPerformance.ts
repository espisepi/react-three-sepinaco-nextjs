import { useEffect, useRef, useState } from 'react'

interface ReactPerformanceMetrics {
    renderCount: number
    lastRenderTime: number
    averageRenderTime: number
    maxRenderTime: number
    minRenderTime: number
}

export function useReactPerformance(componentName: string) {
    const [metrics, setMetrics] = useState<ReactPerformanceMetrics>({
        renderCount: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
        maxRenderTime: 0,
        minRenderTime: Infinity
    })

    const renderTimes = useRef<number[]>([])
    const startTime = useRef<number>(0)
    const isTracking = useRef<boolean>(false)

    useEffect(() => {
        if (!isTracking.current) {
            isTracking.current = true
            startTime.current = performance.now()
        }

        const renderStartTime = performance.now()
        const currentRenderTimes = renderTimes.current // Capturar la referencia al inicio

        return () => {
            const renderEndTime = performance.now()
            const renderTime = renderEndTime - renderStartTime

            currentRenderTimes.push(renderTime)

            // Mantener solo los últimos 100 renders para el cálculo promedio
            if (currentRenderTimes.length > 100) {
                currentRenderTimes.shift()
            }

            const averageRenderTime = currentRenderTimes.reduce((a, b) => a + b, 0) / currentRenderTimes.length
            const maxRenderTime = Math.max(...currentRenderTimes)
            const minRenderTime = Math.min(...currentRenderTimes)

            setMetrics(prev => ({
                renderCount: prev.renderCount + 1,
                lastRenderTime: renderTime,
                averageRenderTime: Math.round(averageRenderTime * 100) / 100,
                maxRenderTime: Math.round(maxRenderTime * 100) / 100,
                minRenderTime: Math.round(minRenderTime * 100) / 100
            }))
        }
    }, [])

    // Log de métricas en desarrollo
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && metrics.renderCount > 0) {
            // eslint-disable-next-line no-console
            console.log(`[Performance] ${componentName}:`, {
                renders: metrics.renderCount,
                lastRender: `${metrics.lastRenderTime}ms`,
                average: `${metrics.averageRenderTime}ms`,
                max: `${metrics.maxRenderTime}ms`,
                min: `${metrics.minRenderTime}ms`
            })
        }
    }, [metrics, componentName])

    return metrics
}

// Hook para detectar renders innecesarios
export function useRenderTracker(componentName: string, props?: any) {
    const renderCount = useRef(0)
    const prevProps = useRef(props)

    useEffect(() => {
        renderCount.current++

        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`[Render] ${componentName} rendered ${renderCount.current} times`)

            if (props && prevProps.current) {
                const changedProps = Object.keys(props).filter(
                    key => props[key] !== prevProps.current[key]
                )

                if (changedProps.length > 0) {
                    // eslint-disable-next-line no-console
                    console.log(`[Render] ${componentName} props changed:`, changedProps)
                }
            }

            prevProps.current = props
        }
    })

    return renderCount.current
}

// Hook para medir el tiempo de ejecución de funciones
export function useFunctionTimer() {
    const timers = useRef<Map<string, number>>(new Map())

    const startTimer = (name: string) => {
        timers.current.set(name, performance.now())
    }

    const endTimer = (name: string) => {
        const startTime = timers.current.get(name)
        if (startTime) {
            const duration = performance.now() - startTime
            timers.current.delete(name)

            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log(`[Timer] ${name}: ${duration.toFixed(2)}ms`)
            }

            return duration
        }
        return 0
    }

    return { startTimer, endTimer }
}
