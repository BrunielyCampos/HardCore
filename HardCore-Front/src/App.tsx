import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './Pages/Cadastro';
import Login from './Pages/Login';
import Home from './Pages/Home';
import PaginaItem from './Pages/AbaDoItem';
import Carrinho from './Pages/Carrinho';
import Identificacao from './Pages/Identificacao';
import Pagamento from './Pages/Pagamento';
import { CarrinhoProvider } from './Context/CarrinhoContext'; 


export default function App() {
  return (

    <CarrinhoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/produto/:id" element={<PaginaItem />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/identificacao" element={<Identificacao />} />
          <Route path="/pagamento" element={<Pagamento />} />
        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}