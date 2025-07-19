import OxygenContainer3 from '../objects/OxygenContainer3'
import WobblyTorus from '../objects/WobblyTorus'
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import React, { Suspense } from 'react';
// import { useControls } from "leva"

export default function Scene({ sceneIndex }) {
  const environmentControls = {
    hint: 'HDRI Lighting',
    options: [
      'city',
      'sunset',
      'forest',
    ],
    value: 'city',
  }

  // const { hdri } = useControls('environment/lighting', { hdri: environmentControls })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 13]} />

      <Stage adjustCamera={false} intensity={.5} contactShadow={true} shadows={true}>
        <OrbitControls target={[1, 1, 0]} />

        <OxygenContainer3 position={[0, 0, 0]}/>
        <WobblyTorus position={[0, 2.5, 0]} rotation={[0, 90, 0]} />

        <Suspense fallback={null}>
          {/*<Environment background={false} />*/}
          {/*<Environment preset={hdri} background={false} />*/}
        </Suspense>
      </Stage>
    </>
  );
}

