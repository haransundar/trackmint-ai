import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function SignalNode({ position, label, color }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html center distanceFactor={8} style={{ color: '#fff', fontWeight: 'bold', textShadow: '0 2px 8px #000' }}>
        {label}
      </Html>
    </group>
  );
}

export default function SignalCluster3D({ lead }) {
  // Always define signals and nodePositions at the top
  const signals = lead && lead.ai_analysis ? Object.entries(lead.ai_analysis) : [];
  const radius = 6;
  const nodePositions = useMemo(() => (
    signals.map((_, i) => {
      const angle = (i / signals.length) * Math.PI * 2;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
    })
  ), [signals.length]);

  // If no signals, show a message
  if (!lead || !lead.ai_analysis || Object.keys(lead.ai_analysis).length === 0) {
    return (
      <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
        No signals to visualize.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        {/* Central node (company) */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={0.7} />
        </mesh>
        <Html center distanceFactor={10} style={{ color: '#00eaff', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 2px 8px #000' }}>
          {lead.url}
        </Html>
        {/* Signal nodes and connecting lines */}
        {signals.map(([key, value], i) => (
          <group key={key}>
            {/* Line from center to node */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, radius, 16]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
              <group position={[0, 0, 0]}>
                <primitive
                  object={new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(...nodePositions[i]).clone().normalize()
                  )}
                />
              </group>
            </mesh>
            <SignalNode
              position={nodePositions[i]}
              label={`${key}: ${String(value)}`}
              color="#ffd700"
            />
          </group>
        ))}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
} 