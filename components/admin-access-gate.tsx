"use client";

import { useEffect, useState, type ReactNode } from "react";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export default function AdminAccessGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    const token = sessionStorage.getItem("yuppifacts.access");
    if (!token || !apiOrigin) { setState("denied"); return; }
    fetch(`${apiOrigin}/v1/access/session`, { headers: { "x-application-token": token } })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ account?: { role?: string } }>;
      })
      .then(({ account }) => setState(account?.role === "master_admin" ? "allowed" : "denied"))
      .catch(() => setState("denied"));
  }, []);

  useEffect(() => {
    if (state === "denied") window.location.replace("/admin/entrar");
  }, [state]);

  if (state !== "allowed") return <main className="access-panel-state">Validando acceso administrativo…</main>;
  return <>{children}</>;
}
