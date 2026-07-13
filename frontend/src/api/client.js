import axios from 'axios'

// Development stays same-origin through Vite's proxy; production uses Render.
const apiOrigin = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')
let csrfToken = null

const client = axios.create({
  baseURL: `${apiOrigin}/api`,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase()
  if (csrfToken && !['get', 'head', 'options', 'trace'].includes(method)) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

export const initialiseCsrf = async () => {
  const response = await client.get('/auth/csrf/')
  csrfToken = response.data.csrfToken || null
  return response
}

export default client
