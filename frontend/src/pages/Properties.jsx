import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { propertiesAPI } from '../api/endpoints'
import PropertyCard from '../components/PropertyCard'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Search & Filter State
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    place: '',
    bhk: '',
    status: 'all',
    price_min: '',
    price_max: '',
    house_type: '',
  })
  const [sorting, setSorting] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = {
        search: search || undefined,
        place: filters.place || undefined,
        bhk: filters.bhk || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        price_min: filters.price_min || undefined,
        price_max: filters.price_max || undefined,
        house_type: filters.house_type || undefined,
        ordering: getSortingKey(sorting),
        page: currentPage,
      }

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

      const response = await propertiesAPI.list(params)
      setProperties(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const getSortingKey = (sort) => {
    const map = {
      newest: '-created_at',
      oldest: 'created_at',
      price_low: 'price',
      price_high: '-price',
      bhk_low: 'bhk',
      bhk_high: '-bhk',
    }
    return map[sort] || '-created_at'
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filters])

  useEffect(() => {
    fetchProperties()
  }, [search, filters, sorting, currentPage])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      place: '',
      bhk: '',
      status: 'all',
      price_min: '',
      price_max: '',
      house_type: '',
    })
    setSearch('')
    setSorting('newest')
  }

  const handleDelete = (id) => {
    setProperties(properties.filter(p => p.id !== id))
  }

  const isFiltered = search || Object.values(filters).some(v => v && v !== 'all') || sorting !== 'newest'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Properties</h1>
        <p className="text-slate-600">Search and manage all your properties</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by owner name, place, address..."
            className="input pl-12 w-full"
          />
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
        >
          <FiFilter size={18} />
          <span>Filters {isFiltered && '(Active)'}</span>
          {isFiltered && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-sm"
            >
              <FiX size={16} />
              Clear
            </button>
          )}
        </button>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg"
          >
            <input
              type="text"
              placeholder="Place"
              value={filters.place}
              onChange={(e) => handleFilterChange('place', e.target.value)}
              className="input text-sm"
            />
            <input
              type="number"
              placeholder="BHK"
              value={filters.bhk}
              onChange={(e) => handleFilterChange('bhk', e.target.value)}
              className="input text-sm"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value)}
              className="input text-sm"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value)}
              className="input text-sm"
            />
            <select
              value={filters.house_type}
              onChange={(e) => handleFilterChange('house_type', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </motion.div>
        )}

        {/* Sorting */}
        <div className="flex items-center justify-between">
          <select
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            className="input text-sm max-w-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="bhk_low">BHK: Low to High</option>
            <option value="bhk_high">BHK: High to Low</option>
          </select>
          {properties.length > 0 && (
            <span className="text-sm text-slate-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
            </span>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-500 text-lg">No properties found</p>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </motion.div>
  )
}
