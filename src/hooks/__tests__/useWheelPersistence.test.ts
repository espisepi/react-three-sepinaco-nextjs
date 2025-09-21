import { renderHook, act } from '@testing-library/react'
import { useWheelPersistence, WheelConfiguration } from '@/hooks/useWheelPersistence'
import { WheelPanel } from '@/types/wheel'

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
})

// Mock FileReader
const mockFileReader = {
    readAsText: jest.fn(),
    result: null,
    error: null,
    onload: null,
    onerror: null,
}

Object.defineProperty(window, 'FileReader', {
    value: jest.fn(() => mockFileReader),
    writable: true,
})

describe('useWheelPersistence Hook', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue(null)
        mockFileReader.result = null
        mockFileReader.error = null
        mockFileReader.onload = null
        mockFileReader.onerror = null
    })

    describe('Initialization', () => {
        it('should initialize with default configuration when no saved config exists', () => {
            mockLocalStorage.getItem.mockReturnValue(null)

            const { result } = renderHook(() => useWheelPersistence())

            expect(result.current.config.panels).toHaveLength(6)
            expect(result.current.config.spinDuration).toBe(3)
            expect(result.current.config.enableOrbitControls).toBe(false)
            expect(result.current.config.canvasWidth).toBe(100)
            expect(result.current.config.canvasHeight).toBe(50)
            expect(result.current.isLoaded).toBe(true)
        })

        it('should load saved configuration from localStorage', () => {
            const savedConfig: WheelConfiguration = {
                panels: [
                    { id: '1', text: 'Custom Panel', color: '#FF0000' }
                ],
                spinDuration: 5,
                enableOrbitControls: true,
                canvasWidth: 200,
                canvasHeight: 100,
                blockVisibility: {
                    wheelControl: true,
                    sceneSelector: false,
                    materialSelector: true,
                },
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
            }

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedConfig))

            const { result } = renderHook(() => useWheelPersistence())

            expect(result.current.config.panels).toHaveLength(1)
            expect(result.current.config.panels[0].text).toBe('Custom Panel')
            expect(result.current.config.spinDuration).toBe(5)
            expect(result.current.config.enableOrbitControls).toBe(true)
            expect(result.current.isLoaded).toBe(true)
        })

        it('should handle invalid saved configuration gracefully', () => {
            mockLocalStorage.getItem.mockReturnValue('invalid json')

            const { result } = renderHook(() => useWheelPersistence())

            // Should fall back to default configuration
            expect(result.current.config.panels).toHaveLength(6)
            expect(result.current.isLoaded).toBe(true)
        })

        it('should handle malformed configuration structure', () => {
            const malformedConfig = {
                panels: 'not an array',
                spinDuration: 'not a number',
            }

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(malformedConfig))

            const { result } = renderHook(() => useWheelPersistence())

            // Should fall back to default configuration
            expect(result.current.config.panels).toHaveLength(6)
            expect(result.current.config.spinDuration).toBe(3)
            expect(result.current.isLoaded).toBe(true)
        })
    })

    describe('Configuration Updates', () => {
        it('should update panels', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const newPanels: WheelPanel[] = [
                { id: '1', text: 'Panel 1', color: '#FF0000' },
                { id: '2', text: 'Panel 2', color: '#00FF00' },
            ]

            act(() => {
                result.current.updatePanels(newPanels)
            })

            expect(result.current.config.panels).toEqual(newPanels)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should update spin duration', () => {
            const { result } = renderHook(() => useWheelPersistence())

            act(() => {
                result.current.updateSpinDuration(5)
            })

            expect(result.current.config.spinDuration).toBe(5)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should update orbit controls', () => {
            const { result } = renderHook(() => useWheelPersistence())

            act(() => {
                result.current.updateOrbitControls(true)
            })

            expect(result.current.config.enableOrbitControls).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should update canvas size', () => {
            const { result } = renderHook(() => useWheelPersistence())

            act(() => {
                result.current.updateCanvasSize(300, 150)
            })

            expect(result.current.config.canvasWidth).toBe(300)
            expect(result.current.config.canvasHeight).toBe(150)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should update block visibility', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const newVisibility = {
                wheelControl: false,
                sceneSelector: true,
                materialSelector: false,
            }

            act(() => {
                result.current.updateBlockVisibility(newVisibility)
            })

            expect(result.current.config.blockVisibility).toEqual(newVisibility)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should update multiple configuration properties at once', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const updates = {
                panels: [{ id: '1', text: 'Updated Panel', color: '#0000FF' }],
                spinDuration: 7,
                enableOrbitControls: true,
            }

            act(() => {
                result.current.updateConfig(updates)
            })

            expect(result.current.config.panels).toEqual(updates.panels)
            expect(result.current.config.spinDuration).toBe(7)
            expect(result.current.config.enableOrbitControls).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })
    })

    describe('Configuration Management', () => {
        it('should download configuration as JSON file', () => {
            const { result } = renderHook(() => useWheelPersistence())

            // Mock URL.createObjectURL and URL.revokeObjectURL
            const mockCreateObjectURL = jest.fn(() => 'blob:mock-url')
            const mockRevokeObjectURL = jest.fn()
            global.URL.createObjectURL = mockCreateObjectURL
            global.URL.revokeObjectURL = mockRevokeObjectURL

            // Mock document.createElement and click
            const mockAnchor = {
                href: '',
                download: '',
                click: jest.fn(),
            }
            const mockCreateElement = jest.fn(() => mockAnchor)
            document.createElement = mockCreateElement

            act(() => {
                result.current.downloadConfig()
            })

            expect(mockCreateElement).toHaveBeenCalledWith('a')
            expect(mockAnchor.download).toMatch(/ruleta-config-.*\.json/)
            expect(mockAnchor.click).toHaveBeenCalled()
            expect(mockCreateObjectURL).toHaveBeenCalled()
            expect(mockRevokeObjectURL).toHaveBeenCalled()
        })

        it('should load configuration from file', async () => {
            const { result } = renderHook(() => useWheelPersistence())

            const configToLoad: WheelConfiguration = {
                panels: [
                    { id: 'loaded', text: 'Loaded Panel', color: '#00FF00' }
                ],
                spinDuration: 8,
                enableOrbitControls: false,
                canvasWidth: 400,
                canvasHeight: 200,
                blockVisibility: {
                    wheelControl: true,
                    sceneSelector: true,
                    materialSelector: true,
                },
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
            }

            const mockFile = new File([JSON.stringify(configToLoad)], 'config.json', {
                type: 'application/json',
            })

            // Mock FileReader to simulate successful read
            mockFileReader.result = JSON.stringify(configToLoad)
            mockFileReader.readAsText.mockImplementation(() => {
                if (mockFileReader.onload) {
                    mockFileReader.onload({ target: mockFileReader } as any)
                }
            })

            await act(async () => {
                await result.current.loadConfigFromFile(mockFile)
            })

            expect(result.current.config.panels).toEqual(configToLoad.panels)
            expect(result.current.config.spinDuration).toBe(8)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should handle invalid file content', async () => {
            const { result } = renderHook(() => useWheelPersistence())

            const mockFile = new File(['invalid json'], 'config.json', {
                type: 'application/json',
            })

            // Mock FileReader to simulate error
            mockFileReader.error = new Error('Invalid JSON')
            mockFileReader.readAsText.mockImplementation(() => {
                if (mockFileReader.onerror) {
                    mockFileReader.onerror({ target: mockFileReader } as any)
                }
            })

            await act(async () => {
                await result.current.loadConfigFromFile(mockFile)
            })

            // Should not change configuration on error
            expect(result.current.config.panels).toHaveLength(6)
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
        })

        it('should reset to default configuration', () => {
            const { result } = renderHook(() => useWheelPersistence())

            // First update some configuration
            act(() => {
                result.current.updateSpinDuration(10)
            })

            expect(result.current.config.spinDuration).toBe(10)

            // Then reset
            act(() => {
                result.current.resetToDefault()
            })

            expect(result.current.config.spinDuration).toBe(3)
            expect(result.current.config.panels).toHaveLength(6)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should clear localStorage', () => {
            const { result } = renderHook(() => useWheelPersistence())

            act(() => {
                result.current.clearStorage()
            })

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('wheel-config')
        })
    })

    describe('Configuration Info', () => {
        it('should provide configuration information', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const info = result.current.getConfigInfo()

            expect(info).toHaveProperty('panelsCount')
            expect(info).toHaveProperty('spinDuration')
            expect(info).toHaveProperty('canvasSize')
            expect(info).toHaveProperty('orbitControlsEnabled')
            expect(info).toHaveProperty('createdAt')
            expect(info).toHaveProperty('updatedAt')
        })

        it('should detect when no localStorage data exists', () => {
            mockLocalStorage.getItem.mockReturnValue(null)

            const { result } = renderHook(() => useWheelPersistence())

            const info = result.current.getConfigInfo()
            expect(info.hasLocalStorageData).toBe(false)
        })
    })

    describe('Error Handling', () => {
        it('should handle localStorage errors gracefully', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('Storage quota exceeded')
            })

            const { result } = renderHook(() => useWheelPersistence())

            act(() => {
                result.current.updateSpinDuration(5)
            })

            // Should not crash, just not save to localStorage
            expect(result.current.config.spinDuration).toBe(5)
        })

        it('should handle localStorage getItem errors', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('Storage access denied')
            })

            const { result } = renderHook(() => useWheelPersistence())

            // Should fall back to default configuration
            expect(result.current.config.panels).toHaveLength(6)
            expect(result.current.isLoaded).toBe(true)
        })

        it('should handle FileReader errors', async () => {
            const { result } = renderHook(() => useWheelPersistence())

            const mockFile = new File(['test'], 'config.json', {
                type: 'application/json',
            })

            // Mock FileReader to simulate error
            mockFileReader.error = new Error('File read error')
            mockFileReader.readAsText.mockImplementation(() => {
                if (mockFileReader.onerror) {
                    mockFileReader.onerror({ target: mockFileReader } as any)
                }
            })

            await act(async () => {
                await result.current.loadConfigFromFile(mockFile)
            })

            // Should not change configuration on error
            expect(result.current.config.panels).toHaveLength(6)
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
        })
    })

    describe('Timestamp Updates', () => {
        it('should update timestamps when configuration changes', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const initialUpdatedAt = result.current.config.updatedAt

            act(() => {
                result.current.updateSpinDuration(5)
            })

            expect(result.current.config.updatedAt).not.toBe(initialUpdatedAt)
            expect(result.current.config.createdAt).toBe(initialUpdatedAt) // createdAt should not change
        })

        it('should preserve createdAt timestamp', () => {
            const { result } = renderHook(() => useWheelPersistence())

            const initialCreatedAt = result.current.config.createdAt

            act(() => {
                result.current.updateSpinDuration(5)
            })

            expect(result.current.config.createdAt).toBe(initialCreatedAt)
        })
    })

    describe('Server-Side Rendering', () => {
        it('should handle SSR environment', () => {
            // Mock window as undefined (SSR environment)
            const originalWindow = global.window
            // @ts-ignore
            delete global.window

            const { result } = renderHook(() => useWheelPersistence())

            expect(result.current.config.panels).toHaveLength(6)
            expect(result.current.isLoaded).toBe(true)

            // Restore window
            global.window = originalWindow
        })
    })
})
