import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const { user } = useAuthStore()
  const currentTime = new Date()
  const greeting =
    currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass border-b border-brass-400/10 px-6 py-5 sticky top-0 z-20"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side */}
        <div>
          <h2 className="font-display text-2xl text-paper">
            Good {greeting},{' '}
            <span className="italic text-brass-300">
              {user?.first_name || user?.username}
            </span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-paper-dim mt-1.5 font-mono uppercase tracking-wider">
            <FiClock size={13} />
            <span>
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full bg-ink-800 border border-ink-700 hover:border-brass-400/30"
          >
            <div className="w-9 h-9 rounded-full border-2 border-brass-400/50 bg-ink-900 flex items-center justify-center text-brass-300 font-display font-semibold">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0)}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-medium text-paper">{user?.username}</p>
              <p className="text-[11px] text-paper-dim font-mono uppercase tracking-wide">
                Broker Admin
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}