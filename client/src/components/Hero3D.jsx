import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function Terrain() {
  const mesh = useRef()
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 64, 64)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = Math.sin(x * 0.4) * 0.3 + Math.cos(y * 0.3) * 0.25 + Math.sin(x * y * 0.05) * 0.15
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
    }
  })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#2d5a3d" roughness={0.85} metalness={0.05} flatShading />
    </mesh>
  )
}

function Ocean() {
  const mesh = useRef()
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = -1.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.04
    }
  })
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 2]}>
      <planeGeometry args={[22, 12, 32, 32]} />
      <meshStandardMaterial color="#1e6b8a" transparent opacity={0.75} roughness={0.2} metalness={0.3} />
    </mesh>
  )
}

function Sun() {
  const mesh = useRef()
  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime * 0.15
      mesh.current.position.x = Math.cos(t) * 5
      mesh.current.position.y = 3 + Math.sin(t) * 1.5
    }
  })
  return (
    <mesh ref={mesh} position={[5, 4, -3]}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial color="#f5c842" emissive="#d4a017" emissiveIntensity={1.5} />
    </mesh>
  )
}

function FloatingOrbs() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.08
  })
  return (
    <group ref={group}>
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
        const r = 3.5 + (i % 3) * 0.4
        const isGold = i % 3 === 0
        const color = isGold ? '#d4a017' : (i % 3 === 1 ? '#4ade80' : '#16a34a')
        return (
          <Float key={i} speed={1.5 + i * 0.1} floatIntensity={0.6}>
            <mesh position={[Math.cos(angle) * r, 0.8 + (i % 2) * 0.5, Math.sin(angle) * r - 1]}>
              <sphereGeometry args={[0.12 + (i % 3) * 0.04, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.2, 6]} />
        <meshStandardMaterial color="#3a2510" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.6, 1.2, 7]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <coneGeometry args={[0.4, 0.9, 7]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  )
}

const treePositions = [
  [-3.5, -1.1, -1], [3.2, -1.1, 0.5], [-1.8, -1.1, 2],
  [-5.0, -1.1, 0.5], [4.8, -1.1, -0.8], [2.0, -1.1, -2.5],
  [-2.5, -1.1, -3.0], [0.5, -1.1, 3.0], [-4.2, -1.1, 2.5],
  [5.5, -1.1, 2.0], [1.5, -1.1, -4.0], [-0.5, -1.1, -4.5]
]

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2.5, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a1f0f']} />
        <fog attach="fog" args={['#0a1f0f', 8, 24]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 3]} intensity={1.2} castShadow color="#fffde7" />
        <pointLight position={[-4, 3, 2]} intensity={0.5} color="#4ade80" />
        <pointLight position={[4, 2, -2]} intensity={0.3} color="#d4a017" />
        <Stars radius={40} depth={40} count={1500} factor={3} saturation={0.3} fade speed={0.5} />
        <Sun />
        <Terrain />
        <Ocean />
        <FloatingOrbs />
        {treePositions.map((pos, i) => (
          <Tree key={i} position={pos} scale={0.8 + (i % 3) * 0.15} />
        ))}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0f] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
