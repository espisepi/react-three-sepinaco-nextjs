import { ClassicWheelScene } from './ClassicWheelScene'
import { DarkWheelScene } from './DarkWheelScene'
import { MinimalWheelScene } from './MinimalWheelScene'

/**
 * Registro automático de todas las escenas disponibles
 * Este archivo centraliza el registro de escenas para facilitar la gestión
 */

// Crear escenas directamente sin usar el factory complejo
const classicScene: any = {
  id: 'classic',
  name: 'Clásica',
  description: 'Escena tradicional con iluminación equilibrada y efectos estándar',
  icon: '🎯',
  component: ClassicWheelScene,
  config: {
    lighting: {
      ambientIntensity: 0.4,
      directionalIntensity: 1,
      pointLightIntensity: 0.5,
      pointLightColor: '#4ECDC4'
    },
    camera: {
      position: [0, 0, 5],
      target: [0, 0, 0]
    },
    wheel: {
      radius: 2,
      height: 0.2,
      segments: 8
    }
  }
}

const darkScene: any = {
  id: 'dark',
  name: 'Oscura',
  description: 'Ambiente misterioso con efectos de neón y iluminación dramática',
  icon: '🌙',
  component: DarkWheelScene,
  config: {
    lighting: {
      ambientIntensity: 0.2,
      directionalIntensity: 0.8,
      pointLightIntensity: 0.3,
      pointLightColor: '#FF6B6B'
    },
    camera: {
      position: [0, 0, 6],
      target: [0, 0, 0]
    },
    wheel: {
      radius: 2.2,
      height: 0.3,
      segments: 12
    }
  }
}

const minimalScene: any = {
  id: 'minimal',
  name: 'Minimalista',
  description: 'Diseño limpio y elegante con geometrías simples',
  icon: '⚪',
  component: MinimalWheelScene,
  config: {
    lighting: {
      ambientIntensity: 0.6,
      directionalIntensity: 1.2,
      pointLightIntensity: 0.8,
      pointLightColor: '#4ECDC4'
    },
    camera: {
      position: [0, 0, 4],
      target: [0, 0, 0]
    },
    wheel: {
      radius: 1.8,
      height: 0.15,
      segments: 6
    }
  }
}

// Array de todas las escenas disponibles
const allScenes = [classicScene, darkScene, minimalScene]

/**
 * Obtener todas las escenas registradas
 */
export const getRegisteredScenes = () => {
  return allScenes
}

/**
 * Obtener escena por ID
 */
export const getSceneById = (id: string) => {
  return allScenes.find(scene => scene.id === id) || null
}

/**
 * Verificar si una escena existe
 */
export const hasScene = (id: string) => {
  return allScenes.some(scene => scene.id === id)
}

/**
 * Obtener el número total de escenas
 */
export const getSceneCount = () => {
  return allScenes.length
}

// Exportar las escenas individuales para uso directo
export { ClassicWheelScene, DarkWheelScene, MinimalWheelScene }
