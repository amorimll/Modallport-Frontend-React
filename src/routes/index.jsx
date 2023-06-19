import { BrowserRouter, Routes, Route } from "react-router-dom";
import Processos from "../screens/Cadastros/Processos";
import ModelosVistoria from "../screens/Cadastros/Vistoria";

const RoutesPaths = () => {
    
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/cadastros/processos" element={<Processos />}></Route>
          <Route path="/cadastros/vistorias" element={<ModelosVistoria />}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default RoutesPaths