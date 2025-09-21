import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WheelControls } from '@/features/wheel-of-fortune/components/WheelControls'
import { WheelPanel } from '@/types/wheel'

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} />
    },
}))

// Mock CollapsibleBlock component
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

describe('WheelControls Component', () => {
    const mockPanels: WheelPanel[] = [
        { id: '1', text: 'Premio 1', color: '#FF0000' },
        { id: '2', text: 'Premio 2', color: '#00FF00' },
        { id: '3', text: 'Premio 3', color: '#0000FF' },
    ]

    const defaultProps = {
        panels: mockPanels,
        isSpinning: false,
        onSpin: jest.fn(),
        onAddPanel: jest.fn(),
        onRemovePanel: jest.fn(),
        onUpdatePanel: jest.fn(),
        onUpdatePanelColor: jest.fn(),
        onUpdatePanelTexture: jest.fn(),
        onUpdatePanelTextureScale: jest.fn(),
        onUpdatePanelTextureRotation: jest.fn(),
        onUpdatePanelTextureOffset: jest.fn(),
        onUpdateTextPosition: jest.fn(),
        onUpdateTextRotation: jest.fn(),
        onUpdateTextScale: jest.fn(),
        result: null,
        raycastResult: null,
        blockVisibility: {
            panelsManagement: true,
            instructions: true,
        },
        onUpdateBlockVisibility: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Rendering', () => {
        it('should render panels management section', () => {
            render(<WheelControls {...defaultProps} />)

            expect(screen.getByText('Paneles (3)')).toBeInTheDocument()
            expect(screen.getByText('+ Agregar')).toBeInTheDocument()
        })

        it('should render all panels', () => {
            render(<WheelControls {...defaultProps} />)

            expect(screen.getByText('Premio 1')).toBeInTheDocument()
            expect(screen.getByText('Premio 2')).toBeInTheDocument()
            expect(screen.getByText('Premio 3')).toBeInTheDocument()
        })

        it('should render instructions section', () => {
            render(<WheelControls {...defaultProps} />)

            expect(screen.getByText('Instrucciones')).toBeInTheDocument()
        })

        it('should show empty state when no panels', () => {
            render(<WheelControls {...defaultProps} panels={[]} />)

            expect(screen.getByText('No hay paneles en la ruleta')).toBeInTheDocument()
            expect(screen.getByText('Haz clic en "Agregar" para crear el primero')).toBeInTheDocument()
        })
    })

    describe('Panel Management', () => {
        it('should call onAddPanel when add button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const addButton = screen.getByText('+ Agregar')
            await user.click(addButton)

            expect(defaultProps.onAddPanel).toHaveBeenCalledTimes(1)
        })

        it('should call onRemovePanel when remove button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const removeButtons = screen.getAllByText('🗑️')
            await user.click(removeButtons[0])

            expect(defaultProps.onRemovePanel).toHaveBeenCalledWith('1')
        })

        it('should disable remove button when only one panel exists', () => {
            const singlePanel = [mockPanels[0]]
            render(<WheelControls {...defaultProps} panels={singlePanel} />)

            const removeButton = screen.getByText('🗑️')
            expect(removeButton).toBeDisabled()
        })

        it('should show edit mode when edit button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            expect(screen.getByDisplayValue('Premio 1')).toBeInTheDocument()
            expect(screen.getByText('✓')).toBeInTheDocument()
            expect(screen.getByText('✗')).toBeInTheDocument()
        })

        it('should save panel text when save button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Nuevo Premio')

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            expect(defaultProps.onUpdatePanel).toHaveBeenCalledWith('1', 'Nuevo Premio')
        })

        it('should cancel edit when cancel button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Texto Temporal')

            const cancelButton = screen.getByText('✗')
            await user.click(cancelButton)

            expect(defaultProps.onUpdatePanel).not.toHaveBeenCalled()
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
        })

        it('should save on Enter key press', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Nuevo Premio')
            await user.keyboard('{Enter}')

            expect(defaultProps.onUpdatePanel).toHaveBeenCalledWith('1', 'Nuevo Premio')
        })

        it('should cancel on Escape key press', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, 'Texto Temporal')
            await user.keyboard('{Escape}')

            expect(defaultProps.onUpdatePanel).not.toHaveBeenCalled()
            expect(screen.getByText('Premio 1')).toBeInTheDocument()
        })
    })

    describe('Color Management', () => {
        it('should enter color edit mode when color circle is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            expect(screen.getByDisplayValue('#FF0000')).toBeInTheDocument()
            expect(screen.getByTitle('Confirmar color')).toBeInTheDocument()
            expect(screen.getByTitle('Restaurar color anterior')).toBeInTheDocument()
        })

        it('should update color in real time', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            const colorInput = screen.getByDisplayValue('#FF0000')
            await user.clear(colorInput)
            await user.type(colorInput, '#00FFFF')

            expect(defaultProps.onUpdatePanelColor).toHaveBeenCalledWith('1', '#00FFFF')
        })

        it('should save color when confirm button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            const confirmButton = screen.getByTitle('Confirmar color')
            await user.click(confirmButton)

            // Color should already be updated in real time
            expect(defaultProps.onUpdatePanelColor).toHaveBeenCalled()
        })

        it('should restore original color when cancel button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            const colorInput = screen.getByDisplayValue('#FF0000')
            await user.clear(colorInput)
            await user.type(colorInput, '#00FFFF')

            const cancelButton = screen.getByTitle('Restaurar color anterior')
            await user.click(cancelButton)

            expect(defaultProps.onUpdatePanelColor).toHaveBeenCalledWith('1', '#FF0000')
        })
    })

    describe('Texture Management', () => {
        it('should handle image upload', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const uploadButtons = screen.getAllByText('📷 Subir')
            const file = new File(['test'], 'test.png', { type: 'image/png' })

            await user.upload(screen.getByLabelText(/Imagen de textura/i), file)

            expect(defaultProps.onUpdatePanelTexture).toHaveBeenCalled()
        })

        it('should show texture controls when texture is present', () => {
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            expect(screen.getByAltText('Texture for Premio 1')).toBeInTheDocument()
            expect(screen.getByTitle('Mostrar controles')).toBeInTheDocument()
        })

        it('should toggle texture controls visibility', async () => {
            const user = userEvent.setup()
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            const toggleButton = screen.getByTitle('Mostrar controles')
            await user.click(toggleButton)

            expect(screen.getByText('Escala: 1x')).toBeInTheDocument()
            expect(screen.getByText('Rotación: 0°')).toBeInTheDocument()
        })

        it('should update texture scale', async () => {
            const user = userEvent.setup()
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            const toggleButton = screen.getByTitle('Mostrar controles')
            await user.click(toggleButton)

            const scaleButton = screen.getByTitle('Grande (2x)')
            await user.click(scaleButton)

            expect(defaultProps.onUpdatePanelTextureScale).toHaveBeenCalledWith('1', 2)
        })

        it('should update texture rotation', async () => {
            const user = userEvent.setup()
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            const toggleButton = screen.getByTitle('Mostrar controles')
            await user.click(toggleButton)

            const rotationButton = screen.getByTitle('90° - Rotación derecha')
            await user.click(rotationButton)

            expect(defaultProps.onUpdatePanelTextureRotation).toHaveBeenCalledWith('1', 90)
        })

        it('should update texture offset', async () => {
            const user = userEvent.setup()
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            const toggleButton = screen.getByTitle('Mostrar controles')
            await user.click(toggleButton)

            const offsetButton = screen.getByTitle('Derecha (1)')
            await user.click(offsetButton)

            expect(defaultProps.onUpdatePanelTextureOffset).toHaveBeenCalledWith('1', 1, 0)
        })

        it('should remove texture when remove button is clicked', async () => {
            const user = userEvent.setup()
            const panelsWithTexture = [
                { ...mockPanels[0], texture: 'data:image/png;base64,test' }
            ]
            render(<WheelControls {...defaultProps} panels={panelsWithTexture} />)

            const removeTextureButton = screen.getByTitle('Eliminar textura')
            await user.click(removeTextureButton)

            expect(defaultProps.onUpdatePanelTexture).toHaveBeenCalledWith('1', null)
        })
    })

    describe('Text Controls', () => {
        it('should toggle text controls visibility', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            expect(screen.getByText('Controles de Texto')).toBeInTheDocument()
            expect(screen.getByText('Posición')).toBeInTheDocument()
            expect(screen.getByText('Rotación')).toBeInTheDocument()
            expect(screen.getByText('Escala')).toBeInTheDocument()
        })

        it('should update text position', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            const positionSlider = screen.getByLabelText(/X: 0.00/)
            fireEvent.change(positionSlider, { target: { value: '1.5' } })

            expect(defaultProps.onUpdateTextPosition).toHaveBeenCalledWith('1', 1.5, 0, 0)
        })

        it('should update text rotation', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            const rotationSlider = screen.getByLabelText(/X: 0°/)
            fireEvent.change(rotationSlider, { target: { value: '90' } })

            expect(defaultProps.onUpdateTextRotation).toHaveBeenCalledWith('1', 90, 0, 0)
        })

        it('should update text scale', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            const scaleSlider = screen.getByLabelText(/X: 1.00/)
            fireEvent.change(scaleSlider, { target: { value: '2.0' } })

            expect(defaultProps.onUpdateTextScale).toHaveBeenCalledWith('1', 2.0, 1, 1)
        })

        it('should reset text properties when reset button is clicked', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const textControlsButton = screen.getAllByTitle('Mostrar controles de texto')[0]
            await user.click(textControlsButton)

            const resetButton = screen.getByText('🔄 Restablecer Texto')
            await user.click(resetButton)

            expect(defaultProps.onUpdateTextPosition).toHaveBeenCalledWith('1', 0, 0, 0)
            expect(defaultProps.onUpdateTextRotation).toHaveBeenCalledWith('1', 0, 0, 0)
            expect(defaultProps.onUpdateTextScale).toHaveBeenCalledWith('1', 1, 1, 1)
        })
    })

    describe('Block Visibility', () => {
        it('should toggle panels management visibility', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const toggleButton = screen.getByTestId('toggle-button')
            await user.click(toggleButton)

            expect(defaultProps.onUpdateBlockVisibility).toHaveBeenCalledWith('panelsManagement', false)
        })

        it('should toggle instructions visibility', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const instructionToggles = screen.getAllByTestId('toggle-button')
            await user.click(instructionToggles[1])

            expect(defaultProps.onUpdateBlockVisibility).toHaveBeenCalledWith('instructions', false)
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            render(<WheelControls {...defaultProps} />)

            expect(screen.getByLabelText(/Imagen de textura/i)).toBeInTheDocument()
        })

        it('should have proper titles for buttons', () => {
            render(<WheelControls {...defaultProps} />)

            expect(screen.getByTitle('Haz clic para cambiar el color')).toBeInTheDocument()
            expect(screen.getByTitle('Mostrar controles de texto')).toBeInTheDocument()
        })

        it('should support keyboard navigation', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            editButtons[0].focus()
            await user.keyboard('{Enter}')

            expect(screen.getByDisplayValue('Premio 1')).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty panel text gracefully', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            // Should not call onUpdatePanel with empty text
            expect(defaultProps.onUpdatePanel).not.toHaveBeenCalled()
        })

        it('should handle very long panel text', async () => {
            const user = userEvent.setup()
            const longText = 'A'.repeat(1000)
            render(<WheelControls {...defaultProps} />)

            const editButtons = screen.getAllByText('✏️')
            await user.click(editButtons[0])

            const input = screen.getByDisplayValue('Premio 1')
            await user.clear(input)
            await user.type(input, longText)

            const saveButton = screen.getByText('✓')
            await user.click(saveButton)

            expect(defaultProps.onUpdatePanel).toHaveBeenCalledWith('1', longText)
        })

        it('should handle invalid color values', async () => {
            const user = userEvent.setup()
            render(<WheelControls {...defaultProps} />)

            const colorCircles = screen.getAllByTitle('Haz clic para cambiar el color')
            await user.click(colorCircles[0])

            const colorInput = screen.getByDisplayValue('#FF0000')
            await user.clear(colorInput)
            await user.type(colorInput, 'invalid-color')

            // Should still call the update function (validation happens elsewhere)
            expect(defaultProps.onUpdatePanelColor).toHaveBeenCalledWith('1', 'invalid-color')
        })
    })
})
