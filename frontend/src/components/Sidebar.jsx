import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiList, FiPlus, FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { path: '/', icon: FiHome, label: 'Dashboard' },
  { path: '/properties', icon: FiList, label: 'Properties' },
  { path: '/add-property', icon: FiPlus, label: 'Add Property' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-ink-900 border border-ink-700 text-paper shadow-panel"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className="fixed lg:relative left-0 top-0 h-screen w-72 bg-ink-950 blueprint-grid border-r border-ink-800 p-6 flex flex-col z-40 lg:translate-x-0 lg:z-10">
        {/* Logo */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-md border-2 border-brass-400/60 bg-ink-900 mb-3">
            <FiHome className="text-brass-300 text-lg" />
          </div>
          <h1 className="font-display text-xl text-paper">
            Property<span className="italic text-brass-300">Pro</span>
          </h1>
          <p className="text-[11px] text-paper-dim font-mono uppercase tracking-widest mt-1">
            Ledger &amp; Listings
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <motion.div key={path} whileHover={{ x: 3 }} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-spine"
                    className="absolute left-0 top-0 h-full w-[3px] bg-brass-400 rounded-full"
                  />
                )}
                <Link
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 pl-5 pr-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-ink-900 text-brass-300 border border-brass-400/20'
                      : 'text-paper-dim hover:bg-ink-900/60 hover:text-paper border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 font-medium text-sm transition-all duration-200"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </motion.button>
      </aside>
    </>
  )
}