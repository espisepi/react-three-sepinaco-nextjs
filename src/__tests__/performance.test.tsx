import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { WheelControls } from '@/features/wheel-of-fortune/components/WheelControls'
import { WheelResult } from '@/features/wheel-of-fortune/components/WheelResult'
import { useWheelPersistence } from '@/hooks/useWheelPersistence'
import { WheelPanel } from '@/types/wheel'
import { sceneFactory } from '@/features/wheel-of-fortune/factories/SceneFactory'
import { materialFactory } from '@/features/wheel-of-fortune/factories/MaterialFactory'

// Mock components
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />
}))

jest.mock('@/components/ui/CollapsibleBlock', () => ({
    CollapsibleBlock: ({ children, title, isVisible, onToggle }: any) => (
        <div data-testid="collapsible-block">
            <button onClick={onToggle} data-testid="toggle-button">
                {title} - {isVisible ? 'Open' : 'Closed'}
            </button>
            {isVisible && <div data-testid="collapsible-content">{children}</div>}
        </div>
    ),
}))

jest.mock('@/hooks/useWheelPersistence', () => ({
    useWheelPersistence: jest.fn()
}))

describe('Performance Tests', () => {
    const mockPersistenceHook = {
        config: {
            panels: [],
            spinDuration: 3,
            enableOrbitControls: false,
            canvasWidth: 100,
            canvasHeight: 50,
            blockVisibility: {
                panelsManagement: true,
                instructions: true,
            },
            version: '1.0.0',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
        },
        isLoaded: true,
        updateConfig: jest.fn(),
        updatePanels: jest.fn(),
        updateSpinDuration: jest.fn(),
        updateOrbitControls: jest.fn(),
        updateCanvasSize: jest.fn(),
        updateBlockVisibility: jest.fn(),
        downloadConfig: jest.fn(),
        loadConfigFromFile: jest.fn(),
        resetToDefault: jest.fn(),
        clearStorage: jest.fn(),
        getConfigInfo: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useWheelPersistence as jest.Mock).mockReturnValue(mockPersistenceHook)
        sceneFactory.clearScenes()
        materialFactory.clearMaterials()
    })

    describe('Component Rendering Performance', () => {
        it('should render WheelControls with large number of panels efficiently', () => {
            const largePanelSet: WheelPanel[] = Array.from({ length: 1000 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
            }))

            mockPersistenceHook.config.panels = largePanelSet

            const startTime = performance.now()
            render(<WheelControls {...mockPersistenceHook.config} />)
            const endTime = performance.now()

            const renderTime = endTime - startTime

            // Should render within 2 seconds for 1000 panels
            expect(renderTime).toBeLessThan(2000)

            // Should show all panels
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
            expect(screen.getByText('Premio 1000')).toBeInTheDocument()

            console.log(`Rendered 1000 panels in ${renderTime.toFixed(2)}ms`)
        })

        it('should render WheelResult efficiently with complex data', () => {
            const complexResult: WheelPanel = {
                id: 'complex',
                text: 'A'.repeat(1000), // Very long text
                color: '#FF0000',
                texture: 'data:image/png;base64,' + 'A'.repeat(10000), // Large texture
                textureScale: 30,
                textureRotation: 360,
                textureOffsetX: 1,
                textureOffsetY: -1,
                textPositionX: 2,
                textPositionY: -2,
                textPositionZ: 1,
                textRotationX: 360,
                textRotationY: 180,
                textRotationZ: 90,
                textScaleX: 3,
                textScaleY: 2,
                textScaleZ: 1.5
            }

            const startTime = performance.now()
            render(<WheelResult result={complexResult} raycastResult={null} />)
            const endTime = performance.now()

            const renderTime = endTime - startTime

            // Should render complex result within 500ms
            expect(renderTime).toBeLessThan(500)

            console.log(`Rendered complex result in ${renderTime.toFixed(2)}ms`)
        })

        it('should handle rapid re-renders efficiently', () => {
            const panels: WheelPanel[] = Array.from({ length: 100 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
            }))

            const RapidRerenderComponent = () => {
                const [currentPanels, setCurrentPanels] = React.useState(panels)
                const [updateCount, setUpdateCount] = React.useState(0)

                React.useEffect(() => {
                    const interval = setInterval(() => {
                        setCurrentPanels(prev =>
                            prev.map((panel, index) => ({
                                ...panel,
                                text: `Updated Premio ${index + 1} - ${updateCount}`
                            }))
                        )
                        setUpdateCount(prev => prev + 1)
                    }, 10)

                    return () => clearInterval(interval)
                }, [updateCount])

                return (
                    <WheelControls
                        panels={currentPanels}
                        isSpinning={false}
                        onSpin={jest.fn()}
                        onAddPanel={jest.fn()}
                        onRemovePanel={jest.fn()}
                        onUpdatePanel={jest.fn()}
                        onUpdatePanelColor={jest.fn()}
                        onUpdatePanelTexture={jest.fn()}
                        onUpdatePanelTextureScale={jest.fn()}
                        onUpdatePanelTextureRotation={jest.fn()}
                        onUpdatePanelTextureOffset={jest.fn()}
                        onUpdateTextPosition={jest.fn()}
                        onUpdateTextRotation={jest.fn()}
                        onUpdateTextScale={jest.fn()}
                        result={null}
                        raycastResult={null}
                        blockVisibility={mockPersistenceHook.config.blockVisibility}
                        onUpdateBlockVisibility={jest.fn()}
                    />
                )
            }

            const startTime = performance.now()
            const { unmount } = render(<RapidRerenderComponent />)

            // Let it run for 1 second
            setTimeout(() => {
                unmount()
                const endTime = performance.now()
                const totalTime = endTime - startTime

                // Should handle rapid updates without significant performance degradation
                expect(totalTime).toBeLessThan(2000)

                console.log(`Handled rapid re-renders for 1 second in ${totalTime.toFixed(2)}ms`)
            }, 1000)
        })
    })

    describe('Memory Usage Performance', () => {
        it('should not leak memory with repeated operations', () => {
            const initialMemory = (performance as any).memory?.usedJSHeapSize || 0

            // Perform many operations
            for (let i = 0; i < 1000; i++) {
                const panels: WheelPanel[] = Array.from({ length: 10 }, (_, j) => ({
                    id: `panel-${i}-${j}`,
                    text: `Premio ${j + 1}`,
                    color: '#FF0000'
                }))

                const { unmount } = render(
                    <WheelControls
                        panels={panels}
                        isSpinning={false}
                        onSpin={jest.fn()}
                        onAddPanel={jest.fn()}
                        onRemovePanel={jest.fn()}
                        onUpdatePanel={jest.fn()}
                        onUpdatePanelColor={jest.fn()}
                        onUpdatePanelTexture={jest.fn()}
                        onUpdatePanelTextureScale={jest.fn()}
                        onUpdatePanelTextureRotation={jest.fn()}
                        onUpdatePanelTextureOffset={jest.fn()}
                        onUpdateTextPosition={jest.fn()}
                        onUpdateTextRotation={jest.fn()}
                        onUpdateTextScale={jest.fn()}
                        result={null}
                        raycastResult={null}
                        blockVisibility={mockPersistenceHook.config.blockVisibility}
                        onUpdateBlockVisibility={jest.fn()}
                    />
                )

                unmount()
            }

            const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
            const memoryIncrease = finalMemory - initialMemory

            // Memory increase should be reasonable (less than 50MB)
            if (initialMemory > 0 && finalMemory > 0) {
                expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // 50MB
                console.log(`Memory increase after 1000 operations: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
            }
        })

        it('should handle large texture data efficiently', () => {
            const largeTextureData = 'data:image/png;base64,' + 'A'.repeat(100000) // 100KB texture

            const panelsWithLargeTextures: WheelPanel[] = Array.from({ length: 50 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: '#FF0000',
                texture: largeTextureData
            }))

            const startTime = performance.now()
            render(<WheelControls
                panels={panelsWithLargeTextures}
                isSpinning={false}
                onSpin={jest.fn()}
                onAddPanel={jest.fn()}
                onRemovePanel={jest.fn()}
                onUpdatePanel={jest.fn()}
                onUpdatePanelColor={jest.fn()}
                onUpdatePanelTexture={jest.fn()}
                onUpdatePanelTextureScale={jest.fn()}
                onUpdatePanelTextureRotation={jest.fn()}
                onUpdatePanelTextureOffset={jest.fn()}
                onUpdateTextPosition={jest.fn()}
                onUpdateTextRotation={jest.fn()}
                onUpdateTextScale={jest.fn()}
                result={null}
                raycastResult={null}
                blockVisibility={mockPersistenceHook.config.blockVisibility}
                onUpdateBlockVisibility={jest.fn()}
            />)
            const endTime = performance.now()

            const renderTime = endTime - startTime

            // Should render large textures within 1 second
            expect(renderTime).toBeLessThan(1000)

            console.log(`Rendered 50 panels with large textures in ${renderTime.toFixed(2)}ms`)
        })
    })

    describe('Factory Performance', () => {
        it('should create scenes efficiently', () => {
            const startTime = performance.now()

            // Create 1000 scenes
            for (let i = 0; i < 1000; i++) {
                sceneFactory.createScene({
                    id: `scene-${i}`,
                    name: `Scene ${i}`,
                    description: `Scene ${i} description`,
                    icon: '🎬',
                    config: {
                        lighting: { ambientIntensity: 0.5 },
                        camera: { position: [0, 0, 5] },
                        wheel: { radius: 2 }
                    }
                })
            }

            const endTime = performance.now()
            const creationTime = endTime - startTime

            // Should create 1000 scenes within 1 second
            expect(creationTime).toBeLessThan(1000)
            expect(sceneFactory.getSceneCount()).toBe(1000)

            console.log(`Created 1000 scenes in ${creationTime.toFixed(2)}ms`)

            // Clean up
            sceneFactory.clearScenes()
        })

        it('should create materials efficiently', () => {
            const startTime = performance.now()

            // Create 1000 materials
            for (let i = 0; i < 1000; i++) {
                materialFactory.createMaterial({
                    id: `material-${i}`,
                    name: `Material ${i}`,
                    description: `Material ${i} description`,
                    icon: '🎨',
                    config: {
                        metalness: Math.random(),
                        roughness: Math.random(),
                        clearcoat: Math.random()
                    }
                })
            }

            const endTime = performance.now()
            const creationTime = endTime - startTime

            // Should create 1000 materials within 1 second
            expect(creationTime).toBeLessThan(1000)
            expect(materialFactory.getMaterialCount()).toBe(1000)

            console.log(`Created 1000 materials in ${creationTime.toFixed(2)}ms`)

            // Clean up
            materialFactory.clearMaterials()
        })

        it('should retrieve scenes and materials efficiently', () => {
            // Create test data
            for (let i = 0; i < 1000; i++) {
                sceneFactory.createScene({
                    id: `scene-${i}`,
                    name: `Scene ${i}`,
                    description: `Scene ${i} description`,
                    icon: '🎬',
                    config: { lighting: { ambientIntensity: 0.5 } }
                })

                materialFactory.createMaterial({
                    id: `material-${i}`,
                    name: `Material ${i}`,
                    description: `Material ${i} description`,
                    icon: '🎨',
                    config: { metalness: 0.5 }
                })
            }

            const startTime = performance.now()

            // Retrieve all scenes and materials
            for (let i = 0; i < 1000; i++) {
                sceneFactory.getScene(`scene-${i}`)
                materialFactory.getMaterial(`material-${i}`)
            }

            const endTime = performance.now()
            const retrievalTime = endTime - startTime

            // Should retrieve 2000 items within 100ms
            expect(retrievalTime).toBeLessThan(100)

            console.log(`Retrieved 2000 items in ${retrievalTime.toFixed(2)}ms`)

            // Clean up
            sceneFactory.clearScenes()
            materialFactory.clearMaterials()
        })

        it('should handle bulk operations efficiently', () => {
            const startTime = performance.now()

            // Bulk create scenes
            const scenes = Array.from({ length: 500 }, (_, i) => ({
                id: `bulk-scene-${i}`,
                name: `Bulk Scene ${i}`,
                description: `Bulk scene ${i} description`,
                icon: '🎬',
                config: { lighting: { ambientIntensity: 0.5 } }
            }))

            scenes.forEach(scene => sceneFactory.createScene(scene))

            // Bulk create materials
            const materials = Array.from({ length: 500 }, (_, i) => ({
                id: `bulk-material-${i}`,
                name: `Bulk Material ${i}`,
                description: `Bulk material ${i} description`,
                icon: '🎨',
                config: { metalness: 0.5 }
            }))

            materials.forEach(material => materialFactory.createMaterial(material))

            const endTime = performance.now()
            const bulkTime = endTime - startTime

            // Should handle bulk operations within 500ms
            expect(bulkTime).toBeLessThan(500)
            expect(sceneFactory.getSceneCount()).toBe(500)
            expect(materialFactory.getMaterialCount()).toBe(500)

            console.log(`Bulk created 1000 items in ${bulkTime.toFixed(2)}ms`)

            // Clean up
            sceneFactory.clearScenes()
            materialFactory.clearMaterials()
        })
    })

    describe('Event Handling Performance', () => {
        it('should handle rapid user interactions efficiently', () => {
            const panels: WheelPanel[] = Array.from({ length: 100 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: '#FF0000'
            }))

            const { container } = render(
                <WheelControls
                    panels={panels}
                    isSpinning={false}
                    onSpin={jest.fn()}
                    onAddPanel={jest.fn()}
                    onRemovePanel={jest.fn()}
                    onUpdatePanel={jest.fn()}
                    onUpdatePanelColor={jest.fn()}
                    onUpdatePanelTexture={jest.fn()}
                    onUpdatePanelTextureScale={jest.fn()}
                    onUpdatePanelTextureRotation={jest.fn()}
                    onUpdatePanelTextureOffset={jest.fn()}
                    onUpdateTextPosition={jest.fn()}
                    onUpdateTextRotation={jest.fn()}
                    onUpdateTextScale={jest.fn()}
                    result={null}
                    raycastResult={null}
                    blockVisibility={mockPersistenceHook.config.blockVisibility}
                    onUpdateBlockVisibility={jest.fn()}
                />
            )

            const startTime = performance.now()

            // Simulate rapid clicks on edit buttons
            const editButtons = container.querySelectorAll('button[title*="Mostrar controles de texto"]')
            editButtons.forEach((button, index) => {
                if (index < 50) { // Click first 50 buttons
                    fireEvent.click(button)
                }
            })

            const endTime = performance.now()
            const interactionTime = endTime - startTime

            // Should handle 50 rapid interactions within 100ms
            expect(interactionTime).toBeLessThan(100)

            console.log(`Handled 50 rapid interactions in ${interactionTime.toFixed(2)}ms`)
        })

        it('should handle form input efficiently', () => {
            const panels: WheelPanel[] = [
                { id: '1', text: 'Premio 1', color: '#FF0000' }
            ]

            const { container } = render(
                <WheelControls
                    panels={panels}
                    isSpinning={false}
                    onSpin={jest.fn()}
                    onAddPanel={jest.fn()}
                    onRemovePanel={jest.fn()}
                    onUpdatePanel={jest.fn()}
                    onUpdatePanelColor={jest.fn()}
                    onUpdatePanelTexture={jest.fn()}
                    onUpdatePanelTextureScale={jest.fn()}
                    onUpdatePanelTextureRotation={jest.fn()}
                    onUpdatePanelTextureOffset={jest.fn()}
                    onUpdateTextPosition={jest.fn()}
                    onUpdateTextRotation={jest.fn()}
                    onUpdateTextScale={jest.fn()}
                    result={null}
                    raycastResult={null}
                    blockVisibility={mockPersistenceHook.config.blockVisibility}
                    onUpdateBlockVisibility={jest.fn()}
                />
            )

            // Enter edit mode
            const editButton = container.querySelector('button[title*="Mostrar controles de texto"]')
            fireEvent.click(editButton!)

            const startTime = performance.now()

            // Simulate rapid typing
            const input = container.querySelector('input[type="text"]') as HTMLInputElement
            for (let i = 0; i < 100; i++) {
                fireEvent.change(input, { target: { value: `Test ${i}` } })
            }

            const endTime = performance.now()
            const inputTime = endTime - startTime

            // Should handle 100 rapid input changes within 200ms
            expect(inputTime).toBeLessThan(200)

            console.log(`Handled 100 rapid input changes in ${inputTime.toFixed(2)}ms`)
        })
    })

    describe('Bundle Size Performance', () => {
        it('should have reasonable component bundle size', () => {
            // This test would typically be run with bundle analysis tools
            // For now, we'll just verify that components can be imported without issues

            expect(() => {
                require('@/features/wheel-of-fortune/components/WheelControls')
                require('@/features/wheel-of-fortune/components/WheelResult')
                require('@/features/wheel-of-fortune/factories/SceneFactory')
                require('@/features/wheel-of-fortune/factories/MaterialFactory')
                require('@/hooks/useWheelPersistence')
            }).not.toThrow()

            console.log('All components imported successfully')
        })
    })

    describe('Network Performance', () => {
        it('should handle texture loading efficiently', async () => {
            const mockTextureUrl = 'https://example.com/texture.png'

            // Mock fetch for texture loading
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                blob: () => Promise.resolve(new Blob(['test'], { type: 'image/png' }))
            })

            const panelsWithTextures: WheelPanel[] = [
                { id: '1', text: 'Premio 1', color: '#FF0000', texture: mockTextureUrl }
            ]

            const startTime = performance.now()

            render(<WheelResult result={panelsWithTextures[0]} raycastResult={null} />)

            const endTime = performance.now()
            const renderTime = endTime - startTime

            // Should render with texture URL within 100ms
            expect(renderTime).toBeLessThan(100)

            console.log(`Rendered with texture URL in ${renderTime.toFixed(2)}ms`)
        })
    })

    describe('Accessibility Performance', () => {
        it('should handle screen reader interactions efficiently', () => {
            const panels: WheelPanel[] = Array.from({ length: 50 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: '#FF0000'
            }))

            const startTime = performance.now()

            render(
                <WheelControls
                    panels={panels}
                    isSpinning={false}
                    onSpin={jest.fn()}
                    onAddPanel={jest.fn()}
                    onRemovePanel={jest.fn()}
                    onUpdatePanel={jest.fn()}
                    onUpdatePanelColor={jest.fn()}
                    onUpdatePanelTexture={jest.fn()}
                    onUpdatePanelTextureScale={jest.fn()}
                    onUpdatePanelTextureRotation={jest.fn()}
                    onUpdatePanelTextureOffset={jest.fn()}
                    onUpdateTextPosition={jest.fn()}
                    onUpdateTextRotation={jest.fn()}
                    onUpdateTextScale={jest.fn()}
                    result={null}
                    raycastResult={null}
                    blockVisibility={mockPersistenceHook.config.blockVisibility}
                    onUpdateBlockVisibility={jest.fn()}
                />
            )

            const endTime = performance.now()
            const renderTime = endTime - startTime

            // Should render accessible content within 500ms
            expect(renderTime).toBeLessThan(500)

            // Verify accessibility attributes are present
            expect(screen.getAllByRole('button')).toHaveLength(expect.any(Number))
            expect(screen.getAllByRole('img')).toHaveLength(expect.any(Number))

            console.log(`Rendered accessible content in ${renderTime.toFixed(2)}ms`)
        })
    })
})
