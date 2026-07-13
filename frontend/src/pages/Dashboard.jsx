import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiDollarSign, FiHome, FiBarChart2 } from 'react-icons/fi'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import toast from 'react-hot-toast'
import { propertiesAPI } from '../api/endpoints'
import StatCard from '../components/StatCard'
import PropertyCard from '../components/PropertyCard'

// Brass, sage, rose, and a muted ink-slate — the same four accents used across the app
const COLORS = ['#D9A64C', '#4F9A6C', '#D33F5C', '#5A6780']

const chartTooltipStyle = {
  background: '#1E2738',
  border: '1px solid rgba(217,166,76,0.25)',
  borderRadius: '8px',
  color: '#EDEAE1',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, recentRes] = await Promise.all([
          propertiesAPI.statistics(),
          propertiesAPI.recent()
        ])
        setStats(statsRes.data)
        setRecent(recentRes.data)
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingDashboard />
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-paper-dim font-mono text-sm">
        No data available
      </div>
    )
  }

  // Prepare chart data
  const placeData = Object.entries(stats.properties_by_place).map(([place, count]) => ({
    name: place,
    count
  }))

  const bhkData = Object.entries(stats.properties_by_bhk).map(([bhk, count]) => ({
    bhk: `${bhk} BHK`,
    properties: count
  }))

  const statusData = Object.entries(stats.properties_by_status).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item}>
          <StatCard icon={FiHome} label="Total Properties" value={stats.total_properties} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={FiTrendingUp} label="Available" value={stats.available_properties} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={FiDollarSign}
            label="Average Price"
            value={`₹${Number(stats.average_price || 0).toLocaleString('en-IN')}`}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={FiBarChart2} label="Total Property Value" value={`₹${Number(stats.total_property_value || 0).toLocaleString('en-IN')}`} />
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties by Place */}
        <motion.div variants={item} className="lg:col-span-2 card">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-paper">Properties by Place</h3>
            <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">By region</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,166,76,0.08)" />
              <XAxis dataKey="name" stroke="#A9A493" tick={{ fill: '#A9A493', fontSize: 12 }} />
              <YAxis stroke="#A9A493" tick={{ fill: '#A9A493', fontSize: 12 }} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(217,166,76,0.05)' }} />
              <Bar dataKey="count" fill="#D9A64C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Properties by Status */}
        <motion.div variants={item} className="card">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-paper">Status</h3>
            <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="#141B29"
                strokeWidth={2}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* BHK Distribution */}
      <motion.div variants={item} className="card">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-paper">Properties by BHK</h3>
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Inventory mix</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={bhkData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,166,76,0.08)" />
            <XAxis dataKey="bhk" stroke="#A9A493" tick={{ fill: '#A9A493', fontSize: 12 }} />
            <YAxis stroke="#A9A493" tick={{ fill: '#A9A493', fontSize: 12 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Line
              type="monotone"
              dataKey="properties"
              stroke="#D9A64C"
              strokeWidth={2}
              dot={{ fill: '#D9A64C', r: 5 }}
              activeDot={{ r: 7, fill: '#EACB8B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recently Added Properties */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-paper">Recently Added</h3>
          {recent.length > 0 && (
            <span className="font-mono text-xs text-paper-dim">{recent.length} properties</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.length > 0 ? (
            recent.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-paper-dim font-mono text-sm">No properties added yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function LoadingDashboard() {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 skeleton" />
        ))}
      </div>
      <div className="h-80 skeleton" />
    </div>
  )
}
