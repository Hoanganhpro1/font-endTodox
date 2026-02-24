import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router"
import Homepage from "./pages/Homepage"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/signIn"
import SignUp from "./pages/SignUp"
function App() {

  return (
    <>
    <Toaster richColors/>

 
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={<Homepage />}
          />
          <Route path="*"
            element={<NotFound />}
          />
          <Route path="/SignIn"
            element={<SignIn/>}
          />
          <Route path="/SignIn"
            element={<SignUp/>}
          />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
