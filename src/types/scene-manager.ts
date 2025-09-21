import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'
import { WheelMaterial } from '@/types/material-manager'

/**
 * Tipos mejorados para el sistema de escenas
 * Eliminando any types y mejorando la seguridad de tipos
 */

export interface WheelSceneProps {
  panels: WheelPanel[]
  isSpinning: boolean
  onSpinComplete: (panel: WheelPanel) => void
  spinDuration: number
  onCurrentPanelChange?: (panel: WheelPanel | null) => void
  onRaycastHit?: (panel: WheelPanel | null) => void
  enableOrbitControls?: boolean
  autorotate?: boolean
  autorotateSpeed?: number
  activeMaterial?: WheelMaterial
}

export interface SceneManager {
  getCurrentScene(): string
  setScene(sceneId: string): void
  listScenes(): SceneInfo[]
  registerScene(scene: SceneInfo): void
  unregisterScene(sceneId: string): boolean
}

export interface SceneInfo {
  id: string
  name: string
  description: string
  icon: string
  component: React.ComponentType<WheelSceneProps>
}

export interface SceneFactory {
  createScene(sceneData: Omit<SceneInfo, 'component'>): SceneInfo
  registerScene(scene: SceneInfo): void
  getScene(sceneId: string): SceneInfo | null
  listScenes(): SceneInfo[]
  unregisterScene(sceneId: string): boolean
  hasScene(sceneId: string): boolean
  getSceneCount(): number
  clearScenes(): void
}

/**
 * Tipos para el sistema de raycasting optimizado
 */
export interface RaycastResult {
  hit: boolean
  panel: WheelPanel | null
  distance: number
  point: THREE.Vector3
}

export interface RaycastConfig {
  throttleMs: number
  maxDistance: number
  recursive: boolean
}

/**
 * Tipos para el sistema de rotación de la ruleta
 */
export interface RotationState {
  speed: number
  isDecelerating: boolean
  startTime: number
  duration: number
}

export interface RotationConfig {
  baseSpeed: number
  maxSpeed: number
  decelerationRate: number
  minSpeed: number
}

/**
 * Tipos para el sistema de texturas
 */
export interface TextureInfo {
  id: string
  texture: THREE.Texture
  loaded: boolean
  error?: string
}

export interface TextureManager {
  loadTexture(panelId: string, url: string): Promise<THREE.Texture>
  getTexture(panelId: string): THREE.Texture | undefined
  hasTexture(panelId: string): boolean
  removeTexture(panelId: string): boolean
  clearTextures(): void
  getTextureCount(): number
}

/**
 * Tipos para el sistema de persistencia
 */
export interface PersistenceConfig {
  storageKey: string
  version: string
  autoSave: boolean
  compression: boolean
}

export interface PersistenceManager {
  save(data: unknown): boolean
  load<T>(): T | null
  clear(): boolean
  hasData(): boolean
  getSize(): number
}

/**
 * Interfaz para el hook useSceneManager
 */
export interface UseSceneManagerReturn {
  scenes: any[]
  activeScene: any | null
  setActiveScene: (scene: any) => void
  getSceneById: (id: string) => any | null
  hasScene: (id: string) => boolean
  getSceneCount: () => number
  clearScenes: () => void
  availableScenes: any[]
  isSceneActive: (sceneId: string) => boolean
  getSceneConfig: (sceneId: string) => any | null
  updateSceneConfig: (sceneId: string, config: any) => void
}

/**
 * Configuración por defecto para escenas
 */
export const DEFAULT_SCENE_CONFIG = {
  id: 'classic',
  name: 'Escena Clásica',
  description: 'Escena tradicional con cielo, océano y estrellas',
  icon: '🌟'
}
