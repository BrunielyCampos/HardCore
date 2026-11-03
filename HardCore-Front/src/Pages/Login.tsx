import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

// Importe os assets conforme a estrutura da sua pasta
import bgImage from "../assets/LoginAsset/image 11.png";
import dpadImage from "../assets/LoginAsset/image 12.png";
import userIcon from "../assets/LoginAsset/ix_user-profile-filled.svg";
import lockIcon from "../assets/LoginAsset/mdi_lock.svg";

interface AnimatedInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  animClass: string;
  icon: string;
}

function AnimatedInput({ id, label, type = "text", value, onChange, animClass, icon }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasContent = value.length > 0;
  const isActive = isFocused || hasContent;

  return (
    <div className="relative flex h-[75.39px] w-[457.83px] items-center rounded-[16.75px_3.93px_18.51px_5.50px] border-[0.79px] border-solid border-[#AAAAAA] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] px-[15px] gap-[15px]">
      
      {/* Ícone do Input */}
      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden">
        <img src={icon} alt={`${label} icon`} className="h-[36px] w-[28px] object-contain" />
      </div>

      {/* Campo de Texto Animado */}
      <div className="relative flex h-full w-full items-center">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          className="peer h-full w-full bg-transparent pt-4 font-['Inter',sans-serif] text-[28.99px] italic text-white focus:outline-none"
        />
        <label
          htmlFor={id}
          className={`absolute left-0 font-['Inter',sans-serif] text-[28.99px] italic text-white transition-all pointer-events-none origin-top-left ${
            isActive ? `${animClass}` : "top-1/2 -translate-y-1/2 opacity-70"
          }`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Dados de Login:", formData);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-black">
      <main className="relative h-[1080px] w-[1479px] shrink-0 overflow-hidden bg-black">
        
        {/* Imagem de Fundo (Soldado) */}
        <img
          className="fixed right-[-100px] -top-45 h-[1262px] w-[1262px] object-cover"
          alt="Background"
          src={bgImage}
        />

        {/* Formulário de Login */}
        <form
          className="absolute left-[157px] top-[240px] flex h-[672.33px] w-[562.09px] flex-col items-center rounded-[11.65px] border-[1.07px] border-solid border-white bg-[linear-gradient(0deg,#000000_0%,#600305_35%,#480001_72%,black_100%)] pt-[60px]"
          onSubmit={handleSubmit}
        >
          {/* Título */}
          <h1 className="m-0 px-8 text-center font-['Metal_Mania',cursive] text-[46.36px] font-normal leading-[1.2] text-[#FF0000]">
            TURBINE A SUA EXPERIÊNCIA!
          </h1>

          {/* Inputs */}
          <div className="z-10 mt-[65px] flex flex-col gap-[28px]">
            <AnimatedInput
              id="login"
              label="Login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              animClass="anim-login-field"
              icon={userIcon}
            />
            <AnimatedInput
              id="senha"
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              animClass="anim-senha-field"
              icon={lockIcon}
            />
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="btn-rectangle-anim relative z-10 mt-[60px] flex h-[76.11px] w-[367.12px] cursor-pointer items-center justify-center rounded-[7.46px] border-none shadow-md transition-transform duration-200 active:scale-95"
          >
            <span className="font-['Inter',sans-serif] text-[26.23px] font-bold text-white">
              Fazer Login
            </span>
          </button>

          {/* Rodapé de Criação de Conta */}
          <div className="absolute bottom-[60px] flex items-center gap-[5px]">
            <span className="font-['Metal_Mania',cursive] text-[24.02px] text-white">
              Ainda não tem uma conta
            </span>
            <span className="font-['Metal_Mania',cursive] text-[23.78px] text-white">?</span>
            <Link 
              to="/cadastro" 
              className="group flex items-center gap-[5px] font-['Metal_Mania',cursive] text-[20.66px] text-white transition-colors hover:text-[#FF7777]"
            >
              Criar agora
              <span className="mt-[2px] transition-transform group-hover:translate-x-1">&gt;</span>
            </Link>
          </div>
        </form>

        {/* D-Pad Playstation Flutuante */}
        <img
          className="absolute left-[531px] top-[794px] z-20 h-[284.94px] w-[284.94px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
          alt="Playstation D-Pad"
          src={dpadImage}
        />

      </main>
    </div>
  );
}