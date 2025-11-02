'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Edges } from '@react-three/drei';
import * as THREE from 'three';

interface Box3DProps {
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  thickness?: number; // mm - cardboard thickness
  fluteType?: string;
  isOpen?: boolean;
}

function CardboardBox({ 
  length, 
  width, 
  height, 
  thickness = 4,
  fluteType = 'BC',
  isOpen = false 
}: Box3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Convert mm to scene units (scale down by 100 for better visualization)
  const scaleL = length / 100;
  const scaleW = width / 100;
  const scaleH = height / 100;
  const wallThickness = thickness / 100;

  // Rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  // Material for cardboard - realistic brown cardboard texture
  const cardboardMaterial = new THREE.MeshPhongMaterial({
    color: '#D2B48C', // Light brown cardboard color
    transparent: true,
    opacity: 0.9,
    shininess: 10 // Low shininess for matte cardboard look
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: '#8B4513', // Darker brown for edges
    linewidth: 2
  });

  return (
    <group ref={meshRef}>
      {/* Main box structure */}
      <group>
        {/* Bottom */}
        <Box 
          args={[scaleL, wallThickness, scaleW]} 
          position={[0, -scaleH/2 + wallThickness/2, 0]}
          material={cardboardMaterial}
        >
          <Edges material={edgeMaterial} />
        </Box>

        {/* Front wall */}
        <Box 
          args={[scaleL, scaleH, wallThickness]} 
          position={[0, 0, scaleW/2 - wallThickness/2]}
          material={cardboardMaterial}
        >
          <Edges material={edgeMaterial} />
        </Box>

        {/* Back wall */}
        <Box 
          args={[scaleL, scaleH, wallThickness]} 
          position={[0, 0, -scaleW/2 + wallThickness/2]}
          material={cardboardMaterial}
        >
          <Edges material={edgeMaterial} />
        </Box>

        {/* Left wall */}
        <Box 
          args={[wallThickness, scaleH, scaleW]} 
          position={[-scaleL/2 + wallThickness/2, 0, 0]}
          material={cardboardMaterial}
        >
          <Edges material={edgeMaterial} />
        </Box>

        {/* Right wall */}
        <Box 
          args={[wallThickness, scaleH, scaleW]} 
          position={[scaleL/2 - wallThickness/2, 0, 0]}
          material={cardboardMaterial}
        >
          <Edges material={edgeMaterial} />
        </Box>

        {/* Top flaps - only show if box is open */}
        {isOpen && (
          <>
            {/* Front flap */}
            <Box 
              args={[scaleL, wallThickness, scaleW * 0.4]} 
              position={[0, scaleH/2 + wallThickness/2, scaleW * 0.2]}
              rotation={[Math.PI * 0.3, 0, 0]}
              material={cardboardMaterial}
            >
              <Edges material={edgeMaterial} />
            </Box>

            {/* Back flap */}
            <Box 
              args={[scaleL, wallThickness, scaleW * 0.4]} 
              position={[0, scaleH/2 + wallThickness/2, -scaleW * 0.2]}
              rotation={[-Math.PI * 0.3, 0, 0]}
              material={cardboardMaterial}
            >
              <Edges material={edgeMaterial} />
            </Box>

            {/* Side flaps */}
            <Box 
              args={[scaleL * 0.3, wallThickness, scaleW]} 
              position={[scaleL * 0.35, scaleH/2 + wallThickness/2, 0]}
              rotation={[0, 0, Math.PI * 0.3]}
              material={cardboardMaterial}
            >
              <Edges material={edgeMaterial} />
            </Box>

            <Box 
              args={[scaleL * 0.3, wallThickness, scaleW]} 
              position={[-scaleL * 0.35, scaleH/2 + wallThickness/2, 0]}
              rotation={[0, 0, -Math.PI * 0.3]}
              material={cardboardMaterial}
            >
              <Edges material={edgeMaterial} />
            </Box>
          </>
        )}

        {!isOpen && (
          /* Closed top */
          <Box 
            args={[scaleL, wallThickness, scaleW]} 
            position={[0, scaleH/2 - wallThickness/2, 0]}
            material={cardboardMaterial}
          >
            <Edges material={edgeMaterial} />
          </Box>
        )}
      </group>

      {/* Dimension labels */}
      <Text
        position={[0, -scaleH/2 - 0.5, scaleW/2 + 0.3]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {length}mm
      </Text>

      <Text
        position={[scaleL/2 + 0.3, -scaleH/2 - 0.5, 0]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI/2, 0]}
      >
        {width}mm
      </Text>

      <Text
        position={[scaleL/2 + 0.3, 0, scaleW/2 + 0.3]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI/2, 0]}
      >
        {height}mm
      </Text>

      {/* FEFCO/Flute type label */}
      <Text
        position={[0, scaleH/2 + 0.5, 0]}
        fontSize={0.4}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {fluteType}
      </Text>
    </group>
  );
}

function Scene({ length, width, height, thickness, fluteType, isOpen }: Box3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* 3D Box */}
      <CardboardBox 
        length={length}
        width={width}
        height={height}
        thickness={thickness}
        fluteType={fluteType}
        isOpen={isOpen}
      />
      
      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/100/2 - 0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>
      
      {/* Grid helper */}
      <gridHelper args={[20, 20, '#cccccc', '#eeeeee']} position={[0, -height/100/2 - 0.49, 0]} />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
      />
    </>
  );
}

export default function Box3D(props: Box3DProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        className="three-canvas"
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}