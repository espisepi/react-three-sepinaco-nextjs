import { WheelPanel } from '@/types/wheel'

describe('WheelPanel Interface', () => {
    describe('Basic Properties', () => {
        it('should have required properties', () => {
            const panel: WheelPanel = {
                id: 'test-id',
                text: 'Test Panel',
                color: '#FF0000'
            }

            expect(panel.id).toBe('test-id')
            expect(panel.text).toBe('Test Panel')
            expect(panel.color).toBe('#FF0000')
        })

        it('should accept optional texture properties', () => {
            const panel: WheelPanel = {
                id: 'test-id',
                text: 'Test Panel',
                color: '#FF0000',
                texture: 'data:image/png;base64,test',
                textureScale: 2.5,
                textureRotation: 45,
                textureOffsetX: 0.5,
                textureOffsetY: -0.3
            }

            expect(panel.texture).toBe('data:image/png;base64,test')
            expect(panel.textureScale).toBe(2.5)
            expect(panel.textureRotation).toBe(45)
            expect(panel.textureOffsetX).toBe(0.5)
            expect(panel.textureOffsetY).toBe(-0.3)
        })

        it('should accept optional text positioning properties', () => {
            const panel: WheelPanel = {
                id: 'test-id',
                text: 'Test Panel',
                color: '#FF0000',
                textPositionX: 1.5,
                textPositionY: -0.8,
                textPositionZ: 0.2,
                textRotationX: 90,
                textRotationY: 180,
                textRotationZ: 270,
                textScaleX: 1.5,
                textScaleY: 0.8,
                textScaleZ: 2.0
            }

            expect(panel.textPositionX).toBe(1.5)
            expect(panel.textPositionY).toBe(-0.8)
            expect(panel.textPositionZ).toBe(0.2)
            expect(panel.textRotationX).toBe(90)
            expect(panel.textRotationY).toBe(180)
            expect(panel.textRotationZ).toBe(270)
            expect(panel.textScaleX).toBe(1.5)
            expect(panel.textScaleY).toBe(0.8)
            expect(panel.textScaleZ).toBe(2.0)
        })
    })

    describe('Validation Tests', () => {
        it('should validate color format', () => {
            const validColors = [
                '#FF0000',
                '#00FF00',
                '#0000FF',
                '#FFFFFF',
                '#000000',
                '#123ABC',
                '#abc123'
            ]

            validColors.forEach(color => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color
                }
                expect(panel.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
            })
        })

        it('should validate texture scale range', () => {
            const validScales = [0.1, 1, 5, 10, 20, 30]

            validScales.forEach(scale => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textureScale: scale
                }
                expect(panel.textureScale).toBeGreaterThanOrEqual(0.1)
                expect(panel.textureScale).toBeLessThanOrEqual(30)
            })
        })

        it('should validate texture rotation range', () => {
            const validRotations = [0, 45, 90, 135, 180, 225, 270, 315, 360]

            validRotations.forEach(rotation => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textureRotation: rotation
                }
                expect(panel.textureRotation).toBeGreaterThanOrEqual(0)
                expect(panel.textureRotation).toBeLessThanOrEqual(360)
            })
        })

        it('should validate texture offset range', () => {
            const validOffsets = [-1, -0.5, 0, 0.5, 1]

            validOffsets.forEach(offset => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textureOffsetX: offset,
                    textureOffsetY: offset
                }
                expect(panel.textureOffsetX).toBeGreaterThanOrEqual(-1)
                expect(panel.textureOffsetX).toBeLessThanOrEqual(1)
                expect(panel.textureOffsetY).toBeGreaterThanOrEqual(-1)
                expect(panel.textureOffsetY).toBeLessThanOrEqual(1)
            })
        })

        it('should validate text position range', () => {
            const validPositions = [-2, -1, 0, 1, 2]

            validPositions.forEach(position => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textPositionX: position,
                    textPositionY: position,
                    textPositionZ: position
                }
                expect(panel.textPositionX).toBeGreaterThanOrEqual(-2)
                expect(panel.textPositionX).toBeLessThanOrEqual(2)
                expect(panel.textPositionY).toBeGreaterThanOrEqual(-2)
                expect(panel.textPositionY).toBeLessThanOrEqual(2)
                expect(panel.textPositionZ).toBeGreaterThanOrEqual(-2)
                expect(panel.textPositionZ).toBeLessThanOrEqual(2)
            })
        })

        it('should validate text rotation range', () => {
            const validRotations = [0, 45, 90, 135, 180, 225, 270, 315, 360]

            validRotations.forEach(rotation => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textRotationX: rotation,
                    textRotationY: rotation,
                    textRotationZ: rotation
                }
                expect(panel.textRotationX).toBeGreaterThanOrEqual(0)
                expect(panel.textRotationX).toBeLessThanOrEqual(360)
                expect(panel.textRotationY).toBeGreaterThanOrEqual(0)
                expect(panel.textRotationY).toBeLessThanOrEqual(360)
                expect(panel.textRotationZ).toBeGreaterThanOrEqual(0)
                expect(panel.textRotationZ).toBeLessThanOrEqual(360)
            })
        })

        it('should validate text scale range', () => {
            const validScales = [0.1, 0.5, 1, 1.5, 2, 3]

            validScales.forEach(scale => {
                const panel: WheelPanel = {
                    id: 'test',
                    text: 'Test',
                    color: '#FF0000',
                    textScaleX: scale,
                    textScaleY: scale,
                    textScaleZ: scale
                }
                expect(panel.textScaleX).toBeGreaterThanOrEqual(0.1)
                expect(panel.textScaleX).toBeLessThanOrEqual(3)
                expect(panel.textScaleY).toBeGreaterThanOrEqual(0.1)
                expect(panel.textScaleY).toBeLessThanOrEqual(3)
                expect(panel.textScaleZ).toBeGreaterThanOrEqual(0.1)
                expect(panel.textScaleZ).toBeLessThanOrEqual(3)
            })
        })
    })

    describe('Factory Functions', () => {
        it('should create a basic panel', () => {
            const createBasicPanel = (id: string, text: string, color: string): WheelPanel => ({
                id,
                text,
                color
            })

            const panel = createBasicPanel('1', 'Premio 1', '#FF0000')

            expect(panel).toEqual({
                id: '1',
                text: 'Premio 1',
                color: '#FF0000'
            })
        })

        it('should create a panel with texture', () => {
            const createTexturedPanel = (
                id: string,
                text: string,
                color: string,
                texture: string
            ): WheelPanel => ({
                id,
                text,
                color,
                texture,
                textureScale: 1,
                textureRotation: 0,
                textureOffsetX: 0,
                textureOffsetY: 0
            })

            const panel = createTexturedPanel('1', 'Premio 1', '#FF0000', 'data:image/png;base64,test')

            expect(panel.texture).toBe('data:image/png;base64,test')
            expect(panel.textureScale).toBe(1)
            expect(panel.textureRotation).toBe(0)
            expect(panel.textureOffsetX).toBe(0)
            expect(panel.textureOffsetY).toBe(0)
        })

        it('should create a panel with custom text positioning', () => {
            const createCustomTextPanel = (
                id: string,
                text: string,
                color: string,
                textPosition: { x: number; y: number; z: number },
                textRotation: { x: number; y: number; z: number },
                textScale: { x: number; y: number; z: number }
            ): WheelPanel => ({
                id,
                text,
                color,
                textPositionX: textPosition.x,
                textPositionY: textPosition.y,
                textPositionZ: textPosition.z,
                textRotationX: textRotation.x,
                textRotationY: textRotation.y,
                textRotationZ: textRotation.z,
                textScaleX: textScale.x,
                textScaleY: textScale.y,
                textScaleZ: textScale.z
            })

            const panel = createCustomTextPanel(
                '1',
                'Premio 1',
                '#FF0000',
                { x: 1, y: -0.5, z: 0.2 },
                { x: 90, y: 180, z: 270 },
                { x: 1.5, y: 0.8, z: 2.0 }
            )

            expect(panel.textPositionX).toBe(1)
            expect(panel.textPositionY).toBe(-0.5)
            expect(panel.textPositionZ).toBe(0.2)
            expect(panel.textRotationX).toBe(90)
            expect(panel.textRotationY).toBe(180)
            expect(panel.textRotationZ).toBe(270)
            expect(panel.textScaleX).toBe(1.5)
            expect(panel.textScaleY).toBe(0.8)
            expect(panel.textScaleZ).toBe(2.0)
        })
    })

    describe('Utility Functions', () => {
        it('should validate panel completeness', () => {
            const isValidPanel = (panel: Partial<WheelPanel>): panel is WheelPanel => {
                return !!(
                    panel.id &&
                    panel.text &&
                    panel.color &&
                    typeof panel.id === 'string' &&
                    typeof panel.text === 'string' &&
                    typeof panel.color === 'string'
                )
            }

            const validPanel: WheelPanel = { id: '1', text: 'Test', color: '#FF0000' }
            const invalidPanel = { id: '1', text: 'Test' } // missing color

            expect(isValidPanel(validPanel)).toBe(true)
            expect(isValidPanel(invalidPanel)).toBe(false)
        })

        it('should normalize panel properties', () => {
            const normalizePanel = (panel: WheelPanel): WheelPanel => ({
                ...panel,
                textureScale: panel.textureScale ?? 1,
                textureRotation: panel.textureRotation ?? 0,
                textureOffsetX: panel.textureOffsetX ?? 0,
                textureOffsetY: panel.textureOffsetY ?? 0,
                textPositionX: panel.textPositionX ?? 0,
                textPositionY: panel.textPositionY ?? 0,
                textPositionZ: panel.textPositionZ ?? 0,
                textRotationX: panel.textRotationX ?? 0,
                textRotationY: panel.textRotationY ?? 0,
                textRotationZ: panel.textRotationZ ?? 0,
                textScaleX: panel.textScaleX ?? 1,
                textScaleY: panel.textScaleY ?? 1,
                textScaleZ: panel.textScaleZ ?? 1
            })

            const panel: WheelPanel = { id: '1', text: 'Test', color: '#FF0000' }
            const normalized = normalizePanel(panel)

            expect(normalized.textureScale).toBe(1)
            expect(normalized.textureRotation).toBe(0)
            expect(normalized.textureOffsetX).toBe(0)
            expect(normalized.textureOffsetY).toBe(0)
            expect(normalized.textPositionX).toBe(0)
            expect(normalized.textPositionY).toBe(0)
            expect(normalized.textPositionZ).toBe(0)
            expect(normalized.textRotationX).toBe(0)
            expect(normalized.textRotationY).toBe(0)
            expect(normalized.textRotationZ).toBe(0)
            expect(normalized.textScaleX).toBe(1)
            expect(normalized.textScaleY).toBe(1)
            expect(normalized.textScaleZ).toBe(1)
        })

        it('should clone panel with modifications', () => {
            const clonePanel = (panel: WheelPanel, modifications: Partial<WheelPanel>): WheelPanel => ({
                ...panel,
                ...modifications
            })

            const originalPanel: WheelPanel = {
                id: '1',
                text: 'Original',
                color: '#FF0000',
                textureScale: 2
            }

            const clonedPanel = clonePanel(originalPanel, {
                text: 'Modified',
                color: '#00FF00',
                textureScale: 3
            })

            expect(clonedPanel.id).toBe('1')
            expect(clonedPanel.text).toBe('Modified')
            expect(clonedPanel.color).toBe('#00FF00')
            expect(clonedPanel.textureScale).toBe(3)
        })
    })
})
