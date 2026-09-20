import { motion } from 'framer-motion'

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, background: '#010308',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, fontFamily: 'var(--font-hud)',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: 120, height: 120, borderRadius: '50%', border: '2px solid #00d4ff',
          boxShadow: '0 0 50px rgba(0,212,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
        }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ width: 60, height: 60, borderRadius: '50%', border: '2px dashed rgba(0,212,255,0.6)' }} />
      </motion.div>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.4em', color: '#00d4ff', marginBottom: 10 }}>J.A.R.V.I.S</div>
      <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#6a90a8' }}>INITIALIZING SYSTEMS</div>
      <div style={{ width: 220, height: 2, background: 'rgba(0,180,255,0.15)', marginTop: 28, borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.5, duration: 1.5 }}
          onAnimationComplete={onComplete}
          style={{ height: '100%', background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', boxShadow: '0 0 12px #00d4ff' }}
        />
      </div>
    </motion.div>
  )
}
