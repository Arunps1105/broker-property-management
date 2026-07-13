import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, color }) {
  const displayValue =
    typeof value === 'number' && value > 999 && value < 1000000
      ? (value / 1000).toFixed(1) + 'k'
      : value

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden cursor-pointer rounded-2xl border border-ink-700/60 bg-ink-900 p-6 shadow-panel hover:border-brass-400/40 hover:shadow-panel-lg transition-all duration-300"
    >
      {/* Folded corner accent — a small ledger flourish, not a decoration for its own sake */}
      <div
        className="absolute top-0 right-0 h-10 w-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(217,166,76,0.35) 50%)',
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-dim">
            {label}
          </p>
          <p className="font-display text-4xl font-semibold text-paper mt-2 tabular-nums">
            {displayValue}
          </p>
        </div>
        <div className="flex-shrink-0 h-11 w-11 rounded-full border border-brass-400/30 bg-ink-800 flex items-center justify-center group-hover:border-brass-400/60 group-hover:shadow-brass transition-all duration-300">
          <Icon className="text-brass-300 text-lg" />
        </div>
      </div>

      {/* Hairline base rule, brass tinted, echoes a ledger's ruled sheet */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-brass-400/40 via-ink-700 to-transparent" />
    </motion.div>
  )
}