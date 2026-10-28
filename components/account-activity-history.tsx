"use client";

import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, History, Power, Smile, Trash2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import "./account-activity-history.css";
import "./account-activity-semantic.css";

export type AccountActivity = { id: string; action?: string; title: string; detail: string | null; actorName: string | null; createdAt: string };

const dateKey = (date: Date | string) => { const value = new Date(date); return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`; };
const dateTitle = (date: Date) => new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
const timeLabel = (date: string) => new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(date));
function monthDays(month: Date) { const amount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); return Array.from({ length: amount }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)); }
function dayItems(center:Date){return Array.from({length:21},(_,index)=>{const day=new Date(center);day.setDate(center.getDate()+index-10);return day;});}
function activityIcon(action:string=""){const value=action.toLowerCase();if(value.includes("delete")||value.includes("elimin"))return ["danger",<Trash2/>] as const;if(value.includes("online")||value.includes("login"))return ["success",<Power/>] as const;if(value.includes("offline")||value.includes("logout"))return ["neutral",<Power/>] as const;if(value.includes("failed")||value.includes("rejected"))return ["warning",<FileText/>] as const;if(value.includes("pending")||value.includes("review"))return ["warning",<TriangleAlert/>] as const;if(value.includes("request")||value.includes("invoice"))return ["info",<FileText/>] as const;if(value.includes("help")||value.includes("chat"))return ["neutral",<Smile/>] as const;return ["success",<CheckCircle2/>] as const;}
function activityTag(action:string=""){const value=action.toLowerCase();if(value.includes("online"))return ["verde","En línea"] as const;if(value.includes("offline"))return ["gris","Fuera de línea"] as const;if(value.includes("failed")||value.includes("rejected"))return ["rojo","No procesada"] as const;if(value.includes("pending")||value.includes("review"))return ["amarillo","En revisión"] as const;if(value.includes("invoice")||value.includes("received"))return ["verde","Factura recibida"] as const;if(value.includes("request"))return ["azul","Solicitud"] as const;return null;}

export default function AccountActivityHistory({ activities, loading }: { activities: AccountActivity[]; loading: boolean }) {
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [period, setPeriod] = useState<"12 meses"|"30 días"|"7 días"|"24 horas"|"Hoy">("Hoy");
  const selected = useMemo(() => new Date(`${selectedDate}T12:00:00`), [selectedDate]);
  const visible = useMemo(() => activities.filter(item => dateKey(item.createdAt) === selectedDate), [activities, selectedDate]);
  const resultLabel = `${dateKey(new Date()) === selectedDate ? "Hoy" : new Intl.DateTimeFormat("es-MX", { weekday: "long" }).format(selected)} · ${dateTitle(selected).replace(/^[^,]+, /, "")}`;

  const today = dateKey(new Date());
  return <section className="account-activity-history" aria-label="Historial de actividades">
    <header className="account-activity-heading"><div><p>USUARIO · HISTORIAL DE ACTIVIDADES</p><h2>Historial de Actividades</h2><span>YuppiFacts · Mi cuenta</span></div><b className="account-activity-count"><History/>{activities.length} {activities.length===1?"actividad":"actividades"}</b></header>
    <div className="account-activity-controls"><div className="account-activity-periods" aria-label="Periodo de historial">{(["12 meses","30 días","7 días","24 horas","Hoy"] as const).map(item=><button key={item} type="button" className={period===item?"active":""} onClick={()=>{setPeriod(item);if(item==="Hoy"){const now=new Date();setMonth(now);setSelectedDate(dateKey(now));}}}>{item}</button>)}</div><button className="account-activity-date" type="button" onClick={()=>{const now=new Date();setMonth(now);setSelectedDate(dateKey(now));}}><CalendarDays/>Seleccionar fechas</button></div>
    <section className="account-activity-calendar" aria-label="Calendario de actividades"><button type="button" aria-label="Días anteriores" onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth(), value.getDate()-7))}><ChevronLeft /></button><div>{dayItems(month).map(day => { const key = dateKey(day); return <button type="button" key={key} className={[key === today ? "today" : "", selectedDate === key ? "selected" : ""].filter(Boolean).join(" ")} onClick={() => {setSelectedDate(key);setMonth(day)}}><small>{new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(day).replace(".", "")}</small><b>{day.getDate()}</b><em>{new Intl.DateTimeFormat("es-MX", { month: "short" }).format(day).replace(".", "")}</em></button>; })}</div><button type="button" aria-label="Días siguientes" onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth(), value.getDate()+7))}><ChevronRight /></button></section>
    <div className="account-activity-summary"><span><CalendarDays />{resultLabel}</span><small>{visible.length} {visible.length === 1 ? "actividad" : "actividades"}</small></div>
    {loading ? <section className="account-activity-empty"><Clock3 /><b>Cargando historial…</b></section> : visible.length ? <section className="account-activity-feed">{visible.map(item => {const [tone,icon]=activityIcon(item.action),tag=activityTag(item.action);return <article key={item.id}><time>{timeLabel(item.createdAt)}</time><i className={tone}>{icon}</i><div><h3>{item.actorName ? <strong>{item.actorName}</strong> : null} {item.title}</h3>{item.detail ? <p>{item.detail}</p> : null}</div>{tag?<small className={`account-activity-tag ${tag[0]}`}>{tag[1]}</small>:null}</article>})}</section> : <section className="account-activity-empty"><History /><b>Sin actividades registradas</b><span>No hay registros para esta fecha.</span></section>}
  </section>;
}
