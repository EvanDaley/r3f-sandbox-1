import OxygenContainer2 from '../objects/OxygenContainer2'
import Box from '../objects/Box'
import AbstractSphere from '../objects/AbstractSphere'
import {
  OrbitControls, Stats, Stage, Loader, PerspectiveCamera,
  Text,
  OrthographicCamera, Environment, useTexture, Reflector
} from '@react-three/drei';
import OxygenContainer3 from '../objects/OxygenContainer3'
import Robot from '../objects/Robot'


// import { Billboard, Html, OrbitControls, OrthographicCamera, Plane, Points } from "@react-three/drei"
import { Canvas, useThree } from '@react-three/fiber';
import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three'
import { MeshPhysicalMaterial } from 'three';

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

const SmoothMove = ({ children, position }) => {
  const { pos } = useSpring({
    pos: position,
    config: { duration: 500 }
  })

  return (
    <>
      <animated.group position={pos}>
        {children}
      </animated.group>
    </>
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
      <group position={[3, 2, 0]}>
        <pointLight  color="#66ffff" intensity={3} decay={3} distance={25} />
        <Robot scale={[1,1,1]}/>
      </group>

      <group position={[-((cellCount / 2) * spacing), 0, -((cellCount / 2) * spacing)]}>
        {cells.map((pos) => (
          <Cell onClick={onTargetClicked} key={`cell-${pos}`} position={pos} />
        ))}

        <SmoothMove position={position}>

          <mesh position={[0, 0, 0]}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshNormalMaterial attach="material" />
          </mesh>

        </SmoothMove>

      </group>
    </>
  );
}

export default function Scene() {
  return (
    <>
      <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />
      <ambientLight intensity={0.1} />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Suspense fallback={null}>
        <Room />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.5} enableZoom={false}  rotateSpeed={0.12} enablePan={false}/>
    </>
  );
}