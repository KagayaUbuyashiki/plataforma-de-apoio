import { startTransition, type FormEvent } from "react";

/**
 * Envia o formulário para uma ação do useActionState SEM limpar os campos.
 * (Com <form action={...}>, o React 19 reseta o formulário após cada envio,
 * apagando o que foi digitado quando o servidor devolve um erro.)
 */
export function enviarSemLimpar(acao: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => acao(fd));
  };
}
