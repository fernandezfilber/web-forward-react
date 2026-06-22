import React, { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'

import { TextureLoader } from 'three'
import { 
  Float, 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PresentationControls, 
  MeshTransmissionMaterial,
  Text3D,
  Center,
  Sparkles
} from '@react-three/drei'
import * as THREE from 'three'

function Nucleus({ texture }) {
  const groupRef = useRef()
  
  // Generar posiciones aleatorias para protones y neutrones
  const particles = useMemo(() => {
    const pts = []
    for (let i = 0; i < 20; i++) {
      const phi = Math.acos(-1 + (2 * i) / 20)
      const theta = Math.sqrt(20 * Math.PI) * phi
      const r = 0.8 + Math.random() * 0.4
      pts.push({
        position: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        ],
        color: i % 2 === 0 ? "#ef4444" : "#3b82f6", // Rojo (protones) y Azul (neutrones)
        size: 0.3 + Math.random() * 0.2
      })

    }
    return pts
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Vibración del núcleo (Efecto cuántico)
      groupRef.current.children.forEach((child, i) => {
        child.position.x += Math.sin(t * 10 + i) * 0.005
        child.position.y += Math.cos(t * 12 + i) * 0.005
        child.position.z += Math.sin(t * 8 + i) * 0.005
      })
      // Rotación suave del grupo completo
      groupRef.current.rotation.y = t * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Partículas del Núcleo (Protones y Neutrones) */}
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 32, 32]} />
          <meshStandardMaterial 
            color={p.color} 
            emissive={p.color} 
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Núcleo de Energía Central (Logo) */}
      <group scale={0.6}>
        <mesh>
          <sphereGeometry args={[2.2, 64, 64]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={1}
            chromaticAberration={0.02}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[2.1, 64]} />
          <meshStandardMaterial 
            map={texture}
            transparent={true}
            side={THREE.DoubleSide}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Brillo central */}
      <pointLight intensity={15} color="#ffffff" distance={5} />
      <Sparkles count={40} scale={3} size={2} speed={0.5} opacity={0.5} color="#ffffff" />
    </group>

  )
}


function AtomStructure({ textureUrl }) {
  const electronRef1 = useRef()
  const electronRef2 = useRef()
  const electronRef3 = useRef()
  const texture = useLoader(TextureLoader, textureUrl)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 1.5
    
    // Animación de los electrones sobre sus órbitas
    if (electronRef1.current) {
      electronRef1.current.position.set(Math.cos(t) * 4.5, Math.sin(t) * 4.5, 0)
    }
    if (electronRef2.current) {
      electronRef2.current.position.set(Math.cos(t + 2) * 4.5, 0, Math.sin(t + 2) * 4.5)
    }
    if (electronRef3.current) {
      electronRef3.current.position.set(0, Math.cos(t + 4) * 4.5, Math.sin(t + 4) * 4.5)
    }
  })

  return (
    <group>
      {/* NÚCLEO ATÓMICO DINÁMICO */}
      <Nucleus texture={texture} />

      <pointLight intensity={10} color="#ffffff" distance={10} />

      {/* ÓRBITAS */}
      <group>
        {/* Órbita 1 (XY) */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[4.5, 0.01, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        {/* Órbita 2 (XZ) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.5, 0.01, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        {/* Órbita 3 (YZ) */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[4.5, 0.01, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* ELECTRONES (Clásico Amarillo/Oro) */}
      <mesh ref={electronRef1}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={10} />
      </mesh>
      <mesh ref={electronRef2}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={10} />
      </mesh>
      <mesh ref={electronRef3}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={10} />
      </mesh>
    </group>

  )
}

function GlassLogo({ textureUrl }) {
  const { viewport } = useThree()
  
  // Calcular escala responsiva basada en el ancho del viewport
  // En móviles el viewport.width suele ser pequeño (~5-8 unidades)
  const responsiveScale = Math.min(Math.max(viewport.width / 11, 0.5), 1)
  
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group scale={responsiveScale}>
        <AtomStructure textureUrl={textureUrl} />

        {/* Texto 3D Inferior */}
        <Center position={[0, -2.5, 0]}>
          <Text3D 
            font="/helvetiker_bold.typeface.json"
            size={0.6}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            FORWARD
            <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
          </Text3D>
        </Center>
        <Center position={[0, -3.3, 0]}>
          <Text3D 
            font="/helvetiker_bold.typeface.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            VISION
            <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
          </Text3D>
        </Center>
      </group>
    </Float>
  )
}


export default function ThreeDLogo({ textureUrl, className }) {
  return (
    <div className={`w-full h-[400px] md:h-[700px] cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <GlassLogo textureUrl={textureUrl} />
          </PresentationControls>

          <OrbitControls enableZoom={false} enablePan={false} makeDefault />
          
          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.4} 
            scale={15} 
            blur={2} 
            far={10} 
            color="#000000"
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}


