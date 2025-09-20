import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react'

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// THROTTLE HOOK
// ============================================================================

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now())

  return useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    }) as T,
    [callback, delay]
  )
}

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T } | undefined>(undefined)

  if (!ref.current || !areEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() }
  }

  return ref.current.value
}

function areEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i])) return false
  }

  return true
}

function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false
      }
      return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!isEqual(a[key], b[key])) return false
    }

    return true
  }

  return false
}

// ============================================================================
// PERFORMANCE MONITORING HOOK
// ============================================================================

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef(Date.now())

  useEffect(() => {
    renderCount.current += 1
    const currentTime = Date.now()
    const timeSinceLastRender = currentTime - lastRenderTime.current

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        timeSinceLastRender: `${timeSinceLastRender}ms`,
        timestamp: new Date().toISOString()
      })
    }

    lastRenderTime.current = currentTime
  })

  return {
    renderCount: renderCount.current,
    getRenderFrequency: () => {
      const now = Date.now()
      const timeSinceLastRender = now - lastRenderTime.current
      return timeSinceLastRender
    }
  }
}

// ============================================================================
// MEMORY OPTIMIZATION HOOKS
// ============================================================================

export function useMemoryOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback)
  const depsRef = useRef(deps)

  // Update callback ref only when deps change
  if (!areEqual(depsRef.current, deps)) {
    callbackRef.current = callback
    depsRef.current = deps
  }

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    []
  )
}

export function useStableValue<T>(value: T): T {
  const ref = useRef<T>(value)

  if (!isEqual(ref.current, value)) {
    ref.current = value
  }

  return ref.current
}

// ============================================================================
// BATCH UPDATES HOOK
// ============================================================================

export function useBatchedUpdates() {
  const updatesRef = useRef<(() => void)[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const batchUpdate = useCallback((update: () => void) => {
    updatesRef.current.push(update)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const updates = updatesRef.current
      updatesRef.current = []

      // Execute all updates in a single batch
      updates.forEach(updateFn => updateFn())
    }, 0)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return batchUpdate
}

// ============================================================================
// VIRTUALIZATION UTILITIES
// ============================================================================

export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    visibleRange
  }
}

// ============================================================================
// LAZY LOADING HOOK
// ============================================================================

export function useLazyLoad<T>(
  loadFunction: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const loadedRef = useRef(false)

  const load = useCallback(async () => {
    if (loadedRef.current) return

    setLoading(true)
    setError(null)

    try {
      const result = await loadFunction()
      setData(result)
      loadedRef.current = true
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}

// ============================================================================
// PERFORMANCE PROFILER COMPONENT
// ============================================================================

interface PerformanceProfilerProps {
  children: React.ReactNode
  name: string
  threshold?: number
}

export function PerformanceProfiler({
  children,
  name,
  threshold = 16 // 60fps threshold
}: PerformanceProfilerProps) {
  const startTime = useRef<number | undefined>(undefined)
  const endTime = useRef<number | undefined>(undefined)

  useEffect(() => {
    startTime.current = performance.now()

    return () => {
      endTime.current = performance.now()

      if (startTime.current && endTime.current) {
        const duration = endTime.current - startTime.current

        if (duration > threshold && process.env.NODE_ENV === 'development') {
          console.warn(
            `[Performance] ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
          )
        }
      }
    }
  }, [name, threshold])

  return React.createElement(React.Fragment, null, children)
}

// ============================================================================
// MEMORY LEAK DETECTION
// ============================================================================

export function useMemoryLeakDetection(componentName: string) {
  const mountedRef = useRef(true)
  const cleanupFunctionsRef = useRef<(() => void)[]>([])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false

      // Run all cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          console.error(`[Memory Leak] Cleanup error in ${componentName}:`, error)
        }
      })

      cleanupFunctionsRef.current = []
    }
  }, [componentName])

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctionsRef.current.push(cleanup)
  }, [])

  const isMounted = useCallback(() => mountedRef.current, [])

  return { addCleanup, isMounted }
}
