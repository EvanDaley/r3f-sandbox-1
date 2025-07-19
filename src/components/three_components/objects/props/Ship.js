import React, { useMemo } from "react";
// import { Canvas } from "react-three-fiber";
import * as THREE from "three";
import { useControls } from 'leva'

const filePath = window.location.href + '/midjourney-raw/ship1.png'

const Texture = ({ texture }) => {
  const options = useMemo(() => {
    return {
      x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      visible: true,
      color: { value: 'lime' },
    }
  }, [])

  // const defaultRotation = {
  //   x: -0.7853981633974484,
  //   y: 6.385428887820153e-38,
  //   z: 6.385428887820154e-38
  // }

  const defaultRotation = {
    x: -0.7853981633974484,
    y: 0.615479708461653,
    z: 0.5235987754704757
  }

  const defaultPosition = {
    x: -10,
    y: 0,
    z: -4,
  }

  const useControls = false
  let control1 = {}

  // control1 = useControls({
  //   color: 'green',
  //   rotation: {
  //     ...defaultRotation
  //   },
  //   position: {
  //     ...defaultPosition
  //   }
  // })
  
  control1 = {
    rotation: defaultRotation,
    position: defaultPosition
  }

  return (
    <mesh
    position={[control1.position.x, control1.position.y, control1.position.z]}
      rotation={[control1.rotation.x, control1.rotation.y, control1.rotation.z]}
    >
      <planeBufferGeometry
        attach="geometry"
        args={[15, 14]}
      />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};
const Image = ({ url }) => {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  return <Texture texture={texture} />;
};

export default function Ship() {
  return (
    <Image url={filePath} />
  );
}
