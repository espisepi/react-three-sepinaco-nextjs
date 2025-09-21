import React from 'react'
import { renderHook } from '@testing-library/react'
import * as THREE from 'three'
import {
    materialFactory,
    useMaterialFactory,
    MaterialBuilder,
    createMaterialBuilder,
    createMaterialWithPreset
} from '@/features/wheel-of-fortune/factories/MaterialFactory'
import { WheelMaterial, MaterialPreset, MATERIAL_PRESETS } from '@/types/material-manager'

// Mock Three.js materials
jest.mock('three', () => ({
    ...jest.requireActual('three'),
    MeshPhysicalMaterial: jest.fn().mockImplementation((config) => ({
        ...config,
        dispose: jest.fn(),
        clone: jest.fn(),
        copy: jest.fn()
    }))
}))

describe('MaterialFactory', () => {
    beforeEach(() => {
        // Clear all materials before each test
        materialFactory.clearMaterials()
        jest.clearAllMocks()
    })

    describe('Basic Factory Operations', () => {
        it('should create and register a material', () => {
            const material = materialFactory.createMaterial({
                id: 'test-material',
                name: 'Test Material',
                description: 'A test material',
                icon: '🎨',
                config: {
                    metalness: 0.8,
                    roughness: 0.2
                }
            })

            expect(material.id).toBe('test-material')
            expect(material.name).toBe('Test Material')
            expect(material.description).toBe('A test material')
            expect(material.icon).toBe('🎨')
            expect(material.config?.metalness).toBe(0.8)
            expect(material.config?.roughness).toBe(0.2)
            expect(typeof material.createMaterial).toBe('function')
        })

        it('should retrieve a registered material', () => {
            const material = materialFactory.createMaterial({
                id: 'retrievable-material',
                name: 'Retrievable Material',
                description: 'A material that can be retrieved',
                icon: '🔍'
            })

            const retrieved = materialFactory.getMaterial('retrievable-material')
            expect(retrieved).toBe(material)
        })

        it('should return null for non-existent material', () => {
            const retrieved = materialFactory.getMaterial('non-existent')
            expect(retrieved).toBeNull()
        })

        it('should list all registered materials', () => {
            materialFactory.createMaterial({
                id: 'material-1',
                name: 'Material 1',
                description: 'First material',
                icon: '1️⃣'
            })

            materialFactory.createMaterial({
                id: 'material-2',
                name: 'Material 2',
                description: 'Second material',
                icon: '2️⃣'
            })

            const materials = materialFactory.listMaterials()
            expect(materials).toHaveLength(2)
            expect(materials.map(m => m.id)).toContain('material-1')
            expect(materials.map(m => m.id)).toContain('material-2')
        })

        it('should unregister a material', () => {
            materialFactory.createMaterial({
                id: 'temporary-material',
                name: 'Temporary Material',
                description: 'A material to be removed',
                icon: '🗑️'
            })

            expect(materialFactory.hasMaterial('temporary-material')).toBe(true)

            const removed = materialFactory.unregisterMaterial('temporary-material')
            expect(removed).toBe(true)
            expect(materialFactory.hasMaterial('temporary-material')).toBe(false)
        })

        it('should return false when trying to unregister non-existent material', () => {
            const removed = materialFactory.unregisterMaterial('non-existent')
            expect(removed).toBe(false)
        })

        it('should clear all materials', () => {
            materialFactory.createMaterial({
                id: 'material-1',
                name: 'Material 1',
                description: 'First material',
                icon: '1️⃣'
            })

            materialFactory.createMaterial({
                id: 'material-2',
                name: 'Material 2',
                description: 'Second material',
                icon: '2️⃣'
            })

            expect(materialFactory.getMaterialCount()).toBe(2)

            materialFactory.clearMaterials()
            expect(materialFactory.getMaterialCount()).toBe(0)
        })

        it('should check if material exists', () => {
            materialFactory.createMaterial({
                id: 'existing-material',
                name: 'Existing Material',
                description: 'A material that exists',
                icon: '✅'
            })

            expect(materialFactory.hasMaterial('existing-material')).toBe(true)
            expect(materialFactory.hasMaterial('non-existing')).toBe(false)
        })
    })

    describe('Three.js Material Creation', () => {
        it('should create Three.js material with basic configuration', () => {
            const material = materialFactory.createMaterial({
                id: 'basic-material',
                name: 'Basic Material',
                description: 'A basic material',
                icon: '🔧'
            })

            const threeMaterial = material.createMaterial('#FF0000')

            expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith({
                color: '#FF0000',
                metalness: 0.1,
                roughness: 0.3,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1,
                transparent: false,
                side: 2, // THREE.DoubleSide
            })
        })

        it('should create Three.js material with texture', () => {
            const material = materialFactory.createMaterial({
                id: 'textured-material',
                name: 'Textured Material',
                description: 'A material with texture',
                icon: '🖼️',
                config: {
                    metalness: 0.5,
                    roughness: 0.3
                }
            })

            const mockTexture = {
                anisotropy: 1,
                center: [0, 0],
                flipY: true,
                generateMipmaps: true,
                image: { width: 100, height: 100 },
                isTexture: true,
                magFilter: 1003,
                minFilter: 1003,
                name: 'mock-texture',
                needsUpdate: false,
                offset: [0, 0],
                repeat: [1, 1],
                rotation: 0,
                sourceFile: '',
                type: 1009,
                unpackAlignment: 4,
                userData: {},
                uuid: 'mock-uuid',
                version: 0,
                wrapS: 1000,
                wrapT: 1000,
                dispose: jest.fn(),
                clone: jest.fn(),
                copy: jest.fn(),
                toJSON: jest.fn(),
                transformUv: jest.fn(),
                updateMatrix: jest.fn()
            } as any

            const threeMaterial = material.createMaterial('#00FF00', mockTexture)

            expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith({
                color: '#00FF00',
                metalness: 0.5,
                roughness: 0.3,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1,
                transparent: false,
                side: 2,
                map: mockTexture
            })
        })

        it('should handle advanced material properties', () => {
            const material = materialFactory.createMaterial({
                id: 'advanced-material',
                name: 'Advanced Material',
                description: 'A material with advanced properties',
                icon: '⚡',
                config: {
                    metalness: 0.9,
                    roughness: 0.1,
                    emissive: '#00FFFF',
                    emissiveIntensity: 0.5,
                    opacity: 0.8,
                    transmission: 0.3,
                    thickness: 0.1,
                    ior: 1.5,
                    reflectivity: 0.8
                }
            })

            const threeMaterial = material.createMaterial('#FF00FF')

            expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith({
                color: '#FF00FF',
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1,
                transparent: false,
                side: 2,
                emissive: '#00FFFF',
                emissiveIntensity: 0.5,
                opacity: 0.8,
                transmission: 0.3,
                thickness: 0.1,
                ior: 1.5,
                reflectivity: 0.8
            })
        })
    })

    describe('MaterialBuilder', () => {
        it('should build material with custom configuration', () => {
            const builder = createMaterialBuilder()
            const material = builder
                .setId('custom-material')
                .setName('Custom Material')
                .setDescription('A custom built material')
                .setIcon('🛠️')
                .setMetalness(0.7)
                .setRoughness(0.3)
                .setClearcoat(0.8)
                .build()

            expect(material.id).toBe('custom-material')
            expect(material.name).toBe('Custom Material')
            expect(material.description).toBe('A custom built material')
            expect(material.icon).toBe('🛠️')
            expect(material.config?.metalness).toBe(0.7)
            expect(material.config?.roughness).toBe(0.3)
            expect(material.config?.clearcoat).toBe(0.8)
        })

        it('should use preset configuration', () => {
            const builder = createMaterialBuilder()
            const material = builder
                .setId('preset-material')
                .setName('Preset Material')
                .setDescription('A material with preset')
                .setIcon('🎯')
                .usePreset('METALLIC')
                .build()

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.METALLIC.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.METALLIC.roughness)
        })

        it('should override preset with custom config', () => {
            const builder = createMaterialBuilder()
            const material = builder
                .setId('override-material')
                .setName('Override Material')
                .setDescription('A material with overridden preset')
                .setIcon('🔄')
                .usePreset('METALLIC')
                .setMetalness(0.9) // Override preset value
                .build()

            expect(material.config?.metalness).toBe(0.9) // Overridden value
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.METALLIC.roughness) // Preset value
        })
    })

    describe('Material Presets', () => {
        it('should create material with METALLIC preset', () => {
            const material = createMaterialWithPreset('METALLIC', {
                id: 'metallic-material',
                name: 'Metallic Material',
                description: 'A metallic material',
                icon: '🔩'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.METALLIC.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.METALLIC.roughness)
            expect(material.config?.clearcoat).toBe(MATERIAL_PRESETS.METALLIC.clearcoat)
        })

        it('should create material with PLASTIC preset', () => {
            const material = createMaterialWithPreset('MATTE', {
                id: 'plastic-material',
                name: 'Plastic Material',
                description: 'A plastic material',
                icon: '🧱'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.MATTE.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.MATTE.roughness)
            expect(material.config?.clearcoat).toBe(MATERIAL_PRESETS.MATTE.clearcoat)
        })

        it('should create material with GLASS preset', () => {
            const material = createMaterialWithPreset('GLASS', {
                id: 'glass-material',
                name: 'Glass Material',
                description: 'A glass material',
                icon: '🪟'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.GLASS.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.GLASS.roughness)
            expect(material.config?.clearcoat).toBe(MATERIAL_PRESETS.GLASS.clearcoat)
        })

        it('should create material with RUBBER preset', () => {
            const material = createMaterialWithPreset('MATTE', {
                id: 'rubber-material',
                name: 'Rubber Material',
                description: 'A rubber material',
                icon: '🔴'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.MATTE.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.MATTE.roughness)
            expect(material.config?.clearcoat).toBe(MATERIAL_PRESETS.MATTE.clearcoat)
        })

        it('should create material with EMISSIVE preset', () => {
            const material = createMaterialWithPreset('NEON', {
                id: 'emissive-material',
                name: 'Emissive Material',
                description: 'An emissive material',
                icon: '💡'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.NEON.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.NEON.roughness)
            expect(material.config?.emissive).toBe(MATERIAL_PRESETS.NEON.emissive)
            expect(material.config?.emissiveIntensity).toBe(MATERIAL_PRESETS.NEON.emissiveIntensity)
        })

        it('should create material with TRANSPARENT preset', () => {
            const material = createMaterialWithPreset('TRANSPARENT', {
                id: 'transparent-material',
                name: 'Transparent Material',
                description: 'A transparent material',
                icon: '👻'
            })

            expect(material.config?.metalness).toBe(MATERIAL_PRESETS.TRANSPARENT.metalness)
            expect(material.config?.roughness).toBe(MATERIAL_PRESETS.TRANSPARENT.roughness)
            expect(material.config?.transparent).toBe(MATERIAL_PRESETS.TRANSPARENT.transparent)
            expect(material.config?.opacity).toBe(MATERIAL_PRESETS.TRANSPARENT.opacity)
        })

        it('should override preset with custom configuration', () => {
            const material = createMaterialWithPreset('METALLIC', {
                id: 'custom-metallic',
                name: 'Custom Metallic',
                description: 'A custom metallic material',
                icon: '⚙️',
                config: {
                    metalness: 0.9, // Custom value
                    roughness: 0.1  // Custom value
                }
            })

            expect(material.config?.metalness).toBe(0.9) // Custom value
            expect(material.config?.roughness).toBe(0.1) // Custom value
            expect(material.config?.clearcoat).toBe(MATERIAL_PRESETS.METALLIC.clearcoat) // Preset value
        })
    })

    describe('Integration Tests', () => {
        it('should work with multiple materials and presets', () => {
            // Create materials with different presets
            const metallic = createMaterialWithPreset('METALLIC', {
                id: 'metallic',
                name: 'Metallic',
                description: 'Metallic material',
                icon: '🔩'
            })

            const plastic = createMaterialWithPreset('MATTE', {
                id: 'plastic',
                name: 'Plastic',
                description: 'Plastic material',
                icon: '🧱'
            })

            // Register materials
            materialFactory.registerMaterial(metallic)
            materialFactory.registerMaterial(plastic)

            // Verify each material has correct configuration
            const metallicRetrieved = materialFactory.getMaterial('metallic')
            expect(metallicRetrieved?.config?.metalness).toBe(MATERIAL_PRESETS.METALLIC.metalness)

            const plasticRetrieved = materialFactory.getMaterial('plastic')
            expect(plasticRetrieved?.config?.metalness).toBe(MATERIAL_PRESETS.MATTE.metalness)
        })

        it('should create Three.js materials with different configurations', () => {
            const metallic = createMaterialWithPreset('METALLIC', {
                id: 'metallic',
                name: 'Metallic',
                description: 'Metallic material',
                icon: '🔩'
            })

            materialFactory.registerMaterial(metallic)

            const threeMaterial = metallic.createMaterial('#FF0000')

            expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: '#FF0000',
                    metalness: MATERIAL_PRESETS.METALLIC.metalness,
                    roughness: MATERIAL_PRESETS.METALLIC.roughness
                })
            )
        })
    })

    describe('useMaterialFactory Hook', () => {
        it('should provide factory methods', () => {
            const { result } = renderHook(() => useMaterialFactory())

            expect(typeof result.current.registerMaterial).toBe('function')
            expect(typeof result.current.getMaterial).toBe('function')
            expect(typeof result.current.listMaterials).toBe('function')
            expect(typeof result.current.unregisterMaterial).toBe('function')
            expect(typeof result.current.hasMaterial).toBe('function')
            expect(typeof result.current.getMaterialCount).toBe('function')
            expect(typeof result.current.clearMaterials).toBe('function')
        })

        it('should work with hook methods', () => {
            const { result } = renderHook(() => useMaterialFactory())

            const material = {
                id: 'hook-material',
                name: 'Hook Material',
                description: 'A material created via hook',
                icon: '🪝',
                createMaterial: jest.fn()
            }

            result.current.registerMaterial(material)
            expect(result.current.hasMaterial('hook-material')).toBe(true)
            expect(result.current.getMaterialCount()).toBe(1)

            const retrieved = result.current.getMaterial('hook-material')
            expect(retrieved).toBe(material)

            result.current.unregisterMaterial('hook-material')
            expect(result.current.hasMaterial('hook-material')).toBe(false)
            expect(result.current.getMaterialCount()).toBe(0)
        })
    })
})
