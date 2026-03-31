
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const TechSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#FF4D00"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#FF4D00"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D00"
          emissive="#FF4D00"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FF4D00" emissive="#FF4D00" emissiveIntensity={1} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.2} />
      </mesh>
    </Float>
  );
};

const Particles = ({ count = 100 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#FF4D00" transparent opacity={0.5} />
    </points>
  );
};

export const TechGlobe: React.FC<{ className?: string; glow?: boolean }> = ({ className, glow }) => {
  return (
    <div className={`w-full h-full min-h-[400px] ${className} ${glow ? 'animate-pulse' : ''}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={glow ? 1 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={glow ? 3 : 1} color="#FF4D00" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={glow ? 2 : 1} color="#ffffff" />
        
        <TechSphere />
        <Particles count={glow ? 400 : 200} />
        
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      </Canvas>
    </div>
  );
};
