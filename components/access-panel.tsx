"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type Account = { fullName: string; phoneE164: string; role: string };

export default function AccessPanel() {
  const [account, setAccount] = useState<Account | null>(null);
  const [state, setState] = useState<"loading" | "invalid" | "ready">("loading");
  useEffect(() => {
    const token = sessionStorage.getItem("yuppifacts.access");
    if (!token || !apiOrigin) { setState("invalid"); return; }
    fetch(`${apiOrigin}/v1/access/session`, { headers: { "x-application-token": token } })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ account: Account }>;
      })
      .then((result) => { setAccount(result.account); setState("ready"); })
      .catch(() => { sessionStorage.removeItem("yuppifacts.access"); setState("invalid"); });
  }, []);
  const signOut = () => { sessionStorage.removeItem("yuppifacts.access"); window.location.assign("/entrar"); };
  if (state === "loading") return <main className="access-panel-state">Validando tu acceso…</main>;
  if (state === "invalid") return <main className="access-panel-state"><h1>Tu sesión no está disponible.</h1><p>Inicia sesión nuevamente para continuar.</p><Link className="button" href="/entrar">Ir a iniciar sesión</Link></main>;
  return <main className="access-panel-state"><section><span><CheckCircle2 size={26} /></span><p className="eyebrow">ACCESO CONFIRMADO</p><h1>Hola, {account?.fullName}</h1><p>Tu identidad se validó con tu número de WhatsApp, código interno y PIN. El espacio de trabajo de tu cuenta se habilita según el plan y permisos asignados por el administrador.</p><dl><div><dt>WhatsApp</dt><dd>{account?.phoneE164}</dd></div><div><dt>Tipo de acceso</dt><dd>{account?.role === "master_admin" ? "Administrador maestro" : "Suscriptor"}</dd></div></dl><button type="button" onClick={signOut}><LogOut size={17} />Cerrar sesión</button></section><aside><ShieldCheck size={27} /><b>Sesión protegida</b><p>La autorización se valida con una sesión emitida por el servidor.</p></aside></main>;
}
