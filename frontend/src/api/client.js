import axios from 'axios'

// Keep local API requests same-origin so the browser cannot upgrade the backend
// host through a cached HSTS rule. Vite proxies /api to HTTP on port 8000.


const client = axios.create({
  baseURL: '/api',
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