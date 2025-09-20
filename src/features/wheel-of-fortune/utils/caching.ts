// ============================================================================
// CACHING SYSTEM FOR PERFORMANCE OPTIMIZATION
// ============================================================================

// ============================================================================
// CACHE INTERFACES
// ============================================================================

export interface CacheEntry<T> {
    value: T
    timestamp: number
    ttl: number
    accessCount: number
    lastAccessed: number
}

export interface CacheOptions {
    maxSize?: number
    defaultTtl?: number
    cleanupInterval?: number
}

export interface CacheStats {
    hits: number
    misses: number
    size: number
    maxSize: number
    hitRate: number
    memoryUsage: number
}

// ============================================================================
// LRU CACHE IMPLEMENTATION
// ============================================================================

export class LRUCache<T> {
    private cache = new Map<string, CacheEntry<T>>()
    private accessOrder: string[] = []
    private hits = 0
    private misses = 0
    private readonly maxSize: number
    private readonly defaultTtl: number
    private cleanupTimer?: NodeJS.Timeout

    constructor(options: CacheOptions = {}) {
        this.maxSize = options.maxSize || 100
        this.defaultTtl = options.defaultTtl || 300000 // 5 minutes
        this.startCleanupTimer(options.cleanupInterval || 60000) // 1 minute
    }

    // ============================================================================
    // CACHE OPERATIONS
    // ============================================================================

    set(key: string, value: T, ttl?: number): void {
        const now = Date.now()
        const entry: CacheEntry<T> = {
            value,
            timestamp: now,
            ttl: ttl || this.defaultTtl,
            accessCount: 0,
            lastAccessed: now,
        }

        // Remove existing entry if it exists
        if (this.cache.has(key)) {
            this.removeFromAccessOrder(key)
        }

        // Add new entry
        this.cache.set(key, entry)
        this.addToAccessOrder(key)

        // Evict if over capacity
        if (this.cache.size > this.maxSize) {
            this.evictLRU()
        }
    }

    get(key: string): T | null {
        const entry = this.cache.get(key)

        if (!entry) {
            this.misses++
            return null
        }

        const now = Date.now()

        // Check if expired
        if (now - entry.timestamp > entry.ttl) {
            this.delete(key)
            this.misses++
            return null
        }

        // Update access info
        entry.accessCount++
        entry.lastAccessed = now
        this.hits++

        // Move to end of access order (most recently used)
        this.removeFromAccessOrder(key)
        this.addToAccessOrder(key)

        return entry.value
    }

    has(key: string): boolean {
        const entry = this.cache.get(key)

        if (!entry) {
            return false
        }

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.delete(key)
            return false
        }

        return true
    }

    delete(key: string): boolean {
        const deleted = this.cache.delete(key)
        if (deleted) {
            this.removeFromAccessOrder(key)
        }
        return deleted
    }

    clear(): void {
        this.cache.clear()
        this.accessOrder = []
        this.hits = 0
        this.misses = 0
    }

    // ============================================================================
    // CACHE MANAGEMENT
    // ============================================================================

    private evictLRU(): void {
        if (this.accessOrder.length === 0) return

        const lruKey = this.accessOrder[0]
        this.delete(lruKey)
    }

    private addToAccessOrder(key: string): void {
        this.accessOrder.push(key)
    }

    private removeFromAccessOrder(key: string): void {
        const index = this.accessOrder.indexOf(key)
        if (index > -1) {
            this.accessOrder.splice(index, 1)
        }
    }

    private startCleanupTimer(interval: number): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanup()
        }, interval)
    }

    private cleanup(): void {
        const now = Date.now()
        const expiredKeys: string[] = []

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                expiredKeys.push(key)
            }
        }

        expiredKeys.forEach(key => this.delete(key))
    }

    // ============================================================================
    // CACHE STATISTICS
    // ============================================================================

    getStats(): CacheStats {
        const totalRequests = this.hits + this.misses
        const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0

        // Estimate memory usage (rough calculation)
        let memoryUsage = 0
        for (const [key, entry] of this.cache.entries()) {
            memoryUsage += key.length * 2 // UTF-16 characters
            memoryUsage += JSON.stringify(entry).length * 2
        }

        return {
            hits: this.hits,
            misses: this.misses,
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate,
            memoryUsage,
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    keys(): string[] {
        return Array.from(this.cache.keys())
    }

    values(): T[] {
        return Array.from(this.cache.values()).map(entry => entry.value)
    }

    entries(): Array<[string, T]> {
        return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value])
    }

    size(): number {
        return this.cache.size
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================

    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer)
        }
        this.clear()
    }
}

// ============================================================================
// CACHE MANAGER
// ============================================================================

export class CacheManager {
    private static instance: CacheManager
    private caches = new Map<string, LRUCache<any>>()

    private constructor() { }

    static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager()
        }
        return CacheManager.instance
    }

    createCache<T>(name: string, options: CacheOptions = {}): LRUCache<T> {
        if (this.caches.has(name)) {
            throw new Error(`Cache '${name}' already exists`)
        }

        const cache = new LRUCache<T>(options)
        this.caches.set(name, cache)
        return cache
    }

    getCache<T>(name: string): LRUCache<T> | null {
        return this.caches.get(name) || null
    }

    deleteCache(name: string): boolean {
        const cache = this.caches.get(name)
        if (cache) {
            cache.destroy()
            return this.caches.delete(name)
        }
        return false
    }

    getAllStats(): Record<string, CacheStats> {
        const stats: Record<string, CacheStats> = {}

        for (const [name, cache] of this.caches.entries()) {
            stats[name] = cache.getStats()
        }

        return stats
    }

    clearAll(): void {
        for (const cache of this.caches.values()) {
            cache.clear()
        }
    }

    destroyAll(): void {
        for (const cache of this.caches.values()) {
            cache.destroy()
        }
        this.caches.clear()
    }
}

// ============================================================================
// SPECIALIZED CACHES
// ============================================================================

export class TextureCache extends LRUCache<string> {
    constructor() {
        super({
            maxSize: 50, // Limit texture cache size
            defaultTtl: 600000, // 10 minutes
            cleanupInterval: 300000, // 5 minutes
        })
    }

    async loadTexture(url: string): Promise<string> {
        const cached = this.get(url)
        if (cached) {
            return cached
        }

        try {
            // Simulate texture loading
            const texture = await this.loadTextureFromUrl(url)
            this.set(url, texture)
            return texture
        } catch (error) {
            throw new Error(`Failed to load texture: ${url}`)
        }
    }

    private async loadTextureFromUrl(url: string): Promise<string> {
        // This would be implemented with actual texture loading logic
        return new Promise((resolve) => {
            setTimeout(() => resolve(url), 100)
        })
    }
}

export class CalculationCache extends LRUCache<number> {
    constructor() {
        super({
            maxSize: 1000, // More calculations can be cached
            defaultTtl: 300000, // 5 minutes
            cleanupInterval: 60000, // 1 minute
        })
    }

    calculate(key: string, calculator: () => number): number {
        const cached = this.get(key)
        if (cached !== null) {
            return cached
        }

        const result = calculator()
        this.set(key, result)
        return result
    }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const cacheManager = CacheManager.getInstance()

export function createCache<T>(name: string, options?: CacheOptions): LRUCache<T> {
    return cacheManager.createCache<T>(name, options)
}

export function getCache<T>(name: string): LRUCache<T> | null {
    return cacheManager.getCache<T>(name)
}

export function deleteCache(name: string): boolean {
    return cacheManager.deleteCache(name)
}

export function getCacheStats(): Record<string, CacheStats> {
    return cacheManager.getAllStats()
}
