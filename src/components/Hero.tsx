import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { motion, type Variants } from 'framer-motion';
import MathGraph from './MathGraph';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="hero-section">
      {/* 3D Canvas Background - Full Screen */}
      <motion.div 
        className="hero-3d-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <Suspense fallback={null}>
            <MathGraph />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Hero Content - Centered over canvas */}
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-slogan-box">
          <p className="hero-slogan">Decodificando o futuro. <span>Uma variável por vez.</span></p>
          <div className="slogan-line"></div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="hero-description">
          A Logarithm traduz a complexidade do seu negócio em algoritmos de crescimento. Combinamos inteligência de dados, engenharia de precisão e design focado na conversão real.
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-cta">
          <button className="btn-primary">
            Nossos Serviços
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
          <button className="btn-secondary">Fale com um Engenheiro</button>
        </motion.div>
      </motion.div>

      <div className="scroll-hint">
        <span>Scroll para descobrir</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
