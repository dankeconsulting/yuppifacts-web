"use client";

import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Edit3, FileUp, LockKeyhole, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import "./preregistration.css";
import "./registration-payment.css";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const plans = [
  { id: "individual", name: "Persona Física", description: "Para personas físicas con actividad empresarial, RESICO y pequeños contribuyentes." },
  { id: "accounting_firm", name: "Despachos Contables", description: "Para contadores independientes y despachos con cartera de contribuyentes." },
  { id: "company", name: "Persona Moral", description: "Para empresas y corporativos con áreas contables propias." },
] as const;
const billingOptions = [
  { id: "monthly", label: "Mensual" },
  { id: "quarterly", label: "Trimestral" },
  { id: "annual", label: "Anual" },
] as const;
type PlanId = typeof plans[number]["id"];
type BillingPeriod = typeof billingOptions[number]["id"];
type Session = { id: string; folio: string; planId: PlanId; billingPeriod: BillingPeriod; quotedAmountCents: number; currency: string; lifecycleStatus: string; plan?: { name: string } };
type StoredAccess = { sessionId: string; accessToken: string };

async function request<T>(path: string, accessToken: string, options: RequestInit = {}) {
  if (!apiOrigin) throw new Error("La contratación todavía no está disponible.");
  const response = await fetch(`${apiOrigin}${path}`, { ...options, headers: { "content-type": "application/json", "x-contracting-token": accessToken, ...options.headers } });
  const body = await response.json().catch(() => null) as T & { error?: string } | null;
  if (!response.ok) throw new Error(body?.error ?? "No fue posible actualizar la contratación.");
  return body as T;
}

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(cents / 100);
}

export default function RegistrationPayment({ folio }: { folio: string }) {
  const [access, setAccess] = useState<StoredAccess | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [draftPlanId, setDraftPlanId] = useState<PlanId>("individual");
  const [draftBillingPeriod, setDraftBillingPeriod] = useState<BillingPeriod>("monthly");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(`yuppifacts.contracting.${folio}`);
    if (!stored) { setError("Este resumen sólo está disponible desde la contratación iniciada en este navegador."); setBusy(false); return; }
    try {
      const parsed = JSON.parse(stored) as StoredAccess;
      setAccess(parsed);
      request<{ session: Session }>(`/v1/contracting/sessions/${parsed.sessionId}`, parsed.accessToken)
        .then((result) => { setSession(result.session); setDraftPlanId(result.session.planId); setDraftBillingPeriod(result.session.billingPeriod); })
        .catch((cause) => setError(cause instanceof Error ? cause.message : "No fue posible cargar la contratación."))
        .finally(() => setBusy(false));
    } catch { setError("No fue posible recuperar esta contratación."); setBusy(false); }
  }, [folio]);

  const startEdit = () => { if (!session) return; setDraftPlanId(session.planId); setDraftBillingPeriod(session.billingPeriod); setError(""); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setError(""); };
  const saveSelection = async () => {
    if (!access || !session) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request<{ session: Session }>(`/v1/contracting/sessions/${session.id}/selection`, access.accessToken, { method: "PATCH", body: JSON.stringify({ planId: draftPlanId, billingPeriod: draftBillingPeriod }) });
      setSession(result.session); setEditing(false); setNotice("Plan y forma de pago actualizados. El total se recalculó antes de iniciar el pago.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible actualizar el plan."); } finally { setBusy(false); }
  };
  const startCheckout = async () => {
    if (!access || !session) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request<{ checkoutUrl: string }>(`/v1/contracting/sessions/${session.id}/payments/mercado-pago`, access.accessToken, { method: "POST" });
      window.location.assign(result.checkoutUrl);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible iniciar Mercado Pago."); } finally { setBusy(false); }
  };

  if (busy && !session && !error) return <main className="stage-page"><section className="empty-stage"><p className="eyebrow">CONTRATACIÓN YUPPIFACTS</p><h1>Preparando tu resumen…</h1></section></main>;
  if (!session) return <main className="stage-page"><section className="empty-stage"><h1>No pudimos abrir este resumen.</h1><p>{error || "Vuelve a iniciar tu contratación."}</p><Link className="button" href="/registro">Ir a contratación</Link></section></main>;

  const selectedPlan = plans.find((plan) => plan.id === session.planId)!;
  const selectedBilling = billingOptions.find((period) => period.id === session.billingPeriod)!;
  return <main className="stage-page"><section className="stage-card payment-summary-card"><p className="eyebrow">PASO 4 DE 5 · RESUMEN DE PAGO</p><h1>Revisa tu contratación.</h1><p className="stage-lead">Puedes cambiar el plan o la modalidad antes de iniciar un pago. Una vez abierto Mercado Pago, deberás crear un intento nuevo para modificar el importe.</p>
    <section className="payment-summary" aria-label="Resumen de contratación"><div><span>Plan</span><b>{selectedPlan.name}</b><small>{selectedPlan.description}</small></div><div><span>Forma de pago</span><b>{selectedBilling.label}</b><small>Cobro {selectedBilling.label.toLowerCase()}</small></div><div className="payment-summary__total"><span>Total a pagar</span><strong>{formatAmount(session.quotedAmountCents, session.currency)}</strong><small>{session.currency} · {selectedBilling.label.toLowerCase()}</small></div><button type="button" className="payment-summary__edit" onClick={startEdit} disabled={busy}><Edit3 size={16} /> Cambiar plan o modalidad</button></section>
    {editing && <section className="payment-selection-editor"><div className="payment-selection-editor__head"><div><p className="eyebrow">EDITAR CONTRATACIÓN</p><h2>Elige una nueva opción.</h2></div><button type="button" aria-label="Cerrar edición" onClick={cancelEdit}>×</button></div><div className="payment-billing-tabs" role="tablist" aria-label="Modalidad de pago">{billingOptions.map((period) => <button type="button" role="tab" aria-selected={draftBillingPeriod === period.id} className={draftBillingPeriod === period.id ? "active" : ""} onClick={() => setDraftBillingPeriod(period.id)} key={period.id}>{period.label}</button>)}</div><div className="payment-plan-list">{plans.map((plan) => <button type="button" key={plan.id} className={draftPlanId === plan.id ? "selected" : ""} onClick={() => setDraftPlanId(plan.id)}><span><b>{plan.name}</b><small>{plan.description}</small></span>{draftPlanId === plan.id && <Check size={18} />}</button>)}</div><div className="payment-editor-actions"><button type="button" onClick={cancelEdit}><ArrowLeft size={17} /> Cancelar</button><button type="button" className="button" disabled={busy} onClick={saveSelection}>{busy ? "Actualizando…" : "Actualizar resumen"}</button></div></section>}
    {notice && <p className="inline-notice"><Check size={16} />{notice}</p>}{error && <p className="inline-notice payment-error"><ShieldAlert size={16} />{error}</p>}
    <section className="payment-option"><CreditCard /><div><b>Mercado Pago</b><p>El checkout se crea con las credenciales activas que guardaste en el Administrador Maestro.</p></div><button type="button" className="button" disabled={busy || editing} onClick={startCheckout}>{busy ? "Preparando…" : "Ir a Mercado Pago"}</button></section><div className="divider">o</div><section className="voucher-upload voucher-upload--disabled"><FileUp /><b>Adjuntar voucher</b><span>Esta opción se habilita tras crear un intento de pago; la carga se guarda en almacenamiento privado.</span></section><p className="security-note"><LockKeyhole size={15} />Cambiar el plan guarda una nueva cotización en el servidor y queda registrado antes de crear cualquier pago.</p></section></main>;
}
