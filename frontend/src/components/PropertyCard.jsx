import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiMapPin, FiPhone, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { FaBed } from 'react-icons/fa'
import { propertiesAPI } from '../api/endpoints'

export default function PropertyCard({ property, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertiesAPI.delete(property.id)
        toast.success('Property deleted successfully')
        onDelete?.(property.id)
      } catch (error) {
        toast.error('Failed to delete property')
      }
    }
  }

  const stampClass = (status) => {
    switch (status) {
      case 'available':
        return 'stamp-available'
      case 'sold':
        return 'stamp-sold'
      default:
        return 'stamp-default'
    }
  }

  const listingId = `LST-${String(property.id).padStart(4, '0')}`

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group flex flex-col h-full rounded-2xl border border-ink-700/60 bg-ink-900 overflow-hidden shadow-panel hover:border-brass-400/30 hover:shadow-panel-lg transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/properties/${property.id}`} className="relative block h-48 bg-ink-800 overflow-hidden">
        {property.first_image ? (
          <img
            src={property.first_image}
            alt={property.owner_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink-800">
            <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">No image</span>
          </div>
        )}

        {/* Listing ID, ledger style */}
        <span className="absolute top-3 left-3 font-mono text-[11px] text-paper/90 bg-ink-950/70 backdrop-blur-sm px-2 py-1 rounded">
          {listingId}
        </span>

        {/* Status stamp */}
        <span className={`absolute top-3 right-3 ${stampClass(property.status)}`}>
          {property.status}
        </span>

        {property.images_count > 0 && (
          <span className="absolute bottom-3 left-3 font-mono text-[11px] bg-ink-950/70 text-paper-dim px-2 py-1 rounded backdrop-blur-sm">
            {property.images_count} photos
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Header */}
        <div className="mb-3">
          <Link to={`/properties/${property.id}`}>
            <h3 className="font-display text-lg font-semibold text-paper group-hover:text-brass-300 transition-colors">
              {property.bhk} BHK in {property.place}
            </h3>
          </Link>
          {property.area && (
            <p className="text-sm text-paper-dim mt-0.5">{property.area}</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-paper-dim">
            <FiMapPin size={15} className="text-brass-400 flex-shrink-0" />
            <span className="text-sm truncate">{property.place}</span>
          </div>
          <div className="flex items-center gap-2 text-paper-dim">
            <FaBed size={15} className="text-brass-400 flex-shrink-0" />
            <span className="text-sm">{property.bhk} Bedrooms</span>
          </div>
         <div className="flex items-baseline gap-1 pt-1">
  <span className="font-mono text-lg font-semibold text-brass-300">
    ₹{(property.price ?? 0).toLocaleString()}
  </span>
</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-ink-700/60">
          <a
            href={`tel:${property.primary_phone}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-sage-500/30 text-sage-300 hover:bg-sage-500/10 transition-all duration-200 text-sm font-medium"
          >
            <FiPhone size={15} />
            <span>Call</span>
          </a>
          <Link
            to={`/edit-property/${property.id}`}
            className="flex items-center justify-center px-3 py-2 rounded-md border border-brass-400/30 text-brass-300 hover:bg-brass-400/10 transition-all duration-200"
          >
            <FiEdit2 size={15} />
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-3 py-2 rounded-md border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
