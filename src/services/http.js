import axios from 'axios'

// Allow override via env: create a .env.local with VITE_API_BASE_URL=http://localhost:3000
const baseURL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3000'

const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export default http
