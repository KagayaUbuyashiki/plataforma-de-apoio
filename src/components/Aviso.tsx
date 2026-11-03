type Props = { tipo?: "info" | "erro" | "sucesso"; children: React.ReactNode };

const ESTILOS = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  erro: "border-red-200 bg-red-50 text-red-900",
  sucesso: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function Aviso({ tipo = "info", children }: Props) {
  return (
    <div role={tipo === "erro" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      {children}
    </div>
  );
}
