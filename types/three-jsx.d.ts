import * as THREE from 'three'

// Extender Three.js JSX elements para TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Geometries
            boxGeometry: React.DetailedHTMLProps<any, any>
            sphereGeometry: React.DetailedHTMLProps<any, any>
            cylinderGeometry: React.DetailedHTMLProps<any, any>
            coneGeometry: React.DetailedHTMLProps<any, any>
            planeGeometry: React.DetailedHTMLProps<any, any>
            torusGeometry: React.DetailedHTMLProps<any, any>
            octahedronGeometry: React.DetailedHTMLProps<any, any>
            tetrahedronGeometry: React.DetailedHTMLProps<any, any>
            icosahedronGeometry: React.DetailedHTMLProps<any, any>
            dodecahedronGeometry: React.DetailedHTMLProps<any, any>
            ringGeometry: React.DetailedHTMLProps<any, any>
            tubeGeometry: React.DetailedHTMLProps<any, any>
            torusKnotGeometry: React.DetailedHTMLProps<any, any>
            latheGeometry: React.DetailedHTMLProps<any, any>
            extrudeGeometry: React.DetailedHTMLProps<any, any>
            textGeometry: React.DetailedHTMLProps<any, any>

            // Materials
            meshBasicMaterial: React.DetailedHTMLProps<any, any>
            meshStandardMaterial: React.DetailedHTMLProps<any, any>
            meshPhysicalMaterial: React.DetailedHTMLProps<any, any>
            meshLambertMaterial: React.DetailedHTMLProps<any, any>
            meshPhongMaterial: React.DetailedHTMLProps<any, any>
            meshToonMaterial: React.DetailedHTMLProps<any, any>
            meshNormalMaterial: React.DetailedHTMLProps<any, any>
            meshDepthMaterial: React.DetailedHTMLProps<any, any>
            meshDistanceMaterial: React.DetailedHTMLProps<any, any>
            lineBasicMaterial: React.DetailedHTMLProps<any, any>
            lineDashedMaterial: React.DetailedHTMLProps<any, any>
            pointsMaterial: React.DetailedHTMLProps<any, any>
            shaderMaterial: React.DetailedHTMLProps<any, any>
            rawShaderMaterial: React.DetailedHTMLProps<any, any>
            spriteMaterial: React.DetailedHTMLProps<any, any>

            // Objects
            mesh: React.DetailedHTMLProps<any, any>
            group: React.DetailedHTMLProps<any, any>
            scene: React.DetailedHTMLProps<any, any>
            camera: React.DetailedHTMLProps<any, any>
            light: React.DetailedHTMLProps<any, any>
            ambientLight: React.DetailedHTMLProps<any, any>
            directionalLight: React.DetailedHTMLProps<any, any>
            pointLight: React.DetailedHTMLProps<any, any>
            spotLight: React.DetailedHTMLProps<any, any>
            hemisphereLight: React.DetailedHTMLProps<any, any>
            rectAreaLight: React.DetailedHTMLProps<any, any>
            line: React.DetailedHTMLProps<any, any>
            lineLoop: React.DetailedHTMLProps<any, any>
            lineSegments: React.DetailedHTMLProps<any, any>
            points: React.DetailedHTMLProps<any, any>
            sprite: React.DetailedHTMLProps<any, any>
            instancedMesh: React.DetailedHTMLProps<any, any>
            skinnedMesh: React.DetailedHTMLProps<any, any>
            bone: React.DetailedHTMLProps<any, any>
            skeleton: React.DetailedHTMLProps<any, any>

            // Controls
            orbitControls: React.DetailedHTMLProps<any, any>
            transformControls: React.DetailedHTMLProps<any, any>
            pointerLockControls: React.DetailedHTMLProps<any, any>
            flyControls: React.DetailedHTMLProps<any, any>
            firstPersonControls: React.DetailedHTMLProps<any, any>

            // Helpers
            axesHelper: React.DetailedHTMLProps<any, any>
            gridHelper: React.DetailedHTMLProps<any, any>
            polarGridHelper: React.DetailedHTMLProps<any, any>
            arrowHelper: React.DetailedHTMLProps<any, any>
            boxHelper: React.DetailedHTMLProps<any, any>
            planeHelper: React.DetailedHTMLProps<any, any>
            hemisphereLightHelper: React.DetailedHTMLProps<any, any>
            directionalLightHelper: React.DetailedHTMLProps<any, any>
            pointLightHelper: React.DetailedHTMLProps<any, any>
            spotLightHelper: React.DetailedHTMLProps<any, any>
            rectAreaLightHelper: React.DetailedHTMLProps<any, any>
            skeletonHelper: React.DetailedHTMLProps<any, any>

            // Loaders
            textureLoader: React.DetailedHTMLProps<any, any>
            cubeTextureLoader: React.DetailedHTMLProps<any, any>
            dataTextureLoader: React.DetailedHTMLProps<any, any>
            compressedTextureLoader: React.DetailedHTMLProps<any, any>
            exrLoader: React.DetailedHTMLProps<any, any>
            hdrLoader: React.DetailedHTMLProps<any, any>
            rgbeLoader: React.DetailedHTMLProps<any, any>
            logLuvLoader: React.DetailedHTMLProps<any, any>
            pvrLoader: React.DetailedHTMLProps<any, any>
            ktxLoader: React.DetailedHTMLProps<any, any>
            ktx2Loader: React.DetailedHTMLProps<any, any>
            tgaLoader: React.DetailedHTMLProps<any, any>
            tiffLoader: React.DetailedHTMLProps<any, any>
            webpLoader: React.DetailedHTMLProps<any, any>

            // Post-processing
            effectComposer: React.DetailedHTMLProps<any, any>
            renderPass: React.DetailedHTMLProps<any, any>
            shaderPass: React.DetailedHTMLProps<any, any>
            unrealBloomPass: React.DetailedHTMLProps<any, any>
            filmPass: React.DetailedHTMLProps<any, any>
            glitchPass: React.DetailedHTMLProps<any, any>
            saoPass: React.DetailedHTMLProps<any, any>
            ssaoPass: React.DetailedHTMLProps<any, any>
            smaaPass: React.DetailedHTMLProps<any, any>
            taarPass: React.DetailedHTMLProps<any, any>
            ssrPass: React.DetailedHTMLProps<any, any>
            ssgiPass: React.DetailedHTMLProps<any, any>
            temporalReprojectionPass: React.DetailedHTMLProps<any, any>

            // Physics
            rigidBody: React.DetailedHTMLProps<any, any>
            collider: React.DetailedHTMLProps<any, any>
            joint: React.DetailedHTMLProps<any, any>

            // Audio
            audioListener: React.DetailedHTMLProps<any, any>
            audio: React.DetailedHTMLProps<any, any>
            positionalAudio: React.DetailedHTMLProps<any, any>

            // Animation
            animationMixer: React.DetailedHTMLProps<any, any>
            animationAction: React.DetailedHTMLProps<any, any>
            animationClip: React.DetailedHTMLProps<any, any>

            // Fog
            fog: React.DetailedHTMLProps<any, any>
            fogExp2: React.DetailedHTMLProps<any, any>

            // Shadows
            shadowMap: React.DetailedHTMLProps<any, any>

            // Renderer
            webGLRenderer: React.DetailedHTMLProps<any, any>
            webGL1Renderer: React.DetailedHTMLProps<any, any>
            webGL2Renderer: React.DetailedHTMLProps<any, any>
            css2DRenderer: React.DetailedHTMLProps<any, any>
            css3DRenderer: React.DetailedHTMLProps<any, any>
            svgRenderer: React.DetailedHTMLProps<any, any>

            // Other
            clock: React.DetailedHTMLProps<any, any>
            raycaster: React.DetailedHTMLProps<any, any>
            vector2: React.DetailedHTMLProps<any, any>
            vector3: React.DetailedHTMLProps<any, any>
            vector4: React.DetailedHTMLProps<any, any>
            euler: React.DetailedHTMLProps<any, any>
            quaternion: React.DetailedHTMLProps<any, any>
            matrix3: React.DetailedHTMLProps<any, any>
            matrix4: React.DetailedHTMLProps<any, any>
            color: React.DetailedHTMLProps<any, any>
            texture: React.DetailedHTMLProps<any, any>
            cubeTexture: React.DetailedHTMLProps<any, any>
            dataTexture: React.DetailedHTMLProps<any, any>
            compressedTexture: React.DetailedHTMLProps<any, any>
            canvasTexture: React.DetailedHTMLProps<any, any>
            videoTexture: React.DetailedHTMLProps<any, any>
            renderTarget: React.DetailedHTMLProps<any, any>
            webGLRenderTarget: React.DetailedHTMLProps<any, any>
            webGLMultisampleRenderTarget: React.DetailedHTMLProps<any, any>
            webGLArrayRenderTarget: React.DetailedHTMLProps<any, any>
            webGLCubeRenderTarget: React.DetailedHTMLProps<any, any>
            webGL3DRenderTarget: React.DetailedHTMLProps<any, any>
        }
    }
}
