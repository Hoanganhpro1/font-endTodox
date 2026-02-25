import { SignupForm } from '@/components/auth/signup-form';
import React from 'react'
import {z} from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'




const SignUp = () => {
 

  return (
   <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0"  style={{
      backgroundImage: `radial-gradient(circle 700px at 20% 120%, rgba(59,130,246,0.3), transparent),
      radial-gradient(circle 700px at 90% 120%, rgba(59,130,246,0.3), transparent)`,
      
    }}>
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
 
  )
}

export default SignUp
