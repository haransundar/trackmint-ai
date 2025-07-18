import { Canvas } from '@react-three/fiber';

export default function DataConstellation() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none', // allows UI interaction
      background: 'radial-gradient(ellipse at center, #0a192f 0%, #1a2a3a 100%)'
    }}>
      <Canvas style={{ width: '100vw', height: '100vh', display: 'block' }}>
        <ambientLight intensity={0.7} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={0.7} />
        </mesh>
      </Canvas>
    </div>
  );
} 