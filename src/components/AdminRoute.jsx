import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  const userString = localStorage.getItem('user')
  
  // Chưa đăng nhập → redirect về login
  if (!token) {
    return <Navigate to="/SignIn" replace />
  }

  // Kiểm tra role
  if (userString) {
    const user = JSON.parse(userString)
    
    // Không phải Admin → redirect về homepage
    if (user.role !== 'Admin') {
      return <Navigate to="/" replace />
    }
  }

  // Là Admin → cho vào
  return children
}

export default AdminRoute