import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.username, formData.password)
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-4">
            <FiMail className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Property Manager
          </h1>
          <p className="text-slate-600">Manage your properties efficiently</p>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Email/Username Input */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-primary-500 text-lg" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="input pl-12"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-primary-500 text-lg" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input pl-12"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Demo Info */}
          <div className="pt-4 border-t border-slate-200 text-center text-sm text-slate-600">
            <p>Demo credentials available</p>
            <p>Contact your administrator for access</p>
          </div>
        </motion.form>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-8">
          © 2024 Property Manager. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
