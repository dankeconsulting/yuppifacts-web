"use client";

import Link from "next/link";
import { BadgeCheck, CircleX, Clock3, Eye, FileCheck2, UserRound, Users } from "lucide-react";
import { useEffect, useState } from "react";
import "./admin-dashboard.css";

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
  fullName: string;
  email: string;
  role: string;
  profile: string;
  phone: string;
  state: string | null;
  city: string | null;
  registeredAt: string;
};

const date = (value: string) => new Intl.DateTimeFormat("es-MX", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
}).format(new Date(value));

export default function AdminDashboard() {
  const [recent, setRecent] = useState<RecentSubscriber[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
        setRecent(Array.isArray(body.subscribers) ? body.subscribers : []);
        setError("");
      } catch (reason) {
        setRecent([]);
        setError(reason instanceof Error ? reason.message : "No fue posible cargar los registros recientes.");
      }
    };
    void load();
  }, []);

  return <main className="admin-dashboard"><section className="admin-dashboard-content">
    <header className="admin-dashboard-header"><div><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h1>Dashboard</h1><p>Administra usuarios, promociones y cobros de YuppiFacts desde un solo lugar.</p></div><Link href="/admin/configuracion" className="admin-dashboard-button">Configuración</Link></header>
    <section className="admin-dashboard-summary"><div><span>Estado de promociones</span><b>Configuración protegida</b><p>Solo los planes activos se muestran en el registro promocional.</p></div><Link href="/admin/configuracion/promocion">Ver Planes Promo →</Link></section>
    <section className="admin-subscriber-summary" aria-label="Resumen de suscriptores">{subscriberSummary.map(({ label, icon: Icon, tone }) => <article key={label}><span className={`admin-summary-icon ${tone}`}><Icon size={21} /></span><small>GLOBAL</small><b>0</b><p>{label}</p></article>)}</section>
    <section className="admin-recent-subscribers" aria-labelledby="recent-title">
      <header><div><p className="eyebrow">REGISTROS RECIENTES</p><h2 id="recent-title">Usuarios nuevos de la última hora</h2><p>Se conserva este bloque hasta que entre un registro nuevo.</p></div><Link href="/admin/usuarios-nuevos">Ver todos →</Link></header>
      {error ? <p className="admin-recent-error">{error}</p> : recent.length ? <div className="admin-dashboard-user-table">
        <div className="admin-dashboard-user-row admin-dashboard-user-head"><span>User ID</span><span>Suscriptor</span><span>Rol</span><span>Perfil / modo</span><span>WhatsApp</span><span>Ubicación</span><span>Fecha de registro</span><span>Acciones</span></div>
        {recent.map(item => <div className="admin-dashboard-user-row" key={item.id}>
          <span className="record-id">{item.recordNumber}</span>
          <span className="subscriber-name"><i><UserRound size={17} /></i><b>{item.fullName}<small>{item.email}</small></b></span>
          <span>{item.role}</span><span>{item.profile}</span><span>{item.phone}</span><span>{item.city ? `${item.city}, ${item.state}` : "México"}</span><span>{date(item.registeredAt)}</span>
          <span className="row-actions"><Link href={`/admin/usuarios/${item.id}`} aria-label={`Ver ficha de ${item.fullName}`}><Eye size={17} /></Link></span>
        </div>)}
        <footer><span>{recent.length} registros recientes</span><span>Proyección de Usuarios nuevos</span></footer>
      </div> : <div className="admin-recent-empty"><Users size={21} /><span>Aún no hay registros recientes.</span></div>}
    </section>
    <section className="admin-next-step"><FileCheck2 size={22} /><div><b>Flujo de activación protegido</b><p>La suscripción solo se activa después de validar el comprobante de pago.</p></div><Link href="/admin/promociones">Ir a comprobantes →</Link></section>
  </section></main>;
}
