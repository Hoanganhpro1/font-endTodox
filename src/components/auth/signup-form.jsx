import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom' // ✅ Thêm
import { toast } from 'sonner' // ✅ Thêm
import api from '@/lib/axios' // ✅ Thêm

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate() // ✅ Thêm

  const signUpSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập buộc phải có"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  // ✅ Cập nhật onSubmit để gọi API
  const onSubmit = async (data) => {
    try {
      console.log("Đang đăng ký với dữ liệu:", data)

      // ✅ Gọi API Register
      const response = await api.post('/Auth/register', {
        username: data.username,
        email: data.email,
        password: data.password
      })

      console.log("Đăng ký thành công:", response.data)

      // ✅ Lưu tokens vào localStorage
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // ✅ Hiển thị thông báo thành công
      toast.success(`Chào mừng ${response.data.user.username}! Đăng ký thành công!`)

      // ✅ Redirect về Homepage
      navigate('/')

    } catch (error) {
      console.error('Lỗi đăng ký:', error)

      // ✅ Hiển thị lỗi chi tiết
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 400) {
        toast.error('Email hoặc tên đăng nhập đã tồn tại!')
      } else {
        toast.error('Đăng ký thất bại. Vui lòng thử lại!')
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-8 bg-blue-50" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold">Chào mừng tới todoX</h1>
                <p className="text-muted-foreground text-balance">Hãy đăng ký để tiếp tục.</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="block text-sm">Tên</Label>
                <Input
                  {...register("username")}
                  type="text"
                  id="username"
                  placeholder="todox"
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="block text-sm">Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="block text-sm">Mật Khẩu</Label>
                <Input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? 'Đang đăng ký...' : 'Tạo tài khoản'}
              </Button>

              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a className="underline underline-offset-4" href="/SignIn">
                  Đăng Nhập
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/login.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="px-6 text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>.
      </div>
    </div>
  )
}