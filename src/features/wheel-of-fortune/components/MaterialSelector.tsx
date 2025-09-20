'use client'

import React, { memo, useCallback } from 'react'
import { WheelMaterial } from '@/types/material-manager'
import { CollapsibleBlock } from '@/components/ui/CollapsibleBlock'

interface MaterialSelectorProps {
    /** Materiales disponibles */
    materials: WheelMaterial[]
    /** Material activo actual */
    activeMaterialId: string
    /** Callback cuando se selecciona un material */
    onMaterialSelect: (materialId: string) => void
    /** Visibilidad del bloque */
    isVisible: boolean
    /** Callback para cambiar visibilidad */
    onToggleVisibility: (isVisible: boolean) => void
    /** Clase CSS adicional */
    className?: string
}

/**
 * Componente selector de materiales con diseño responsive y accesible
 * Implementa el patrón Compound Component para máxima flexibilidad
 */
export const MaterialSelector = memo(({
    materials,
    activeMaterialId,
    onMaterialSelect,
    isVisible,
    onToggleVisibility,
    className = ''
}: MaterialSelectorProps) => {
    const handleMaterialSelect = useCallback((materialId: string) => {
        if (materialId !== activeMaterialId) {
            onMaterialSelect(materialId)
        }
    }, [activeMaterialId, onMaterialSelect])

    const handleToggleVisibility = useCallback(() => {
        onToggleVisibility(!isVisible)
    }, [isVisible, onToggleVisibility])

    return (
        <div className={`space-y-4 ${className}`}>
            <CollapsibleBlock
                title={`Materiales (${materials.length})`}
                icon="🎨"
                isVisible={isVisible}
                onToggle={handleToggleVisibility}
            >
                <div className="space-y-3">
                    {/* Información del material activo */}
                    {materials.length > 0 && (
                        <div className="rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">
                                    {materials.find(m => m.id === activeMaterialId)?.icon || '🎨'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">
                                        {materials.find(m => m.id === activeMaterialId)?.name || 'Material Desconocido'}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        {materials.find(m => m.id === activeMaterialId)?.description || 'Sin descripción'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid de botones de materiales */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {materials.map((material) => {
                            const isActive = material.id === activeMaterialId

                            return (
                                <MaterialButton
                                    key={material.id}
                                    material={material}
                                    isActive={isActive}
                                    onClick={() => handleMaterialSelect(material.id)}
                                />
                            )
                        })}
                    </div>

                    {/* Mensaje cuando no hay materiales */}
                    {materials.length === 0 && (
                        <div className="py-8 text-center text-gray-400">
                            <div className="mb-2 text-4xl">🎨</div>
                            <p className="text-lg font-medium">No hay materiales disponibles</p>
                            <p className="text-sm">Los materiales se registrarán automáticamente</p>
                        </div>
                    )}
                </div>
            </CollapsibleBlock>
        </div>
    )
})

MaterialSelector.displayName = 'MaterialSelector'

/**
 * Componente botón individual para cada material
 * Implementa estados visuales claros y feedback táctil
 */
interface MaterialButtonProps {
    material: WheelMaterial
    isActive: boolean
    onClick: () => void
}

const MaterialButton = memo(({ material, isActive, onClick }: MaterialButtonProps) => {
    const baseClasses = `
    group relative cursor-pointer overflow-hidden rounded-xl border-2 p-3 transition-all duration-300 
    hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
  `

    const activeClasses = `
    border-purple-400 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
    shadow-purple-500/20 focus:ring-purple-500
  `

    const inactiveClasses = `
    border-gray-400/30 bg-gradient-to-r from-gray-500/20 to-slate-500/20 
    hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20
    focus:ring-purple-500
  `

    const buttonClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            aria-pressed={isActive}
            aria-label={`Cambiar a material ${material.name}`}
            title={material.description}
        >
            {/* Indicador de estado activo */}
            {isActive && (
                <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white shadow-lg">
                    ✓
                </div>
            )}

            {/* Contenido del botón */}
            <div className="flex flex-col items-center space-y-2 text-center">
                {/* Icono */}
                <div className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    {material.icon}
                </div>

                {/* Nombre */}
                <div className="space-y-1">
                    <h4 className={`text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        }`}>
                        {material.name}
                    </h4>

                    {/* Descripción (solo en pantallas grandes) */}
                    <p className={`hidden text-xs transition-colors lg:block ${isActive ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
                        }`}>
                        {material.description}
                    </p>
                </div>

                {/* Indicador de estado */}
                <div className={`size-2 rounded-full transition-colors ${isActive ? 'bg-purple-400' : 'bg-gray-500 group-hover:bg-purple-400'
                    }`} />
            </div>

            {/* Efecto de hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
    )
})

MaterialButton.displayName = 'MaterialButton'

/**
 * Componente de información adicional de materiales
 * Muestra estadísticas y detalles técnicos
 */
interface MaterialInfoProps {
    materials: WheelMaterial[]
    activeMaterialId: string
}

export const MaterialInfo = memo(({ materials, activeMaterialId }: MaterialInfoProps) => {
    const activeMaterial = materials.find(m => m.id === activeMaterialId)

    if (!activeMaterial) return null

    const config = activeMaterial.config || {}

    return (
        <div className="rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm">
            <h4 className="mb-2 text-sm font-semibold text-purple-300">Propiedades del Material</h4>
            <div className="space-y-1 text-xs text-gray-300">
                <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-white">{activeMaterial.id}</span>
                </div>
                <div className="flex justify-between">
                    <span>Total materiales:</span>
                    <span className="text-white">{materials.length}</span>
                </div>
                {config.metalness !== undefined && (
                    <div className="flex justify-between">
                        <span>Metalicidad:</span>
                        <span className="text-white">{(config.metalness * 100).toFixed(0)}%</span>
                    </div>
                )}
                {config.roughness !== undefined && (
                    <div className="flex justify-between">
                        <span>Rugosidad:</span>
                        <span className="text-white">{(config.roughness * 100).toFixed(0)}%</span>
                    </div>
                )}
                {config.transparent && (
                    <div className="flex justify-between">
                        <span>Transparencia:</span>
                        <span className="text-white">{(config.opacity * 100).toFixed(0)}%</span>
                    </div>
                )}
                {config.emissive && (
                    <div className="flex justify-between">
                        <span>Emisión:</span>
                        <span className="text-white">Sí</span>
                    </div>
                )}
            </div>
        </div>
    )
})

MaterialInfo.displayName = 'MaterialInfo'

/**
 * Componente de vista previa del material
 * Muestra una representación visual del material seleccionado
 */
interface MaterialPreviewProps {
    material: WheelMaterial
    panelColor?: string
}

export const MaterialPreview = memo(({ material, panelColor = '#ffffff' }: MaterialPreviewProps) => {
    const previewMaterial = material.createMaterial(panelColor)

    return (
        <div className="rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm">
            <h4 className="mb-3 text-sm font-semibold text-purple-300">Vista Previa</h4>
            <div className="flex items-center space-x-3">
                {/* Círculo de vista previa */}
                <div
                    className="size-12 rounded-full border-2 border-white/20 shadow-lg"
                    style={{
                        backgroundColor: panelColor,
                        opacity: previewMaterial.transparent ? previewMaterial.opacity : 1,
                        boxShadow: (previewMaterial as any).emissive ? `0 0 20px ${(previewMaterial as any).emissive}` : 'none'
                    }}
                />
                <div className="flex-1">
                    <p className="text-xs text-gray-300">
                        Color: <span className="font-mono text-white">{panelColor}</span>
                    </p>
                    <p className="text-xs text-gray-300">
                        Tipo: <span className="text-white">{previewMaterial.type}</span>
                    </p>
                </div>
            </div>
        </div>
    )
})

MaterialPreview.displayName = 'MaterialPreview'
