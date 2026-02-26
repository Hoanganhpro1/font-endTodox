import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router"
import Homepage from "./pages/Homepage"
import NotFound from "./pages/NotFound"

import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
function App() {

  return (
    <>
    <Toaster richColors/>

 
      <BrowserRouter>
        <Routes>
           <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Thêm */}
        <Route path="/reset-password" element={<ResetPassword />} />   {/* ✅ Thêm */}
          <Route path="*"
            element={<NotFound />}
          />
         <Route
          path="/"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
