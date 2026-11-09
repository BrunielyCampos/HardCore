import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './Pages/Cadastro';
import Login from './Pages/Login';
import Home from './Pages/Home';
import PaginaItem from './Pages/AbaDoItem';
import Carrinho from './Pages/Carrinho';
import { CarrinhoProvider } from './Context/CarrinhoContext'; // Importe o Provider

export default function App() {
  return (
    // O Provider tem de estar no topo de tudo!
    <CarrinhoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/produto/:id" element={<PaginaItem />} />
          <Route path="/carrinho" element={<Carrinho />} />
        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}