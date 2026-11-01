import { useState, type ChangeEvent, type FormEvent } from "react";
import caveira from "../assets/CatalogoAsset/image 13.png";
import hardocre3 from "../assets/CatalogoAsset/Hardocre 3.png";
import hardocre4 from "../assets/CatalogoAsset/Hardocre 4.png";
import rectangle14 from "../assets/CatalogoAsset/Rectangle 14.svg";
import chevronDown from "../assets/CatalogoAsset/chevron-down.svg";
import vector3 from "../assets/CatalogoAsset/Vector 3.svg";

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
  { id: "name", label: "Nome", type: "text" },
  { id: "surname", label: "Sobrenome", type: "text" },
  { id: "password", label: "Senha", type: "password" },
  { id: "email", label: "E-mail", type: "email" },
  { id: "cpf", label: "CPF", type: "text" },
  { id: "rg", label: "RG", type: "text" },
];

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Checkbox({ id, checked, onChange }: CheckboxProps) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="relative h-[24px] w-[24px] shrink-0 cursor-pointer appearance-none rounded-[6px_3px_6px_3px] border-[1px] border-solid border-[#CCCCCC] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] checked:bg-[#980808] checked:after:absolute checked:after:left-[7px] checked:after:top-[3px] checked:after:h-[12px] checked:after:w-[8px] checked:after:rotate-45 checked:after:border-b-[2.25px] checked:after:border-r-[2.25px] checked:after:border-white checked:after:content-['']"
      aria-label={id}
    />
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
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#121214]">
      <main className="relative h-[1238px] w-[1479px] shrink-0 overflow-hidden bg-[#121214]">
        
        {/* Fundo e Grafismos Absolutos */}
        <img
          className="absolute left-0 top-0 h-[1251px] w-[703px] object-cover"
          style={{ left: '-120px' }}
          alt=""
          src={caveira}
        />
        <img
          className="absolute left-[368.93px] top-[1024.15px] h-[204.22px] w-[213.84px] object-contain"
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

          {/* Grelha de Inputs */}
          <div className="z-10 mt-[70px] grid grid-cols-2 gap-x-[9px] gap-y-[26px]">
            {inputFields.map((field) => (
              <div
                key={field.id}
                className="flex h-[61.09px] w-[371px] items-center rounded-[13.57px_3.18px_15px_4.45px] border-[0.64px] border-solid border-[#AAAAAA] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] px-[8.27px]"
              >
                <label htmlFor={field.id} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id as keyof FormDataState] as string}
                  onChange={handleChange}
                  required
                  placeholder={field.label}
                  className="h-full w-full bg-transparent font-['Inter',sans-serif] text-[23.5px] italic text-white placeholder:text-white focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Dropdown Tipo de Conta */}
          <div className="z-10 mt-[26px] flex h-[61.26px] w-[372px] flex-col justify-center rounded-[13.61px_3.19px_15.04px_4.47px] border-[0.64px] border-solid border-[#AAAAAA] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] px-[8.30px] py-[7.66px]">
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
                className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
              >
                <option value="Pessoa Física">Pessoa Física</option>
                <option value="Pessoa Jurídica">Pessoa Jurídica</option>
              </select>
              <span className="relative z-10 font-['Inter',sans-serif] text-[17.87px] font-semibold italic text-white">
                {formData.accountType}
              </span>
              <img src={chevronDown} className="pointer-events-none absolute right-2 z-10 h-[12.76px] w-[12.76px] object-contain" alt="" />
            </div>
          </div>

          {/* Checkboxes e Termos */}
          <div className="z-10 mt-[40px] flex w-[730px] flex-col gap-[33px] pl-[5px]">
            <div className="flex items-center gap-[9px]">
              <Checkbox id="marketing" checked={formData.marketing} onChange={handleChange} />
              <label htmlFor="marketing" className="flex cursor-pointer items-center gap-[6px] font-['Metal_Mania',cursive] text-[20px] text-white">
                Aceito receber comunicação de marketing da
                <img className="h-[46.25px] w-[82.22px] object-contain" alt="" src={hardocre3} />
              </label>
            </div>

            <div className="flex items-center gap-[9px]">
              <Checkbox id="terms" checked={formData.terms} onChange={handleChange} />
              <label htmlFor="terms" className="flex cursor-pointer flex-wrap items-center font-['Metal_Mania',cursive] text-[20px] text-white">
                <span className="mr-[5px]">Estou ciente e CONCORDO com os</span>
                <a href="#" className="underline decoration-white hover:text-gray-300">
                  termos de aceite
                </a>
                <span className="mx-[5px]">e</span>
                <a href="#" className="underline decoration-white hover:text-gray-300">
                  políticas de privacidade
                </a>
                <span className="mx-[5px]">da</span>
                <img className="h-[46.25px] w-[82.22px] object-contain" alt="" src={hardocre4} />
              </label>
            </div>
          </div>

          {/* Botão Submeter */}
          <button
            type="submit"
            className="relative z-10 mt-[45px] flex h-[83.96px] w-[405px] cursor-pointer items-center justify-center border-none bg-transparent"
          >
            <img
              className="absolute inset-0 h-full w-full object-fill"
              alt=""
              src={rectangle14}
            />
            <span className="relative z-20 font-['Inter',sans-serif] text-[28.94px] font-bold text-white">
              Criar Conta
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}