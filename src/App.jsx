import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router"
import Homepage from "./pages/Homepage"
import NotFound from "./pages/NotFound"

import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
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
          <Route path="/SignUp"
            element={<SignUp/>}
          />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
