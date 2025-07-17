import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate random positions for nodes
function randomPositions(count, spread = 20) {
  return Array.from({ length: count }, () => [
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
  ]);
}

function AnimatedNodes({ count = 60 }) {
  const positions = useMemo(() => randomPositions(count), [count]);
  const pointsRef = useRef();

  // Animate the nodes slowly
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        const angle = t * 0.1 + i;
        pointsRef.current.geometry.attributes.position.array[i * 3 + 0] += Math.sin(angle) * 0.002;
        pointsRef.current.geometry.attributes.position.array[i * 3 + 1] += Math.cos(angle) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00eaff"
        size={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function GlowingLines({ nodePositions, lineCount = 8 }) {
  // Randomly connect some nodes with glowing lines
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < lineCount; i++) {
      const a = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      const b = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      arr.push([a, b]);
    }
    return arr;
  }, [nodePositions, lineCount]);

  return (
    <>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={line}
          color="#00eaff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
}

export default function DataConstellation() {
  const nodeCount = 60;
  const nodePositions = useMemo(() => randomPositions(nodeCount), [nodeCount]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <AnimatedNodes count={nodeCount} />
        <GlowingLines nodePositions={nodePositions} lineCount={10} />
      </Canvas>
    </div>
  );
} 