import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Line, Sphere as BaseSphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Logo3D() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  useFrame(() => {
    // Smooth mouse follow interpolation
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, (mouse.y * Math.PI) / 6, 0.05);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, (mouse.x * Math.PI) / 6, 0.05);

    if (groupRef.current) {
      groupRef.current.rotation.y = targetRotation.current.y;
      groupRef.current.rotation.x = targetRotation.current.x;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#8b5cf6" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#ec4899" />
      <pointLight position={[0, 0, 5]} intensity={3} color="#a855f7" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group ref={groupRef} scale={[1.5, 1.5, 1.5]}>
          {/* Main Body of the "L" Box */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[1, 3, 0.5]} />
            <meshStandardMaterial color="#a855f7" emissive="#d946ef" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.5, -1.25, 0]}>
            <boxGeometry args={[1.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#a855f7" emissive="#d946ef" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Circuit Lines on the L */}
          <Line points={[[-0.7, 1.2, 0.26], [-0.3, 1.2, 0.26]]} color="#ffffff" lineWidth={2} />
          <Line points={[[-0.7, 0.6, 0.26], [-0.3, 0.6, 0.26]]} color="#ffffff" lineWidth={2} />
          <Line points={[[-0.7, 0.0, 0.26], [-0.3, 0.0, 0.26]]} color="#ffffff" lineWidth={2} />

          {/* Connectors (Points on circuits) */}
          <BaseSphere args={[0.08]} position={[-0.7, 1.2, 0.26]}><meshBasicMaterial color="#ffffff" /></BaseSphere>
          <BaseSphere args={[0.08]} position={[-0.7, 0.6, 0.26]}><meshBasicMaterial color="#ffffff" /></BaseSphere>
          <BaseSphere args={[0.08]} position={[-0.7, 0.0, 0.26]}><meshBasicMaterial color="#ffffff" /></BaseSphere>

          {/* Subtle curved swoosh underneath */}
          <group position={[0, -2, 0]}>
             <Line 
               points={Array.from({length: 20}).map((_, i) => {
                 const x = -2 + (i / 19) * 4;
                 const y = Math.sin(x * 0.8) * 0.3;
                 return [x, y, 0];
               })}
               color="#d946ef"
               lineWidth={4}
             />
          </group>
        </group>
      </Float>
    </>
  );
}
