"use client";

import Link from "next/link";
import { BadgeCheck, CircleX, Clock3, Copy, Eye, FileCheck2, ShieldAlert, Trash2, UserRound, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./admin-dashboard.css";
import "./admin-user-section.css";
import "./admin-delete-modal-adjustments.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const subscriberSummary = [
  { label: "Total", icon: Users, tone: "violet" },
  { label: "Por revisar", icon: Clock3, tone: "amber" },
  { label: "Activos", icon: BadgeCheck, tone: "green" },
  { label: "Rechazados", icon: CircleX, tone: "rose" },
];

type RecentSubscriber = {
  id: string;
  recordNumber: number;
  isTemporary: boolean;
  fullName: string;
  email: string;
  role: string;
  profile: string;
  phone: string;
  state: string | null;
  city: string | null;
  registeredAt: string;
};

type DeleteStep = "confirm" | "pin" | null;

const date = (value: string) => new Intl.DateTimeFormat("es-MX", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
}).format(new Date(value));

export default function AdminDashboard() {
  const [recent, setRecent] = useState<RecentSubscriber[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(null);
  const [confirmation, setConfirmation] = useState("");
  const [pin, setPin] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const token = sessionStorage.getItem("yuppifacts.access") ?? "";
      const response = await fetch(`${api}/v1/admin/dashboard/recent-subscribers`, {
        cache: "no-store", headers: { "x-application-token": token },
      });
      const raw = await response.text();
      let body: { subscribers?: RecentSubscriber[]; error?: string } = {};
      try { body = raw ? JSON.parse(raw) : {}; } catch { /* Use the API status below. */ }
      if (!response.ok) throw new Error(body.error ?? "No fue posible cargar los registros recientes.");
      const subscribers = Array.isArray(body.subscribers) ? body.subscribers : [];
      setRecent(subscribers);
      setSelected(current => current.filter(id => subscribers.some(item => item.id === id)));
      setError("");
    } catch (reason) {
      setRecent([]);
      setError(reason instanceof Error ? reason.message : "No fue posible cargar los registros recientes.");
    }
  };

  useEffect(() => { void load(); }, []);

  const targets = recent.filter(item => selected.includes(item.id));
  const expectedIds = targets.map(item => item.recordNumber).sort((a, b) => a - b);
  const parsedIds = confirmation.split(",").map(value => Number(value.trim())).filter(value => Number.isInteger(value) && value > 0).sort((a, b) => a - b);
  const idsMatch = parsedIds.length === expectedIds.length && parsedIds.every((value, index) => value === expectedIds[index]);
  const confirmationLabel = targets.length === 1 ? "Escribe el ID de este usuario" : "Escribe los IDs de estos usuarios";
  const closeDelete = () => {
    if (deleting) return;
    setDeleteStep(null);
    setConfirmation("");
    setPin("");
    setError("");
  };
  const startDelete = (ids: string[]) => {
    setSelected(ids);
    setConfirmation("");
    setPin("");
    setError("");
    setDeleteStep("confirm");
  };
  const copyIds = async () => {
    try { await navigator.clipboard.writeText(expectedIds.join(", ")); }
    catch { setError("No fue posible copiar los IDs. Puedes seleccionarlos y copiarlos manualmente."); }
  };
  const submitDelete = async () => {
    if (!idsMatch || pin.length !== 4) return;
    setDeleting(true);
    setError("");
    try {
      const token = sessionStorage.getItem("yuppifacts.access") ?? "";
      const response = await fetch(`${api}/v1/admin/subscribers/delete`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-application-token": token },
        body: JSON.stringify({ ids: targets.map(item => item.id), confirmationIds: parsedIds, pin }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "No fue posible eliminar los registros.");
      setDeleteStep(null);
      setConfirmation("");
      setPin("");
      setSelected([]);
      await load();
      window.dispatchEvent(new Event("admin-subscriber-counts-changed"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No fue posible eliminar los registros.");
    } finally {
      setDeleting(false);
    }
  };

  return <main className="admin-dashboard"><section className="admin-dashboard-content">
    <header className="admin-dashboard-header"><div><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h1>Dashboard</h1><p>Administra usuarios, promociones y cobros de YuppiFacts desde un solo lugar.</p></div><Link href="/admin/configuracion" className="admin-dashboard-button">Configuración</Link></header>
    <section className="admin-dashboard-summary"><div><span>Estado de promociones</span><b>Configuración protegida</b><p>Solo los planes activos se muestran en el registro promocional.</p></div><Link href="/admin/configuracion/promocion">Ver Planes Promo →</Link></section>
    <section className="admin-subscriber-summary" aria-label="Resumen de suscriptores">{subscriberSummary.map(({ label, icon: Icon, tone }) => <article key={label}><span className={`admin-summary-icon ${tone}`}><Icon size={21} /></span><small>GLOBAL</small><b>0</b><p>{label}</p></article>)}</section>
    <section className="admin-recent-subscribers" aria-labelledby="recent-title">
      <header><div><p className="eyebrow">REGISTROS RECIENTES</p><h2 id="recent-title">Usuarios nuevos de la última hora</h2><p>Se conserva este bloque hasta que entre un registro nuevo.</p></div><Link href="/admin/usuarios-nuevos">Ver todos →</Link></header>
      {error ? <p className="admin-recent-error">{error}</p> : recent.length ? <section className="admin-user-table admin-dashboard-user-table">
        <div className="admin-user-row admin-user-head"><input type="checkbox" aria-label="Seleccionar todos" checked={recent.length > 0 && recent.every(item => selected.includes(item.id))} onChange={event => setSelected(event.target.checked ? recent.map(item => item.id) : [])} /><span>User ID</span><span>Suscriptor</span><span>Rol</span><span>Perfil / modo</span><span>WhatsApp</span><span>Ubicación</span><span>Fecha de registro</span><span>Acciones</span></div>
        {recent.map(item => <div className="admin-user-row" key={item.id}>
          <input type="checkbox" aria-label={`Seleccionar registro ${item.recordNumber}`} checked={selected.includes(item.id)} onChange={event => setSelected(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id))} />
          <span className="record-id">{item.recordNumber}</span>
          <span className="subscriber-name"><i><UserRound size={17} /></i><b>{item.fullName}<small>{item.email}</small></b></span>
          <span>{item.role}</span><span>{item.profile}</span><span>{item.phone}</span><span>{item.city ? `${item.city}, ${item.state}` : "México"}</span><span>{date(item.registeredAt)}</span>
          <span className="row-actions"><Link href={`/admin/usuarios/${item.id}`} aria-label={`Ver ficha de ${item.fullName}`}><Eye size={17} /></Link><button type="button" onClick={() => startDelete([item.id])} aria-label={`Eliminar ${item.fullName}`}><Trash2 size={17} /></button></span>
        </div>)}
        <footer><span>{recent.length} registros en total</span><span>Registros por página <b>10</b> · Página 1 de 1</span></footer>
      </section> : <div className="admin-recent-empty"><Users size={21} /><span>Aún no hay registros recientes.</span></div>}
    </section>
    <section className="admin-next-step"><FileCheck2 size={22} /><div><b>Flujo de activación protegido</b><p>La suscripción solo se activa después de validar el comprobante de pago.</p></div><Link href="/admin/promociones">Ir a comprobantes →</Link></section>
  </section>{deleteStep && <div className="admin-delete-backdrop" role="presentation"><section className="admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><button className="admin-modal-close" onClick={closeDelete} aria-label="Cerrar"><X size={24} /></button>{deleteStep === "confirm" ? <><span className="admin-delete-icon"><ShieldAlert size={23} /></span><h2 id="delete-title">¿Quieres eliminar {targets.length === 1 ? targets[0]?.fullName : `estos ${targets.length} registros`}?</h2><p>Se borrarán de forma permanente la cuenta, contratos, vouchers y archivos relacionados. Esta acción no se puede recuperar.</p><div className="admin-delete-targets"><strong>Registro{targets.length === 1 ? "" : "s"} a eliminar</strong>{targets.map(item => <div key={item.id}><b>{item.fullName || (item.isTemporary ? "Registro temporal sin PIN" : "Usuario")}</b><span>ID {item.recordNumber}</span></div>)}</div><label className="admin-delete-input"><span>{confirmationLabel}</span><div><input autoFocus value={confirmation} onChange={event => setConfirmation(event.target.value.replace(/[^0-9,\s]/g, ""))} placeholder={targets.length === 1 ? "Escribe el ID aquí" : "Escribe los IDs separados por coma"} inputMode="numeric" /><button type="button" onClick={() => void copyIds()} title="Copiar IDs"><Copy size={17} /></button></div>{confirmation && !idsMatch && <em>Los IDs deben coincidir exactamente con los registros seleccionados.</em>}</label><footer><button type="button" onClick={closeDelete}>Cancelar</button><button type="button" className="danger" disabled={!idsMatch} onClick={() => setDeleteStep("pin")}>Continuar</button></footer></> : <><span className="admin-delete-icon"><ShieldAlert size={23} /></span><h2 id="delete-title">PIN de seguridad</h2><p>Ingresa tu PIN administrativo de cuatro dígitos para eliminar {targets.length === 1 ? `el registro ${targets[0]?.recordNumber}` : `los ${targets.length} registros seleccionados`}.</p><label className="admin-delete-input"><span>PIN de seguridad</span><div><input autoFocus type="password" maxLength={4} value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="••••" /></div></label>{error && <p className="admin-modal-error">{error}</p>}<footer><button type="button" onClick={() => setDeleteStep("confirm")}>Regresar</button><button type="button" className="danger" disabled={pin.length !== 4 || deleting} onClick={() => void submitDelete()}>{deleting ? "Eliminando…" : "Eliminar"}</button></footer></>}</section></div>}</main>;
}
