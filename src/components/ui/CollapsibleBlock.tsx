import React from 'react'

interface CollapsibleBlockProps {
  children: React.ReactNode
  title: string
  isVisible: boolean
  onToggle: () => void
}

export const CollapsibleBlock: React.FC<CollapsibleBlockProps> = ({
  children,
  title,
  isVisible,
  onToggle
}) => (
  <div data-testid="collapsible-block">
    <button onClick={onToggle} data-testid="toggle-button" aria-expanded={isVisible}>
      {title} - {isVisible ? 'Open' : 'Closed'}
    </button>
    {isVisible && <div data-testid="collapsible-content">{children}</div>}
  </div>
)
