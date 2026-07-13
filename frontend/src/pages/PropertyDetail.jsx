import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiCopy, FiEdit2, FiFileText, FiMapPin, FiPhone, FiTrash2, FiVideo } from 'react-icons/fi'
import { FaInstagram } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { propertiesAPI } from '../api/endpoints'

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    propertiesAPI.get(id).then(({ data }) => setProperty(data)).catch(() => {
      toast.error('Unable to load property')
      navigate('/properties')
    })
  }, [id, navigate])

  const remove = async () => {
    if (!window.confirm('Delete this property permanently?')) return
    await propertiesAPI.delete(id)
    toast.success('Property deleted')
    navigate('/properties')
  }
  const copyPhone = async () => {
    await navigator.clipboard.writeText(property.primary_phone)
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }
  const removeDocument = async (documentId) => {
    await propertiesAPI.deleteDocument(id, documentId)
    setProperty(current => ({ ...current, documents: current.documents.filter(doc => doc.id !== documentId) }))
    toast.success('Document removed')
  }

  if (!property) return <div className="p-8 text-center text-paper-dim">Loading property…</div>
  const images = property.images || []
  const image = images[activeImage]?.image

  return <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={() => navigate('/properties')} className="inline-flex items-center gap-2 text-brass-300 hover:text-brass-200"><FiArrowLeft /> All properties</button>
      <div className="flex gap-2"><button onClick={() => navigate(`/edit-property/${id}`)} className="btn-secondary inline-flex items-center gap-2"><FiEdit2 /> Edit</button><button onClick={remove} className="inline-flex items-center gap-2 rounded-lg bg-rose-500/15 px-4 py-2 text-rose-300 hover:bg-rose-500/25"><FiTrash2 /> Delete</button></div>
    </header>

    <section className="rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-3"><span className={`stamp-${property.status}`}>{property.status}</span><span className="text-paper-dim">#{String(property.id).padStart(5, '0')}</span></div>
      <h1 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">{property.bhk} BHK {property.house_type} in {property.place}</h1>
      <p className="mt-2 flex items-center gap-2 text-paper-dim"><FiMapPin /> {property.complete_address}</p>
    </section>

    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
        <div className="aspect-[16/10] bg-ink-800">{image ? <img src={image} alt={property.place} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-paper-dim">No property images</div>}</div>
        {images.length > 1 && <div className="flex gap-3 overflow-x-auto p-4">{images.map((item, index) => <button key={item.id} onClick={() => setActiveImage(index)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeImage ? 'border-brass-400' : 'border-transparent'}`}><img src={item.image} alt="Property thumbnail" className="h-full w-full object-cover" /></button>)}</div>}
      </section>
      <aside className="space-y-4">
        <section className="rounded-2xl border border-brass-400/30 bg-ink-900 p-6"><p className="text-sm uppercase tracking-wider text-paper-dim">Price</p><p className="mt-2 font-display text-3xl text-brass-300">{money(property.price)}</p></section>
        <section className="rounded-2xl border border-ink-700 bg-ink-900 p-6"><h2 className="font-display text-lg text-paper">Owner</h2><p className="mt-3 text-paper">{property.owner_name}</p><button onClick={copyPhone} className="mt-3 flex w-full items-center gap-2 rounded-lg bg-sage-500/15 px-3 py-2 text-sage-300"><FiPhone /> {property.primary_phone}{copied ? <FiCheck className="ml-auto" /> : <FiCopy className="ml-auto" />}</button>{property.whatsapp_number && <a className="mt-3 block text-sm text-sage-300 hover:text-sage-200" href={`https://wa.me/${property.whatsapp_number}`} target="_blank" rel="noreferrer">Open WhatsApp chat</a>}</section>
        {property.google_maps_link && <a href={property.google_maps_link} target="_blank" rel="noreferrer" className="block rounded-xl border border-ink-700 bg-ink-900 p-4 text-brass-300 hover:bg-ink-800">Open Google Maps</a>}
        {property.instagram_link && <a href={property.instagram_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900 p-4 text-brass-300 hover:bg-ink-800"><FaInstagram /> Instagram</a>}
      </aside>
    </div>

    <section className="grid gap-4 rounded-2xl border border-ink-700 bg-ink-900 p-6 sm:grid-cols-2 lg:grid-cols-4">{[
      ['Square feet', property.square_feet ? `${property.square_feet} sq ft` : '—'], ['Floor', property.floor ?? '—'], ['Furnishing', property.furnishing_status], ['Parking', property.parking ? 'Available' : 'Not listed'], ['Water', property.water_availability || '—'], ['Power backup', property.power_backup ? 'Available' : 'Not listed'], ['Facilities', property.facilities || '—'], ['Area', property.area || '—']
    ].map(([label, value]) => <div key={label}><p className="text-xs uppercase tracking-wider text-paper-dim">{label}</p><p className="mt-1 text-paper">{value}</p></div>)}</section>

    {(property.description || property.broker_notes) && <section className="grid gap-6 rounded-2xl border border-ink-700 bg-ink-900 p-6 md:grid-cols-2"><div><h2 className="font-display text-lg text-paper">Description</h2><p className="mt-3 whitespace-pre-wrap text-paper-dim">{property.description || 'No description provided.'}</p></div><div><h2 className="font-display text-lg text-paper">Broker notes</h2><p className="mt-3 whitespace-pre-wrap text-paper-dim">{property.broker_notes || 'No notes provided.'}</p></div></section>}

    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-ink-700 bg-ink-900 p-6"><h2 className="flex items-center gap-2 font-display text-lg text-paper"><FiVideo /> Property video</h2>{property.property_video ? <video className="mt-4 w-full rounded-lg" controls src={property.property_video}>Your browser cannot play this video.</video> : <p className="mt-3 text-paper-dim">No video uploaded.</p>}</div><div className="rounded-2xl border border-ink-700 bg-ink-900 p-6"><h2 className="flex items-center gap-2 font-display text-lg text-paper"><FiFileText /> Documents</h2><div className="mt-4 space-y-2">{property.documents?.length ? property.documents.map(doc => <div key={doc.id} className="flex items-center gap-3 rounded-lg bg-ink-800 p-3"><a href={doc.file} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-brass-300">{doc.document_type.replace('_', ' ')}</a><button onClick={() => removeDocument(doc.id)} className="text-sm text-rose-300">Remove</button></div>) : <p className="text-paper-dim">No documents uploaded.</p>}</div></div></section>
  </main>
}
