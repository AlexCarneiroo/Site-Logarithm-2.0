import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float, Line, Sphere, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';

const THEOREMS = [
  'E = mc²', 'e^(iπ) + 1 = 0', 'a² + b² = c²', 'F = ma', '∇·E = ρ/ε₀', 
  'S = k log W', 'ΔxΔp ≥ ħ/2', 'A = πr²', 'V = IR', 'PV = nRT', 
  'i² = -1', 'P(A|B) = P(B|A)P(A)/P(B)', 'lim(x→∞) (1 + 1/x)^x = e', '∫ e^x dx = e^x + C',
  '01010011', 'O(n log n)', '∞'
];

function FloatingTheorems({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null);
  const theorems = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      text: THEOREMS[Math.floor(Math.random() * THEOREMS.length)],
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        -15 - Math.random() * 30
      ),
      speed: Math.random() * 0.02 + 0.01
    }));
  }, []);

  useFrame(() => {
    if (group.current) {
      const speedMult = hovered ? 4 : 1;
      group.current.children.forEach((child, i) => {
        child.position.z += theorems[i].speed * speedMult;
        // Float upwards slightly as well
        child.position.y += theorems[i].speed * 0.2 * speedMult;
        
        if (child.position.z > 5) {
          child.position.z = -40;
          child.position.x = (Math.random() - 0.5) * 60;
          child.position.y = (Math.random() - 0.5) * 40;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {theorems.map((t) => (
        <Text 
          key={t.id} 
          position={t.position} 
          color={hovered ? "#ec4899" : "#3b82f6"} 
          fontSize={Math.random() * 0.8 + 0.4} 
          fillOpacity={hovered ? 0.6 : 0.3} 
          material-transparent={true} 
          outlineWidth={0.02} 
          outlineColor="#0f172a"
          outlineOpacity={hovered ? 0.6 : 0.3}
        >
          {t.text}
        </Text>
      ))}
    </group>
  );
}

export default function DataCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  
  const { mouse } = useThree();
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentScale = useRef(1);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth mouse follow interpolation
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, (mouse.y * Math.PI) / 4, 0.05);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, (mouse.x * Math.PI) / 4, 0.05);

    // Dynamic Scale based on hover
    const targetScale = hovered ? 1.2 : 1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
    
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.15 + targetRotation.current.y;
      coreRef.current.rotation.x = t * 0.1 + targetRotation.current.x;
      coreRef.current.scale.setScalar(currentScale.current);
      
      // Dynamic color shift on material when hovered
      const material = coreRef.current.material as any;
      if (material.color) {
        material.color.lerp(
          new THREE.Color(hovered ? "#f43f5e" : "#1e1b4b"), 
          0.05
        );
        material.emissive.lerp(
          new THREE.Color(hovered ? "#ec4899" : "#3b82f6"), 
          0.05
        );
        material.distort = THREE.MathUtils.lerp(material.distort, hovered ? 0.8 : 0.4, 0.05);
        material.speed = THREE.MathUtils.lerp(material.speed, hovered ? 5 : 2.5, 0.05);
      }
    }
    
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.1 + targetRotation.current.y * 1.5;
      wireframeRef.current.rotation.z = t * 0.05 + targetRotation.current.x * 1.5;
      wireframeRef.current.scale.setScalar(currentScale.current);
      
      const material = wireframeRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(new THREE.Color(hovered ? "#fcd34d" : "#ec4899"), 0.05);
      material.emissive.lerp(new THREE.Color(hovered ? "#f59e0b" : "#ec4899"), 0.05);
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z = t * 0.08 + targetRotation.current.x;
      ringsRef.current.rotation.x = t * 0.12 + targetRotation.current.y;
      ringsRef.current.rotation.y = t * 0.05;
      
      // Spread rings on hover
      ringsRef.current.children.forEach((ring, i) => {
        const targetRadius = hovered ? 1.2 + (i * 0.1) : 1;
        ring.scale.lerp(new THREE.Vector3(targetRadius, targetRadius, targetRadius), 0.05);
        
        // Rotate rings faster on hover
        ring.rotation.z += hovered ? 0.02 * (i % 2 === 0 ? 1 : -1) : 0;
      });
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02 - targetRotation.current.y * 0.2;
      particlesRef.current.rotation.x = targetRotation.current.x * 0.2;
    }
  });

  // Structured constellation network lines
  const networkLines = useMemo(() => {
    const lines = [];
    const points = [];
    const samples = 35;
    const phi = Math.PI * (3 - Math.sqrt(5));
    
    // Generate a Fibonacci sphere for structured nodes
    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        // Expand the sphere outward
        points.push(new THREE.Vector3(x * 6.5, y * 6.5, z * 6.5));
    }
    
    // Connect closest neighbors creating a geometric shell
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].distanceTo(points[j]) < 5.0) {
                // Add an intermediate point to curve the connections slightly outward like a shield
                const mid = new THREE.Vector3().copy(points[i]).lerp(points[j], 0.5).multiplyScalar(1.05);
                lines.push([points[i], mid, points[j]]);
            }
        }
    }
    return lines;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#8b5cf6" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#ec4899" />
      <pointLight position={[0, 0, 0]} intensity={3} color="#3b82f6" />

      {/* Deep Space Theorems */}
      <group ref={particlesRef}>
        <FloatingTheorems hovered={hovered} />
      </group>

      <Float speed={hovered ? 4 : 2} rotationIntensity={hovered ? 1 : 0.5} floatIntensity={hovered ? 2 : 1.5}>
        <group>
          {/* Invisible Hitbox to prevent hover flickering */}
          <mesh
            visible={false}
            onPointerOver={() => {
              document.body.style.cursor = 'crosshair';
              setHovered(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
              setHovered(false);
            }}
          >
            <sphereGeometry args={[2.8, 32, 32]} />
            <meshBasicMaterial />
          </mesh>
          {/* Inner Glowing Core */}
          <Icosahedron ref={coreRef} args={[1.5, 4]} position={[0, 0, 0]}>
            <MeshDistortMaterial
              color="#1e1b4b"
              emissive="#3b82f6"
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.9}
              distort={0.4}
              speed={2.5}
            />
          </Icosahedron>

          {/* Outer Tech Wireframe */}
          <Icosahedron ref={wireframeRef} args={[2.2, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color="#ec4899"
              wireframe
              transparent
              opacity={0.4}
              emissive="#ec4899"
              emissiveIntensity={0.5}
            />
          </Icosahedron>

          {/* Orbiting Particles (Satellites) */}
          <Trail
            width={0.5}
            length={4}
            color={new THREE.Color('#3b82f6')}
            attenuation={(t) => t * t}
          >
            <mesh position={[2.5, 0, 0]}>
               {/* Invisible mesh to act as trail emitter, it will rotate with the wireframe if we attached it there, but here we let it float with the core group and just add static trails or we can animate its position in useFrame. For simplicity, we just add static dots on the wireframe */}
            </mesh>
          </Trail>

          {/* Orbiting Tech Rings */}
          <group ref={ringsRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[3.2, 0.02, 32, 100]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} transparent opacity={0.6} />
              <Sphere args={[0.08]} position={[3.2, 0, 0]}>
                <meshBasicMaterial color="#ffffff" />
              </Sphere>
            </mesh>
            
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
              <torusGeometry args={[4.5, 0.015, 32, 100]} />
              <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} transparent opacity={0.4} />
              <Sphere args={[0.06]} position={[-4.5, 0, 0]}>
                <meshBasicMaterial color="#ffffff" />
              </Sphere>
            </mesh>
            
            <mesh rotation={[Math.PI / 4, -Math.PI / 4, 0]}>
              <torusGeometry args={[6, 0.01, 32, 100]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} transparent opacity={0.3} />
              <Sphere args={[0.05]} position={[0, 6, 0]}>
                <meshBasicMaterial color="#ffffff" />
              </Sphere>
            </mesh>
          </group>

          {/* Network Connection Shield */}
          <group>
            {networkLines.map((line, i) => (
              <Line
                key={i}
                points={line}
                color={hovered ? "#fcd34d" : "#3b82f6"}
                lineWidth={hovered ? 1.5 : 0.8}
                transparent
                opacity={hovered ? 0.6 : 0.15}
              />
            ))}
          </group>
        </group>
      </Float>
    </>
  );
}
