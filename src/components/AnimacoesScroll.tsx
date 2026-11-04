"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Faz os elementos com o atributo data-revelar aparecerem suavemente quando entram na tela.
 * O atraso de cada um pode ser ajustado com a variável CSS --d (ex.: style={{ "--d": 2 }}).
 */
export function AnimacoesScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const pendentes = () => document.querySelectorAll<HTMLElement>("[data-revelar]:not(.revelado)");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pendentes().forEach((el) => el.classList.add("revelado"));
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("revelado");
            observador.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    const observar = () => pendentes().forEach((el) => observador.observe(el));
    observar();

    // Conteúdo que aparece depois (ex.: etapas do formulário) também é observado.
    const mutacoes = new MutationObserver(observar);
    mutacoes.observe(document.body, { childList: true, subtree: true });

    return () => {
      observador.disconnect();
      mutacoes.disconnect();
    };
  }, [pathname]);

  return null;
}
