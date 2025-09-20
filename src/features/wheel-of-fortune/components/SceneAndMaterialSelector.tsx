'use client'

import React, { memo, useState, useCallback } from 'react'
import { SceneSelector } from './SceneSelector'
import { MaterialSelector } from './MaterialSelector'
import { WheelScene } from '@/types/scene-manager'
import { WheelMaterial } from '@/types/material-manager'

interface SceneAndMaterialSelectorProps {
    /** Escenas disponibles */
    scenes: WheelScene[]
    /** Escena activa actual */
    activeSceneId: string
    /** Callback cuando se selecciona una escena */
    onSceneSelect: (sceneId: string) => void
    /** Materiales disponibles */
    materials: WheelMaterial[]
    /** Material activo actual */
    activeMaterialId: string
    /** Callback cuando se selecciona un material */
    onMaterialSelect: (materialId: string) => void
    /** Clase CSS adicional */
    className?: string
}

/**
 * Componente combinado que integra el selector de escenas y materiales
 * Proporciona una interfaz unificada para gestionar ambos aspectos
 */
export const SceneAndMaterialSelector = memo(({
    scenes,
    activeSceneId,
    onSceneSelect,
    materials,
    activeMaterialId,
    onMaterialSelect,
    className = ''
}: SceneAndMaterialSelectorProps) => {
    const [scenesVisible, setScenesVisible] = useState(true)
    const [materialsVisible, setMaterialsVisible] = useState(true)

    const handleToggleScenesVisibility = useCallback((isVisible: boolean) => {
        setScenesVisible(isVisible)
    }, [])

    const handleToggleMaterialsVisibility = useCallback((isVisible: boolean) => {
        setMaterialsVisible(isVisible)
    }, [])

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Selector de Escenas */}
            <SceneSelector
                scenes={scenes}
                activeSceneId={activeSceneId}
                onSceneSelect={onSceneSelect}
                isVisible={scenesVisible}
                onToggleVisibility={handleToggleScenesVisibility}
            />

            {/* Selector de Materiales */}
            <MaterialSelector
                materials={materials}
                activeMaterialId={activeMaterialId}
                onMaterialSelect={onMaterialSelect}
                isVisible={materialsVisible}
                onToggleVisibility={handleToggleMaterialsVisibility}
            />

            {/* Información combinada */}
            <CombinedInfo
                activeSceneId={activeSceneId}
                activeMaterialId={activeMaterialId}
                scenes={scenes}
                materials={materials}
            />
        </div>
    )
})

SceneAndMaterialSelector.displayName = 'SceneAndMaterialSelector'

/**
 * Componente de información combinada
 * Muestra detalles tanto de la escena como del material activos
 */
interface CombinedInfoProps {
    activeSceneId: string
    activeMaterialId: string
    scenes: WheelScene[]
    materials: WheelMaterial[]
}

const CombinedInfo = memo(({ activeSceneId, activeMaterialId, scenes, materials }: CombinedInfoProps) => {
    const activeScene = scenes.find(s => s.id === activeSceneId)
    const activeMaterial = materials.find(m => m.id === activeMaterialId)

    if (!activeScene || !activeMaterial) return null

    return (
        <div className="rounded-lg border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 backdrop-blur-sm">
            <h4 className="mb-3 text-sm font-semibold text-cyan-300">Configuración Actual</h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Información de la Escena */}
                <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-300">Escena Activa</h5>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">{activeScene.icon}</span>
                        <div>
                            <p className="text-sm font-medium text-white">{activeScene.name}</p>
                            <p className="text-xs text-gray-400">{activeScene.description}</p>
                        </div>
                    </div>
                </div>

                {/* Información del Material */}
                <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-300">Material Activo</h5>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">{activeMaterial.icon}</span>
                        <div>
                            <p className="text-sm font-medium text-white">{activeMaterial.name}</p>
                            <p className="text-xs text-gray-400">{activeMaterial.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                <div className="text-center">
                    <p className="text-xs text-gray-400">Escenas</p>
                    <p className="text-lg font-semibold text-white">{scenes.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">Materiales</p>
                    <p className="text-lg font-semibold text-white">{materials.length}</p>
                </div>
            </div>
        </div>
    )
})

CombinedInfo.displayName = 'CombinedInfo'

/**
 * Componente de vista previa rápida
 * Muestra una representación visual de la combinación escena + material
 */
interface QuickPreviewProps {
    activeSceneId: string
    activeMaterialId: string
    scenes: WheelScene[]
    materials: WheelMaterial[]
}

export const QuickPreview = memo(({ activeSceneId, activeMaterialId, scenes, materials }: QuickPreviewProps) => {
    const activeScene = scenes.find(s => s.id === activeSceneId)
    const activeMaterial = materials.find(m => m.id === activeMaterialId)

    if (!activeScene || !activeMaterial) return null

    return (
        <div className="rounded-lg border border-green-400/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 backdrop-blur-sm">
            <h4 className="mb-3 text-sm font-semibold text-green-300">Vista Previa</h4>

            <div className="flex items-center justify-center space-x-4">
                {/* Icono de escena */}
                <div className="flex flex-col items-center space-y-1">
                    <div className="text-3xl">{activeScene.icon}</div>
                    <p className="text-xs text-gray-300">{activeScene.name}</p>
                </div>

                {/* Separador */}
                <div className="text-2xl text-gray-500">+</div>

                {/* Icono de material */}
                <div className="flex flex-col items-center space-y-1">
                    <div className="text-3xl">{activeMaterial.icon}</div>
                    <p className="text-xs text-gray-300">{activeMaterial.name}</p>
                </div>
            </div>

            <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">
                    Combinación: <span className="text-white">{activeScene.name} + {activeMaterial.name}</span>
                </p>
            </div>
        </div>
    )
})

QuickPreview.displayName = 'QuickPreview'
