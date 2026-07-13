import axios from 'axios'

// Development stays same-origin through Vite's proxy; production uses Render.
const apiOrigin = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')

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

export const initialiseCsrf = () => client.get('/auth/csrf/')

export default client
