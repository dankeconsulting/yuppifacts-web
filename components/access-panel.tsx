"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3, LogOut } from "lucide-react";
import Workspace from "./workspace";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type WorkspaceProfile = "individual" | "independent_accountant" | "accounting_firm" | "company" | "corporate";
type Account = { fullName: string; phoneE164: string; role: string; accountStatus: string; online: boolean; profile: WorkspaceProfile };

// The API has used both the legacy pre-registration names and the concise
// review names. Both mean that payment was validated and the account is now
// waiting for the administrator to take it online.
const preparationStatuses = new Set([
  "pre_registration_approved",
  "profile_in_progress",
  "profile_submitted",
  "pending_review",
  "in_review",
]);

function PaymentVerificationGate({ accessToken }: { accessToken?: string }) {
  const signOut = async () => {
    if (accessToken && apiOrigin) {
      await fetch(`${apiOrigin}/v1/access/logout`, { method: "POST", headers: { "x-application-token": accessToken } }).catch(() => undefined);
    }
    sessionStorage.removeItem("yuppifacts.access");
    window.location.assign("/entrar");
  };

  return <main className="payment-verification-gate">
    <section className="payment-verification-card" role="dialog" aria-modal="true" aria-labelledby="payment-verification-title">
      <span className="payment-verification-icon"><Clock3 /></span>
      <p className="payment-verification-eyebrow">YUPPIFACTS</p>
      <h1 id="payment-verification-title">Estamos verificando tu pago</h1>
      <p>En cuanto validemos tu comprobante, activaremos tu cuenta para continuar con la configuración de tu plataforma.</p>
      <button type="button" onClick={() => void signOut()}><LogOut />De acuerdo, cerrar sesión</button>
    </section>
  </main>;
}

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
  const accessToken = sessionStorage.getItem("yuppifacts.access") ?? undefined;
  const accountStatus = account?.accountStatus.trim().toLowerCase() ?? "";
  const paymentIsPending = !account?.online && !preparationStatuses.has(accountStatus);
  if (paymentIsPending) return <PaymentVerificationGate accessToken={accessToken} />;
  return <Workspace userName={account?.fullName} profile={account?.profile ?? "individual"} showActivationOverlay={!account?.online} accessToken={accessToken} />;
}
