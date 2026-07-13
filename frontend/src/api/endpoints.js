import client, { initialiseCsrf } from './client'

// Auth Endpoints
export const authAPI = {
  initialiseCsrf,
  login: (credentials) => client.post('/auth/login/', credentials),
  logout: () => client.post('/auth/logout/'),
  getCurrentUser: () => client.get('/auth/me/'),
  checkAuth: () => client.get('/auth/check/'),
  changePassword: (data) => client.post('/auth/change-password/', data),
}

const buildPropertyFormData = (data) => {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    if (key === 'image_uploads' && data[key]) {
      data[key].forEach((image) => {
        formData.append('image_uploads', image)
      })
    } else if (key === 'document_uploads' && data[key]) {
      data[key].forEach((doc) => {
        formData.append('document_uploads', doc)
      })
    } else if (key === 'document_types' && data[key]) {
      data[key].forEach((docType) => {
        formData.append('document_types', docType)
      })
    } else if (key === 'property_video') {
      if (data[key]) {
        formData.append('property_video', data[key])
      }
    } else {
      const value = data[key]
      formData.append(key, value === null || value === undefined ? '' : value)
    }
  })

  return formData
}

// Properties Endpoints
export const propertiesAPI = {
  list: (params) => client.get('/properties/', { params }),
  get: (id) => client.get(`/properties/${id}/`),
  create: (data) => {
    const formData = buildPropertyFormData(data)
    return client.post('/properties/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) => {
    const formData = buildPropertyFormData(data)
    return client.patch(`/properties/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => client.delete(`/properties/${id}/`),
  statistics: () => client.get('/properties/statistics/'),
  recent: () => client.get('/properties/recent_properties/'),
  bulkDelete: (ids) => client.post('/properties/bulk_delete/', { ids }),
  deleteDocument: (propertyId, documentId) =>
    client.delete(`/properties/${propertyId}/documents/${documentId}/`),
}

// Search History Endpoints
export const searchAPI = {
  recent: () => client.get('/properties/search-history/recent/'),
  clearAll: () => client.delete('/properties/search-history/clear_all/'),
}