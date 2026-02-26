import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    // Chưa đăng nhập → redirect về login
    return <Navigate to="/SignIn" replace />
  }

  return children
}

export default PrivateRoute