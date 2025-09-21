import React from 'react'
import { renderHook } from '@testing-library/react'
import {
    sceneFactory,
    useSceneFactory,
    SceneBuilder,
    createSceneBuilder,
    SCENE_PRESETS,
    createSceneWithPreset
} from '@/features/wheel-of-fortune/factories/SceneFactory'
import { WheelScene, WheelSceneProps } from '@/types/scene-manager'

// Mock component for testing
const MockSceneComponent: React.FC<WheelSceneProps> = () => <div>Mock Scene</div>

describe('SceneFactory', () => {
    beforeEach(() => {
        // Clear all scenes before each test
        sceneFactory.clearScenes()
    })

    describe('Basic Factory Operations', () => {
        it('should register a scene', () => {
            const scene: WheelScene = {
                id: 'test-scene',
                name: 'Test Scene',
                description: 'A test scene',
                icon: '🎬',
                component: MockSceneComponent,
                config: {
                    lighting: { ambientIntensity: 0.5 },
                    camera: { position: [0, 0, 5] },
                    wheel: { radius: 2 }
                }
            }

            sceneFactory.registerScene(scene)

            expect(sceneFactory.hasScene('test-scene')).toBe(true)
            expect(sceneFactory.getSceneCount()).toBe(1)
        })

        it('should get a registered scene', () => {
            const scene: WheelScene = {
                id: 'test-scene',
                name: 'Test Scene',
                description: 'A test scene',
                icon: '🎬',
                component: MockSceneComponent,
                config: {
                    lighting: { ambientIntensity: 0.5 },
                    camera: { position: [0, 0, 5] },
                    wheel: { radius: 2 }
                }
            }

            sceneFactory.registerScene(scene)
            const retrievedScene = sceneFactory.getScene('test-scene')

            expect(retrievedScene).toEqual(scene)
        })

        it('should return null for non-existent scene', () => {
            const retrievedScene = sceneFactory.getScene('non-existent')

            expect(retrievedScene).toBeNull()
        })

        it('should list all registered scenes', () => {
            const scene1: WheelScene = {
                id: 'scene-1',
                name: 'Scene 1',
                description: 'First scene',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            const scene2: WheelScene = {
                id: 'scene-2',
                name: 'Scene 2',
                description: 'Second scene',
                icon: '🎭',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.3 } }
            }

            sceneFactory.registerScene(scene1)
            sceneFactory.registerScene(scene2)

            const scenes = sceneFactory.listScenes()

            expect(scenes).toHaveLength(2)
            expect(scenes).toContain(scene1)
            expect(scenes).toContain(scene2)
        })

        it('should unregister a scene', () => {
            const scene: WheelScene = {
                id: 'test-scene',
                name: 'Test Scene',
                description: 'A test scene',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            sceneFactory.registerScene(scene)
            expect(sceneFactory.hasScene('test-scene')).toBe(true)

            const removed = sceneFactory.unregisterScene('test-scene')

            expect(removed).toBe(true)
            expect(sceneFactory.hasScene('test-scene')).toBe(false)
            expect(sceneFactory.getSceneCount()).toBe(0)
        })

        it('should return false when unregistering non-existent scene', () => {
            const removed = sceneFactory.unregisterScene('non-existent')

            expect(removed).toBe(false)
        })

        it('should overwrite existing scene when registering with same ID', () => {
            const scene1: WheelScene = {
                id: 'test-scene',
                name: 'Original Scene',
                description: 'Original description',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            const scene2: WheelScene = {
                id: 'test-scene',
                name: 'Updated Scene',
                description: 'Updated description',
                icon: '🎭',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.7 } }
            }

            sceneFactory.registerScene(scene1)
            sceneFactory.registerScene(scene2)

            const retrievedScene = sceneFactory.getScene('test-scene')
            expect(retrievedScene).toEqual(scene2)
            expect(sceneFactory.getSceneCount()).toBe(1)
        })

        it('should clear all scenes', () => {
            const scene1: WheelScene = {
                id: 'scene-1',
                name: 'Scene 1',
                description: 'First scene',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            const scene2: WheelScene = {
                id: 'scene-2',
                name: 'Scene 2',
                description: 'Second scene',
                icon: '🎭',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.3 } }
            }

            sceneFactory.registerScene(scene1)
            sceneFactory.registerScene(scene2)

            expect(sceneFactory.getSceneCount()).toBe(2)

            sceneFactory.clearScenes()

            expect(sceneFactory.getSceneCount()).toBe(0)
            expect(sceneFactory.listScenes()).toHaveLength(0)
        })
    })

    describe('Error Handling', () => {
        it('should throw error when creating scene without component', () => {
            expect(() => {
                sceneFactory.createScene({
                    id: 'test',
                    name: 'Test',
                    description: 'Test',
                    icon: '🎬',
                    config: { lighting: { ambientIntensity: 0.5 } }
                })
            }).toThrow('createScene requires a component. Use createSceneWithPreset or SceneBuilder instead.')
        })
    })

    describe('useSceneFactory Hook', () => {
        it('should provide all factory methods', () => {
            const { result } = renderHook(() => useSceneFactory())

            expect(typeof result.current.createScene).toBe('function')
            expect(typeof result.current.registerScene).toBe('function')
            expect(typeof result.current.getScene).toBe('function')
            expect(typeof result.current.listScenes).toBe('function')
            expect(typeof result.current.unregisterScene).toBe('function')
            expect(typeof result.current.hasScene).toBe('function')
            expect(typeof result.current.getSceneCount).toBe('function')
            expect(typeof result.current.clearScenes).toBe('function')
        })

        it('should register scene through hook', () => {
            const { result } = renderHook(() => useSceneFactory())

            const scene: WheelScene = {
                id: 'hook-scene',
                name: 'Hook Scene',
                description: 'Scene created via hook',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            result.current.registerScene(scene)

            expect(result.current.hasScene('hook-scene')).toBe(true)
            expect(result.current.getSceneCount()).toBe(1)
        })

        it('should maintain state across hook calls', () => {
            const { result: result1 } = renderHook(() => useSceneFactory())
            const { result: result2 } = renderHook(() => useSceneFactory())

            const scene: WheelScene = {
                id: 'shared-scene',
                name: 'Shared Scene',
                description: 'Scene shared between hooks',
                icon: '🎬',
                component: MockSceneComponent,
                config: { lighting: { ambientIntensity: 0.5 } }
            }

            result1.current.registerScene(scene)

            expect(result2.current.hasScene('shared-scene')).toBe(true)
            expect(result2.current.getSceneCount()).toBe(1)
        })
    })

    describe('SceneBuilder', () => {
        it('should create a scene using builder pattern', () => {
            const scene = createSceneBuilder('builder-scene', 'Builder Scene')
                .withDescription('Scene created with builder')
                .withIcon('🏗️')
                .withComponent(MockSceneComponent)
                .withConfig({
                    lighting: { ambientIntensity: 0.8 },
                    camera: { position: [0, 0, 6] },
                    wheel: { radius: 3 }
                })
                .build()

            expect(scene.id).toBe('builder-scene')
            expect(scene.name).toBe('Builder Scene')
            expect(scene.description).toBe('Scene created with builder')
            expect(scene.icon).toBe('🏗️')
            expect(scene.component).toBe(MockSceneComponent)
            expect(scene.config.lighting.ambientIntensity).toBe(0.8)
            expect(scene.config.camera.position).toEqual([0, 0, 6])
            expect(scene.config.wheel.radius).toBe(3)

            // Should be automatically registered
            expect(sceneFactory.hasScene('builder-scene')).toBe(true)
        })

        it('should throw error when building without component', () => {
            const builder = createSceneBuilder('incomplete-scene', 'Incomplete Scene')
                .withDescription('Scene without component')

            expect(() => {
                builder.build()
            }).toThrow('Scene component is required')
        })

        it('should use default values when not specified', () => {
            const scene = createSceneBuilder('minimal-scene', 'Minimal Scene')
                .withComponent(MockSceneComponent)
                .build()

            expect(scene.description).toBe('')
            expect(scene.icon).toBe('🎬')
            expect(scene.config).toBeDefined()
        })

        it('should chain builder methods', () => {
            const builder = createSceneBuilder('chained-scene', 'Chained Scene')

            const scene = builder
                .withDescription('First description')
                .withIcon('🎭')
                .withDescription('Updated description')
                .withIcon('🎪')
                .withComponent(MockSceneComponent)
                .build()

            expect(scene.description).toBe('Updated description')
            expect(scene.icon).toBe('🎪')
        })
    })

    describe('Scene Presets', () => {
        it('should have all predefined presets', () => {
            expect(SCENE_PRESETS.CLASSIC).toBeDefined()
            expect(SCENE_PRESETS.DARK).toBeDefined()
            expect(SCENE_PRESETS.BRIGHT).toBeDefined()
            expect(SCENE_PRESETS.NEON).toBeDefined()
        })

        it('should create scene with CLASSIC preset', () => {
            const scene = createSceneWithPreset(
                'classic-scene',
                'Classic Scene',
                MockSceneComponent,
                'CLASSIC'
            )

            expect(scene.config.lighting.ambientIntensity).toBe(0.4)
            expect(scene.config.lighting.directionalIntensity).toBe(1)
            expect(scene.config.lighting.pointLightIntensity).toBe(0.5)
            expect(scene.config.lighting.pointLightColor).toBe('#4ECDC4')
            expect(scene.config.camera.position).toEqual([0, 0, 5])
            expect(scene.config.wheel.radius).toBe(2)
            expect(scene.config.wheel.height).toBe(0.2)
            expect(scene.config.wheel.segments).toBe(8)
        })

        it('should create scene with DARK preset', () => {
            const scene = createSceneWithPreset(
                'dark-scene',
                'Dark Scene',
                MockSceneComponent,
                'DARK'
            )

            expect(scene.config.lighting.ambientIntensity).toBe(0.2)
            expect(scene.config.lighting.directionalIntensity).toBe(0.8)
            expect(scene.config.lighting.pointLightIntensity).toBe(0.3)
            expect(scene.config.lighting.pointLightColor).toBe('#FF6B6B')
            expect(scene.config.camera.position).toEqual([0, 0, 6])
            expect(scene.config.wheel.radius).toBe(2.2)
            expect(scene.config.wheel.height).toBe(0.3)
            expect(scene.config.wheel.segments).toBe(12)
        })

        it('should create scene with BRIGHT preset', () => {
            const scene = createSceneWithPreset(
                'bright-scene',
                'Bright Scene',
                MockSceneComponent,
                'BRIGHT'
            )

            expect(scene.config.lighting.ambientIntensity).toBe(0.6)
            expect(scene.config.lighting.directionalIntensity).toBe(1.2)
            expect(scene.config.lighting.pointLightIntensity).toBe(0.8)
            expect(scene.config.lighting.pointLightColor).toBe('#4ECDC4')
            expect(scene.config.camera.position).toEqual([0, 0, 4])
            expect(scene.config.wheel.radius).toBe(1.8)
            expect(scene.config.wheel.height).toBe(0.15)
            expect(scene.config.wheel.segments).toBe(6)
        })

        it('should create scene with NEON preset', () => {
            const scene = createSceneWithPreset(
                'neon-scene',
                'Neon Scene',
                MockSceneComponent,
                'NEON'
            )

            expect(scene.config.lighting.ambientIntensity).toBe(0.1)
            expect(scene.config.lighting.directionalIntensity).toBe(0.5)
            expect(scene.config.lighting.pointLightIntensity).toBe(1.0)
            expect(scene.config.lighting.pointLightColor).toBe('#00FFFF')
            expect(scene.config.camera.position).toEqual([0, 0, 7])
            expect(scene.config.wheel.radius).toBe(2.5)
            expect(scene.config.wheel.height).toBe(0.4)
            expect(scene.config.wheel.segments).toBe(16)
        })

        it('should default to CLASSIC preset when not specified', () => {
            const scene = createSceneWithPreset(
                'default-scene',
                'Default Scene',
                MockSceneComponent
            )

            expect(scene.config.lighting.ambientIntensity).toBe(0.4)
            expect(scene.config.lighting.directionalIntensity).toBe(1)
            expect(scene.config.lighting.pointLightIntensity).toBe(0.5)
            expect(scene.config.lighting.pointLightColor).toBe('#4ECDC4')
        })
    })

    describe('Integration Tests', () => {
        it('should work with multiple scenes and presets', () => {
            const classicScene = createSceneWithPreset(
                'classic',
                'Classic',
                MockSceneComponent,
                'CLASSIC'
            )

            const darkScene = createSceneWithPreset(
                'dark',
                'Dark',
                MockSceneComponent,
                'DARK'
            )

            const customScene = createSceneBuilder('custom', 'Custom')
                .withDescription('Custom scene')
                .withIcon('🎨')
                .withComponent(MockSceneComponent)
                .withConfig({
                    lighting: { ambientIntensity: 0.9 },
                    camera: { position: [0, 0, 8] },
                    wheel: { radius: 4 }
                })
                .build()

            expect(sceneFactory.getSceneCount()).toBe(3)
            expect(sceneFactory.hasScene('classic')).toBe(true)
            expect(sceneFactory.hasScene('dark')).toBe(true)
            expect(sceneFactory.hasScene('custom')).toBe(true)

            const scenes = sceneFactory.listScenes()
            expect(scenes).toHaveLength(3)

            // Verify each scene has correct configuration
            const classic = sceneFactory.getScene('classic')
            expect(classic?.config.lighting.ambientIntensity).toBe(0.4)

            const dark = sceneFactory.getScene('dark')
            expect(dark?.config.lighting.ambientIntensity).toBe(0.2)

            const custom = sceneFactory.getScene('custom')
            expect(custom?.config.lighting.ambientIntensity).toBe(0.9)
        })

        it('should handle scene lifecycle correctly', () => {
            // Register scenes
            const scene1 = createSceneWithPreset('scene1', 'Scene 1', MockSceneComponent)
            const scene2 = createSceneWithPreset('scene2', 'Scene 2', MockSceneComponent)

            expect(sceneFactory.getSceneCount()).toBe(2)

            // Unregister one scene
            const removed = sceneFactory.unregisterScene('scene1')
            expect(removed).toBe(true)
            expect(sceneFactory.getSceneCount()).toBe(1)
            expect(sceneFactory.hasScene('scene1')).toBe(false)
            expect(sceneFactory.hasScene('scene2')).toBe(true)

            // Clear all scenes
            sceneFactory.clearScenes()
            expect(sceneFactory.getSceneCount()).toBe(0)
            expect(sceneFactory.hasScene('scene2')).toBe(false)
        })
    })

    describe('Type Safety', () => {
        it('should enforce required scene properties', () => {
            const scene: WheelScene = {
                id: 'type-safe-scene',
                name: 'Type Safe Scene',
                description: 'Scene with proper typing',
                icon: '🔒',
                component: MockSceneComponent,
                config: {
                    lighting: { ambientIntensity: 0.5 },
                    camera: { position: [0, 0, 5] },
                    wheel: { radius: 2 }
                }
            }

            expect(scene.id).toBe('type-safe-scene')
            expect(scene.name).toBe('Type Safe Scene')
            expect(scene.component).toBe(MockSceneComponent)
        })

        it('should handle partial configuration in builder', () => {
            const scene = createSceneBuilder('partial-config', 'Partial Config')
                .withComponent(MockSceneComponent)
                .withConfig({
                    lighting: { ambientIntensity: 0.7 }
                    // Other config properties should use defaults
                })
                .build()

            expect(scene.config.lighting.ambientIntensity).toBe(0.7)
            expect(scene.config.camera).toBeDefined()
            expect(scene.config.wheel).toBeDefined()
        })
    })
})
