"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Workspace from "./workspace";

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
  if (state === "loading") return <main className="access-panel-state">Validando tu acceso…</main>;
  if (state === "invalid") return <main className="access-panel-state"><h1>Tu sesión no está disponible.</h1><p>Inicia sesión nuevamente para continuar.</p><Link className="button" href="/entrar">Ir a iniciar sesión</Link></main>;
  return <Workspace userName={account?.fullName} profile="individual" />;
}
