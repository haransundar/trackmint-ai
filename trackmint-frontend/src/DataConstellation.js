import { Canvas } from '@react-three/fiber';

export default function DataConstellation() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, height: '100vh', width: '100vw' }}>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <ambientLight />
      </Canvas>
    </div>
  );
} 