import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const registerUser = (data) => api.post('/auth/register', data)

export const loginUser = (data) => api.post('/auth/login', data)

export const getMe = (token) =>
  api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

export default api
