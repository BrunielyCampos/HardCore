import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './Pages/Cadastro';
import Login from './Pages/Login';
import Home from './Pages/Home';
import PaginaItem from './Pages/AbaDoItem';
import Carrinho from './Pages/Carrinho';
import Identificacao from './Pages/Identificacao';
import Pagamento from './Pages/Pagamento';
import Confirmacao from './Pages/Confirmacao';
import TelaInicialGerenciador from './Pages/TelaInicialGerenciador';
import GerenciarProdutos from './Pages/GerenciarProdutos';
import CadastrarProduto from './Pages/CadastrarProduto';
import PrecosEstoque from './Pages/PrecosEstoque';
import { CarrinhoProvider } from './Context/CarrinhoContext'; 
import { ProdutoProvider } from './Context/ProdutoContext';


export default function App() {
  return (
    <ProdutoProvider>
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
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/gerenciador" element={<TelaInicialGerenciador />} />
            <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
            <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
            <Route path="/precos-estoque" element={<PrecosEstoque />} />
          </Routes>
        </BrowserRouter>
      </CarrinhoProvider>
    </ProdutoProvider>
  );
}