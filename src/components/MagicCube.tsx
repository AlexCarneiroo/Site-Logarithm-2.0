import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const CUBE_COLORS = [
  '#3b82f6', // Premium Blue
  '#8b5cf6', // Premium Purple
  '#f43f5e', // Premium Rose
  '#10b981', // Premium Emerald
  '#f59e0b', // Premium Amber
  '#ffffff', // Clean White
];

function CubePiece({ position, colorIndex }) {
  const meshRef = useRef();

  return (
    <RoundedBox
      ref={meshRef}
      args={[0.96, 0.96, 0.96]} // Tighter gaps
      radius={0.12} // Smoother edges
      smoothness={5}
      position={position}
    >
      <meshPhysicalMaterial
        color={CUBE_COLORS[colorIndex % CUBE_COLORS.length]}
        metalness={0.1}
        roughness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.1} // Slight glass effect
        ior={1.5}
        envMapIntensity={1.5}
      />
    </RoundedBox>
  );
}

export default function MagicCube() {
  const groupRef = useRef();

  const pieces = useMemo(() => {
    const temp = [];
    let colorCount = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          temp.push({
            position: [x * 1.02, y * 1.02, z * 1.02], // Tighter spacing multiplier
            colorIndex: colorCount++,
          });
        }
      }
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(state.clock.elapsedTime * 0.3) * 0.2, 0.05);
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.cos(state.clock.elapsedTime * 0.2) * 0.1, 0.05);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#3b82f6" />
      
      <Environment preset="studio" />
      
      <Float
        speed={2} 
        rotationIntensity={0.5} 
        floatIntensity={1.5} 
        floatingRange={[-0.2, 0.2]}
      >
        <group ref={groupRef} scale={[1.4, 1.4, 1.4]} position={[0, 0.5, 0]}>
          {pieces.map((piece, i) => (
            <CubePiece key={i} position={piece.position} colorIndex={piece.colorIndex} />
          ))}
        </group>
      </Float>

      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#a78bfa"
      />

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}
