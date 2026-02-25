import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "../ui/label";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod';
export function SigninForm({
  className,
  ...props
}) {
  const signUpSchema = z.object({
  email: z.string().email("email không hợp lệ"),
  password: z.string().min(6,"mật khẩu phải có 6 kí tự")

})
   const onSubmit = async (data)=>{
  console.log("dữ liệu hợp lệ",data)
 }
  const {register,handleSubmit,formState:{errors,isSubmitting}}  = useForm(
  {
    resolver: zodResolver(signUpSchema)
  }
  
 )
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-8 bg-blue-50" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 text-center">
                  <h1 className="text-2xl font-bold">Chào mừng tới todoX</h1>
                  <p className="text-muted-foreground text-balance">Hãy đăng kí để tiếp tục.</p>
                </div>
              <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="block text-sm">Email</Label>
              <Input  {...register("email")} type="email" id="email" placehoder ="todox"></Input>
                {errors.email && (
                <p className="text-destructive text-sm">{
                  errors.email.message
                }</p>
              )}
            </div>
              <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="block text-sm">Mật Khẩu</Label>
              <Input  {...register("password")} type="password" id="password" placehoder ="todox"></Input>
                {errors.password && (
                <p className="text-destructive text-sm">{
                  errors.password.message
                }</p>
              )}
            </div>
            <Button disabled ={isSubmitting} type="submit" className="w-full">
              Đăng nhập
            </Button>
            <div className="text-center text-sm">
              Chưa có tài khoản? {" "}
              <a className="underline underline-offset-4" href="/SignUp">Đăng ký</a>
            </div>
            </div>
           
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
             src="/public/login.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
