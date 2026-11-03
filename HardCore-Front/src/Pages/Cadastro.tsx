import { useState, type ChangeEvent, type FormEvent } from "react";
import caveira from "../assets/CatalogoAsset/image 13.png";
import hardocre3 from "../assets/CatalogoAsset/Hardocre 3.png";
import hardocre4 from "../assets/CatalogoAsset/Hardocre 4.png";
import chevronDown from "../assets/CatalogoAsset/chevron-down.svg";
import vector3 from "../assets/CatalogoAsset/Vector 3.svg";
import "./Cadastro.css";

interface FormDataState {
  name: string;
  surname: string;
  password: string;
  email: string;
  cpf: string;
  rg: string;
  accountType: string;
  marketing: boolean;
  terms: boolean;
}

const inputFields = [
  { id: "name", label: "Nome", type: "text", animClass: "anim-nome" },
  { id: "surname", label: "Sobrenome", type: "text", animClass: "anim-sobrenome" },
  { id: "password", label: "Senha", type: "password", animClass: "anim-senha" },
  { id: "email", label: "E-mail", type: "email", animClass: "anim-email" },
  { id: "cpf", label: "CPF", type: "text", animClass: "anim-cpf" },
  { id: "rg", label: "RG", type: "text", animClass: "anim-rg" },
];

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
  required?: boolean;
}

function Checkbox({ id, checked, onChange, required = false }: CheckboxProps) {
  return (
    <div className="relative flex h-[25px] w-[25px] shrink-0 items-center justify-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(e) => onChange(id, e.target.checked)}
        aria-label={id}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      />

      <span
        className="
          pointer-events-none flex h-full w-full items-center justify-center
          rounded-[6px_3px_6px_3px]
          border border-[#AAAAAA]
          bg-gradient-to-br from-[#2F2F2F] to-[#777777]
          shadow-inner
          transition-all duration-300 ease-out
          peer-checked:border-[#FF3333]
          peer-checked:bg-none
          peer-checked:bg-[#980808]
          peer-checked:shadow-[0_0_12px_rgba(220,20,20,0.35)]
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`
            h-[17px] w-[17px] text-white
            transition-all duration-300 ease-out
            ${checked ? "scale-100 opacity-100 rotate-0 anim-checkbox-check" : "scale-50 opacity-0 -rotate-45"}
          `}
        >
          <path
            d="M5 12.5L10 17L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

interface AnimatedInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  animClass: string;
}

function AnimatedInput({ id, label, type = "text", value, onChange, animClass }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasContent = value.length > 0;
  const isActive = isFocused || hasContent;

  return (
    <div className="relative flex h-[61.09px] w-[371px] items-center rounded-[13.57px_3.18px_15px_4.45px] border-[0.64px] border-solid border-[#AAAAAA] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] px-[8.27px]">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
        className="peer h-full w-full bg-transparent pt-4 font-['Inter',sans-serif] text-[23.5px] italic text-white focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`absolute left-[15px] font-['Inter',sans-serif] text-[23.5px] italic text-white/70 transition-all pointer-events-none origin-top-left ${
          isActive ? `${animClass} text-white` : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function Cadastro() {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    surname: "",
    password: "",
    email: "",
    cpf: "",
    rg: "",
    accountType: "Pessoa Física",
    marketing: false,
    terms: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((current) => ({
      ...current,
      [id]: checked,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.terms) {
      alert("Você precisa aceitar os termos de uso para continuar.");
      return;
    }
    console.log("Dados submetidos:", formData);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#121214]">
      <main className="relative h-[1238px] w-[1479px] shrink-0 overflow-hidden bg-[#121214]">
        
        {/* Fundo e Grafismos Absolutos */}
        <img
          className="fixed left-0 -top-10 h-[1251px] w-[703px] object-cover"
          style={{ left: '-120px' }}
          alt=""
          src={caveira}
        />
       <img
          className="fixed left-[380.93px] -bottom-[50px] h-[204.22px] w-[213.84px] object-contain z-0"
          alt=""
          aria-hidden="true"
          src={vector3}
        />

        {/* Formulário com Flexbox e Grid */}
        <form
          className="absolute left-[338px] top-[156px] flex h-[939px] w-[804px] flex-col items-center rounded-[9.54px] border-[0.87px] border-solid border-[#4F4F4F] bg-[linear-gradient(0deg,#740303_4%,#980808_17%,#111111_48%,#000000_100%)] pt-[53px]"
          onSubmit={handleSubmit}
        >
          {/* Títulos */}
          <div className="z-10 flex flex-col items-center">
            <h1 className="m-0 font-['Metal_Mania',cursive] text-[46.35px] font-normal leading-none text-white">
              Criar minha conta
            </h1>
            <p className="m-0 mt-[10px] font-['Mate_SC',serif] text-[27.08px] font-normal leading-none text-white">
              Informe seus dados para criar conta
            </p>
          </div>

          {/* Grelha de Inputs Dinâmica com Animação */}
          <div className="z-10 mt-[70px] grid grid-cols-2 gap-x-[9px] gap-y-[26px]">
            {inputFields.map((field) => (
              <AnimatedInput
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={formData[field.id as keyof FormDataState] as string}
                onChange={handleChange}
                animClass={field.animClass}
              />
            ))}
          </div>

          {/* Dropdown Tipo de Conta Nativo Otimizado */}
          <div className="z-10 mt-[26px] flex h-[61.26px] w-[372px] flex-col justify-center rounded-[13.61px_3.19px_15.04px_4.47px] border-[0.64px] border-solid border-[#AAAAAA] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] px-[8.30px] py-[7.66px] relative">
            <label
              htmlFor="accountType"
              className="font-['Inter',sans-serif] text-[8.30px] italic text-[#CCCCCC]"
            >
              Quero me cadastrar como: *
            </label>
            <div className="relative mt-[2px] flex w-full items-center">
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                className="w-full bg-transparent font-['Inter',sans-serif] text-[17.87px] font-semibold italic text-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="Pessoa Física" className="bg-[#2F2F2F] text-white">Pessoa Física</option>
                <option value="Pessoa Jurídica" className="bg-[#2F2F2F] text-white">Pessoa Jurídica</option>
              </select>
              <img src={chevronDown} className="pointer-events-none absolute right-2 z-10 h-[12.76px] w-[12.76px] object-contain" alt="" />
            </div>
          </div>

          {/* Checkboxes e Termos */}
          <div className="z-10 mt-[40px] flex w-[730px] flex-col gap-[33px] pl-[5px]">
            <label className="flex cursor-pointer items-center gap-[9px] font-['Metal_Mania',cursive] text-[18px] leading-relaxed text-white transition-colors duration-200 hover:text-[#FF7777]">
              <Checkbox id="marketing" checked={formData.marketing} onChange={handleCheckboxChange} />
              <span className="flex items-center gap-[6px]">
                Aceito receber comunicação de marketing da
                <img
                  className="h-[40px] w-[75px] object-contain"
                  alt="Hardcore Logo 3"
                  src={hardocre3}
                />
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-[9px] font-['Metal_Mania',cursive] text-[18px] leading-relaxed text-white transition-colors duration-200 hover:text-[#FF7777]">
              <Checkbox id="terms" checked={formData.terms} onChange={handleCheckboxChange} required={true} />
              <span className="flex flex-wrap items-center">
                <span className="mr-[5px]">Estou ciente e CONCORDO com os</span>
                <a href="#" onClick={(e) => e.stopPropagation()} className="underline decoration-white underline-offset-4 transition-colors hover:text-[#FF5555]">
                  termos de aceite
                </a>
                <span className="mx-[5px]">e</span>
                <a href="#" onClick={(e) => e.stopPropagation()} className="underline decoration-white underline-offset-4 transition-colors hover:text-[#FF5555]">
                  políticas de privacidade
                </a>
                <span className="mx-[5px]">da</span>
                <img
                  className="h-[40px] w-[75px] object-contain inline-block align-middle"
                  alt="Hardcore Logo 4"
                  src={hardocre4}
                />
              </span>
            </label>
          </div>

  
          <button
            type="submit"
            className="btn-rectangle-anim relative z-10 mt-[45px] flex h-[102px] w-[492px] cursor-pointer items-center justify-center rounded-[10px] border-none shadow-md transition-transform duration-200 active:scale-95"
          >
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: '35.16px',
                fontWeight: '700',
                wordWrap: 'break-word',
              }}
              className="relative z-20 text-white"
            >
              Criar Conta
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}