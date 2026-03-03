import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router-dom" // ✅ ĐÚNG
import Homepage from "./pages/Homepage"
import NotFound from "./pages/NotFound"

import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import AdminLayout from "./components/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import UsersManagement from "./pages/admin/UsersManagement"
import AdminRoute from "./components/AdminRoute"
import Statistics from "./pages/admin/Statistics"        // ✅ Thêm
import UserDetail from "./pages/admin/UserDetail" 
import TodosManagement from "./pages/admin/TodosManagement"
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
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersManagement />} />
           <Route path="users/:id" element={<UserDetail />} />      {/* ✅ Thêm */}
            <Route path="stats" element={<Statistics />} />     
              <Route path="todos" element={<TodosManagement />} />
           </Route>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
