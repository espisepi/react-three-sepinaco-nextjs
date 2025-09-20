# 🎰 Sistema de Persistencia para la Ruleta de la Suerte

Este documento describe el sistema de persistencia implementado para la Ruleta de la Suerte, que permite guardar y cargar todas las configuraciones de manera permanente.

## 🚀 Características Implementadas

### ✅ Persistencia Automática en localStorage
- **Guardado automático**: Todas las modificaciones se guardan automáticamente en localStorage
- **Carga automática**: Al iniciar la aplicación, se cargan las configuraciones guardadas
- **Validación**: Se valida la estructura de los datos antes de cargarlos
- **Fallback**: Si hay errores, se usa la configuración por defecto

### ✅ Descarga de Configuración como JSON
- **Archivo completo**: Descarga todos los atributos modificables de la ruleta
- **Nombre descriptivo**: Incluye fecha en el nombre del archivo
- **Formato legible**: JSON con formato indentado para fácil lectura
- **Metadatos**: Incluye información de versión y timestamps

### ✅ Carga de Configuración desde JSON
- **Validación de archivo**: Verifica que el archivo sea JSON válido
- **Validación de estructura**: Comprueba que tenga la estructura correcta
- **Feedback visual**: Muestra mensajes de éxito/error
- **Reemplazo completo**: Reemplaza toda la configuración actual

### ✅ Gestión de Configuraciones
- **Reset a valores por defecto**: Restaura la configuración inicial
- **Limpiar datos locales**: Elimina todos los datos guardados
- **Información de estado**: Muestra detalles de la configuración actual
- **Interfaz intuitiva**: Botones claros con confirmaciones

## 📋 Atributos Persistidos

El sistema guarda **TODOS** los atributos modificables de la ruleta:

### 🎯 Paneles
- **Texto**: Contenido de cada panel
- **Color**: Color de fondo de cada panel
- **Textura**: Imagen de textura (URL o base64)
- **Escala de textura**: Factor de escala (0.1 - 3.0)
- **Rotación de textura**: Ángulo de rotación (0° - 360°)
- **Offset de textura**: Desplazamiento X e Y (-1 a 1)

### 📝 Texto 3D
- **Posición**: Coordenadas X, Y, Z (-2 a 2)
- **Rotación**: Rotación en ejes X, Y, Z (0° - 360°)
- **Escala**: Factor de escala en ejes X, Y, Z (0.1 - 3.0)

### ⚙️ Configuración General
- **Duración del giro**: Tiempo en segundos (1-10)
- **Controles de órbita**: Habilitado/deshabilitado
- **Tamaño del canvas**: Ancho (50-100%) y altura (20-100vh)

### 📊 Metadatos
- **Versión**: Versión del formato de configuración
- **Fecha de creación**: Timestamp de creación inicial
- **Fecha de actualización**: Timestamp de última modificación
- **Fecha de descarga**: Timestamp cuando se descargó el archivo

## 🛠️ Arquitectura Técnica

### Hook Personalizado: `useWheelPersistence`
```typescript
// Ubicación: src/hooks/useWheelPersistence.ts
const {
  config,                    // Configuración actual
  isLoaded,                 // Estado de carga
  updatePanels,             // Actualizar paneles
  updateSpinDuration,       // Actualizar duración
  updateOrbitControls,      // Actualizar controles
  updateCanvasSize,         // Actualizar tamaño canvas
  downloadConfig,           // Descargar configuración
  loadConfigFromFile,       // Cargar desde archivo
  resetToDefault,           // Reset a valores por defecto
  clearStorage,             // Limpiar localStorage
  getConfigInfo,            // Obtener información
} = useWheelPersistence()
```

### Componente de Gestión: `WheelConfigManager`
```typescript
// Ubicación: src/features/wheel-of-fortune/components/WheelConfigManager.tsx
<WheelConfigManager
  config={config}
  onDownloadConfig={downloadConfig}
  onLoadConfigFromFile={loadConfigFromFile}
  onResetToDefault={resetToDefault}
  onClearStorage={clearStorage}
  getConfigInfo={getConfigInfo}
/>
```

## 📁 Estructura de Archivos

```
src/
├── hooks/
│   └── useWheelPersistence.ts          # Hook principal de persistencia
├── features/wheel-of-fortune/
│   └── components/
│       └── WheelConfigManager.tsx      # Componente de gestión
└── types/
    └── wheel.ts                        # Tipos TypeScript
```

## 🔧 Uso del Sistema

### 1. Guardado Automático
```typescript
// Se ejecuta automáticamente en cada cambio
useEffect(() => {
  if (isLoaded) {
    saveToLocalStorage(config)
  }
}, [config, isLoaded])
```

### 2. Descarga Manual
```typescript
const handleDownload = () => {
  const success = downloadConfig()
  if (success) {
    showMessage('success', '✅ Configuración descargada exitosamente')
  }
}
```

### 3. Carga desde Archivo
```typescript
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const success = await loadConfigFromFile(file)
    // Manejo de resultado...
  }
}
```

## 🎨 Interfaz de Usuario

### Panel de Gestión de Configuraciones
- **📊 Información Actual**: Muestra estado de la configuración
- **📥 Descargar**: Botón para exportar configuración
- **📤 Cargar**: Botón para importar configuración
- **🔄 Reset**: Botón para restaurar valores por defecto
- **🗑️ Limpiar**: Botón para eliminar datos locales
- **ℹ️ Información**: Instrucciones de uso

### Mensajes de Estado
- **✅ Éxito**: Verde con borde verde
- **❌ Error**: Rojo con borde rojo  
- **ℹ️ Información**: Azul con borde azul

## 🔒 Validación y Seguridad

### Validación de Archivos
```typescript
const isValidConfiguration = (config: any): config is WheelConfiguration => {
  return (
    config &&
    typeof config === 'object' &&
    Array.isArray(config.panels) &&
    typeof config.spinDuration === 'number' &&
    // ... más validaciones
  )
}
```

### Manejo de Errores
- **Try-catch**: En todas las operaciones de archivo
- **Validación**: Antes de aplicar configuraciones
- **Fallback**: Configuración por defecto en caso de error
- **Logging**: Errores registrados en consola

## 🚀 Beneficios del Sistema

### Para el Usuario
- **Persistencia**: Las modificaciones se mantienen entre sesiones
- **Portabilidad**: Puede compartir configuraciones con otros
- **Backup**: Puede hacer copias de seguridad de sus configuraciones
- **Flexibilidad**: Puede cargar diferentes configuraciones según necesidad

### Para el Desarrollo
- **Clean Code**: Separación clara de responsabilidades
- **Reutilizable**: Hook puede usarse en otros componentes
- **Mantenible**: Código bien estructurado y documentado
- **Escalable**: Fácil agregar nuevos atributos a persistir

## 📈 Próximas Mejoras

- [ ] **Compresión**: Comprimir archivos JSON para reducir tamaño
- [ ] **Historial**: Mantener historial de configuraciones
- [ ] **Sincronización**: Sincronizar entre dispositivos
- [ ] **Templates**: Plantillas predefinidas de configuraciones
- [ ] **Validación avanzada**: Validación más estricta de archivos
- [ ] **Importación múltiple**: Cargar múltiples archivos a la vez

## 🎯 Conclusión

El sistema de persistencia implementado proporciona una solución completa y robusta para guardar y cargar todas las configuraciones de la ruleta. Con una arquitectura limpia, validación robusta y una interfaz intuitiva, los usuarios pueden personalizar completamente su experiencia y mantener sus configuraciones de manera permanente.

---

*Implementado con ❤️ siguiendo principios de Clean Code y mejores prácticas de React/TypeScript*
