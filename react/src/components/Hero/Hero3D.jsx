import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, PresentationControls, Html } from '@react-three/drei'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function MyGLBModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

const Hero3D = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="hero-3d-wrapper"
    style={{ width: '100%', height: '480px', maxWidth: 700, margin: '0 auto' }}
  >
    <Canvas shadows camera={{ position: [3, 2, 7], fov: 50 }} style={{ borderRadius: 24, background: 'linear-gradient(120deg, #232526 0%, #414345 100%)' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <PresentationControls global polar={[-0.4, 0.4]} azimuth={[-0.6, 0.6]}>
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
            <MyGLBModel url="/laptop.gltf" />
          </Float>
        </Suspense>
      </PresentationControls>
    </Canvas>
  </motion.div>
)

export default Hero3D
