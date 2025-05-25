
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { Mesh } from 'three';

interface NexusHubProps {
  onPortalClick?: (portalType: string) => void;
}

const NexusHub: React.FC<NexusHubProps> = ({ onPortalClick }) => {
  const centerOrbRef = useRef<Mesh>(null);
  const portalRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate central orb
    if (centerOrbRef.current) {
      centerOrbRef.current.rotation.y = time * 0.5;
      centerOrbRef.current.position.y = Math.sin(time) * 0.2;
    }

    // Animate portals - safely check if refs exist
    portalRefs.current.forEach((portal, index) => {
      if (portal) {
        portal.rotation.y = time * 0.3 + index * 0.5;
      }
    });
  });

  const handlePortalClick = (portalType: string) => {
    console.log(`Portal clicked: ${portalType}`);
    onPortalClick?.(portalType);
  };

  const setPortalRef = (index: number) => (el: Mesh | null) => {
    if (portalRefs.current) {
      portalRefs.current[index] = el;
    }
  };

  return (
    <group>
      {/* Ground/Platform */}
      <Cylinder args={[15, 15, 0.5]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Central Knowledge Orb */}
      <Sphere 
        ref={centerOrbRef}
        args={[1.5]} 
        position={[0, 3, 0]}
        onClick={() => handlePortalClick('search')}
      >
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6" 
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.1}
        />
      </Sphere>

      {/* Search Portal Text */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.5}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff2"
      >
        Altarul Căutării
      </Text>

      {/* Collection Portals */}
      {[
        { name: "Literatură\nClasică", position: [-6, 2, -6] as [number, number, number], color: "#ef4444" },
        { name: "Știință &\nTehnologie", position: [6, 2, -6] as [number, number, number], color: "#06b6d4" },
        { name: "Istorie &\nFilozofie", position: [-6, 2, 6] as [number, number, number], color: "#84cc16" },
        { name: "Colecția\nFavorite", position: [6, 2, 6] as [number, number, number], color: "#f59e0b" }
      ].map((portal, index) => (
        <group key={portal.name} position={portal.position}>
          <Box 
            ref={setPortalRef(index)}
            args={[2, 3, 0.5]}
            onClick={() => handlePortalClick(portal.name.toLowerCase().replace(/[^a-z]/g, ''))}
          >
            <meshStandardMaterial 
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={0.1}
              metalness={0.6}
              roughness={0.3}
            />
          </Box>
          <Text
            position={[0, 2, 0.3]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff2"
          >
            {portal.name}
          </Text>
        </group>
      ))}

      {/* Ambient floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05]}
          position={[
            (Math.random() - 0.5) * 25,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 25
          ] as [number, number, number]}
        >
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#8b5cf6" 
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
};

export default NexusHub;
