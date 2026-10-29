"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, FileText, QrCode, UsersRound } from "lucide-react";
import Workspace from "./workspace";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type WorkspaceProfile = "individual" | "independent_accountant" | "accounting_firm" | "company" | "corporate";
type Account = { fullName: string; phoneE164: string; role: string; accountStatus: string; subscriptionLifecycle?: string | null; online: boolean; profile: WorkspaceProfile };

// The API has used both the legacy pre-registration names and the concise
// review names. Both mean that payment was validated and the account is now
// waiting for the administrator to take it online.
const preparationStatuses = new Set([
  "payment_verified",
  "pre_registration_approved",
  "profile_in_progress",
  "profile_submitted",
  "approved",
  "active",
]);

function PaymentVerificationGate({ accessToken, userName }: { accessToken?: string; userName?: string }) {
  const signOut = async () => {
    if (accessToken && apiOrigin) {
      await fetch(`${apiOrigin}/v1/access/logout`, { method: "POST", headers: { "x-application-token": accessToken } }).catch(() => undefined);
    }
    sessionStorage.removeItem("yuppifacts.access");
    window.location.assign("/entrar");
  };

  const greeting = userName?.trim() ? `Hola, ${userName.trim()}.` : "Hola.";

  return <main className="payment-verification-gate">
    <section className="payment-verification-card" role="dialog" aria-modal="true" aria-labelledby="payment-verification-title">
      <header className="payment-verification-product">
        <span className="payment-verification-logo" aria-hidden="true">
          <img src="/brand/yuppifacts-iso-dark.svg" alt="" />
        </span>
        <p className="payment-verification-eyebrow">YuppiFacts AI<sup>®</sup></p>
        <div className="payment-verification-tools" aria-hidden="true">
          <span><QrCode /></span><span><FileText /></span><span><UsersRound /></span><span><BarChart3 /></span>
        </div>
      </header>
      <h1 id="payment-verification-title">{greeting}</h1>
      <p>Te damos la más cordial bienvenida a YuppiFacts AI<sup>®</sup> y agradecemos tu preferencia. Nuestro equipo está validando tu pago. En cuanto se haya verificado, procederemos a activar tu cuenta.</p>
      <button type="button" onClick={() => void signOut()}>De acuerdo, cerrar sesión</button>
    </section>
  </main>;
}

export default function AccessPanel() {
  const [account, setAccount] = useState<Account | null>(null);
  const [state, setState] = useState<"loading" | "invalid" | "ready">("loading");
  useEffect(() => {
    const token = sessionStorage.getItem("yuppifacts.access");
    if (!token || !apiOrigin) { setState("invalid"); return; }

    let active = true;
    const loadSession = async () => {
      try {
        const response = await fetch(`${apiOrigin}/v1/access/session`, {
          headers: { "x-application-token": token },
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        const result = await response.json() as { account: Account };
        if (!active) return;
        setAccount(result.account);
        setState("ready");
      } catch {
        if (!active) return;
        sessionStorage.removeItem("yuppifacts.access");
        setState("invalid");
      }
    };

    void loadSession();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadSession();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);
  if (state === "loading") return <main className="access-panel-state">Validando tu acceso…</main>;
  if (state === "invalid") return <main className="access-panel-state"><h1>Tu sesión no está disponible.</h1><p>Inicia sesión nuevamente para continuar.</p><Link className="button" href="/entrar">Ir a iniciar sesión</Link></main>;
  const accessToken = sessionStorage.getItem("yuppifacts.access") ?? undefined;
  const accountStatus = account?.accountStatus.trim().toLowerCase() ?? "";
  const subscriptionLifecycle = account?.subscriptionLifecycle?.trim().toLowerCase() ?? "";
  const isReadyForPreparation = preparationStatuses.has(accountStatus) || preparationStatuses.has(subscriptionLifecycle);
  const paymentIsPending = !account?.online && !isReadyForPreparation;
  if (paymentIsPending) return <PaymentVerificationGate accessToken={accessToken} userName={account?.fullName} />;
  return <Workspace userName={account?.fullName} profile={account?.profile ?? "individual"} showActivationOverlay={!account?.online} accessToken={accessToken} />;
}
