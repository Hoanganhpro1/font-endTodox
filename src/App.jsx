import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router"
import Homepage from "./pages/Homepage"
import NotFound from "./pages/NotFound"
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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
