import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/Auth/forgot-password', { email })
      
      setSubmitted(true)
      toast.success('Đã gửi link đặt lại mật khẩu đến email của bạn!')
      
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
            <p className="text-muted-foreground mb-6">
              Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>
            </p>
            
            <p className="text-sm text-muted-foreground mb-6">
              Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary hover:underline"
              >
                gửi lại
              </button>
            </p>

            <Link to="/SignIn">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </Link>
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
            <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
            <p className="text-muted-foreground mt-2">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/SignIn" className="text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword