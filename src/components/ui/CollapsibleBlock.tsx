'use client'

import { ReactNode } from 'react'

interface CollapsibleBlockProps {
  title: string
  isVisible: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
  icon?: string
}

export function CollapsibleBlock({
  title,
  isVisible,
  onToggle,
  children,
  className = '',
  icon = '📦'
}: CollapsibleBlockProps) {
  return (
    <div className={`rounded-2xl bg-white/10 p-6 backdrop-blur-sm ${className}`}>
      {/* Header con título y botón de toggle */}
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='flex items-center gap-2 text-xl font-bold text-white'>
          <span>{icon}</span>
          {title}
        </h3>
        <button
          onClick={onToggle}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ${isVisible
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
            }`}
          title={isVisible ? 'Ocultar contenido' : 'Mostrar contenido'}
        >
          {isVisible ? '👁️ Ocultar' : '👁️‍🗨️ Mostrar'}
        </button>
      </div>

      {/* Contenido del bloque */}
      {isVisible && (
        <div className='transition-all duration-300 ease-in-out'>
          {children}
        </div>
      )}
    </div>
  )
}
