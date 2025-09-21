import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WheelControls } from '@/features/wheel-of-fortune/components/WheelControls'
import { WheelResult } from '@/features/wheel-of-fortune/components/WheelResult'
import { useWheelPersistence } from '@/hooks/useWheelPersistence'
import { WheelPanel } from '@/types/wheel'
import { sceneFactory } from '@/features/wheel-of-fortune/factories/SceneFactory'
import { materialFactory } from '@/features/wheel-of-fortune/factories/MaterialFactory'

// Mock components and hooks
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

// Mock the persistence hook
jest.mock('@/hooks/useWheelPersistence', () => ({
    useWheelPersistence: jest.fn()
}))

describe('Wheel of Fortune Integration Tests', () => {
    const mockPanels: WheelPanel[] = [
        { id: '1', text: 'Premio 1', color: '#FF0000' },
        { id: '2', text: 'Premio 2', color: '#00FF00' },
        { id: '3', text: 'Premio 3', color: '#0000FF' },
    ]

    const mockPersistenceHook = {
        config: {
            panels: mockPanels,
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

        // Clear factories
        sceneFactory.clearScenes()
        materialFactory.clearMaterials()
    })

    describe('Complete Wheel Management Flow', () => {
        it('should handle complete panel lifecycle', async () => {
            const user = userEvent.setup()

            const WheelManagementComponent = () => {
                const persistence = useWheelPersistence()

                return (
                    <div>
                        <WheelControls
                            panels={persistence.config.panels}
                            isSpinning={false}
                            onSpin={jest.fn()}
                            onAddPanel={() => {
                                const newPanel: WheelPanel = {
                                    id: `panel-${Date.now()}`,
                                    text: 'Nuevo Premio',
                                    color: '#FF8800'
                                }
                                persistence.updatePanels([...persistence.config.panels, newPanel])
                            }}
                            onRemovePanel={(id) => {
                                persistence.updatePanels(persistence.config.panels.filter(p => p.id !== id))
                            }}
                            onUpdatePanel={(id, text) => {
                                persistence.updatePanels(
                                    persistence.config.panels.map(p =>
                                        p.id === id ? { ...p, text } : p
                                    )
                                )
                            }}
                            onUpdatePanelColor={(id, color) => {
                                persistence.updatePanels(
                                    persistence.config.panels.map(p =>
                                        p.id === id ? { ...p, color } : p
                                    )
                                )
                            }}
                            onUpdatePanelTexture={jest.fn()}
                            onUpdatePanelTextureScale={jest.fn()}
                            onUpdatePanelTextureRotation={jest.fn()}
                            onUpdatePanelTextureOffset={jest.fn()}
                            onUpdateTextPosition={jest.fn()}
                            onUpdateTextRotation={jest.fn()}
                            onUpdateTextScale={jest.fn()}
                            result={null}
                            raycastResult={null}
                            blockVisibility={persistence.config.blockVisibility}
                            onUpdateBlockVisibility={persistence.updateBlockVisibility}
                        />
                        {persistence.config.panels.length > 0 && (
                            <WheelResult
                                result={persistence.config.panels[0]}
                                raycastResult={null}
                            />
                        )}
                    </div>
                )
            }

            render(<WheelManagementComponent />)

            // Verify initial state
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
            expect(screen.getByText('Premio 2')).toBeInTheDocument()
            expect(screen.getByText('Premio 3')).toBeInTheDocument()

            // Add new panel
            const addButton = screen.getByText('+ Agregar')
            await user.click(addButton)

            expect(mockPersistenceHook.updatePanels).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ text: 'Nuevo Premio', color: '#FF8800' })
                ])
            )

            // Edit existing panel
            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Premio Editado')

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            expect(mockPersistenceHook.updatePanels).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ text: 'Premio Editado' })
                ])
            )

            // Change panel color
            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            const colorInput = screen.getByDisplayValue('#FF0000')
            await user.clear(colorInput)
            await user.type(colorInput, '#00FFFF')

            const confirmColorButton = screen.getByTitle('Confirmar color')
            await user.click(confirmColorButton)

            expect(mockPersistenceHook.updatePanels).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ color: '#00FFFF' })
                ])
            )

            // Remove panel
            const removeButtons = screen.getAllByText('🗑️')
            await user.click(removeButtons[0])

            expect(mockPersistenceHook.updatePanels).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.not.objectContaining({ id: '1' })
                ])
            )
        })

        it('should handle texture management flow', async () => {
            const user = userEvent.setup()

            const TextureManagementComponent = () => {
                const persistence = useWheelPersistence()
                const [panels, setPanels] = React.useState(persistence.config.panels)

                const updatePanelTexture = (id: string, texture: string | null) => {
                    setPanels(panels.map(p => p.id === id ? { ...p, texture } : p))
                }

                const updatePanelTextureScale = (id: string, scale: number) => {
                    setPanels(panels.map(p => p.id === id ? { ...p, textureScale: scale } : p))
                }

                const updatePanelTextureRotation = (id: string, rotation: number) => {
                    setPanels(panels.map(p => p.id === id ? { ...p, textureRotation: rotation } : p))
                }

                const updatePanelTextureOffset = (id: string, offsetX: number, offsetY: number) => {
                    setPanels(panels.map(p => p.id === id ? {
                        ...p,
                        textureOffsetX: offsetX,
                        textureOffsetY: offsetY
                    } : p))
                }

                return (
                    <WheelControls
                        panels={panels}
                        isSpinning={false}
                        onSpin={jest.fn()}
                        onAddPanel={jest.fn()}
                        onRemovePanel={jest.fn()}
                        onUpdatePanel={jest.fn()}
                        onUpdatePanelColor={jest.fn()}
                        onUpdatePanelTexture={updatePanelTexture}
                        onUpdatePanelTextureScale={updatePanelTextureScale}
                        onUpdatePanelTextureRotation={updatePanelTextureRotation}
                        onUpdatePanelTextureOffset={updatePanelTextureOffset}
                        onUpdateTextPosition={jest.fn()}
                        onUpdateTextRotation={jest.fn()}
                        onUpdateTextScale={jest.fn()}
                        result={null}
                        raycastResult={null}
                        blockVisibility={persistence.config.blockVisibility}
                        onUpdateBlockVisibility={persistence.updateBlockVisibility}
                    />
                )
            }

            render(<TextureManagementComponent />)

            // Simulate image upload
            const file = new File(['test'], 'test.png', { type: 'image/png' })
            const uploadInput = screen.getByLabelText(/Imagen de textura/i)

            await user.upload(uploadInput, file)

            // Wait for texture to be processed
            await waitFor(() => {
                expect(screen.getByAltText('Texture for Premio 1')).toBeInTheDocument()
            })

            // Show texture controls
            const textureToggleButton = screen.getByTitle('Mostrar controles')
            await user.click(textureToggleButton)

            // Adjust texture scale
            const scaleButton = screen.getByTitle('Grande (2x)')
            await user.click(scaleButton)

            // Adjust texture rotation
            const rotationButton = screen.getByTitle('90° - Rotación derecha')
            await user.click(rotationButton)

            // Adjust texture offset
            const offsetButton = screen.getByTitle('Derecha (1)')
            await user.click(offsetButton)

            // Remove texture
            const removeTextureButton = screen.getByTitle('Eliminar textura')
            await user.click(removeTextureButton)

            await waitFor(() => {
                expect(screen.queryByAltText('Texture for Premio 1')).not.toBeInTheDocument()
            })
        })

        it('should handle text positioning flow', async () => {
            const user = userEvent.setup()

            const TextPositioningComponent = () => {
                const persistence = useWheelPersistence()
                const [panels, setPanels] = React.useState(persistence.config.panels)

                const updateTextPosition = (id: string, x: number, y: number, z: number) => {
                    setPanels(panels.map(p => p.id === id ? {
                        ...p,
                        textPositionX: x,
                        textPositionY: y,
                        textPositionZ: z
                    } : p))
                }

                const updateTextRotation = (id: string, x: number, y: number, z: number) => {
                    setPanels(panels.map(p => p.id === id ? {
                        ...p,
                        textRotationX: x,
                        textRotationY: y,
                        textRotationZ: z
                    } : p))
                }

                const updateTextScale = (id: string, x: number, y: number, z: number) => {
                    setPanels(panels.map(p => p.id === id ? {
                        ...p,
                        textScaleX: x,
                        textScaleY: y,
                        textScaleZ: z
                    } : p))
                }

                return (
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
                        onUpdateTextPosition={updateTextPosition}
                        onUpdateTextRotation={updateTextRotation}
                        onUpdateTextScale={updateTextScale}
                        result={null}
                        raycastResult={null}
                        blockVisibility={persistence.config.blockVisibility}
                        onUpdateBlockVisibility={persistence.updateBlockVisibility}
                    />
                )
            }

            render(<TextPositioningComponent />)

            // Show text controls
            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            // Adjust text position
            const positionSlider = screen.getByLabelText(/X: 0.00/)
            fireEvent.change(positionSlider, { target: { value: '1.5' } })

            // Adjust text rotation
            const rotationSlider = screen.getByLabelText(/X: 0°/)
            fireEvent.change(rotationSlider, { target: { value: '90' } })

            // Adjust text scale
            const scaleSlider = screen.getByLabelText(/X: 1.00/)
            fireEvent.change(scaleSlider, { target: { value: '2.0' } })

            // Reset text properties
            const resetButton = screen.getByText('🔄 Restablecer Texto')
            await user.click(resetButton)

            // Verify reset
            expect(screen.getByLabelText(/X: 0.00/)).toBeInTheDocument()
            expect(screen.getByLabelText(/X: 0°/)).toBeInTheDocument()
            expect(screen.getByLabelText(/X: 1.00/)).toBeInTheDocument()
        })
    })

    describe('Scene and Material Factory Integration', () => {
        it('should integrate scene factory with wheel management', () => {
            // Create scenes using factory
            const classicScene = sceneFactory.createScene({
                id: 'classic',
                name: 'Classic Scene',
                description: 'Classic wheel scene',
                icon: '🎯',
                config: {
                    lighting: { ambientIntensity: 0.4 },
                    camera: { position: [0, 0, 5] },
                    wheel: { radius: 2 }
                }
            })

            const darkScene = sceneFactory.createScene({
                id: 'dark',
                name: 'Dark Scene',
                description: 'Dark wheel scene',
                icon: '🌙',
                config: {
                    lighting: { ambientIntensity: 0.2 },
                    camera: { position: [0, 0, 6] },
                    wheel: { radius: 2.2 }
                }
            })

            // Create materials using factory
            const metallicMaterial = materialFactory.createMaterial({
                id: 'metallic',
                name: 'Metallic Material',
                description: 'Metallic wheel material',
                icon: '🔩',
                config: {
                    metalness: 0.8,
                    roughness: 0.2
                }
            })

            const plasticMaterial = materialFactory.createMaterial({
                id: 'plastic',
                name: 'Plastic Material',
                description: 'Plastic wheel material',
                icon: '🧱',
                config: {
                    metalness: 0.1,
                    roughness: 0.8
                }
            })

            // Verify integration
            expect(sceneFactory.getSceneCount()).toBe(2)
            expect(materialFactory.getMaterialCount()).toBe(2)

            expect(sceneFactory.hasScene('classic')).toBe(true)
            expect(sceneFactory.hasScene('dark')).toBe(true)
            expect(materialFactory.hasMaterial('metallic')).toBe(true)
            expect(materialFactory.hasMaterial('plastic')).toBe(true)

            // Test scene retrieval
            const retrievedClassicScene = sceneFactory.getScene('classic')
            expect(retrievedClassicScene?.config.lighting.ambientIntensity).toBe(0.4)

            // Test material creation
            const threeMaterial = metallicMaterial.createMaterial('#FF0000')
            expect(threeMaterial).toBeDefined()
        })

        it('should handle scene and material lifecycle together', () => {
            // Register scenes and materials
            const scene1 = sceneFactory.createScene({
                id: 'scene1',
                name: 'Scene 1',
                description: 'First scene',
                icon: '🎬',
                config: { lighting: { ambientIntensity: 0.5 } }
            })

            const material1 = materialFactory.createMaterial({
                id: 'material1',
                name: 'Material 1',
                description: 'First material',
                icon: '🎨',
                config: { metalness: 0.5 }
            })

            expect(sceneFactory.getSceneCount()).toBe(1)
            expect(materialFactory.getMaterialCount()).toBe(1)

            // Unregister one scene and one material
            sceneFactory.unregisterScene('scene1')
            materialFactory.unregisterMaterial('material1')

            expect(sceneFactory.getSceneCount()).toBe(0)
            expect(materialFactory.getMaterialCount()).toBe(0)

            // Clear all
            sceneFactory.clearScenes()
            materialFactory.clearMaterials()

            expect(sceneFactory.getSceneCount()).toBe(0)
            expect(materialFactory.getMaterialCount()).toBe(0)
        })
    })

    describe('Configuration Persistence Integration', () => {
        it('should handle complete configuration lifecycle', async () => {
            const user = userEvent.setup()

            const ConfigurationComponent = () => {
                const persistence = useWheelPersistence()

                return (
                    <div>
                        <div data-testid="config-info">
                            <div>Panels: {persistence.config.panels.length}</div>
                            <div>Spin Duration: {persistence.config.spinDuration}</div>
                            <div>Orbit Controls: {persistence.config.enableOrbitControls ? 'Enabled' : 'Disabled'}</div>
                            <div>Canvas Size: {persistence.config.canvasWidth}x{persistence.config.canvasHeight}</div>
                        </div>
                        <button onClick={persistence.downloadConfig}>Download Config</button>
                        <button onClick={persistence.resetToDefault}>Reset to Default</button>
                        <button onClick={persistence.clearStorage}>Clear Storage</button>
                    </div>
                )
            }

            render(<ConfigurationComponent />)

            // Verify initial configuration
            expect(screen.getByText('Panels: 3')).toBeInTheDocument()
            expect(screen.getByText('Spin Duration: 3')).toBeInTheDocument()
            expect(screen.getByText('Orbit Controls: Disabled')).toBeInTheDocument()
            expect(screen.getByText('Canvas Size: 100x50')).toBeInTheDocument()

            // Test configuration operations
            const downloadButton = screen.getByText('Download Config')
            await user.click(downloadButton)
            expect(mockPersistenceHook.downloadConfig).toHaveBeenCalled()

            const resetButton = screen.getByText('Reset to Default')
            await user.click(resetButton)
            expect(mockPersistenceHook.resetToDefault).toHaveBeenCalled()

            const clearButton = screen.getByText('Clear Storage')
            await user.click(clearButton)
            expect(mockPersistenceHook.clearStorage).toHaveBeenCalled()
        })

        it('should handle configuration updates', () => {
            const ConfigurationUpdateComponent = () => {
                const persistence = useWheelPersistence()

                React.useEffect(() => {
                    // Simulate configuration updates
                    persistence.updateSpinDuration(5)
                    persistence.updateOrbitControls(true)
                    persistence.updateCanvasSize(200, 100)
                    persistence.updateBlockVisibility('panelsManagement', false)
                }, [])

                return (
                    <div data-testid="updated-config">
                        <div>Updated Spin Duration: {persistence.config.spinDuration}</div>
                        <div>Updated Orbit Controls: {persistence.config.enableOrbitControls ? 'Enabled' : 'Disabled'}</div>
                        <div>Updated Canvas Size: {persistence.config.canvasWidth}x{persistence.config.canvasHeight}</div>
                        <div>Updated Block Visibility: {persistence.config.blockVisibility.panelsManagement ? 'Visible' : 'Hidden'}</div>
                    </div>
                )
            }

            render(<ConfigurationUpdateComponent />)

            // Verify updates were called
            expect(mockPersistenceHook.updateSpinDuration).toHaveBeenCalledWith(5)
            expect(mockPersistenceHook.updateOrbitControls).toHaveBeenCalledWith(true)
            expect(mockPersistenceHook.updateCanvasSize).toHaveBeenCalledWith(200, 100)
            expect(mockPersistenceHook.updateBlockVisibility).toHaveBeenCalledWith('panelsManagement', false)
        })
    })

    describe('Error Handling and Edge Cases', () => {
        it('should handle invalid panel data gracefully', async () => {
            const user = userEvent.setup()

            const ErrorHandlingComponent = () => {
                const persistence = useWheelPersistence()
                const [panels, setPanels] = React.useState(persistence.config.panels)

                const updatePanel = (id: string, text: string) => {
                    if (text.trim()) {
                        setPanels(panels.map(p => p.id === id ? { ...p, text } : p))
                    }
                }

                return (
                    <WheelControls
                        panels={panels}
                        isSpinning={false}
                        onSpin={jest.fn()}
                        onAddPanel={jest.fn()}
                        onRemovePanel={jest.fn()}
                        onUpdatePanel={updatePanel}
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
                        blockVisibility={persistence.config.blockVisibility}
                        onUpdateBlockVisibility={persistence.updateBlockVisibility}
                    />
                )
            }

            render(<ErrorHandlingComponent />)

            // Try to edit with empty text
            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            // Should not update with empty text
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
        })

        it('should handle rapid state changes', async () => {
            const user = userEvent.setup()

            const RapidChangeComponent = () => {
                const persistence = useWheelPersistence()
                const [panels, setPanels] = React.useState(persistence.config.panels)
                const [isUpdating, setIsUpdating] = React.useState(false)

                const updatePanel = async (id: string, text: string) => {
                    setIsUpdating(true)
                    // Simulate async update
                    await new Promise(resolve => setTimeout(resolve, 100))
                    setPanels(panels.map(p => p.id === id ? { ...p, text } : p))
                    setIsUpdating(false)
                }

                return (
                    <div>
                        <WheelControls
                            panels={panels}
                            isSpinning={isUpdating}
                            onSpin={jest.fn()}
                            onAddPanel={jest.fn()}
                            onRemovePanel={jest.fn()}
                            onUpdatePanel={updatePanel}
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
                            blockVisibility={persistence.config.blockVisibility}
                            onUpdateBlockVisibility={persistence.updateBlockVisibility}
                        />
                        {isUpdating && <div data-testid="updating">Updating...</div>}
                    </div>
                )
            }

            render(<RapidChangeComponent />)

            // Make rapid changes
            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Updated Premio')

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            // Should show updating state
            expect(screen.getByTestId('updating')).toBeInTheDocument()

            // Wait for update to complete
            await waitFor(() => {
                expect(screen.queryByTestId('updating')).not.toBeInTheDocument()
            })

            expect(screen.getByText('Updated Premio')).toBeInTheDocument()
        })

        it('should handle component unmounting during operations', () => {
            const UnmountingComponent = () => {
                const persistence = useWheelPersistence()
                const [shouldRender, setShouldRender] = React.useState(true)

                React.useEffect(() => {
                    const timer = setTimeout(() => setShouldRender(false), 100)
                    return () => clearTimeout(timer)
                }, [])

                if (!shouldRender) return null

                return (
                    <WheelControls
                        panels={persistence.config.panels}
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
                        blockVisibility={persistence.config.blockVisibility}
                        onUpdateBlockVisibility={persistence.updateBlockVisibility}
                    />
                )
            }

            const { unmount } = render(<UnmountingComponent />)

            // Component should unmount without errors
            expect(() => unmount()).not.toThrow()
        })
    })

    describe('Performance Integration', () => {
        it('should handle large number of panels efficiently', () => {
            const largePanelSet: WheelPanel[] = Array.from({ length: 100 }, (_, i) => ({
                id: `panel-${i}`,
                text: `Premio ${i + 1}`,
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
            }))

            const LargePanelComponent = () => {
                const persistence = useWheelPersistence()

                return (
                    <WheelControls
                        panels={largePanelSet}
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
                        blockVisibility={persistence.config.blockVisibility}
                        onUpdateBlockVisibility={persistence.updateBlockVisibility}
                    />
                )
            }

            const startTime = performance.now()
            render(<LargePanelComponent />)
            const endTime = performance.now()

            // Should render within reasonable time (less than 1 second)
            expect(endTime - startTime).toBeLessThan(1000)

            // Should show all panels
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
            expect(screen.getByText('Premio 100')).toBeInTheDocument()
        })

        it('should handle rapid factory operations', () => {
            const startTime = performance.now()

            // Create many scenes and materials rapidly
            for (let i = 0; i < 50; i++) {
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

            const endTime = performance.now()

            // Should complete within reasonable time
            expect(endTime - startTime).toBeLessThan(1000)

            // Should have all items registered
            expect(sceneFactory.getSceneCount()).toBe(50)
            expect(materialFactory.getMaterialCount()).toBe(50)

            // Clean up
            sceneFactory.clearScenes()
            materialFactory.clearMaterials()
        })
    })
})
