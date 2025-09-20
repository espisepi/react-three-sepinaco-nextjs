import { WheelStore, WheelAppState, WheelActionUnion, DEFAULT_APP_STATE } from './types'

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

class WheelStoreImpl implements WheelStore {
    private state: WheelAppState
    private listeners: Set<() => void> = new Set()

    constructor(initialState: WheelAppState = DEFAULT_APP_STATE) {
        this.state = initialState
    }

    getState(): WheelAppState {
        return this.state
    }

    dispatch(action: WheelActionUnion): void {
        // Import reducer dynamically to avoid circular dependencies
        import('./reducer').then(({ wheelReducer }) => {
            const newState = wheelReducer(this.state, action)

            if (newState !== this.state) {
                this.state = newState
                this.notifyListeners()
            }
        })
    }

    subscribe(listener: () => void): () => void {
        this.listeners.add(listener)

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener)
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener()
            } catch (error) {
                console.error('Error in store listener:', error)
            }
        })
    }
}

// ============================================================================
// SINGLETON STORE INSTANCE
// ============================================================================

let storeInstance: WheelStore | null = null

export function createWheelStore(initialState?: WheelAppState): WheelStore {
    if (!storeInstance) {
        storeInstance = new WheelStoreImpl(initialState)
    }
    return storeInstance
}

export function getWheelStore(): WheelStore {
    if (!storeInstance) {
        storeInstance = new WheelStoreImpl()
    }
    return storeInstance
}

// ============================================================================
// STORE UTILITIES
// ============================================================================

export function resetStore(): void {
    storeInstance = null
}

export function getStoreState(): WheelAppState {
    return getWheelStore().getState()
}

export function dispatchAction(action: WheelActionUnion): void {
    getWheelStore().dispatch(action)
}
