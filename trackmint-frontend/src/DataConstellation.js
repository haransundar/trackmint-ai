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
      pointerEvents: 'none', // ensures UI is clickable
    }}>
      <Canvas style={{ width: '100vw', height: '100vh', display: 'block' }}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <ambientLight />
      </Canvas>
    </div>
  );
} 