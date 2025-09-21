import React from 'react'
import { render, screen } from '@testing-library/react'
import { WheelResult } from '@/features/wheel-of-fortune/components/WheelResult'
import { WheelPanel } from '@/types/wheel'

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} />
    },
}))

describe('WheelResult Component', () => {
    const mockResult: WheelPanel = {
        id: '1',
        text: 'Premio Ganador',
        color: '#FF0000'
    }

    const defaultProps = {
        result: mockResult,
        raycastResult: null,
    }

    describe('Rendering', () => {
        it('should render result with basic panel information', () => {
            render(<WheelResult {...defaultProps} />)

            expect(screen.getByText('🎉 ¡Resultado!')).toBeInTheDocument()
            expect(screen.getByRole('heading', { name: 'Premio Ganador' })).toBeInTheDocument()
            expect(screen.getByText(/¡Felicidades! Has ganado:/)).toBeInTheDocument()
        })

        it('should render color indicator when no texture', () => {
            render(<WheelResult {...defaultProps} />)

            const colorIndicator = screen.getByTestId('color-indicator')
            expect(colorIndicator).toHaveStyle({ backgroundColor: '#FF0000' })
        })

        it('should render texture when available', () => {
            const resultWithTexture: WheelPanel = {
                ...mockResult,
                texture: 'data:image/png;base64,test-image'
            }

            render(<WheelResult {...defaultProps} result={resultWithTexture} />)

            const textureImage = screen.getByAltText('Premio Ganador')
            expect(textureImage).toBeInTheDocument()
            expect(textureImage).toHaveAttribute('src', 'data:image/png;base64,test-image')
        })

        it('should prioritize raycast result over mathematical result', () => {
            const raycastResult: WheelPanel = {
                id: '2',
                text: 'Raycast Winner',
                color: '#00FF00'
            }

            render(<WheelResult {...defaultProps} raycastResult={raycastResult} />)

            expect(screen.getByRole('heading', { name: 'Raycast Winner' })).toBeInTheDocument()
            expect(screen.getByText(/¡Felicidades! Has ganado:/)).toBeInTheDocument()
            expect(screen.queryByText('Premio Ganador')).not.toBeInTheDocument()
        })

        it('should show texture from raycast result when available', () => {
            const raycastResult: WheelPanel = {
                id: '2',
                text: 'Raycast Winner',
                color: '#00FF00',
                texture: 'data:image/png;base64,raycast-texture'
            }

            render(<WheelResult {...defaultProps} raycastResult={raycastResult} />)

            const textureImage = screen.getByAltText('Raycast Winner')
            expect(textureImage).toBeInTheDocument()
            expect(textureImage).toHaveAttribute('src', 'data:image/png;base64,raycast-texture')
        })
    })

    describe('Visual Elements', () => {
        it('should have proper styling classes', () => {
            const { container } = render(<WheelResult {...defaultProps} />)

            const resultContainer = container.firstChild
            expect(resultContainer).toHaveClass('animate-pulse', 'rounded-xl', 'bg-white/10', 'p-6', 'backdrop-blur-sm')
        })

        it('should have proper color indicator styling', () => {
            render(<WheelResult {...defaultProps} />)

            const colorIndicator = screen.getByTestId('color-indicator')
            expect(colorIndicator).toHaveClass('mx-auto', 'mb-3', 'size-16', 'rounded-full', 'border-4', 'border-white/30')
        })

        it('should have proper texture image styling', () => {
            const resultWithTexture: WheelPanel = {
                ...mockResult,
                texture: 'data:image/png;base64,test-image'
            }

            render(<WheelResult {...defaultProps} result={resultWithTexture} />)

            const textureImage = screen.getByAltText('Premio Ganador')
            expect(textureImage).toHaveClass('object-cover')
        })

        it('should have proper text styling', () => {
            render(<WheelResult {...defaultProps} />)

            const title = screen.getByText('🎉 ¡Resultado!')
            expect(title).toHaveClass('mb-4', 'text-xl', 'font-bold', 'text-white')

            const winnerText = screen.getByRole('heading', { name: 'Premio Ganador' })
            expect(winnerText).toHaveClass('text-2xl', 'font-bold', 'text-white')

            const congratulationsText = screen.getByText(/¡Felicidades! Has ganado:/)
            expect(congratulationsText).toHaveClass('text-sm', 'text-gray-300')
        })
    })

    describe('Content Display', () => {
        it('should display panel text correctly', () => {
            const customResult: WheelPanel = {
                id: 'custom',
                text: 'Custom Prize Name',
                color: '#123ABC'
            }

            render(<WheelResult {...defaultProps} result={customResult} />)

            expect(screen.getByRole('heading', { name: 'Custom Prize Name' })).toBeInTheDocument()
            expect(screen.getByText(/¡Felicidades! Has ganado:/)).toBeInTheDocument()
        })

        it('should handle special characters in panel text', () => {
            const specialResult: WheelPanel = {
                id: 'special',
                text: 'Premio con ñ, á, é, í, ó, ú y símbolos: @#$%',
                color: '#FF00FF'
            }

            render(<WheelResult {...defaultProps} result={specialResult} />)

            expect(screen.getByRole('heading', { name: 'Premio con ñ, á, é, í, ó, ú y símbolos: @#$%' })).toBeInTheDocument()
        })

        it('should handle very long panel text', () => {
            const longTextResult: WheelPanel = {
                id: 'long',
                text: 'A'.repeat(100),
                color: '#ABCDEF'
            }

            render(<WheelResult {...defaultProps} result={longTextResult} />)

            expect(screen.getByRole('heading', { name: 'A'.repeat(100) })).toBeInTheDocument()
        })

        it('should handle empty panel text gracefully', () => {
            const emptyResult: WheelPanel = {
                id: 'empty',
                text: '',
                color: '#000000'
            }

            render(<WheelResult {...defaultProps} result={emptyResult} />)

            expect(screen.getByText('¡Felicidades! Has ganado:')).toBeInTheDocument()
        })
    })

    describe('Color Handling', () => {
        it('should handle different color formats', () => {
            const colorFormats = [
                '#FF0000',
                '#00FF00',
                '#0000FF',
                '#FFFFFF',
                '#000000',
                '#123ABC',
                '#abc123'
            ]

            colorFormats.forEach((color, index) => {
                const result: WheelPanel = {
                    id: `color-${index}`,
                    text: `Color ${index}`,
                    color
                }

                const { unmount } = render(<WheelResult {...defaultProps} result={result} />)

                const colorIndicator = screen.getByTestId('color-indicator')
                expect(colorIndicator).toHaveStyle({ backgroundColor: color })

                unmount()
            })
        })

        it('should handle invalid color values gracefully', () => {
            const invalidColorResult: WheelPanel = {
                id: 'invalid',
                text: 'Invalid Color',
                color: 'invalid-color'
            }

            render(<WheelResult {...defaultProps} result={invalidColorResult} />)

            const colorIndicator = screen.getByTestId('color-indicator')
            expect(colorIndicator).toHaveStyle({ backgroundColor: 'invalid-color' })
        })
    })

    describe('Texture Handling', () => {
        it('should handle different image formats', () => {
            const imageFormats = [
                'data:image/png;base64,test',
                'data:image/jpeg;base64,test',
                'data:image/gif;base64,test',
                'data:image/webp;base64,test',
                'https://example.com/image.png',
                '/local/path/image.jpg'
            ]

            imageFormats.forEach((texture, index) => {
                const result: WheelPanel = {
                    id: `texture-${index}`,
                    text: `Texture ${index}`,
                    color: '#FF0000',
                    texture
                }

                const { unmount } = render(<WheelResult {...defaultProps} result={result} />)

                const textureImage = screen.getByAltText(`Texture ${index}`)
                expect(textureImage).toHaveAttribute('src', texture)

                unmount()
            })
        })

        it('should handle broken image URLs gracefully', () => {
            const brokenTextureResult: WheelPanel = {
                id: 'broken',
                text: 'Broken Texture',
                color: '#FF0000',
                texture: 'data:image/png;base64,broken-data'
            }

            render(<WheelResult {...defaultProps} result={brokenTextureResult} />)

            const textureImage = screen.getByAltText('Broken Texture')
            expect(textureImage).toBeInTheDocument()
            expect(textureImage).toHaveAttribute('src', 'data:image/png;base64,broken-data')
        })
    })

    describe('Accessibility', () => {
        it('should have proper alt text for images', () => {
            const resultWithTexture: WheelPanel = {
                ...mockResult,
                texture: 'data:image/png;base64,test-image'
            }

            render(<WheelResult {...defaultProps} result={resultWithTexture} />)

            const textureImage = screen.getByAltText('Premio Ganador')
            expect(textureImage).toBeInTheDocument()
        })

        it('should have proper heading structure', () => {
            render(<WheelResult {...defaultProps} />)

            const mainHeading = screen.getByRole('heading', { level: 3 })
            expect(mainHeading).toHaveTextContent('🎉 ¡Resultado!')

            const winnerHeading = screen.getByRole('heading', { level: 4 })
            expect(winnerHeading).toHaveTextContent('Premio Ganador')
        })

        it('should be keyboard accessible', () => {
            render(<WheelResult {...defaultProps} />)

            const resultContainer = screen.getByText('🎉 ¡Resultado!').closest('div')
            expect(resultContainer).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('should handle null raycast result', () => {
            render(<WheelResult {...defaultProps} raycastResult={null} />)

            expect(screen.getByRole('heading', { name: 'Premio Ganador' })).toBeInTheDocument()
        })

        it('should handle undefined raycast result', () => {
            render(<WheelResult {...defaultProps} raycastResult={undefined} />)

            expect(screen.getByRole('heading', { name: 'Premio Ganador' })).toBeInTheDocument()
        })

        it('should handle result with all optional properties', () => {
            const fullResult: WheelPanel = {
                id: 'full',
                text: 'Full Panel',
                color: '#FF0000',
                texture: 'data:image/png;base64,test',
                textureScale: 2,
                textureRotation: 45,
                textureOffsetX: 0.5,
                textureOffsetY: -0.3,
                textPositionX: 1,
                textPositionY: -0.5,
                textPositionZ: 0.2,
                textRotationX: 90,
                textRotationY: 180,
                textRotationZ: 270,
                textScaleX: 1.5,
                textScaleY: 0.8,
                textScaleZ: 2.0
            }

            render(<WheelResult {...defaultProps} result={fullResult} />)

            expect(screen.getByRole('heading', { name: 'Full Panel' })).toBeInTheDocument()
            expect(screen.getByAltText('Full Panel')).toBeInTheDocument()
        })

        it('should handle rapid prop changes', () => {
            const { rerender } = render(<WheelResult {...defaultProps} />)

            expect(screen.getByRole('heading', { name: 'Premio Ganador' })).toBeInTheDocument()

            const newResult: WheelPanel = {
                id: '2',
                text: 'New Winner',
                color: '#00FF00'
            }

            rerender(<WheelResult {...defaultProps} result={newResult} />)

            expect(screen.getByText('New Winner')).toBeInTheDocument()
            expect(screen.queryByText('Premio Ganador')).not.toBeInTheDocument()
        })
    })

    describe('Performance', () => {
        it('should not re-render unnecessarily', () => {
            const { rerender } = render(<WheelResult {...defaultProps} />)

            const initialRender = screen.getByRole('heading', { name: 'Premio Ganador' })

            // Re-render with same props
            rerender(<WheelResult {...defaultProps} />)

            const afterRerender = screen.getByRole('heading', { name: 'Premio Ganador' })
            expect(afterRerender).toBe(initialRender)
        })

        it('should handle large number of rapid updates', () => {
            const { rerender } = render(<WheelResult {...defaultProps} />)

            // Simulate rapid updates
            for (let i = 0; i < 100; i++) {
                const newResult: WheelPanel = {
                    id: `result-${i}`,
                    text: `Result ${i}`,
                    color: `#${i.toString(16).padStart(6, '0')}`
                }

                rerender(<WheelResult {...defaultProps} result={newResult} />)
            }

            expect(screen.getByRole('heading', { name: 'Result 99' })).toBeInTheDocument()
        })
    })
})
