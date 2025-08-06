import * as THREE from 'three'
import React, { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, useGLTF } from '@react-three/drei'

function ModelScene() {
  const gltf = useGLTF('obj/scene.glb');
  // console.log(gltf);
  const [texture, texture_disp, texture_norm] = useLoader(THREE.TextureLoader, ['img/1.png', 'img/1_disp.png', 'img/1_norm.png']);
  const [text_env] = useLoader(THREE.TextureLoader, ['img/2_new.png']);
  gltf.scene.traverse((o) => {
    if (o.name === 'Sphere') {

      // console.log(o)

      o.material = new THREE.MeshPhysicalMaterial({
        clearcoat: 1.0,
        // clearcoatRoughness: 0.1,
        metalness: 0.0,
        roughness: 0.0,
        map: texture,
        normalMap: texture_norm,
        envMap: text_env,
        // displacementScale:0.01,
        // displacementMap: texture_disp,
        side: THREE.DoubleSide
      });
    }
  });

  const sphere = useMemo(() => {
    return gltf.nodes.Sphere;
  }, []);

  useFrame((state, dt) => {
    sphere.rotation.y -= dt * 0.05;
  })

  const { scene, gl, camera } = useThree();
  useEffect(() => {
    scene.background = text_env;

    gl.toneMapping = THREE.LinearToneMapping;

    camera.position.z = 1;
    camera.position.y = 0.1;
  }, [])

  return <primitive object={gltf.scene} />;
}



export function CharlesScene() {
  return (
    <>
      {/* <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} /> */}
      <ModelScene />
      <OrbitControls target={new THREE.Vector3(0, 0.1, 0)} />
    </>
  )
}