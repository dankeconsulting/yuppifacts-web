import Link from "next/link";
import { BadgeCheck, CreditCard, LayoutDashboard, ReceiptText, Settings, TicketCheck, Users } from "lucide-react";
import "./admin-dashboard.css";

const navigation = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/nuevos-registros", label: "Registros", icon: Users },
  { href: "/admin/promociones", label: "Vouchers", icon: ReceiptText },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

const modules = [
  { href: "/admin/nuevos-registros", title: "Registros", text: "Revisa solicitudes, pagos y expedientes de nuevos usuarios.", icon: Users, action: "Ver registros" },
  { href: "/admin/promociones", title: "Vouchers", text: "Valida comprobantes de pago antes de activar una suscripción.", icon: ReceiptText, action: "Validar vouchers" },
  { href: "/admin/configuracion/planes", title: "Planes de promoción", text: "Activa, desactiva y configura los planes que se muestran en promoción.", icon: TicketCheck, action: "Administrar planes" },
  { href: "/admin/configuracion/pagos", title: "Mercado Pago", text: "Configura credenciales y valida el ambiente de cobro.", icon: CreditCard, action: "Configurar cobros" },
];

export default function AdminDashboard() {
  return <main className="admin-dashboard">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/"><span>Y</span>YuppiFacts</Link>
      <p className="admin-sidebar-label">ADMINISTRADOR</p>
      <nav aria-label="Menú administrativo">
        {navigation.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={href === "/admin" ? "active" : ""}><Icon size={19} />{label}</Link>)}
      </nav>
      <div className="admin-sidebar-footer"><BadgeCheck size={18} /><span>Acceso privado<br />y auditado</span></div>
    </aside>
    <section className="admin-dashboard-content">
      <header className="admin-dashboard-header"><div><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h1>Dashboard</h1><p>Administra la operación de YuppiFacts desde un solo lugar.</p></div><Link href="/admin/configuracion" className="button ghost">Configuración</Link></header>
      <section className="admin-module-grid" aria-label="Módulos administrativos">
        {modules.map(({ href, title, text, icon: Icon, action }) => <article key={href}><span><Icon size={23} /></span><h2>{title}</h2><p>{text}</p><Link href={href}>{action} →</Link></article>)}
      </section>
      <section className="admin-next-step"><TicketCheck size={22} /><div><b>Flujo de activación protegido</b><p>La suscripción solo se activa después de validar el comprobante de pago.</p></div><Link href="/admin/promociones">Ir a vouchers →</Link></section>
    </section>
  </main>;
}
