import React from 'react'
import * as THREE from 'three'
import { WheelPanel } from '@/types/wheel'
import { WheelMaterial } from '@/types/material-manager'

/**
 * Arquitectura limpia siguiendo principios SOLID
 * Separación de responsabilidades y interfaces bien definidas
 */

// ===== SINGLE RESPONSIBILITY PRINCIPLE =====

/**
 * Interfaz para el cálculo de ángulos de segmentos
 * Responsabilidad única: calcular ángulos
 */
export interface IAngleCalculator {
  calculateSegmentAngles(totalPanels: number): SegmentAngle[]
  calculateMidAngle(startAngle: number, endAngle: number): number
}

/**
 * Interfaz para el manejo de texturas
 * Responsabilidad única: gestionar texturas
 */
export interface ITextureManager {
  loadTexture(panelId: string, url: string): Promise<THREE.Texture>
  getTexture(panelId: string): THREE.Texture | undefined
  hasTexture(panelId: string): boolean
  removeTexture(panelId: string): boolean
  clearTextures(): void
}

/**
 * Interfaz para el cálculo de transformaciones de texto
 * Responsabilidad única: calcular transformaciones 3D
 */
export interface ITextTransformCalculator {
  calculateTextTransform(panel: WheelPanel, midAngle: number): TextTransform
}

/**
 * Interfaz para el manejo de materiales
 * Responsabilidad única: gestionar materiales
 */
export interface IMaterialManager {
  createMaterial(panel: WheelPanel, activeMaterial?: WheelMaterial): THREE.Material
  disposeMaterial(material: THREE.Material): void
}

// ===== OPEN/CLOSED PRINCIPLE =====

/**
 * Clase base abstracta para calculadores de ángulos
 * Abierta para extensión, cerrada para modificación
 */
export abstract class BaseAngleCalculator implements IAngleCalculator {
  abstract calculateSegmentAngles(totalPanels: number): SegmentAngle[]

  calculateMidAngle(startAngle: number, endAngle: number): number {
    return startAngle + (endAngle - startAngle) / 2
  }
}

/**
 * Implementación concreta del calculador de ángulos
 */
export class StandardAngleCalculator extends BaseAngleCalculator {
  calculateSegmentAngles(totalPanels: number): SegmentAngle[] {
    const anglePerSegment = (Math.PI * 2) / totalPanels

    return Array.from({ length: totalPanels }, (_, i) => ({
      startAngle: i * anglePerSegment,
      endAngle: (i + 1) * anglePerSegment,
      midAngle: this.calculateMidAngle(i * anglePerSegment, (i + 1) * anglePerSegment),
      anglePerSegment
    }))
  }
}

// ===== LISKOV SUBSTITUTION PRINCIPLE =====

/**
 * Interfaz base para renderizadores de segmentos
 * Cualquier implementación debe ser sustituible
 */
export interface ISegmentRenderer {
  render(panel: WheelPanel, index: number, totalPanels: number): React.ReactElement
}

/**
 * Implementación estándar del renderizador de segmentos
 */
export class StandardSegmentRenderer implements ISegmentRenderer {
  constructor(
    private angleCalculator: IAngleCalculator,
    private textTransformCalculator: ITextTransformCalculator,
    private materialManager: IMaterialManager
  ) { }

  render(panel: WheelPanel, index: number, totalPanels: number): React.ReactElement {
    const angles = this.angleCalculator.calculateSegmentAngles(totalPanels)[index]
    const textTransform = this.textTransformCalculator.calculateTextTransform(panel, angles.midAngle)
    const material = this.materialManager.createMaterial(panel)

    // Implementación del renderizado...
    return React.createElement('mesh', {
      key: panel.id,
      userData: { panelIndex: index }
    })
  }
}

// ===== INTERFACE SEGREGATION PRINCIPLE =====

/**
 * Interfaz específica para operaciones de geometría
 * Solo incluye métodos relacionados con geometría
 */
export interface IGeometryOperations {
  createCylinderGeometry(radius: number, height: number, segments: number): THREE.CylinderGeometry
  createConeGeometry(radius: number, height: number, segments: number): THREE.ConeGeometry
  disposeGeometry(geometry: THREE.BufferGeometry): void
}

/**
 * Interfaz específica para operaciones de materiales
 * Solo incluye métodos relacionados con materiales
 */
export interface IMaterialOperations {
  createBasicMaterial(color: string): THREE.MeshBasicMaterial
  createPhysicalMaterial(config: MaterialConfig): THREE.MeshPhysicalMaterial
  disposeMaterial(material: THREE.Material): void
}

/**
 * Interfaz específica para operaciones de texturas
 * Solo incluye métodos relacionados con texturas
 */
export interface ITextureOperations {
  loadTexture(url: string): Promise<THREE.Texture>
  updateTextureProperties(texture: THREE.Texture, panel: WheelPanel): void
  disposeTexture(texture: THREE.Texture): void
}

// ===== DEPENDENCY INVERSION PRINCIPLE =====

/**
 * Clase de alto nivel que depende de abstracciones
 * No depende de implementaciones concretas
 */
export class WheelSegmentFactory {
  constructor(
    private angleCalculator: IAngleCalculator,
    private textTransformCalculator: ITextTransformCalculator,
    private materialManager: IMaterialManager,
    private geometryOperations: IGeometryOperations,
    private textureOperations: ITextureOperations
  ) { }

  createSegment(panel: WheelPanel, index: number, totalPanels: number): React.ReactElement {
    const angles = this.angleCalculator.calculateSegmentAngles(totalPanels)[index]
    const textTransform = this.textTransformCalculator.calculateTextTransform(panel, angles.midAngle)
    const material = this.materialManager.createMaterial(panel)
    const geometry = this.geometryOperations.createCylinderGeometry(2.05, 0.1, 32)

    // Crear el segmento usando las abstracciones
    return React.createElement('mesh', {
      key: panel.id,
      geometry,
      material,
      userData: { panelIndex: index }
    })
  }
}

// ===== TIPOS DE DATOS =====

export interface SegmentAngle {
  startAngle: number
  endAngle: number
  midAngle: number
  anglePerSegment: number
}

export interface TextTransform {
  textPosition: [number, number, number]
  textRotation: [number, number, number]
  textScale: [number, number, number]
}

export interface MaterialConfig {
  color?: string
  metalness?: number
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  transparent?: boolean
  opacity?: number
  emissive?: string
  emissiveIntensity?: number
}

// ===== FACTORY PATTERN =====

/**
 * Factory para crear instancias de servicios
 * Centraliza la creación de dependencias
 */
export class ServiceFactory {
  private static instance: ServiceFactory
  private services: Map<string, any> = new Map()

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory()
    }
    return ServiceFactory.instance
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service)
  }

  get<T>(key: string): T {
    const service = this.services.get(key)
    if (!service) {
      throw new Error(`Service ${key} not found`)
    }
    return service
  }

  createWheelSegmentFactory(): WheelSegmentFactory {
    const angleCalculator = this.get<IAngleCalculator>('angleCalculator')
    const textTransformCalculator = this.get<ITextTransformCalculator>('textTransformCalculator')
    const materialManager = this.get<IMaterialManager>('materialManager')
    const geometryOperations = this.get<IGeometryOperations>('geometryOperations')
    const textureOperations = this.get<ITextureOperations>('textureOperations')

    return new WheelSegmentFactory(
      angleCalculator,
      textTransformCalculator,
      materialManager,
      geometryOperations,
      textureOperations
    )
  }
}

// ===== BUILDER PATTERN =====

/**
 * Builder para configurar servicios de forma fluida
 */
export class ServiceBuilder {
  private factory: ServiceFactory

  constructor() {
    this.factory = ServiceFactory.getInstance()
  }

  withAngleCalculator(calculator: IAngleCalculator): ServiceBuilder {
    this.factory.register('angleCalculator', calculator)
    return this
  }

  withTextTransformCalculator(calculator: ITextTransformCalculator): ServiceBuilder {
    this.factory.register('textTransformCalculator', calculator)
    return this
  }

  withMaterialManager(manager: IMaterialManager): ServiceBuilder {
    this.factory.register('materialManager', manager)
    return this
  }

  withGeometryOperations(operations: IGeometryOperations): ServiceBuilder {
    this.factory.register('geometryOperations', operations)
    return this
  }

  withTextureOperations(operations: ITextureOperations): ServiceBuilder {
    this.factory.register('textureOperations', operations)
    return this
  }

  build(): ServiceFactory {
    return this.factory
  }
}
