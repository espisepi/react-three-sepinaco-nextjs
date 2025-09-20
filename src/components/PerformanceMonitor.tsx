'use client'

import { useState, useEffect, useRef, memo } from 'react'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage?: number
  renderCount: number
  lastRenderTime: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  showDetails?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const PerformanceMonitor = memo(({
  enabled = false,
  showDetails = false,
  position = 'top-right'
}: PerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderCount: 0,
    lastRenderTime: 0
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const renderCount = useRef(0)
  const animationFrameId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!enabled) return

    const updateMetrics = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime.current

      frameCount.current++
      renderCount.current++

      // Actualizar métricas cada segundo
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime)
        const frameTime = deltaTime / frameCount.current

        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage: (performance as any).memory ?
            Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : undefined,
          renderCount: renderCount.current,
          lastRenderTime: currentTime
        }))

        frameCount.current = 0
        lastTime.current = currentTime
      }

      animationFrameId.current = requestAnimationFrame(updateMetrics)
    }

    animationFrameId.current = requestAnimationFrame(updateMetrics)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [enabled])

  if (!enabled) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'left-4 top-4'
      case 'top-right':
        return 'right-4 top-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'right-4 top-4'
    }
  }

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400'
    if (fps >= 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getFrameTimeColor = (frameTime: number) => {
    if (frameTime <= 16.67) return 'text-green-400'
    if (frameTime <= 33.33) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div className="rounded-lg border border-white/20 bg-black/80 p-3 font-mono text-sm text-white backdrop-blur-sm">
        <div className="mb-2 flex items-center space-x-2">
          <div className="size-2 animate-pulse rounded-full bg-green-400"></div>
          <span className="text-xs font-semibold">Performance</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">FPS:</span>
            <span className={`font-bold ${getFpsColor(metrics.fps)}`}>
              {metrics.fps}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Frame:</span>
            <span className={`font-bold ${getFrameTimeColor(metrics.frameTime)}`}>
              {metrics.frameTime}ms
            </span>
          </div>

          {showDetails && (
            <>
              {metrics.memoryUsage !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Memory:</span>
                  <span className="font-bold text-blue-400">
                    {metrics.memoryUsage}MB
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Renders:</span>
                <span className="font-bold text-purple-400">
                  {metrics.renderCount}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Barra de FPS visual */}
        <div className="mt-2 h-1 w-full rounded-full bg-gray-700">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${metrics.fps >= 55 ? 'bg-green-400' :
              metrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            style={{ width: `${Math.min(100, (metrics.fps / 60) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
})

PerformanceMonitor.displayName = 'PerformanceMonitor'
