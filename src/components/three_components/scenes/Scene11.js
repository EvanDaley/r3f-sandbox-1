import OxygenContainer3 from '../objects/OxygenContainer3'
import LinesRobot from '../objects/LinesRobot'
// import WobblyTorus from '../objects/WobblyTorus'
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import React, { Suspense } from 'react';

export default function Scene({ sceneIndex }) {

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={30} />

            <Stage adjustCamera={false} intensity={.5} contactShadow={true} shadows={true}>
                {/*<OrbitControls target={[1, 1, 0]} />*/}
                <OrbitControls autoRotateSpeed={0.85} zoomSpeed={0.75} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.55} />

                <LinesRobot position={[0, .41, 0]}/>
                {/*<WobblyTorus position={[0, .5, 0]} rotation={[0, 90, 0]} />*/}

                {/*<Suspense fallback={null}>*/}
                {/*    /!*<Environment background={false} />*!/*/}
                {/*    /!*<Environment preset={city} background={false} />*!/*/}
                {/*    /!*<Environment preset="city" />*!/*/}
                {/*    <Environment*/}
                {/*        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/evening_road_01_2k.hdr"*/}
                {/*        ground={{ height: 5, radius: 40, scale: 20 }}*/}
                {/*    />*/}
                {/*</Suspense>*/}

            </Stage>
        </>
    );
}

