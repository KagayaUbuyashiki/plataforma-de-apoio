import { redirect } from "next/navigation";

/** O login agora é único para alunos e instrutores. */
export default function LoginAntigo() {
  redirect("/entrar");
}
