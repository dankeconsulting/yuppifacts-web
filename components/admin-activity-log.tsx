"use client";

import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, History, Search, ShieldAlert, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./admin-activity-log.css";
import "./admin-activity-calendar.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
type Activity = { id:string; action:string; title:string; detail:string|null; actorName:string|null; createdAt:string; incident:{code:string;name:string|null}|null; subscriber:{id:string;reference:string|null;fullName:string|null}|null };
type Range = "day" | "week" | "month" | "year" | "all";

function included(date:string, range:Range) {
  if (range === "all") return true;
  const elapsed = Date.now() - new Date(date).getTime();
  return elapsed <= (range === "day" ? 86400000 : range === "week" ? 7 * 86400000 : range === "month" ? 30 * 86400000 : 365 * 86400000);
}
function dayLabel(date:string) { return new Intl.DateTimeFormat("es-MX", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date(date)); }
function timeLabel(date:string) { return new Intl.DateTimeFormat("es-MX", { hour:"2-digit", minute:"2-digit" }).format(new Date(date)); }
function dateKey(date:Date|string) { const value=new Date(date); return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,"0")}-${String(value.getDate()).padStart(2,"0")}`; }
function dayItems(center:Date) { return Array.from({length:13},(_,index)=>{const date=new Date(center);date.setDate(center.getDate()+index-6);return date;}); }

export default function AdminActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [range, setRange] = useState<Range>("all");
  const [query, setQuery] = useState("");
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
    return included(item.createdAt, range) && (!selectedDate || dateKey(item.createdAt)===selectedDate) && searchable.includes(query.toLocaleLowerCase().trim());
  }), [activities, range, query, selectedDate]);
  const groups = useMemo(() => visible.reduce<Record<string,Activity[]>>((all, item) => { const key=dayLabel(item.createdAt); (all[key] ??= []).push(item); return all; }, {}), [visible]);

  return <main className="admin-activity-log">
    <header className="admin-activity-heading">
      <div><p className="eyebrow">ADMINISTRADOR MAESTRO · HISTORIAL</p><h1>Historial (Logs)</h1><p>Consulta las acciones administrativas registradas sobre las cuentas y suscripciones.</p></div>
      <span className="admin-activity-total"><History size={18}/>{activities.length} actividades</span>
    </header>
    <section className="admin-activity-tools" aria-label="Controles del historial">
      <div className="admin-activity-ranges">{([ ["year","12 meses"], ["month","30 días"], ["week","7 días"], ["day","24 horas"], ["day","Hoy"], ["all","Todo"] ] as const).map(([value,label]) => <button type="button" className={range===value && (value!=="day" || label!=="24 horas")?"active":""} onClick={() => { setRange(value); setSelectedDate(value==="all"?null:label==="Hoy"?dateKey(new Date()):selectedDate); }} key={label}>{label}</button>)}</div>
      <label className="admin-activity-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar usuario, acción o referencia…" /></label>
    </section>
    {range !== "all" ? <section className="admin-activity-calendar" aria-label="Seleccionar día"><button type="button" aria-label="Días anteriores" onClick={() => setCursorDate(value => new Date(value.getFullYear(),value.getMonth(),value.getDate()-7))}><ChevronLeft size={16}/></button><div>{dayItems(cursorDate).map(day => <button type="button" key={dateKey(day)} className={selectedDate===dateKey(day)?"selected":""} onClick={() => {setSelectedDate(dateKey(day));setRange("day");}}><small>{new Intl.DateTimeFormat("es-MX",{weekday:"short"}).format(day).replace(".","")}</small><b>{day.getDate()}</b><em>{new Intl.DateTimeFormat("es-MX",{month:"short"}).format(day).replace(".","")}</em></button>)}</div><button type="button" aria-label="Días siguientes" onClick={() => setCursorDate(value => new Date(value.getFullYear(),value.getMonth(),value.getDate()+7))}><ChevronRight size={16}/></button></section> : null}
    {error ? <p className="admin-activity-error">{error}</p> : null}
    {loading ? <section className="admin-activity-empty"><Clock3 size={32}/><b>Cargando historial…</b></section> : Object.keys(groups).length ? <section className="admin-activity-feed">{Object.entries(groups).map(([day, entries]) => <div className="admin-activity-day" key={day}><header><CalendarDays size={15}/><span>{day}</span><small>{entries.length} {entries.length===1?"actividad":"actividades"}</small></header>{entries.map(item => <article key={item.id}><time>{timeLabel(item.createdAt)}</time><i className={item.action.includes("offline") ? "warning" : item.action.includes("rejected") ? "danger" : "success"}>{item.action.includes("offline") || item.action.includes("rejected") ? <ShieldAlert size={16}/> : <CheckCircle2 size={16}/>}</i><div><h2>{item.title}</h2>{item.subscriber?.fullName ? <p className="admin-activity-user"><UserRound size={14}/>{item.subscriber.fullName}{item.subscriber.reference ? ` · ${item.subscriber.reference}` : ""}</p> : null}{item.detail ? <p>{item.detail}</p> : null}{item.incident ? <small>{item.incident.code}{item.incident.name ? ` · ${item.incident.name}` : ""}</small> : null}</div><span className="admin-activity-actor">{item.actorName ?? "Sistema"}</span></article>)}</div>)}</section> : <section className="admin-activity-empty"><History size={34}/><b>No hay actividades registradas</b><span>{query ? "No hay coincidencias con tu búsqueda." : "Las acciones administrativas aparecerán aquí cuando se realicen."}</span></section>}
  </main>;
}
