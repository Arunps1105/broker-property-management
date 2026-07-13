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
      className="glass sticky top-0 z-20 border-b border-brass-400/10 py-4 pl-16 pr-4 sm:px-6 sm:py-5"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side */}
        <div>
          <h2 className="font-display text-xl text-paper sm:text-2xl">
            Good {greeting},{' '}
            <span className="italic text-brass-300">
              {user?.first_name || user?.username}
            </span>
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-paper-dim sm:text-xs sm:tracking-wider">
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
            className="flex items-center gap-3 rounded-full border border-ink-700 bg-ink-800 py-2 pl-2 pr-2 sm:pl-3 sm:pr-4 hover:border-brass-400/30"
          >
            <div className="w-9 h-9 rounded-full border-2 border-brass-400/50 bg-ink-900 flex items-center justify-center text-brass-300 font-display font-semibold">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0)}
            </div>
            <div className="hidden text-sm leading-tight sm:block">
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
