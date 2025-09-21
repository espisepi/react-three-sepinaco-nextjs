import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props)
  },
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsText: jest.fn(),
  readAsDataURL: jest.fn(),
  result: null,
  onload: null,
  onerror: null,
}))

// Mock Canvas and WebGL contexts
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}))

// Mock WebGL context
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      createShader: jest.fn(),
      shaderSource: jest.fn(),
      compileShader: jest.fn(),
      createProgram: jest.fn(),
      attachShader: jest.fn(),
      linkProgram: jest.fn(),
      useProgram: jest.fn(),
      createBuffer: jest.fn(),
      bindBuffer: jest.fn(),
      bufferData: jest.fn(),
      createTexture: jest.fn(),
      bindTexture: jest.fn(),
      texImage2D: jest.fn(),
      texParameteri: jest.fn(),
      createFramebuffer: jest.fn(),
      bindFramebuffer: jest.fn(),
      framebufferTexture2D: jest.fn(),
      createRenderbuffer: jest.fn(),
      bindRenderbuffer: jest.fn(),
      renderbufferStorage: jest.fn(),
      framebufferRenderbuffer: jest.fn(),
      getAttribLocation: jest.fn(),
      getUniformLocation: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      uniform1f: jest.fn(),
      uniform2f: jest.fn(),
      uniform3f: jest.fn(),
      uniform4f: jest.fn(),
      uniform1i: jest.fn(),
      uniformMatrix4fv: jest.fn(),
      clear: jest.fn(),
      clearColor: jest.fn(),
      viewport: jest.fn(),
      drawArrays: jest.fn(),
      drawElements: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      depthFunc: jest.fn(),
      blendFunc: jest.fn(),
      cullFace: jest.fn(),
      frontFace: jest.fn(),
      getParameter: jest.fn(),
      getShaderParameter: jest.fn(),
      getProgramParameter: jest.fn(),
      getError: jest.fn(() => 0),
      checkFramebufferStatus: jest.fn(() => 36053), // FRAMEBUFFER_COMPLETE
    }
  }
  return null
})

// Suppress console warnings in tests
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return
  }
  originalConsoleWarn.call(console, ...args)
}
