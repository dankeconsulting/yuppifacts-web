"use client";

import Link from "next/link";
import { Archive, BadgeCheck, Bell, ChevronDown, History, LayoutDashboard, LogOut, Menu, Moon, Settings, Sun, Trash2, UserCheck, UserPlus, UserRound, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import "./admin-shell.css";
import YuppiFactsLogo from "./yuppifacts-logo";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios-nuevos", label: "Usuarios nuevos", icon: UserPlus },
  { href: "/admin/usuarios-revision", label: "Usuarios en revisión", icon: UserCheck },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];
const countries = [
  { name: "México", flag: "🇲🇽" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Costa Rica", flag: "🇨🇷" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const isPublicRoute = pathname === "/" || pathname === "/admin/entrar" || pathname === "/admin/activar";

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

  const formattedDate = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const signOut = () => { sessionStorage.removeItem("yuppifacts.access"); router.replace("/admin/entrar"); };
  return <div className={`admin-shell${collapsed ? " is-collapsed" : ""}${lightMode ? " is-light" : ""}`}>
    <aside className="admin-shell-sidebar">
      <div className="admin-shell-navigation">
        <Link href="/admin" className="admin-shell-brand"><YuppiFactsLogo />YuppiFacts</Link>
        <p className="admin-shell-caption">ADMINISTRADOR MAESTRO</p>
        <nav aria-label="Menú administrativo">
          {navigation.map(({ href, label, icon: Icon }, index) => <div key={href}>
            {index === 1 || index === 4 ? <hr /> : null}
            <Link href={href} className={pathname === href ? "active" : ""}><Icon size={18} />{label}</Link>
          </div>)}
        </nav>
      </div>
      <div className="admin-shell-sidebar-fixed">
        <button type="button" className="admin-theme-switch" onClick={() => setLightMode(value => !value)} aria-label={lightMode ? "Activar modo oscuro" : "Activar modo claro"}><span>{lightMode ? <Sun size={18} /> : <Moon size={18} />}</span><b>{lightMode ? "Modo claro" : "Modo oscuro"}</b><i className={lightMode ? "active" : ""}><em /></i></button>
        <div className="admin-country-picker">
          <button type="button" className="admin-country-trigger" onClick={() => setCountryOpen(value => !value)} aria-expanded={countryOpen}><span>{country.flag}</span><b>{country.name}</b><i /><ChevronDown size={16} /></button>
          {countryOpen && <div className="admin-country-menu">{countries.map((option) => <button key={option.name} type="button" className={option.name === country.name ? "selected" : ""} onClick={() => { setCountry(option); setCountryOpen(false); }}><span>{option.flag}</span><b>{option.name}</b><i>{option.name === country.name ? "✓" : ""}</i></button>)}</div>}
        </div>
        <div className="admin-master-note"><BadgeCheck size={19} /><span><b>Admin Maestro</b><small>Acceso global y exclusivo.</small></span></div>
      </div>
    </aside>
    <section className="admin-shell-page">
      <header className="admin-shell-topbar"><div className="admin-topbar-date"><button type="button" aria-label="Colapsar menú" onClick={() => setCollapsed(value => !value)}><Menu size={19} /></button><span>{formattedDate}</span></div><div className="admin-topbar-actions"><button type="button" aria-label="Notificaciones" className="admin-topbar-icon"><Bell size={19} /><i>1</i></button><Link href="/admin/configuracion" aria-label="Configuración" className="admin-topbar-icon"><Settings size={19} /></Link><div className="admin-profile"><button type="button" className="admin-profile-trigger" onClick={() => setProfileOpen(value => !value)}><img src="/avatars/claudia-cruz.jpg" alt="Claudia Cruz" /><span><b>Claudia Cruz</b><small>Admin Maestro</small></span><ChevronDown size={16} /></button>{profileOpen && <div className="admin-profile-menu"><button type="button" onClick={() => setProfileOpen(false)}><UserRound size={18} />Mi perfil</button><button type="button" onClick={() => setProfileOpen(false)}><Archive size={18} />Archivo</button><button type="button" onClick={() => setProfileOpen(false)}><Trash2 size={18} />Papelera</button><hr /><button type="button" onClick={() => setProfileOpen(false)}><History size={18} />Logs</button><hr /><button type="button" className="admin-profile-logout" onClick={signOut}><LogOut size={18} />Cerrar sesión</button></div>}</div></div></header>
      {children}
    </section>
  </div>;
}
