import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Home } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const AdminHeader = () => {
  const navigate = useNavigate()
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        await api.post('/Auth/logout', { refreshToken })
      }

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      toast.success('Đã đăng xuất thành công!')
      navigate('/SignIn')

    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      toast.info('Đã đăng xuất')
      navigate('/SignIn')
    }
  }

  const goToUserView = () => {
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Manage your application
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Button quay về User view */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToUserView}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            User View
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader