import * as THREE from 'three'

import {
    OrbitControls,
    OrthographicCamera
} from '@react-three/drei';
import Robot from '../objects/Robot'

import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react';

import { useSpring, animated } from "@react-spring/three"

const Cell = React.forwardRef(({ position, onClick }, ref) => {
    const [hovered, setHovered] = useState(false)

    const [randomNumber, setRandomNumber] = useState(0);

    useEffect(() => {
        const newRandomNumber = Math.floor(Math.random() * 3) + 5
        setRandomNumber(newRandomNumber);
    }, []);

    return (
        <group ref={ref}>
            <mesh
                onClick={() => onClick(position)}
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                position={position}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial color={hovered ? `#558855` : `#${randomNumber}8${randomNumber}8${randomNumber}8`} />
            </mesh>
        </group>
    )
})

function grid(w, h) {
    const res = []
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            res.push([x, 0, y])
        }
    }

    return res
}

// Dev note: This acts as a container that moves everything inside it. I think I could network this with Peer.js?
const SmoothMove = ({ children, position }) => {
    const groupRef = useRef()
    const prevPos = useRef(new THREE.Vector3(...position))
    const [springProps, api] = useSpring(() => ({
        pos: position,
        config: { duration: 500 }
    }))

    useEffect(() => {
        const from = prevPos.current
        const to = new THREE.Vector3(...position)
        const distance = from.distanceTo(to)

        // Base duration: 100ms per unit of distance, clamp between 200–1000ms
        const duration = Math.min(Math.max(distance * 100, 200), 1000)

        api.start({
            pos: position,
            config: { duration },
            onChange: (anim) => {
                const newPos = new THREE.Vector3(...anim.value.pos)
                const delta = newPos.clone().sub(prevPos.current)

                if (groupRef.current && (delta.x !== 0 || delta.z !== 0)) {
                    let angle = Math.atan2(delta.x, delta.z)
                    const snap45 = Math.PI / 4
                    angle = Math.round(angle / snap45) * snap45
                    groupRef.current.rotation.y = angle
                    prevPos.current.copy(newPos)
                }
            }
        })
    }, [position])

    return (
        <animated.group ref={groupRef} position={springProps.pos}>
            {children}
        </animated.group>
    )
}


function Room() {
    const spacing = 1.05
    const cellCount = 15
    const cells = grid(cellCount, cellCount).map(([x, y, z]) => [x * spacing, -.5, z * spacing])

    const [position, setPosition] = useState([0, 0, 0]);

    const onTargetClicked = (position) => {
        setPosition([position[0], 0, position[2]])
    }

    return (
        <>
            <group position={[-((cellCount / 2) * spacing), 0, -((cellCount / 2) * spacing)]}>
                {cells.map((pos) => (
                    <Cell onClick={onTargetClicked} key={`cell-${pos}`} position={pos} />
                ))}

                <SmoothMove position={[position[0] + 2, position[1], position[2]]}>
                    <Robot scale={[1, 1, 1]} />
                </SmoothMove>

            </group>
        </>
    );
}

export default function Scene() {
    return (
        <>
            <group position={[2, 3, 0]}>
                <pointLight  color="#66ffff" intensity={3} decay={3} distance={25} />
            </group>
            <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />
            <ambientLight intensity={0.1} />
            {/*<pointLight position={[10, 10, 10]} />*/}
            <Suspense fallback={null}>
                <Room />
            </Suspense>
            <OrbitControls minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.5} enableZoom={false}  rotateSpeed={0.12} enablePan={false}/>
        </>
    );
}