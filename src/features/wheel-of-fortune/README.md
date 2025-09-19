# 🎰 Ruleta de la Suerte - React Three Fiber

Una aplicación interactiva de ruleta de la suerte construida con React Three Fiber, Next.js y TypeScript.

## 🚀 Características

- **Ruleta 3D Interactiva**: Ruleta completamente funcional en 3D usando React Three Fiber
- **Gestión de Paneles**: Agregar, editar y eliminar paneles dinámicamente
- **Animación Realista**: Rotación suave con desaceleración gradual
- **Detección Precisa**: Algoritmo preciso para determinar el panel ganador
- **UI Moderna**: Interfaz de usuario elegante con Tailwind CSS
- **Arquitectura Separada**: Separación clara entre componentes R3F (3D) y HTML (UI)

## 📁 Estructura del Proyecto

```
src/features/wheel-of-fortune/
├── components/
│   ├── canvas/
│   │   └── WheelScene.tsx          # Componente R3F principal
│   ├── WheelControls.tsx           # Controles HTML
│   └── WheelResult.tsx             # Resultado HTML
└── app/wheel-of-fortune/
    └── page.tsx                     # Página principal
```

## 🎮 Funcionalidades

### Ruleta 3D
- Geometría dinámica basada en el número de paneles
- Materiales físicos con efectos de iluminación
- Rotación suave con física realista
- Puntero fijo para indicar el resultado

### Gestión de Paneles
- **Agregar**: Botón para añadir nuevos paneles
- **Editar**: Click en el botón de editar para modificar texto
- **Eliminar**: Botón para eliminar paneles (mínimo 1)
- **Colores**: Colores automáticos para cada panel

### Controles
- Botón de giro con estado de carga
- Validación (mínimo 1 panel requerido)
- Feedback visual durante la rotación

## 🛠️ Tecnologías Utilizadas

- **React Three Fiber**: Renderizado 3D
- **Three.js**: Biblioteca 3D subyacente
- **Next.js**: Framework React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **@react-three/drei**: Utilidades para R3F

## 🎯 Cómo Usar

1. **Navegar**: Ve a `/wheel-of-fortune`
2. **Personalizar**: Agrega, edita o elimina paneles según necesites
3. **Girar**: Haz clic en "¡GIRAR RULETA!" para comenzar
4. **Resultado**: El panel ganador se mostrará automáticamente

## 🔧 Configuración Técnica

### Componentes R3F
- `WheelScene`: Escena principal con iluminación y controles de cámara
- `Wheel`: Componente de la ruleta con lógica de rotación
- Geometría dinámica generada por el número de paneles
- Materiales físicos con efectos de metal y claridad

### Componentes HTML
- `WheelControls`: Gestión de paneles y controles
- `WheelResult`: Visualización del resultado
- Estados reactivos para sincronización

### Algoritmo de Rotación
1. **Inicio**: Velocidad inicial aleatoria
2. **Rotación**: Múltiples vueltas completas (5-10)
3. **Desaceleración**: Reducción gradual de velocidad
4. **Detección**: Cálculo preciso del panel final
5. **Resultado**: Callback con el panel ganador

## 🎨 Personalización

### Colores de Paneles
Los colores se asignan automáticamente de una paleta predefinida:
```typescript
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3']
```

### Configuración de Rotación
- Velocidad inicial: `0.3`
- Factor de desaceleración: `0.95`
- Vueltas completas: `5-10` (aleatorio)

## 🚀 Próximas Mejoras

- [ ] Sonidos de rotación y resultado
- [ ] Efectos de partículas al ganar
- [ ] Temas de color personalizables
- [ ] Guardado de configuraciones
- [ ] Modo multijugador
- [ ] Estadísticas de resultados
