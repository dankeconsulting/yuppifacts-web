import Link from "next/link";
import { BadgeCheck, CircleX, Clock3, FileCheck2, Users } from "lucide-react";
import "./admin-dashboard.css";

const subscriberSummary = [
  { label: "Total", icon: Users, tone: "violet" },
  { label: "Por revisar", icon: Clock3, tone: "amber" },
  { label: "Activos", icon: BadgeCheck, tone: "green" },
  { label: "Rechazados", icon: CircleX, tone: "rose" },
];

export default function AdminDashboard() {
  return <main className="admin-dashboard">
    <section className="admin-dashboard-content">
      <header className="admin-dashboard-header"><div><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h1>Dashboard</h1><p>Administra usuarios, promociones y cobros de YuppiFacts desde un solo lugar.</p></div><Link href="/admin/configuracion" className="admin-dashboard-button">Configuración</Link></header>
      <section className="admin-dashboard-summary"><div><span>Estado de promociones</span><b>Configuración protegida</b><p>Solo los planes activos se muestran en el registro promocional.</p></div><Link href="/admin/configuracion/planes">Ver Planes Promo →</Link></section>
      <section className="admin-subscriber-summary" aria-label="Resumen de suscriptores">{subscriberSummary.map(({label,icon:Icon,tone})=><article key={label}><span className={`admin-summary-icon ${tone}`}><Icon size={21}/></span><small>GLOBAL</small><b>0</b><p>{label}</p></article>)}</section>
      <section className="admin-next-step"><FileCheck2 size={22} /><div><b>Flujo de activación protegido</b><p>La suscripción solo se activa después de validar el comprobante de pago.</p></div><Link href="/admin/promociones">Ir a comprobantes →</Link></section>
    </section>
  </main>;
}
