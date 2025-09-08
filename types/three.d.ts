import { ThreeElements } from '@react-three/fiber'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Three.js primitives
            mesh: ThreeElements['mesh']
            group: ThreeElements['group']
            primitive: ThreeElements['primitive']
            sphereGeometry: ThreeElements['sphereGeometry']
            boxGeometry: ThreeElements['boxGeometry']
            meshPhysicalMaterial: ThreeElements['meshPhysicalMaterial']
            meshStandardMaterial: ThreeElements['meshStandardMaterial']
            ambientLight: ThreeElements['ambientLight']
            pointLight: ThreeElements['pointLight']
            color: ThreeElements['color']
            water: any
            shaderImpl: any
        }
    }
}

// Extend Three.js types for missing properties
declare module 'three' {
    interface WebGLRenderer {
        encoding?: any
    }

    interface WebGLRenderTargetOptions {
        encoding?: any
    }
}

export { }
