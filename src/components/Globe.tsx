
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GlobeMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a1a"
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* Glow */}
      <Sphere args={[2.1, 32, 32]}>
        <meshStandardMaterial
          color="#FF4D00"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Connection Points */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Point key={i} />
      ))}
    </group>
  );
};

const Point = () => {
  const pos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * Math.random()));
    const theta = Math.random() * 2 * Math.PI;
    const r = 2;
    return [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ];
  }, []);

  return (
    <mesh position={pos as [number, number, number]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#FF4D00" emissive="#FF4D00" emissiveIntensity={2} />
    </mesh>
  );
};

export const Globe: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FF4D00" />
        <GlobeMesh />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
