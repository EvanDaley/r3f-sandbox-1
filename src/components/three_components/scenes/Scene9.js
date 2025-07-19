// import * as THREE from 'three'
//
// import {
//     OrbitControls,
//     OrthographicCamera
// } from '@react-three/drei';
// import Robot from '../objects/Robot'

import * as THREE from 'three'
import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
    ContactShadows,
    Environment,
    Float,
    Html,
    OrbitControls,
    PerspectiveCamera
} from '@react-three/drei'
import { MathUtils } from 'three'

// import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react';


const material = new THREE.MeshStandardMaterial()
const geometries = [
    { geometry: new THREE.TetrahedronGeometry(2) },
    { geometry: new THREE.CylinderGeometry(0.8, 0.8, 2, 32) },
    { geometry: new THREE.ConeGeometry(1.1, 1.7, 32) },
    { geometry: new THREE.SphereGeometry(1.5, 32, 32) },
    { geometry: new THREE.IcosahedronGeometry(2) },
    { geometry: new THREE.TorusGeometry(1.1, 0.35, 16, 32) },
    { geometry: new THREE.OctahedronGeometry(2) },
    { geometry: new THREE.SphereGeometry(1.5, 32, 32) },
    { geometry: new THREE.BoxGeometry(2.5, 2.5, 2.5) }
]

function Geometries() {
    const n = 40
    const randProps = useMemo(() => Array.from({ length: n }, () => geometries[Math.floor(Math.random() * geometries.length)]), [])
    return randProps.map((prop) => {
        return (
            <Float>
                <mesh
                    scale={MathUtils.randFloat(0.25, 0.5)}
                    position={[MathUtils.randFloat(-8, 8), MathUtils.randFloat(-8, 8), MathUtils.randFloat(-8, 8)]}
                    geometry={prop.geometry}
                    material={material}
                />
            </Float>
        )
    })
}


export default function Scene() {
    return (
        <>
            {/*<PerspectiveCamera makeDefault zoom={1} position={ [0, 0, 22.5]} />*/}

            <hemisphereLight groundColor="red" />
            <Float floatIntensity={2} rotationIntensity={2}>
                <Html style={{ userSelect: 'none' }} castShadow receiveShadow occlude="blending" transform zIndexRange={[0, 0]}>
                    <iframe
                        title="embed"
                        width={700}
                        height={500}
                        src="https://evandaley.github.io/ThreeJsExperiment/
      "
                        frameBorder={0}
                    />
                </Html>
            </Float>
            <Geometries />
            <Environment background preset="dawn" blur={0.8} />
            <ContactShadows position={[0, -9, 0]} opacity={0.7} scale={40} blur={1} />
            <OrbitControls />
        </>
    );
}