import { createContext, useContext, useState, type ReactNode } from "react";

export interface UsuarioLogado {
  usuarioId: number;
  email: string;
  perfil: string;
}

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  contaBancaria: string;
  pix: string;
  endereco: string;
  dataNascimento?: string | null;
}

interface AuthContextType {
  token: string | null;
  usuario: UsuarioLogado | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: CadastroPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function decodificarToken(token: string): UsuarioLogado | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    return {
      usuarioId: payload.usuarioId ?? payload.adminId,
      email: payload.sub,
      perfil: payload.perfil,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("hardcore_token");
  });

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => {
    const savedToken = localStorage.getItem("hardcore_token");
    return savedToken ? decodificarToken(savedToken) : null;
  });

  const login = async (email: string, senha: string) => {
    const response = await fetch("/api/usuarios/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "E-mail ou senha inválidos.");
    }

    const data: { token: string } = await response.json();
    localStorage.setItem("hardcore_token", data.token);
    setToken(data.token);
    setUsuario(decodificarToken(data.token));
  };

  const cadastrar = async (dados: CadastroPayload) => {
    const response = await fetch("/api/usuarios/usuarios/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao criar conta. Verifique os dados.");
    }
  };

  const logout = () => {
    localStorage.removeItem("hardcore_token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        isAuthenticated: !!token,
        login,
        cadastrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}