# Sistema de Gestión de Materiales para la Ruleta

Este sistema implementa un patrón escalable y mantenible para gestionar múltiples materiales 3D en la aplicación de la ruleta de la fortuna, siguiendo las mejores prácticas de clean code y el mismo patrón arquitectónico que el sistema de escenas.

## 🏗️ Arquitectura

### Patrones Implementados

1. **Factory Pattern**: Para crear y registrar materiales dinámicamente
2. **State Manager**: Para gestionar el estado de los materiales
3. **Compound Component**: Para componentes reutilizables
4. **Builder Pattern**: Para crear materiales de forma fluida
5. **Singleton**: Para el factory de materiales

### Estructura de Archivos

```
src/
├── types/
│   └── material-manager.ts          # Tipos TypeScript para el sistema
├── hooks/
│   └── useMaterialManager.ts        # Hook personalizado para gestión de materiales
├── features/wheel-of-fortune/
│   ├── components/
│   │   ├── MaterialSelector.tsx     # Componente selector de materiales
│   │   └── SceneAndMaterialSelector.tsx # Selector combinado
│   ├── factories/
│   │   └── MaterialFactory.ts      # Factory para crear materiales
│   └── materials/
│       ├── index.ts                 # Registro automático de materiales
│       └── README.md                # Documentación del sistema
```

## 🚀 Características

### ✅ Escalabilidad
- **Registro dinámico**: Los materiales se registran automáticamente
- **Factory pattern**: Fácil creación de nuevos materiales
- **Configuración flexible**: Cada material puede tener su propia configuración

### ✅ Mantenibilidad
- **Separación de responsabilidades**: Cada material es independiente
- **Tipos TypeScript**: Tipado fuerte para prevenir errores
- **Clean Code**: Código limpio y bien documentado

### ✅ Reutilización
- **Componentes modulares**: Fácil reutilización de componentes
- **Hooks personalizados**: Lógica reutilizable
- **Configuraciones predefinidas**: Presets para diferentes estilos

## 🎨 Materiales Disponibles

### 1. Material Clásico (`classic`)
- **Descripción**: Material tradicional con acabado equilibrado
- **Características**: 
  - Metalicidad baja (0.1)
  - Rugosidad moderada (0.3)
  - Clearcoat suave (0.5)
- **Icono**: 🎯

### 2. Material Metálico (`metallic`)
- **Descripción**: Acabado metálico brillante con alta reflectividad
- **Características**:
  - Metalicidad alta (0.9)
  - Rugosidad baja (0.1)
  - Clearcoat intenso (0.8)
- **Icono**: ⚡

### 3. Material Cristal (`glass`)
- **Descripción**: Material transparente tipo cristal con refracción
- **Características**:
  - Transparencia completa
  - Sin metalicidad
  - Clearcoat máximo
- **Icono**: 🔮

### 4. Material Neón (`neon`)
- **Descripción**: Material brillante con efecto de luz propia
- **Características**:
  - Emisión de luz
  - Sin metalicidad
  - Rugosidad cero
- **Icono**: 💡

### 5. Material Mate (`matte`)
- **Descripción**: Acabado mate sin reflejos para un look minimalista
- **Características**:
  - Rugosidad máxima (1.0)
  - Sin metalicidad
  - Sin clearcoat
- **Icono**: ⚪

### 6. Material Brillante (`shiny`)
- **Descripción**: Superficie muy pulida con máximo brillo
- **Características**:
  - Rugosidad cero
  - Clearcoat máximo
  - Metalicidad moderada
- **Icono**: ✨

### 7. Material Transparente (`transparent`)
- **Descripción**: Material semi-transparente con visibilidad parcial
- **Características**:
  - Opacidad del 70%
  - Propiedades equilibradas
- **Icono**: 👻

### 8. Material Emisivo (`emissive`)
- **Descripción**: Material que emite luz propia de forma sutil
- **Características**:
  - Emisión de luz suave
  - Sin metalicidad
  - Rugosidad cero
- **Icono**: 🌟

### 9. Material Holográfico (`holographic`)
- **Descripción**: Efecto holográfico con colores cambiantes
- **Características**:
  - Metalicidad alta (0.8)
  - Transparencia del 90%
  - Emisión de luz cian
- **Icono**: 🌈

### 10. Material Madera (`wood`)
- **Descripción**: Acabado natural de madera con textura orgánica
- **Características**:
  - Sin metalicidad
  - Rugosidad alta (0.8)
  - Clearcoat mínimo
- **Icono**: 🪵

### 11. Material Piedra (`stone`)
- **Descripción**: Textura rugosa de piedra natural
- **Características**:
  - Rugosidad máxima
  - Sin metalicidad
  - Sin clearcoat
- **Icono**: 🪨

## 🔧 Uso del Sistema

### Crear un Nuevo Material

```typescript
import { createMaterialWithPreset } from '@/features/wheel-of-fortune/factories/MaterialFactory'

// Crear material con preset
const myMaterial = createMaterialWithPreset(
  'my-material',
  'Mi Material',
  'Descripción de mi material',
  '🎨',
  'METALLIC' // o cualquier otro preset
)

// O usar el builder pattern
const myMaterial = createMaterialBuilder('my-material', 'Mi Material')
  .withDescription('Descripción de mi material')
  .withIcon('🎨')
  .withPreset('METALLIC')
  .withConfig({
    metalness: 0.8,
    roughness: 0.1
  })
  .build()
```

### Usar el Hook de Gestión

```typescript
import { useMaterialManager } from '@/hooks/useMaterialManager'

function MyComponent() {
  const {
    activeMaterial,
    setActiveMaterial,
    availableMaterials,
    getMaterialConfig,
    updateMaterialConfig
  } = useMaterialManager()

  return (
    <div>
      <button onClick={() => setActiveMaterial('metallic')}>
        Cambiar a material metálico
      </button>
      <p>Material activo: {activeMaterial?.name}</p>
    </div>
  )
}
```

### Usar el Selector de Materiales

```typescript
import { MaterialSelector } from '@/features/wheel-of-fortune/components'

function MyComponent() {
  const [showSelector, setShowSelector] = useState(true)
  const { activeMaterial, setActiveMaterial, availableMaterials } = useMaterialManager()

  return (
    <MaterialSelector
      materials={availableMaterials}
      activeMaterialId={activeMaterial?.id || 'classic'}
      onMaterialSelect={setActiveMaterial}
      isVisible={showSelector}
      onToggleVisibility={setShowSelector}
    />
  )
}
```

### Usar el Selector Combinado

```typescript
import { SceneAndMaterialSelector } from '@/features/wheel-of-fortune/components'

function MyComponent() {
  const { activeScene, setActiveScene, availableScenes } = useSceneManager()
  const { activeMaterial, setActiveMaterial, availableMaterials } = useMaterialManager()

  return (
    <SceneAndMaterialSelector
      scenes={availableScenes}
      activeSceneId={activeScene?.id || 'classic'}
      onSceneSelect={setActiveScene}
      materials={availableMaterials}
      activeMaterialId={activeMaterial?.id || 'classic'}
      onMaterialSelect={setActiveMaterial}
    />
  )
}
```

## 🎯 Integración con Escenas

El sistema de materiales se integra perfectamente con el sistema de escenas existente:

```typescript
// En el componente WheelScene
<WheelScene
  panels={panels}
  isSpinning={isSpinning}
  onSpinComplete={handleSpinComplete}
  spinDuration={spinDuration}
  activeMaterial={activeMaterial} // ← Material activo
  // ... otras props
/>
```

## 🔄 Persistencia

El sistema incluye persistencia automática en localStorage:

- **Material activo**: Se guarda automáticamente
- **Configuraciones personalizadas**: Se persisten por material
- **Favoritos**: Lista de materiales favoritos
- **Historial**: Últimos materiales utilizados

## 🎨 Presets Disponibles

El sistema incluye 8 presets predefinidos:

- `CLASSIC`: Material tradicional equilibrado
- `METALLIC`: Acabado metálico brillante
- `GLASS`: Material transparente tipo cristal
- `NEON`: Material con emisión de luz
- `MATTE`: Acabado mate sin reflejos
- `SHINY`: Superficie muy pulida
- `TRANSPARENT`: Material semi-transparente
- `EMISSIVE`: Material con emisión sutil

## 🚀 Extensibilidad

### Agregar Nuevos Presets

```typescript
// En material-manager.ts
export const MATERIAL_PRESETS: Record<MaterialPreset, Record<string, any>> = {
  // ... presets existentes
  CUSTOM: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    transparent: false
  }
}
```

### Crear Materiales Personalizados

```typescript
const customMaterial = createMaterialBuilder('custom', 'Personalizado')
  .withDescription('Material completamente personalizado')
  .withIcon('🎨')
  .withConfig({
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
    emissive: '#ff00ff',
    emissiveIntensity: 0.3
  })
  .build()
```

## 🔍 Debugging

El sistema incluye información de debug integrada:

- Estado del material activo
- Configuración actual
- Número de materiales disponibles
- Propiedades del material seleccionado

## 📈 Performance

- **Memoización**: Los materiales se memoizan para evitar recreaciones
- **Lazy Loading**: Los materiales se cargan bajo demanda
- **Optimización**: Reutilización de instancias de materiales
- **Cleanup**: Limpieza automática de recursos

## 🎯 Casos de Uso

1. **Cambio dinámico de materiales**: Cambiar el aspecto de la ruleta en tiempo real
2. **Personalización**: Permitir a los usuarios crear sus propios materiales
3. **Temas**: Aplicar diferentes temas visuales a la aplicación
4. **Efectos especiales**: Materiales con efectos únicos (neón, holográfico, etc.)
5. **Accesibilidad**: Materiales optimizados para diferentes necesidades visuales

Este sistema proporciona una base sólida y escalable para la gestión de materiales 3D, manteniendo la consistencia arquitectónica con el resto de la aplicación.
