import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 60; // Reduced amount of theorems
const CONNECTION_DISTANCE = 6.0; // Increased distance because there are fewer nodes
const DEPTH_RANGE = 25; 

interface FloatingNumberProps {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  initialText: string;
}

const THEOREMS = [
  'E = mc²',
  'e^(iπ) + 1 = 0',
  'a² + b² = c²',
  'F = ma',
  '∇·E = ρ/ε₀',
  'S = k log W',
  'ΔxΔp ≥ ħ/2',
  'A = πr²',
  'V = IR',
  'PV = nRT',
  'c² = a² + b² - 2ab cos(γ)',
  'F = G m₁m₂ / r²',
  'x = (-b ± √(b² - 4ac)) / 2a',
  'λ = h / p',
  'i² = -1',
  'P(A|B) = P(B|A)P(A)/P(B)',
  'lim(x→∞) (1 + 1/x)^x = e',
  '∫ e^x dx = e^x + C'
];

function FloatingNumber({ position, velocity, initialText }: FloatingNumberProps) {
  const textRef = useRef<THREE.Mesh>(null);
  const [text, setText] = useState(initialText);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);

  // Random glitch effect on individual numbers
  useEffect(() => {
    // Some texts randomly change their value every few seconds
    if (Math.random() > 0.7) {
      const interval = setInterval(() => {
        setText(THEOREMS[Math.floor(Math.random() * THEOREMS.length)]);
      }, 1500 + Math.random() * 4000);
      return () => clearInterval(interval);
    }
  }, []);

  useFrame((state, delta) => {
    if (!textRef.current) return;
    
    // Drifting physics with continuous forward momentum (flying towards screen)
    // When hovered, reduce speed drastically and try to stay put
    const speedMult = hovered ? 0.1 : 1;

    let x = textRef.current.position.x + velocity.x * speedMult;
    let y = textRef.current.position.y + velocity.y * speedMult;
    let z = textRef.current.position.z + (velocity.z + 0.05) * speedMult; 

    // Bounce off X/Y boundaries, but wrap around Z to loop infinitely
    if (Math.abs(x) > 25) velocity.x *= -1;
    if (Math.abs(y) > 15) velocity.y *= -1;
    
    // If it flies past the camera (z > 5), reset it way back
    if (z > 5) {
      z = -DEPTH_RANGE;
      x = (Math.random() - 0.5) * 40;
      y = (Math.random() - 0.5) * 20;
    }

    textRef.current.position.set(x, y, z);
    
    // Rotation matching data flow
    textRef.current.rotation.x += velocity.y * 0.8 * speedMult;
    textRef.current.rotation.y += velocity.x * 0.8 * speedMult;
    textRef.current.rotation.z += velocity.z * 0.1 * speedMult;

    // Hover animation scaling
    targetScale.current = hovered ? 1.6 : 1;
    textRef.current.scale.lerp(new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current), 0.1);

    // Fade out based on Z distance, except when hovered (then fully opaque)
    const normalizedZ = (z + DEPTH_RANGE) / (DEPTH_RANGE + 5);
    const material = textRef.current.material as THREE.Material;
    if ('opacity' in material) {
        material.opacity = THREE.MathUtils.lerp(
          material.opacity as number,
          hovered ? 1.0 : Math.max(0.1, normalizedZ * 0.9),
          0.1
        );
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.4} // Base size
      color={hovered ? "#ec4899" : "#ffffff"} // Turn pink when hovered
      anchorX="center"
      anchorY="middle"
      material-transparent={true}
      outlineWidth={hovered ? 0.03 : 0.015} 
      outlineColor={hovered ? "#ffffff" : "#3b82f6"} // Glow changes to white if hovered
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      {text}
    </Text>
  );
}

export default function MathGraph() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const coreGroup = useRef<THREE.Group>(null);
  
  const { mouse, viewport } = useThree();

  // Generate random data for the numbers
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = (Math.random() - 0.5) * 40; 
      const py = (Math.random() - 0.5) * 20; 
      const pz = (Math.random() - 0.5) * DEPTH_RANGE - (DEPTH_RANGE/2); // Spread deep
      
      const vx = (Math.random() - 0.5) * 0.02;
      const vy = (Math.random() - 0.5) * 0.02;
      const vz = Math.random() * 0.02; // Always slightly forward
      
      const initialText = THEOREMS[Math.floor(Math.random() * THEOREMS.length)];

      temp.push({ 
        id: i, 
        position: new THREE.Vector3(px, py, pz), 
        velocity: new THREE.Vector3(vx, vy, vz), 
        initialText 
      });
    }
    return temp;
  }, []);

  // Use a damped vector for smooth mouse parallax
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!coreGroup.current || !linesRef.current || !geomRef.current) return;

    // Intense smooth parallax tied to mouse position
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, (mouse.y * Math.PI) / 12, 0.05);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, (mouse.x * Math.PI) / 12, 0.05);
    
    coreGroup.current.rotation.x = targetRotation.current.x;
    coreGroup.current.rotation.y = targetRotation.current.y;

    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;

    const linePositions = [];
    const lineColors = [];
    
    const colorInside = new THREE.Color('#60a5fa'); 
    const colorOutside = new THREE.Color('#8b5cf6'); 
    
    const currentPositions = coreGroup.current.children.map(child => child.position);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (!currentPositions[i]) continue;
      
      const posI = currentPositions[i];
      
      const dxMouse = posI.x - targetX;
      const dyMouse = posI.y - targetY;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      // Stronger interactive push for parallax depth drama
      if (distMouse < 5) {
        posI.x += dxMouse * 0.01;
        posI.y += dyMouse * 0.01;
      }

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        if (!currentPositions[j]) continue;
        const posJ = currentPositions[j];
        
        const dist = posI.distanceTo(posJ);

        if (dist < CONNECTION_DISTANCE) {
          linePositions.push(posI.x, posI.y, posI.z, posJ.x, posJ.y, posJ.z);
          
          // Only show lines if they are relatively close to camera (z > -15)
          const zDepthFactor = Math.max(0, (posI.z + 15) / 20);
          const alpha = (1.0 - (dist / CONNECTION_DISTANCE)) * 0.3 * zDepthFactor; 
          
          const mixedColor = colorInside.clone().lerp(colorOutside, alpha);
          
          lineColors.push(
            mixedColor.r, mixedColor.g, mixedColor.b, alpha,
            mixedColor.r, mixedColor.g, mixedColor.b, alpha
          );
        }
      }
    }
    
    const lineGeo = geomRef.current;
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
  });

  return (
    <group ref={coreGroup}>
      <group>
        {nodes.map((node) => (
          <FloatingNumber 
            key={node.id} 
            position={node.position} 
            velocity={node.velocity} 
            initialText={node.initialText} 
          />
        ))}
      </group>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry ref={geomRef} />
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          linewidth={1}
          depthWrite={false}
          opacity={0.6}
        />
      </lineSegments>
    </group>
  );
}
