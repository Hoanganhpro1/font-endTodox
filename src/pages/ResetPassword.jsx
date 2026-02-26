import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Lock, CheckCircle } from 'lucide-react'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp!')
      return
    }

    if (!token) {
      toast.error('Link không hợp lệ!')
      return
    }

    setLoading(true)

    try {
      await api.post('/Auth/reset-password', {
        token: token,
        newPassword: newPassword
      })

      setSuccess(true)
      toast.success('Đặt lại mật khẩu thành công!')

      // Redirect về login sau 2 giây
      setTimeout(() => {
        navigate('/SignIn')
      }, 2000)

    } catch (error) {
      console.error('Reset password error:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Link đã hết hạn hoặc không hợp lệ!')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Thành công!</h2>
            <p className="text-muted-foreground">
              Mật khẩu của bạn đã được đặt lại thành công.
              <br />
              Đang chuyển đến trang đăng nhập...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground mt-2">
              Nhập mật khẩu mới của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword