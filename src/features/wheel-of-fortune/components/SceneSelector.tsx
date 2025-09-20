'use client'

import React, { memo, useCallback } from 'react'
import { WheelScene } from '@/types/scene-manager'
import { CollapsibleBlock } from '@/components/ui/CollapsibleBlock'

interface SceneSelectorProps {
  /** Escenas disponibles */
  scenes: WheelScene[]
  /** Escena activa actual */
  activeSceneId: string
  /** Callback cuando se selecciona una escena */
  onSceneSelect: (sceneId: string) => void
  /** Visibilidad del bloque */
  isVisible: boolean
  /** Callback para cambiar visibilidad */
  onToggleVisibility: (isVisible: boolean) => void
  /** Clase CSS adicional */
  className?: string
}

/**
 * Componente selector de escenas con diseño responsive y accesible
 * Implementa el patrón Compound Component para máxima flexibilidad
 */
export const SceneSelector = memo(({
  scenes,
  activeSceneId,
  onSceneSelect,
  isVisible,
  onToggleVisibility,
  className = ''
}: SceneSelectorProps) => {
  const handleSceneSelect = useCallback((sceneId: string) => {
    if (sceneId !== activeSceneId) {
      onSceneSelect(sceneId)
    }
  }, [activeSceneId, onSceneSelect])

  const handleToggleVisibility = useCallback(() => {
    onToggleVisibility(!isVisible)
  }, [isVisible, onToggleVisibility])

  return (
    <div className={`space-y-4 ${className}`}>
      <CollapsibleBlock
        title={`Escenas 3D (${scenes.length})`}
        icon="🎬"
        isVisible={isVisible}
        onToggle={handleToggleVisibility}
      >
        <div className="space-y-3">
          {/* Información de la escena activa */}
          {scenes.length > 0 && (
            <div className="rounded-lg border border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {scenes.find(s => s.id === activeSceneId)?.icon || '🎬'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {scenes.find(s => s.id === activeSceneId)?.name || 'Escena Desconocida'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {scenes.find(s => s.id === activeSceneId)?.description || 'Sin descripción'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grid de botones de escenas */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.map((scene) => {
              const isActive = scene.id === activeSceneId

              return (
                <SceneButton
                  key={scene.id}
                  scene={scene}
                  isActive={isActive}
                  onClick={() => handleSceneSelect(scene.id)}
                />
              )
            })}
          </div>

          {/* Mensaje cuando no hay escenas */}
          {scenes.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              <div className="mb-2 text-4xl">🎬</div>
              <p className="text-lg font-medium">No hay escenas disponibles</p>
              <p className="text-sm">Las escenas se registrarán automáticamente</p>
            </div>
          )}
        </div>
      </CollapsibleBlock>
    </div>
  )
})

SceneSelector.displayName = 'SceneSelector'

/**
 * Componente botón individual para cada escena
 * Implementa estados visuales claros y feedback táctil
 */
interface SceneButtonProps {
  scene: WheelScene
  isActive: boolean
  onClick: () => void
}

const SceneButton = memo(({ scene, isActive, onClick }: SceneButtonProps) => {
  const baseClasses = `
    group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 
    hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
  `

  const activeClasses = `
    border-green-400 bg-gradient-to-r from-green-500/30 to-emerald-500/30 
    shadow-green-500/20 focus:ring-green-500
  `

  const inactiveClasses = `
    border-gray-400/30 bg-gradient-to-r from-gray-500/20 to-slate-500/20 
    hover:border-blue-400/50 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20
    focus:ring-blue-500
  `

  const buttonClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      aria-pressed={isActive}
      aria-label={`Cambiar a escena ${scene.name}`}
      title={scene.description}
    >
      {/* Indicador de estado activo */}
      {isActive && (
        <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg">
          ✓
        </div>
      )}

      {/* Contenido del botón */}
      <div className="flex flex-col items-center space-y-2 text-center">
        {/* Icono */}
        <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
          {scene.icon}
        </div>

        {/* Nombre */}
        <div className="space-y-1">
          <h4 className={`font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
            }`}>
            {scene.name}
          </h4>

          {/* Descripción (solo en pantallas grandes) */}
          <p className={`hidden text-xs transition-colors lg:block ${isActive ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
            }`}>
            {scene.description}
          </p>
        </div>

        {/* Indicador de estado */}
        <div className={`size-2 rounded-full transition-colors ${isActive ? 'bg-green-400' : 'bg-gray-500 group-hover:bg-blue-400'
          }`} />
      </div>

      {/* Efecto de hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  )
})

SceneButton.displayName = 'SceneButton'

/**
 * Componente de información adicional de escenas
 * Muestra estadísticas y detalles técnicos
 */
interface SceneInfoProps {
  scenes: WheelScene[]
  activeSceneId: string
}

export const SceneInfo = memo(({ scenes, activeSceneId }: SceneInfoProps) => {
  const activeScene = scenes.find(s => s.id === activeSceneId)

  if (!activeScene) return null

  return (
    <div className="rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm">
      <h4 className="mb-2 text-sm font-semibold text-purple-300">Información de la Escena</h4>
      <div className="space-y-1 text-xs text-gray-300">
        <div className="flex justify-between">
          <span>ID:</span>
          <span className="font-mono text-white">{activeScene.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Total escenas:</span>
          <span className="text-white">{scenes.length}</span>
        </div>
        {activeScene.config && (
          <div className="flex justify-between">
            <span>Configuración:</span>
            <span className="text-white">{Object.keys(activeScene.config).length} propiedades</span>
          </div>
        )}
      </div>
    </div>
  )
})

SceneInfo.displayName = 'SceneInfo'
