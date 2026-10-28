"use client";

import { CalendarDays, CheckCircle2, Clock3, History, Search, ShieldAlert, X } from "lucide-react";
import { useMemo, useState } from "react";
import "./account-activity-history.css";

export type AccountActivity = {
  id: string;
  action?: string;
  title: string;
  detail: string | null;
  actorName: string | null;
  createdAt: string;
};

type Range = "today" | "week" | "month" | "all";

function isInRange(date: string, range: Range) {
  if (range === "all") return true;
  const elapsed = Date.now() - new Date(date).getTime();
  return elapsed <= (range === "today" ? 86_400_000 : range === "week" ? 604_800_000 : 2_592_000_000);
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

function timeLabel(date: string) {
  return new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export default function AccountActivityHistory({ activities, loading, onClose }: { activities: AccountActivity[]; loading: boolean; onClose: () => void }) {
  const [range, setRange] = useState<Range>("month");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => activities.filter((item) => {
    const searchable = [item.title, item.detail, item.actorName, item.action].filter(Boolean).join(" ").toLocaleLowerCase();
    return isInRange(item.createdAt, range) && searchable.includes(query.toLocaleLowerCase().trim());
  }), [activities, query, range]);
  const groups = useMemo(() => visible.reduce<Record<string, AccountActivity[]>>((all, item) => {
    const key = dayLabel(item.createdAt);
    (all[key] ??= []).push(item);
    return all;
  }, {}), [visible]);

  return <section className="account-activity-history" aria-label="Historial de actividades">
    <header className="account-activity-heading">
      <div><p>MI CUENTA · HISTORIAL</p><h2>Historial</h2><span>Consulta todas las acciones registradas en tu cuenta.</span></div>
      <div><span className="account-activity-total"><History size={17}/>{activities.length} actividades</span><button type="button" onClick={onClose} aria-label="Cerrar historial"><X /></button></div>
    </header>
    <section className="account-activity-tools" aria-label="Controles del historial">
      <div className="account-activity-ranges">{([ ["today", "Hoy"], ["week", "7 días"], ["month", "30 días"], ["all", "Todo"] ] as const).map(([value, label]) => <button type="button" className={range === value ? "active" : ""} onClick={() => setRange(value)} key={value}>{label}</button>)}</div>
      <label className="account-activity-search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar actividad…" /></label>
    </section>
    {loading ? <section className="account-activity-empty"><Clock3 size={33}/><b>Cargando historial…</b></section> : Object.keys(groups).length ? <section className="account-activity-feed">{Object.entries(groups).map(([day, entries]) => <div className="account-activity-day" key={day}><header><CalendarDays size={15}/><span>{day}</span><small>{entries.length} {entries.length === 1 ? "actividad" : "actividades"}</small></header>{entries.map((item) => <article key={item.id}><time>{timeLabel(item.createdAt)}</time><i className={item.action?.includes("rejected") || item.action?.includes("failed") ? "warning" : "success"}>{item.action?.includes("rejected") || item.action?.includes("failed") ? <ShieldAlert size={16}/> : <CheckCircle2 size={16}/>}</i><div><h3>{item.title}</h3>{item.detail ? <p>{item.detail}</p> : null}{item.actorName ? <small>{item.actorName}</small> : null}</div></article>)}</div>)}</section> : <section className="account-activity-empty"><History size={34}/><b>No hay actividades registradas</b><span>{query ? "No hay coincidencias con tu búsqueda." : "Las acciones de tu cuenta aparecerán aquí."}</span></section>}
  </section>;
}
