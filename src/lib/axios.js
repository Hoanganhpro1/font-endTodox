import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5112/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

// ✅ Request Interceptor - Gửi token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor - Auto refresh token khi 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang ở trang login/register, không cần refresh
      if (originalRequest.url.includes('/Auth/login') || 
          originalRequest.url.includes('/Auth/register')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Đang refresh token, đợi trong queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // Không có refresh token → Logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/SignIn'
        return Promise.reject(error)
      }

      try {
        // ✅ Gọi API refresh token
        const response = await axios.post(
          'http://localhost:5112/api/Auth/refresh-token',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Lưu tokens mới
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Cập nhật header cho request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Process queue
        processQueue(null, accessToken)

        // Retry request gốc
        return api(originalRequest)

      } catch (refreshError) {
        // Refresh token fail → Logout
        processQueue(refreshError, null)
        
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        window.location.href = '/SignIn'
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api