import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './Pages/Cadastro';
import Login from './Pages/Login';
import Home from './Pages/Home';
import PaginaItem from './Pages/AbaDoItem';
import MaisVendidos from './Pages/MaisVendidos';
import Carrinho from './Pages/Carrinho';
import Identificacao from './Pages/Identificacao';
import Pagamento from './Pages/Pagamento';
import Confirmacao from './Pages/Confirmacao';
import TelaInicialGerenciador from './Pages/TelaInicialGerenciador';
import GerenciarProdutos from './Pages/GerenciarProdutos';
import CadastrarProduto from './Pages/CadastrarProduto';
import PrecosEstoque from './Pages/PrecosEstoque';
import GerenciarPedidos from './Pages/GerenciarPedidos';
import PainelEntregador from './Pages/PainelEntregador';
import GerenciarEntregas from './Pages/GerenciarEntregas';
import MeusPedidos from './Pages/MeusPedidos';
import GerenciarUsuarios from './Pages/GerenciarUsuarios';
import Categoria from './Pages/Categoria';
import { ProtectedRoute } from './Componentes/ProtectedRoute';
import { CheckoutRoute } from './Componentes/CheckoutRoute';
import { AuthProvider } from './Context/AuthContext';
import { CarrinhoProvider } from './Context/CarrinhoContext';
import { ProdutoProvider } from './Context/ProdutoContext';
import { PedidoProvider } from './Context/PedidoContext';

export default function App() {
  return (
    <AuthProvider>
      <ProdutoProvider>
        <PedidoProvider>
          <CarrinhoProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/produto/:id" element={<PaginaItem />} />
                <Route path="/mais-vendidos" element={<MaisVendidos />} />
                <Route path="/categoria/:categoria" element={<Categoria />} />

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['CLIENTE', 'ENTREGADOR', 'GERENCIADOR', 'ADMINISTRADOR']}
                      redirectTo="/login"
                    />
                  }
                >
                  <Route path="/meus-pedidos" element={<MeusPedidos />} />
                  <Route path="/confirmacao/:id" element={<Confirmacao />} />

                  <Route element={<CheckoutRoute exigirCarrinho redirectTo="/" />}>
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/identificacao" element={<Identificacao />} />
                    <Route path="/pagamento" element={<Pagamento />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['ENTREGADOR', 'ADMINISTRADOR']}
                      redirectTo="/"
                    />
                  }
                >
                  <Route path="/entregador" element={<PainelEntregador />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['GERENCIADOR', 'ADMINISTRADOR']}
                      redirectTo="/"
                    />
                  }
                >
                  <Route path="/gerenciador" element={<TelaInicialGerenciador />} />
                  <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
                  <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
                  <Route path="/editar-produto/:id" element={<CadastrarProduto />} />
                  <Route path="/precos-estoque" element={<PrecosEstoque />} />
                  <Route path="/gerenciar-pedidos" element={<GerenciarPedidos />} />
                  <Route path="/gerenciar-entregas" element={<GerenciarEntregas />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['ADMINISTRADOR']}
                      redirectTo="/"
                    />
                  }
                >
                  <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CarrinhoProvider>
        </PedidoProvider>
      </ProdutoProvider>
    </AuthProvider>
  );
}