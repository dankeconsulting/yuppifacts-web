"use client";

import { CalendarDays, CheckCircle2, Clock3, History, Search, ShieldAlert, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./admin-activity-log.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type Activity = { id:string; action:string; title:string; detail:string|null; actorName:string|null; createdAt:string; incident:{code:string;name:string|null}|null; subscriber:{id:string;reference:string|null;fullName:string|null}|null };
type Range = "today" | "week" | "month" | "all";

function included(date:string, range:Range) {
  if (range === "all") return true;
  const elapsed = Date.now() - new Date(date).getTime();
  return elapsed <= (range === "today" ? 86400000 : range === "week" ? 7 * 86400000 : 30 * 86400000);
}
function dayLabel(date:string) { return new Intl.DateTimeFormat("es-MX", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date(date)); }
function timeLabel(date:string) { return new Intl.DateTimeFormat("es-MX", { hour:"2-digit", minute:"2-digit" }).format(new Date(date)); }

export default function AdminActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [range, setRange] = useState<Range>("month");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("yuppifacts.access");
    if (!token || !api) { setLoading(false); return; }
    fetch(`${api}/v1/admin/activity`, { headers:{ "x-application-token":token } })
      .then(async response => {
        const body = await response.json().catch(() => ({})) as { activities?:Activity[]; error?:string };
        if (!response.ok) throw new Error(body.error ?? "No fue posible cargar el historial.");
        setActivities(Array.isArray(body.activities) ? body.activities : []);
      })
      .catch(reason => setError(reason instanceof Error ? reason.message : "No fue posible cargar el historial."))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => activities.filter(item => {
    const searchable = [item.title, item.detail, item.actorName, item.subscriber?.fullName, item.subscriber?.reference, item.incident?.code, item.incident?.name].filter(Boolean).join(" ").toLocaleLowerCase();
    return included(item.createdAt, range) && searchable.includes(query.toLocaleLowerCase().trim());
  }), [activities, range, query]);
  const groups = useMemo(() => visible.reduce<Record<string,Activity[]>>((all, item) => { const key=dayLabel(item.createdAt); (all[key] ??= []).push(item); return all; }, {}), [visible]);

  return <main className="admin-activity-log">
    <header className="admin-activity-heading">
      <div><p className="eyebrow">ADMINISTRADOR MAESTRO · HISTORIAL</p><h1>Historial (Logs)</h1><p>Consulta las acciones administrativas registradas sobre las cuentas y suscripciones.</p></div>
      <span className="admin-activity-total"><History size={18}/>{activities.length} actividades</span>
    </header>
    <section className="admin-activity-tools" aria-label="Controles del historial">
      <div className="admin-activity-ranges">{([ ["today","Hoy"], ["week","7 días"], ["month","30 días"], ["all","Todo"] ] as const).map(([value,label]) => <button type="button" className={range===value?"active":""} onClick={() => setRange(value)} key={value}>{label}</button>)}</div>
      <label className="admin-activity-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar usuario, acción o referencia…" /></label>
    </section>
    {error ? <p className="admin-activity-error">{error}</p> : null}
    {loading ? <section className="admin-activity-empty"><Clock3 size={32}/><b>Cargando historial…</b></section> : Object.keys(groups).length ? <section className="admin-activity-feed">{Object.entries(groups).map(([day, entries]) => <div className="admin-activity-day" key={day}><header><CalendarDays size={15}/><span>{day}</span><small>{entries.length} {entries.length===1?"actividad":"actividades"}</small></header>{entries.map(item => <article key={item.id}><time>{timeLabel(item.createdAt)}</time><i className={item.action.includes("offline") ? "warning" : item.action.includes("rejected") ? "danger" : "success"}>{item.action.includes("offline") || item.action.includes("rejected") ? <ShieldAlert size={16}/> : <CheckCircle2 size={16}/>}</i><div><h2>{item.title}</h2>{item.subscriber?.fullName ? <p className="admin-activity-user"><UserRound size={14}/>{item.subscriber.fullName}{item.subscriber.reference ? ` · ${item.subscriber.reference}` : ""}</p> : null}{item.detail ? <p>{item.detail}</p> : null}{item.incident ? <small>{item.incident.code}{item.incident.name ? ` · ${item.incident.name}` : ""}</small> : null}</div><span className="admin-activity-actor">{item.actorName ?? "Sistema"}</span></article>)}</div>)}</section> : <section className="admin-activity-empty"><History size={34}/><b>No hay actividades registradas</b><span>{query ? "No hay coincidencias con tu búsqueda." : "Las acciones administrativas aparecerán aquí cuando se realicen."}</span></section>}
  </main>;
}
