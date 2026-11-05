import { campo, rotulo } from "@/components/admin/estilos";
import { ODS } from "@/data/ods";
import { EXPERIENCIAS } from "@/lib/checklist";
import type { Ficha } from "./actions";

/** Campos da ficha do aluno (usados no primeiro acesso e na edição pela minha área). */
export function CamposFicha({ ficha: f }: { ficha: Ficha }) {
  return (
      <fieldset className="vidro-forte animate-surgir grid gap-4 rounded-3xl p-7 sm:grid-cols-2">
      <legend className="sr-only">Sua ficha</legend>
      <h3 className="text-lg font-extrabold sm:col-span-2">Sua ficha</h3>
      <Campo nome="como_chamar" rotuloTexto="Como você quer ser chamado(a)? (opcional)" valor={f.como_chamar} max={40} />
      <Campo nome="idade" rotuloTexto="Idade" valor={f.idade} tipo="number" obrigatorio />
      <Campo nome="escola" rotuloTexto="Escola" valor={f.escola} max={120} obrigatorio />
      <Campo nome="serie" rotuloTexto="Ano / série" valor={f.serie} max={40} obrigatorio placeholder="ex.: 9º ano" />
      <Campo nome="cidade" rotuloTexto="Cidade" valor={f.cidade} max={80} obrigatorio />
      <div>
        <label htmlFor="ods_interesse" className={rotulo}>ODS que mais te interessa (opcional)</label>
        <select id="ods_interesse" name="ods_interesse" defaultValue={f.ods_interesse} className={campo}>
          <option value="">Ainda não sei</option>
          {ODS.map((o) => (
            <option key={o.numero} value={o.numero}>
              {o.numero}. {o.nome}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="sm:col-span-2">
        <legend className={rotulo}>Você já programou antes?</legend>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCIAS.map((e) => (
            <Opcao key={e.valor} nome="experiencia" valor={e.valor} rotuloTexto={e.rotulo} marcado={f.experiencia === e.valor} />
          ))}
        </div>
      </fieldset>
      <fieldset className="sm:col-span-2">
        <legend className={rotulo}>Você já criou algum site?</legend>
        <div className="flex flex-wrap gap-2">
          <Opcao nome="ja_criou_site" valor="sim" rotuloTexto="Sim" marcado={f.ja_criou_site === "sim"} />
          <Opcao nome="ja_criou_site" valor="nao" rotuloTexto="Não" marcado={f.ja_criou_site === "nao"} />
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="expectativa" className={rotulo}>O que você espera aprender? (opcional)</label>
        <textarea id="expectativa" name="expectativa" rows={3} maxLength={500} defaultValue={f.expectativa} className={campo} />
      </div>
      <p className="text-xs font-medium text-tinta-suave sm:col-span-2">
        Esses dados ficam visíveis só para você e para os instrutores do programa, para acompanhar o seu aprendizado. Não pedimos
        documentos, telefone nem endereço.
      </p>
    </fieldset>
  );
}

function Campo(p: { nome: string; rotuloTexto: string; valor: string; tipo?: string; max?: number; obrigatorio?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={p.nome} className={rotulo}>{p.rotuloTexto}</label>
      <input
        id={p.nome}
        name={p.nome}
        type={p.tipo ?? "text"}
        defaultValue={p.valor}
        maxLength={p.max}
        min={p.tipo === "number" ? 8 : undefined}
        max={p.tipo === "number" ? 99 : undefined}
        required={p.obrigatorio}
        placeholder={p.placeholder}
        className={campo}
      />
    </div>
  );
}

function Opcao(p: { nome: string; valor: string; rotuloTexto: string; marcado: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={p.nome} value={p.valor} defaultChecked={p.marcado} required className="peer sr-only" />
      <span className="inline-flex rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-bold text-tinta-suave transition peer-checked:border-tinta peer-checked:bg-tinta peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-marca-500/30 hover:bg-white">
        {p.rotuloTexto}
      </span>
    </label>
  );
}
