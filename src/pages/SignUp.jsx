import { SignupForm } from '@/components/signup-form'
import React from 'react'

const SignUp = () => {
  return (
   <div className="min-h-screen w-full bg-[#0f172a] relative">
  {/* Blue Radial Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `radial-gradient(circle 600px at 20% 30%, rgba(59,130,246,0.3), transparent)`,
    }}
  />
     {/* Your Content/Components */}
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
</div>
 
  )
}

export default SignUp
