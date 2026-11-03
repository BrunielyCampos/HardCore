import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './Pages/Cadastro';
import Login from './Pages/Login';
import Home from './Pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}