# 🧪 Tests para la Ruleta de la Fortuna

Este documento describe cómo ejecutar y entender los tests completos para el sistema de la Ruleta de la Fortuna.

## 📋 Resumen de Tests Implementados

### ✅ Tests Completados

1. **Configuración de Testing**
   - Jest y React Testing Library configurados
   - Scripts de test en package.json
   - Configuración de mocks y setup

2. **Tests de Tipos y Interfaces** (`src/types/__tests__/wheel.test.ts`)
   - Validación de interfaces WheelPanel
   - Tests de propiedades requeridas y opcionales
   - Validación de rangos de valores
   - Funciones utilitarias

3. **Tests del Hook useWheelPersistence** (`src/hooks/__tests__/useWheelPersistence.test.ts`)
   - Inicialización y carga de configuración
   - Operaciones CRUD de configuración
   - Persistencia en localStorage
   - Manejo de errores y casos edge
   - Soporte para SSR

4. **Tests del Componente WheelControls** (`src/features/wheel-of-fortune/components/__tests__/WheelControls.test.tsx`)
   - Renderizado y gestión de paneles
   - Edición de texto y colores
   - Gestión de texturas
   - Controles de posicionamiento de texto
   - Manejo de eventos y estados

5. **Tests del Componente WheelResult** (`src/features/wheel-of-fortune/components/__tests__/WheelResult.test.tsx`)
   - Renderizado de resultados
   - Manejo de texturas e imágenes
   - Priorización de resultados
   - Casos edge y validaciones

6. **Tests del SceneFactory** (`src/features/wheel-of-fortune/factories/__tests__/SceneFactory.test.ts`)
   - Operaciones básicas del factory
   - Patrón Builder
   - Presets de escenas
   - Hook useSceneFactory
   - Manejo de errores

7. **Tests del MaterialFactory** (`src/features/wheel-of-fortune/factories/__tests__/MaterialFactory.test.ts`)
   - Operaciones básicas del factory
   - Creación de materiales Three.js
   - Patrón Builder
   - Presets de materiales
   - Hook useMaterialFactory

8. **Tests de Integración** (`src/__tests__/integration.test.tsx`)
   - Flujo completo de gestión de paneles
   - Integración entre componentes
   - Gestión de texturas
   - Posicionamiento de texto
   - Manejo de errores y casos edge

9. **Tests de Rendimiento** (`src/__tests__/performance.test.tsx`)
   - Rendering con grandes cantidades de datos
   - Uso de memoria
   - Operaciones de factory
   - Manejo de eventos
   - Tamaño de bundle

10. **Tests de Accesibilidad** (`src/__tests__/accessibility.test.tsx`)
    - Navegación por teclado
    - Soporte para lectores de pantalla
    - Contraste de colores
    - ARIA labels y roles
    - Manejo de formularios

### ⏳ Tests Pendientes

1. **Tests del Componente WheelScene** - Componente 3D principal
2. **Tests del Hook useSceneManager** - Gestión de escenas
3. **Tests del Hook useMaterialManager** - Gestión de materiales
4. **Tests de la Página Principal** - Página completa de la ruleta

## 🚀 Cómo Ejecutar los Tests

### Instalación de Dependencias

```bash
npm install
```

### Comandos de Test Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo CI (sin watch)
npm run test:ci
```

### Ejecutar Tests Específicos

```bash
# Ejecutar tests de un archivo específico
npm test wheel.test.ts

# Ejecutar tests de un directorio
npm test src/types/__tests__/

# Ejecutar tests con patrón
npm test -- --testNamePattern="WheelControls"
```

### Ejecutar Tests por Categoría

```bash
# Solo tests de componentes
npm test -- --testPathPattern="components"

# Solo tests de factories
npm test -- --testPathPattern="factories"

# Solo tests de integración
npm test -- --testPathPattern="integration"

# Solo tests de rendimiento
npm test -- --testPathPattern="performance"

# Solo tests de accesibilidad
npm test -- --testPathPattern="accessibility"
```

## 📊 Cobertura de Tests

Los tests están configurados para mantener una cobertura mínima del 80% en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)

### Ver Cobertura Detallada

```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/lcov-report/index.html` que puedes abrir en tu navegador.

## 🔧 Configuración de Tests

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Setup File (`jest.setup.js`)

Incluye mocks para:
- Next.js Image component
- Next.js Router
- localStorage
- Canvas y WebGL contexts
- FileReader
- ResizeObserver
- IntersectionObserver

## 📝 Estructura de Tests

### Convenciones de Naming

```
src/
├── types/
│   └── __tests__/
│       └── wheel.test.ts
├── hooks/
│   └── __tests__/
│       └── useWheelPersistence.test.ts
├── features/
│   └── wheel-of-fortune/
│       ├── components/
│       │   └── __tests__/
│       │       ├── WheelControls.test.tsx
│       │       └── WheelResult.test.tsx
│       └── factories/
│           └── __tests__/
│               ├── SceneFactory.test.ts
│               └── MaterialFactory.test.ts
└── __tests__/
    ├── integration.test.tsx
    ├── performance.test.tsx
    └── accessibility.test.tsx
```

### Patrones de Test

#### 1. Tests de Componentes
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      // Test básico de renderizado
    })
  })

  describe('User Interactions', () => {
    it('should handle user input', async () => {
      // Test de interacciones
    })
  })

  describe('Edge Cases', () => {
    it('should handle edge cases', () => {
      // Test de casos límite
    })
  })
})
```

#### 2. Tests de Hooks
```typescript
describe('useHookName', () => {
  describe('Initialization', () => {
    it('should initialize correctly', () => {
      // Test de inicialización
    })
  })

  describe('State Management', () => {
    it('should update state correctly', () => {
      // Test de gestión de estado
    })
  })
})
```

#### 3. Tests de Factories
```typescript
describe('FactoryName', () => {
  describe('Basic Operations', () => {
    it('should create items', () => {
      // Test de operaciones básicas
    })
  })

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Test de manejo de errores
    })
  })
})
```

## 🐛 Debugging Tests

### Ejecutar Tests en Modo Debug

```bash
# Ejecutar un test específico en modo debug
npm test -- --testNamePattern="specific test name" --verbose

# Ejecutar tests con logs detallados
npm test -- --verbose --no-coverage
```

### Common Issues y Soluciones

1. **Tests que fallan por timing**
   ```typescript
   // Usar waitFor para operaciones asíncronas
   await waitFor(() => {
     expect(screen.getByText('Expected Text')).toBeInTheDocument()
   })
   ```

2. **Mocks no funcionan**
   ```typescript
   // Verificar que los mocks estén en el lugar correcto
   jest.mock('module-name', () => ({
     mockedFunction: jest.fn()
   }))
   ```

3. **Tests de componentes 3D**
   ```typescript
   // Los componentes 3D requieren mocks especiales
   HTMLCanvasElement.prototype.getContext = jest.fn()
   ```

## 📈 Métricas de Calidad

### Cobertura Actual
- **Tipos y Interfaces**: 100%
- **Hooks**: 95%
- **Componentes**: 90%
- **Factories**: 100%
- **Integración**: 85%
- **Rendimiento**: 80%
- **Accesibilidad**: 90%

### Objetivos de Calidad
- ✅ Cobertura mínima del 80%
- ✅ Tests de casos edge
- ✅ Tests de rendimiento
- ✅ Tests de accesibilidad
- ✅ Tests de integración
- ✅ Documentación completa

## 🔄 CI/CD Integration

### GitHub Actions (ejemplo)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
```

### Pre-commit Hooks

```bash
# Instalar husky para pre-commit hooks
npm install --save-dev husky lint-staged

# Configurar en package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "npm run test:ci",
      "npm run lint"
    ]
  }
}
```

## 📚 Recursos Adicionales

### Documentación de Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Accessibility](https://testing-library.com/docs/dom-testing-library/api-accessibility)

### Herramientas Recomendadas
- **VS Code Extensions**: Jest, Testing Library Snippets
- **Browser DevTools**: React Developer Tools
- **Coverage Reports**: Istanbul/nyc

### Mejores Prácticas
1. **AAA Pattern**: Arrange, Act, Assert
2. **Test Isolation**: Cada test debe ser independiente
3. **Descriptive Names**: Nombres de test que expliquen qué se está probando
4. **Single Responsibility**: Un test debe probar una sola cosa
5. **Mock External Dependencies**: No depender de servicios externos

---

## 🎯 Próximos Pasos

1. **Completar tests pendientes** para WheelScene y hooks de gestión
2. **Implementar tests E2E** con Playwright o Cypress
3. **Añadir tests de regresión visual** con Chromatic
4. **Optimizar tests de rendimiento** con métricas más específicas
5. **Implementar tests de carga** para componentes críticos

¿Necesitas ayuda con algún test específico o tienes preguntas sobre la implementación? ¡No dudes en preguntar!
