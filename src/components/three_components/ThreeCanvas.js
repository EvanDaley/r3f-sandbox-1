import { OrbitControls, Loader, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';

import Scene1 from './scenes/Scene1';
import Scene2 from './scenes/Scene2';
import Scene3 from './scenes/Scene3';
import Scene4 from './scenes/Scene4';
import Scene5 from './scenes/Scene5';
import Scene6 from './scenes/Scene6';
import Scene7 from './scenes/Scene7';
import Scene8 from './scenes/Scene8';
import Scene9 from './scenes/Scene9';

import useStore from '../../store'

export default function ThreeCanvas() {
  const scenes = [
    // Scene7,
    Scene6,
    Scene8,
    Scene9,
    Scene2,
    Scene3,
    Scene4,
    Scene5,
  ]

  const sceneIndex = useStore(state => state.sceneIndex)

  return (
    <>
      <Canvas colorManagement={true} invalidateFrameloop pixelRatio={[1, 2]}>

        <Suspense fallback={null}>
          {React.createElement(scenes[sceneIndex])}
        </Suspense>

        {/* <Stats /> */}



      </Canvas>

      <Loader />
    </>
  );
}

