"use client";

import { botaoPerigo } from "./estilos";

type Props = {
  acao: (formData: FormData) => Promise<void>;
  id: string;
  confirmacao: string;
  rotulo?: string;
};

/** Botão de remover com confirmação, para usar com Server Actions. */
export function BotaoRemover({ acao, id, confirmacao, rotulo = "Remover" }: Props) {
  return (
    <form
      action={acao}
      onSubmit={(e) => {
        if (!confirm(confirmacao)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={botaoPerigo}>
        {rotulo}
      </button>
    </form>
  );
}
