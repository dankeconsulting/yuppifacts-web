import Link from "next/link";
import { CreditCard, FileCheck2, Settings, TicketCheck, UserCheck, UserPlus, Users } from "lucide-react";
import "./admin-dashboard.css";

const modules = [
  { href: "/admin/usuarios-nuevos", title: "Usuarios nuevos", text: "Consulta los registros pendientes de revisar.", icon: UserPlus, action: "Ver usuarios nuevos" },
  { href: "/admin/usuarios-revision", title: "Usuarios en revisión", text: "Atiende los expedientes que requieren validación.", icon: UserCheck, action: "Ver revisiones" },
  { href: "/admin/configuracion/promocion", title: "Promociones", text: "Define cupo, vigencia y disponibilidad de los planes promocionales.", icon: TicketCheck, action: "Configurar promoción" },
  { href: "/admin/configuracion/pagos", title: "Mercado Pago", text: "Administra las credenciales de cobro protegidas.", icon: CreditCard, action: "Configurar cobros" },
];

export default function AdminDashboard() {
  return <main className="admin-dashboard">
    <section className="admin-dashboard-content">
      <header className="admin-dashboard-header"><div><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h1>Dashboard</h1><p>Administra usuarios, promociones y cobros de YuppiFacts desde un solo lugar.</p></div><Link href="/admin/configuracion" className="admin-dashboard-button">Configuración</Link></header>
      <section className="admin-dashboard-summary"><div><span>Estado de promociones</span><b>Configuración protegida</b><p>Solo los planes activos se muestran en el registro promocional.</p></div><Link href="/admin/configuracion/planes">Ver Planes Promo →</Link></section>
      <section className="admin-module-grid" aria-label="Módulos administrativos">
        {modules.map(({ href, title, text, icon: Icon, action }) => <article key={href}><span><Icon size={23} /></span><h2>{title}</h2><p>{text}</p><Link href={href}>{action} →</Link></article>)}
      </section>
      <section className="admin-next-step"><FileCheck2 size={22} /><div><b>Flujo de activación protegido</b><p>La suscripción solo se activa después de validar el comprobante de pago.</p></div><Link href="/admin/promociones">Ir a comprobantes →</Link></section>
    </section>
  </main>;
}
