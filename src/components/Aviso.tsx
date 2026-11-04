type Props = { tipo?: "info" | "erro" | "sucesso"; children: React.ReactNode };

const ESTILOS = {
  info: "!border-l-sky-500 text-sky-950",
  erro: "!border-l-red-500 text-red-950",
  sucesso: "!border-l-emerald-500 text-emerald-950",
};

export function Aviso({ tipo = "info", children }: Props) {
  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`vidro-forte animate-surgir rounded-2xl !border-l-4 px-4 py-3 text-sm font-medium ${ESTILOS[tipo]}`}
    >
      {children}
    </div>
  );
}
