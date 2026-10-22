"use client";

import { Check, EyeOff, ExternalLink, KeyRound, Lock, Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./mercado-pago-settings.css";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type Environment = "sandbox" | "production";
type Field = "publicKey" | "accessToken";
type SecureAction = "reveal" | "update" | "delete";
type Configuration = { environment: Environment; configured: boolean; connectionStatus: "configured" | "tested" | "failed"; isActive: boolean; publicKeyMasked: string; accessTokenMasked: string };
const copy: Record<Field, { label: string; description: string }> = {
  publicKey: { label: "Public Key", description: "Se usa en el frontend para inicializar Mercado Pago." },
  accessToken: { label: "Access Token", description: "Se usa solo en el backend para procesar pagos; nunca se expone al cliente." },
};

export default function MercadoPagoSettings() {
  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [items, setItems] = useState<Configuration[]>([]);
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState("");
  const [visible, setVisible] = useState<Partial<Record<Field, string>>>({});
  const [action, setAction] = useState<{ type: SecureAction; field: Field } | null>(null);
  const [pin, setPin] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const request = async <T,>(path: string, options: RequestInit = {}) => {
    if (!apiOrigin) throw new Error("Falta la conexión del API.");
    const response = await fetch(`${apiOrigin}${path}`, { ...options, headers: { "content-type": "application/json", "x-application-token": sessionStorage.getItem("yuppifacts.access") ?? "", ...options.headers } });
    const body = await response.json().catch(() => null) as T & { error?: string } | null;
    if (!response.ok) throw new Error(body?.error ?? "No fue posible completar la acción.");
    return body as T;
  };
  const load = async () => { try { const result = await request<{ environments: Configuration[] }>("/v1/admin/payment-providers/mercado-pago"); setItems(result.environments); } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible cargar la configuración."); } };
  useEffect(() => { void load(); }, []);
  useEffect(() => { if (!Object.keys(visible).length) return; const timer = window.setTimeout(() => setVisible({}), 20_000); return () => window.clearTimeout(timer); }, [visible]);
  const current = items.find((item) => item.environment === environment);
  const value = (field: Field) => field === "publicKey" ? current?.publicKeyMasked : current?.accessTokenMasked;
  const close = () => { if (!busy) { setAction(null); setPin(""); setError(""); } };
  const saveSecureAction = async () => {
    if (!action || pin.length !== 4) return;
    setBusy(true); setError("");
    try {
      if (action.type === "reveal") {
        const result = await request<{ value: string }>(`/v1/admin/payment-providers/mercado-pago/credentials/${action.field}/reveal`, { method: "POST", body: JSON.stringify({ environment, pin }) });
        setVisible((previous) => ({ ...previous, [action.field]: result.value }));
      } else if (action.type === "update") {
        await request(`/v1/admin/payment-providers/mercado-pago/credentials/${action.field}`, { method: "PUT", body: JSON.stringify({ environment, pin, value: draft }) });
        setEditing(null); setDraft(""); setNotice(`${copy[action.field].label} guardada de forma cifrada.`); await load();
      } else {
        await request(`/v1/admin/payment-providers/mercado-pago/credentials/${action.field}`, { method: "DELETE", body: JSON.stringify({ environment, pin }) });
        setVisible((previous) => { const next = { ...previous }; delete next[action.field]; return next; });
        setNotice(`${copy[action.field].label} eliminada.`); await load();
      }
      close();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible completar la acción."); } finally { setBusy(false); }
  };
  const runWithoutPin = async (kind: "test" | "activate") => {
    setBusy(true); setError("");
    try {
      if (kind === "test") { const result = await request<{ message: string }>("/v1/admin/payment-providers/mercado-pago/test", { method: "POST", body: JSON.stringify({ environment }) }); setNotice(result.message); }
      else { await request("/v1/admin/payment-providers/mercado-pago/activate", { method: "POST", body: JSON.stringify({ environment }) }); setNotice("Cuenta activa para cobros."); }
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible completar la acción."); } finally { setBusy(false); }
  };
  const modalTitle = action && (action.type === "reveal" ? `Desbloquear ${copy[action.field].label}` : action.type === "delete" ? `Confirmar eliminación de ${copy[action.field].label}` : `Confirmar actualización de ${copy[action.field].label}`);
  const modalText = action?.type === "reveal" ? "Ingresa tu PIN del Administrador Maestro para mostrar esta credencial. El valor se ocultará automáticamente después de 20 segundos." : action?.type === "delete" ? "Ingresa tu PIN del Administrador Maestro para eliminar esta credencial." : "Ingresa tu PIN del Administrador Maestro para guardar esta credencial.";
  return <main className="mp-reference">
    <header className="mp-reference-header"><div className="mp-title"><span><KeyRound size={27} /></span><div><h1>Mercado Pago — Configuración de API</h1><p>Gestión de credenciales y estado de conexión.</p></div></div><b className={`mp-status ${current?.isActive ? "ok" : "pending"}`}>{current?.isActive ? "● Cuenta activa" : "● Credenciales pendientes"}</b></header>
    <section className="mp-legend"><b>INDICADOR DE ESTATUS:</b><span className="green">Verde</span><span>— Probado o activo para cobros</span><span className="amber">Amarillo</span><span>— Sin credenciales o pendiente de prueba</span><span className="red">Rojo</span><span>— Error de conexión</span></section>
    {notice && <p className="mp-feedback success"><Check size={16} />{notice}</p>}{error && !action && <p className="mp-feedback error"><X size={16} />{error}</p>}
    <section className="mp-environment"><div><ShieldCheck /><div><b>Modo de operación</b><p>{environment === "sandbox" ? "Sandbox — Pruebas sin cargos reales" : "Producción — Cobros reales"}</p></div></div><span className={`mp-tested ${current?.connectionStatus === "tested" ? "ok" : ""}`}>{current?.connectionStatus === "tested" ? "● Probado" : "● Pendiente de prueba"}</span><div className="mp-tabs"><button className={environment === "sandbox" ? "selected" : ""} onClick={() => { setEnvironment("sandbox"); setEditing(null); setVisible({}); }}>Sandbox</button><button className={environment === "production" ? "selected" : ""} onClick={() => { setEnvironment("production"); setEditing(null); setVisible({}); }}>Producción</button></div></section>
    <section className="mp-table"><div className="mp-table-head"><span>CREDENCIAL</span><span>VALOR</span><span>DESCRIPCIÓN</span><span>ACCIONES</span></div>{(["publicKey", "accessToken"] as Field[]).map((field) => <CredentialRow key={field} field={field} value={value(field)} visibleValue={visible[field]} draft={draft} editing={editing === field} busy={busy} onDraft={setDraft} onEdit={() => { setEditing(field); setDraft(""); setVisible({}); }} onCancel={() => { setEditing(null); setDraft(""); }} onSave={() => draft.trim().length >= 10 && setAction({ type: "update", field })} onReveal={() => setAction({ type: "reveal", field })} onHide={() => setVisible((previous) => { const next = { ...previous }; delete next[field]; return next; })} onDelete={() => setAction({ type: "delete", field })} />)}</section>
    <div className="mp-actions-reference"><button className="mp-secondary" disabled={busy || !current?.configured} onClick={() => void runWithoutPin("test")}>Probar conexión</button><button className="mp-primary" disabled={busy || current?.connectionStatus !== "tested" || current?.isActive} onClick={() => void runWithoutPin("activate")}>{current?.isActive ? "Cuenta activa" : "Activar esta cuenta"}</button><a href="https://www.mercadopago.com/developers/panel/app" target="_blank" rel="noreferrer">Obtener credenciales en Mercado Pago <ExternalLink size={14} /></a></div>
    <p className="mp-controlled"><b>Cambio controlado.</b> Cada credencial se consulta, modifica o elimina de forma individual con confirmación del PIN del Administrador Maestro.</p>
    {action && <div className="mp-credential-backdrop"><section className="mp-credential-modal" role="dialog" aria-modal="true" aria-labelledby="credential-modal-title"><button className="mp-modal-close" onClick={close} aria-label="Cerrar"><X size={21} /></button><span className="mp-modal-icon"><Lock size={23} /></span><p>CREDENCIALES PROTEGIDAS</p><h2 id="credential-modal-title">{modalTitle}</h2><span>{modalText}</span><label>PIN del Administrador Maestro<input autoFocus type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} placeholder="• • • •" /></label>{error && <em>{error}</em>}<footer><button type="button" onClick={close}>Cancelar</button><button type="button" className={action.type === "delete" ? "danger" : "confirm"} disabled={busy || pin.length !== 4} onClick={() => void saveSecureAction()}>{busy ? "Validando…" : action.type === "reveal" ? "Desbloquear" : action.type === "delete" ? "Eliminar" : "Guardar"}</button></footer></section></div>}
  </main>;
}

function CredentialRow({ field, value, visibleValue, draft, editing, busy, onDraft, onEdit, onCancel, onSave, onReveal, onHide, onDelete }: { field: Field; value?: string; visibleValue?: string; draft: string; editing: boolean; busy: boolean; onDraft: (value: string) => void; onEdit: () => void; onCancel: () => void; onSave: () => void; onReveal: () => void; onHide: () => void; onDelete: () => void }) {
  const item = copy[field]; const configured = Boolean(value);
  return <div className="mp-table-row"><b><KeyRound size={19} />{item.label}</b><div className="mp-credential-value">{editing ? <><input autoFocus autoComplete="off" type={field === "accessToken" ? "password" : "text"} value={draft} onChange={(event) => onDraft(event.target.value)} placeholder={`Captura ${item.label}`} /><button className="credential-check" type="button" aria-label="Guardar" disabled={busy || draft.trim().length < 10} onClick={onSave}><Check size={18} /></button><button className="credential-cancel" type="button" aria-label="Cancelar" disabled={busy} onClick={onCancel}><X size={18} /></button></> : <><span className={`mp-value ${visibleValue ? "revealed" : ""}`}><Lock size={16} />{visibleValue ?? value ?? "Sin configurar"}</span>{configured && <button className="credential-lock" type="button" onClick={visibleValue ? onHide : onReveal}>{visibleValue ? <EyeOff size={17} /> : <Lock size={17} />}</button>}</>}</div><p>{item.description}</p><span className="mp-row-actions"><button className="mp-edit" type="button" disabled={busy || editing} onClick={onEdit}><Pencil size={15} />Editar</button>{configured && <button className="credential-delete" type="button" aria-label={`Eliminar ${item.label}`} disabled={busy} onClick={onDelete}><Trash2 size={17} /></button>}</span></div>;
}
