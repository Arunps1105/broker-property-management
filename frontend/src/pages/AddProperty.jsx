import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUpload, FiX, FiFile, FiVideo, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { propertiesAPI } from '../api/endpoints'

const ALLOWED_DOC_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']

const DOCUMENT_CATEGORIES = [
  { key: 'sale_deed', label: 'Sale Deed' },
  { key: 'tax_receipt', label: 'Tax Receipt' },
  { key: 'ownership_certificate', label: 'Ownership Certificate' },
  { key: 'other', label: 'Other Documents' },
]

const getFileExtension = (filename) => {
  if (!filename.includes('.')) return ''
  return filename.split('.').pop().toLowerCase()
}

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Images
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // Video
  const [video, setVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)

  // Documents, grouped by category key -> array of File
  const [documents, setDocuments] = useState({
    sale_deed: [],
    tax_receipt: [],
    ownership_certificate: [],
    other: [],
  })

  const [formData, setFormData] = useState({
    owner_name: '',
    primary_phone: '',
    whatsapp_number: '',
    place: '',
    area: '',
    complete_address: '',
    google_maps_link: '',
    instagram_link: '',
    bhk: '',
    floor: '',
    house_type: 'apartment',
    price: '',
    square_feet: '',
    parking: false,
    water_availability: '',
    power_backup: false,
    furnishing_status: 'unfurnished',
    facilities: '',
    description: '',
    broker_notes: '',
    status: 'available',
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // ---------- Images ----------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // ---------- Video ----------
  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }

    setVideo(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideo(null)
    setVideoPreview(null)
  }

  // ---------- Documents ----------
  const handleDocumentChange = (categoryKey, e) => {
    const files = Array.from(e.target.files)
    const validFiles = []

    files.forEach(file => {
      const ext = getFileExtension(file.name)
      if (!ALLOWED_DOC_EXTENSIONS.includes(ext)) {
        toast.error(`"${file.name}" is not a supported file type (PDF, DOC, DOCX, JPG, PNG only)`)
        return
      }
      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [categoryKey]: [...prev[categoryKey], ...validFiles]
      }))
    }

    // reset input so the same file can be re-selected if removed
    e.target.value = ''
  }

  const removeDocument = (categoryKey, index) => {
    setDocuments(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Validation
      if (
        !formData.owner_name ||
        !formData.primary_phone ||
        !formData.whatsapp_number ||
        !formData.place ||
        !formData.complete_address ||
        !formData.price ||
        !formData.status
      ) {
        toast.error('Please fill in all required fields')
        return
      }

      if (images.length === 0) {
        toast.error('Please upload at least one image')
        return
      }

      // Flatten documents into parallel arrays, preserving category order
      const document_uploads = []
      const document_types = []
      DOCUMENT_CATEGORIES.forEach(({ key }) => {
        documents[key].forEach(file => {
          document_uploads.push(file)
          document_types.push(key)
        })
      })

      const submitData = {
        ...formData,
        image_uploads: images,
        property_video: video,
        document_uploads,
        document_types,
      }

      await propertiesAPI.create(submitData)
      toast.success('Property added successfully!')
      navigate('/properties')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  const totalDocumentsCount = DOCUMENT_CATEGORIES.reduce(
    (sum, { key }) => sum + documents[key].length,
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add New Property</h1>
        <p className="text-slate-600 mt-2">Fill in the details to add a new property</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Owner Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Owner Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleInputChange}
              placeholder="Owner Name *"
              className="input"
              required
            />
            <input
              type="tel"
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleInputChange}
              placeholder="Phone Number *"
              className="input"
              required
            />
            <input
              type="tel"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleInputChange}
              placeholder="WhatsApp Number *"
              className="input md:col-span-2"
              required
            />
          </div>
        </motion.div>

        {/* Location Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="Place/City *"
              className="input"
              required
            />
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Area"
              className="input"
            />
            <textarea
              name="complete_address"
              value={formData.complete_address}
              onChange={handleInputChange}
              placeholder="Complete Address *"
              className="input md:col-span-2"
              rows="2"
              required
            />
            <input
              type="url"
              name="google_maps_link"
              value={formData.google_maps_link}
              onChange={handleInputChange}
              placeholder="Google Maps Link"
              className="input md:col-span-2"
            />
          </div>
        </motion.div>

        {/* Property Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="house_type"
              value={formData.house_type}
              onChange={handleInputChange}
              className="input"
            >
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <input
              type="number"
              name="bhk"
              value={formData.bhk}
              onChange={handleInputChange}
              placeholder="BHK"
              className="input"
            />
            <input
              type="url"
              name="instagram_link"
              value={formData.instagram_link}
              onChange={handleInputChange}
              placeholder="https://instagram.com/username"
              className="input"
            />
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              placeholder="Floor Number"
              className="input"
            />
            <input
              type="number"
              name="square_feet"
              value={formData.square_feet}
              onChange={handleInputChange}
              placeholder="Square Feet"
              className="input"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price (₹) *"
              className="input"
              step="0.01"
              required
            />
            <select
              name="furnishing_status"
              value={formData.furnishing_status}
              onChange={handleInputChange}
              className="input"
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="furnished">Furnished</option>
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="font-medium text-slate-700">Parking Available</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="power_backup"
                checked={formData.power_backup}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="font-medium text-slate-700">Power Backup</span>
            </label>
            <input
              type="text"
              name="water_availability"
              value={formData.water_availability}
              onChange={handleInputChange}
              placeholder="Water Availability"
              className="input md:col-span-2"
            />
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Additional Information</h2>
          <textarea
            name="facilities"
            value={formData.facilities}
            onChange={handleInputChange}
            placeholder="Facilities (e.g., Gym, Pool, Security)"
            className="input"
            rows="3"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="input mt-4"
            rows="3"
          />
          <textarea
            name="broker_notes"
            value={formData.broker_notes}
            onChange={handleInputChange}
            placeholder="Broker Notes"
            className="input mt-4"
            rows="3"
          />
        </motion.div>

        {/* Images Upload */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Property Images</h2>
          <div className="border-2 border-dashed border-primary-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="images"
            />
            <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
              <FiUpload className="text-3xl text-primary-500" />
              <p className="font-medium text-slate-900">Click to upload images</p>
              <p className="text-sm text-slate-500">or drag and drop (Max 10 images)</p>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="text-white text-2xl" />
                  </button>
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
          <p className="text-sm text-slate-600 mt-4">
            {imagePreviews.length}/10 images uploaded
          </p>
        </motion.div>

        {/* Video Upload */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Property Video</h2>
          {!videoPreview ? (
            <div className="border-2 border-dashed border-primary-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video"
              />
              <label htmlFor="video" className="cursor-pointer flex flex-col items-center gap-2">
                <FiVideo className="text-3xl text-primary-500" />
                <p className="font-medium text-slate-900">Click to upload a video</p>
                <p className="text-sm text-slate-500">One video only</p>
              </label>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <video src={videoPreview} controls className="w-full max-h-80 bg-black" />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition-colors"
              >
                <FiX />
              </button>
            </div>
          )}
        </motion.div>

        {/* Documents Upload
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">Property Documents</h2>
          <p className="text-sm text-slate-500 mb-6">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCUMENT_CATEGORIES.map(({ key, label }) => (
              <div key={key} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-800">{label}</span>
                  <label
                    htmlFor={`doc-${key}`}
                    className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer flex items-center gap-1"
                  >
                    <FiUpload /> Add file
                  </label>
                  <input
                    type="file"
                    id={`doc-${key}`}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentChange(key, e)}
                    className="hidden"
                  />
                </div>

                {documents[key].length === 0 ? (
                  <p className="text-sm text-slate-400">No files uploaded</p>
                ) : (
                  <ul className="space-y-2">
                    {documents[key].map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FiFile className="text-slate-500 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDocument(key, index)}
                          className="text-slate-400 hover:text-red-500 shrink-0 ml-2"
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-600 mt-4 flex items-center gap-2">
            <FiFileText /> {totalDocumentsCount} document{totalDocumentsCount !== 1 ? 's' : ''} uploaded
          </p>
        </motion.div> */}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex gap-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary"
          >
            {loading ? 'Adding Property...' : 'Add Property'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}
