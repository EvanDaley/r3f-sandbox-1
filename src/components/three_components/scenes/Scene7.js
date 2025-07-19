import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from "@react-spring/three"
import { PerspectiveCamera } from '@react-three/drei';

function AnimatedGroup() {
  const groupRef = useRef();

  const { elapsedTime } = useSpring({
    from: { elapsedTime: 0 },
    to: async (next) => {
      while (true) {
        await next({ elapsedTime: 10000, reset: true });
      }
    },
    config: { duration: 10000 },
    loop: true,
  });

  useFrame(() => {
    groupRef.current.rotation.x += 0.01;
    groupRef.current.rotation.y += 0.01;
  });

  const linearPosition = (time) => {
    const progress = time / 10000; // 10000 is the duration in milliseconds
    const distance = 10; // the total distance to cover
    return [0, 0, progress * distance];
  };

  return (
    <animated.group ref={groupRef} position={linearPosition(elapsedTime)}>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
    </animated.group>
  );
}

export default function Scene() {
  return (
    <>
      <PerspectiveCamera position={[0, 0, 15]}/>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      <AnimatedGroup />
    </>
  );
}