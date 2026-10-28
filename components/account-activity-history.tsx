"use client";

import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, History, Search, ShieldAlert, X } from "lucide-react";
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

type Range = "day" | "week" | "month" | "year" | "all";

function isInRange(date: string, range: Range) {
  if (range === "all") return true;
  const elapsed = Date.now() - new Date(date).getTime();
  return elapsed <= (range === "day" ? 86_400_000 : range === "week" ? 604_800_000 : range === "month" ? 2_592_000_000 : 31_536_000_000);
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

function timeLabel(date: string) {
  return new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

function dateKey(date: Date | string) { const value = new Date(date); return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`; }
function dayItems(center: Date) { return Array.from({ length: 13 }, (_, index) => { const date = new Date(center); date.setDate(center.getDate() + index - 6); return date; }); }

export default function AccountActivityHistory({ activities, loading, onClose }: { activities: AccountActivity[]; loading: boolean; onClose: () => void }) {
  const [range, setRange] = useState<Range>("all");
  const [query, setQuery] = useState("");
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const visible = useMemo(() => activities.filter((item) => {
    const searchable = [item.title, item.detail, item.actorName, item.action].filter(Boolean).join(" ").toLocaleLowerCase();
    return isInRange(item.createdAt, range) && (!selectedDate || dateKey(item.createdAt) === selectedDate) && searchable.includes(query.toLocaleLowerCase().trim());
  }), [activities, query, range, selectedDate]);
  const groups = useMemo(() => visible.reduce<Record<string, AccountActivity[]>>((all, item) => {
    const key = dayLabel(item.createdAt);
    (all[key] ??= []).push(item);
    return all;
  }, {}), [visible]);

  return <section className="account-activity-history" aria-label="Historial de actividades">
    <header className="account-activity-heading">
      <div><p>USUARIO · HISTORIAL DE ACTIVIDADES</p><h2>Historial de actividades</h2><span>YuppiFacts · Mi cuenta</span></div>
      <div><span className="account-activity-total"><History size={17}/>{activities.length} actividades</span><button type="button" onClick={onClose} aria-label="Cerrar historial"><X /></button></div>
    </header>
    <section className="account-activity-tools" aria-label="Controles del historial">
      <div className="account-activity-ranges">{([ ["year", "12 meses"], ["month", "30 días"], ["week", "7 días"], ["day", "24 horas"], ["day", "Hoy"], ["all", "Todo"] ] as const).map(([value, label]) => <button type="button" className={range === value && (value !== "day" || label !== "24 horas") ? "active" : ""} onClick={() => { setRange(value); setSelectedDate(value === "all" ? null : label === "Hoy" ? dateKey(new Date()) : selectedDate); }} key={label}>{label}</button>)}</div>
      <label className="account-activity-search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar actividad…" /></label>
    </section>
    {range !== "all" && <section className="account-activity-calendar" aria-label="Seleccionar día"><button type="button" aria-label="Días anteriores" onClick={() => setCursorDate(value => new Date(value.getFullYear(), value.getMonth(), value.getDate() - 7))}><ChevronLeft /></button><div>{dayItems(cursorDate).map(day => <button type="button" key={dateKey(day)} className={selectedDate === dateKey(day) ? "selected" : ""} onClick={() => { setSelectedDate(dateKey(day)); setRange("day"); }}><small>{new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(day).replace(".", "")}</small><b>{day.getDate()}</b><em>{new Intl.DateTimeFormat("es-MX", { month: "short" }).format(day).replace(".", "")}</em></button>)}</div><button type="button" aria-label="Días siguientes" onClick={() => setCursorDate(value => new Date(value.getFullYear(), value.getMonth(), value.getDate() + 7))}><ChevronRight /></button></section>}
    {loading ? <section className="account-activity-empty"><Clock3 size={33}/><b>Cargando historial…</b></section> : Object.keys(groups).length ? <section className="account-activity-feed">{Object.entries(groups).map(([day, entries]) => <div className="account-activity-day" key={day}><header><span><CalendarDays size={15}/>{day}</span><small>{entries.length} {entries.length === 1 ? "actividad" : "actividades"}</small></header>{entries.map((item) => <article key={item.id}><time>{timeLabel(item.createdAt)}</time><i className={item.action?.includes("rejected") || item.action?.includes("failed") ? "warning" : "success"}>{item.action?.includes("rejected") || item.action?.includes("failed") ? <ShieldAlert size={16}/> : <CheckCircle2 size={16}/>}</i><div><h3>{item.actorName ? <strong>{item.actorName}</strong> : null} {item.title}</h3>{item.detail ? <p>{item.detail}</p> : null}</div><small className="account-activity-status">{item.action?.replaceAll("_", " ") || "Actividad registrada"}</small></article>)}</div>)}</section> : <section className="account-activity-empty"><History size={34}/><b>No hay actividades registradas</b><span>{query ? "No hay coincidencias con tu búsqueda." : "No hay registros para este periodo."}</span></section>}
  </section>;
}
