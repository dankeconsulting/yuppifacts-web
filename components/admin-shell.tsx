"use client";

import Link from "next/link";
import { BadgeCheck, CheckCircle2, ClipboardList, LayoutDashboard, Settings, UserCheck, UserPlus, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import "./admin-shell.css";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios-nuevos", label: "Usuarios nuevos", icon: UserPlus },
  { href: "/admin/usuarios-revision", label: "Usuarios en revisión", icon: UserCheck },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const isPublicRoute = pathname === "/admin/entrar" || pathname === "/admin/activar";

  useEffect(() => {
    if (isPublicRoute) return;
    const token = sessionStorage.getItem("yuppifacts.access");
    if (!token || !apiOrigin) { router.replace("/admin/entrar"); return; }
    fetch(`${apiOrigin}/v1/access/session`, { headers: { "x-application-token": token } })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ account?: { role?: string } }>;
      })
      .then(({ account }) => {
        if (account?.role !== "master_admin") throw new Error();
        setAllowed(true);
      })
      .catch(() => router.replace("/admin/entrar"));
  }, [isPublicRoute, router]);

  if (isPublicRoute) return <>{children}</>;
  if (!allowed) return <main className="admin-loading">Validando acceso administrativo…</main>;

  return <div className="admin-shell">
    <aside className="admin-shell-sidebar">
      <Link href="/admin" className="admin-shell-brand"><span>Y</span>YuppiFacts</Link>
      <p className="admin-shell-caption">ADMINISTRADOR MAESTRO</p>
      <nav aria-label="Menú administrativo">
        {navigation.map(({ href, label, icon: Icon }, index) => <div key={href}>
          {index === 1 || index === 4 ? <hr /> : null}
          <Link href={href} className={pathname === href ? "active" : ""}><Icon size={18} />{label}</Link>
        </div>)}
      </nav>
      <div className="admin-shell-footer"><BadgeCheck size={18} /><span>Administración<br />segura y auditada</span></div>
    </aside>
    <section className="admin-shell-page">
      <header className="admin-shell-topbar"><span>YuppiFacts · Administración</span><span><CheckCircle2 size={15} /> Sesión administrativa</span></header>
      {children}
    </section>
  </div>;
}
