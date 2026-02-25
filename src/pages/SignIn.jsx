import { SigninForm } from '@/components/auth/signin-form'
import React from 'react'

const SignIn = () => {
  return (
   <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0"  style={{
         backgroundImage: `radial-gradient(circle 700px at 20% 120%, rgba(59,130,246,0.3), transparent),
         radial-gradient(circle 700px at 90% 120%, rgba(59,130,246,0.3), transparent)`,
         
       }}>
         <div className="w-full max-w-sm md:max-w-4xl">
           <SigninForm />
         </div>
       </div>
  )
}

export default SignIn