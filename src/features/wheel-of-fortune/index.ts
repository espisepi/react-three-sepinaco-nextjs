// ============================================================================
// WHEEL OF FORTUNE - ENHANCED ARCHITECTURE EXPORTS
// ============================================================================

// ============================================================================
// STORE EXPORTS (Flux Pattern)
// ============================================================================
export * from './store'

// ============================================================================
// SERVICES EXPORTS (Dependency Inversion)
// ============================================================================
export * from './services'

// ============================================================================
// TYPES EXPORTS (Type Safety)
// ============================================================================
export * from './types/enhanced'

// ============================================================================
// COMPONENTS EXPORTS (SOLID Principles)
// ============================================================================
export { WheelControlsRefactored as WheelControls } from './components/WheelControlsRefactored'
export * from './components/ui'

// ============================================================================
// HOOKS EXPORTS
// ============================================================================
export { useWheelManager } from './hooks/useWheelManager'

// ============================================================================
// UTILITIES EXPORTS
// ============================================================================
export * from './utils/errorHandling'
export * from './utils/performance'
export * from './utils/caching'

// ============================================================================
// ARCHITECTURE OVERVIEW
// ============================================================================

/**
 * ENHANCED WHEEL OF FORTUNE ARCHITECTURE
 * 
 * This architecture follows Clean Code principles, SOLID design patterns,
 * and implements the Flux pattern for state management.
 * 
 * STRUCTURE:
 * 
 * 1. STORE (Flux Pattern)
 *    - Actions: Define all possible state changes
 *    - Reducer: Pure functions that handle state transitions
 *    - Store: Centralized state management with subscriptions
 *    - Hooks: React integration for components
 * 
 * 2. SERVICES (Dependency Inversion Principle)
 *    - Interfaces: Abstract contracts for all services
 *    - Implementations: Concrete service classes
 *    - Factory: Singleton pattern for service instantiation
 *    - Error Handling: Comprehensive error management
 * 
 * 3. COMPONENTS (Single Responsibility Principle)
 *    - UI Components: Reusable, composable UI elements
 *    - Control Components: Specialized control interfaces
 *    - Composite Components: Higher-level component compositions
 * 
 * 4. TYPES (Type Safety)
 *    - Branded Types: Type-safe identifiers and values
 *    - Type Guards: Runtime type validation
 *    - Enhanced Interfaces: Strict typing for all data structures
 * 
 * 5. UTILITIES
 *    - Error Handling: Centralized error management and reporting
 *    - Performance: Optimization hooks and monitoring
 *    - Caching: LRU cache implementation for performance
 * 
 * BENEFITS:
 * 
 * ✅ Maintainable: Clear separation of concerns
 * ✅ Testable: Dependency injection and pure functions
 * ✅ Scalable: Modular architecture that grows with requirements
 * ✅ Type-Safe: Comprehensive TypeScript coverage
 * ✅ Performant: Optimized rendering and memory usage
 * ✅ Robust: Comprehensive error handling and recovery
 * ✅ Reusable: Composable components and services
 * 
 * USAGE:
 * 
 * ```tsx
 * import { useWheelManager, WheelControls } from '@/features/wheel-of-fortune'
 * 
 * function MyWheelPage() {
 *   const wheelManager = useWheelManager()
 *   
 *   return (
 *     <div>
 *       <WheelControls />
 *       {/* Your wheel scene component */}
 * </div>
    *   )
 * }
 * ```
 */
