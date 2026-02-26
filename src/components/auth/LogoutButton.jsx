import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      // Gọi API logout (optional)
      if (refreshToken) {
        await api.post('/Auth/logout', {
          refreshToken: refreshToken
        })
      }

      // Xóa tokens khỏi localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // Hiển thị thông báo
      toast.success('Đã đăng xuất thành công!')

      // Redirect về trang login
      navigate('/SignIn')

    } catch (error) {
      console.error('Logout error:', error)
      
      // Vẫn xóa tokens dù API fail
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      toast.info('Đã đăng xuất')
      navigate('/SignIn')
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Đăng xuất
    </Button>
  )
}

export default LogoutButton