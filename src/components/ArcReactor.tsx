import { motion } from 'framer-motion'

export function ArcReactor({ active = false }: { active?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', opacity: 0.35, filter: 'blur(8px)' }} />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1.5px dashed var(--accent)', opacity: 0.35 }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: '76%', height: '76%', borderRadius: '50%', border: '1.5px solid var(--accent)', opacity: 0.45 }} />
      <motion.div
        animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 90, height: 90, borderRadius: '50%', zIndex: 2,
          background: 'radial-gradient(circle at 32% 28%, #c8f4ff 0%, var(--accent) 45%, var(--accent-dim) 100%)',
          boxShadow: '0 0 50px var(--accent), 0 0 100px var(--accent-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#02050a', boxShadow: 'inset 0 0 14px var(--accent)' }} />
      </motion.div>
      <div style={{ position: 'absolute', bottom: -40, fontFamily: 'var(--font-hud)', fontSize: 13, fontWeight: 600, letterSpacing: '0.4em', color: 'var(--accent)', textShadow: '0 0 16px var(--accent)' }}>
        J.A.R.V.I.S
      </div>
    </div>
  )
}
