import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import LoginFlow from "@/components/login-flow";
import "@/components/access-heading.css";
import "@/components/access-topbar.css";
import "@/components/access-adjustments.css";

export default function AdminSignInPage() {
  return <main className="access-shell">
    <section className="access-aside">
      <Link className="brand" href="/"><span>Y</span>YuppiFacts</Link>
      <div className="access-pitch">
        <p className="eyebrow">ADMINISTRACIÓN YUPPIFACTS</p>
        <h1><span>Controla la operación</span><span><em>con acceso seguro.</em></span></h1>
        <p>Gestiona registros, promociones, comprobantes y la configuración de cobro desde un solo lugar.</p>
      </div>
      <p className="access-stack"><ShieldCheck size={15} /> Acceso auditado <LockKeyhole size={15} /> Validación en servidor</p>
    </section>
    <section className="access-form-wrap">
      <header className="access-topbar"><Link href="/">Volver al sitio</Link><span>Administrador maestro</span></header>
      <LoginFlow returnTo="/admin" />
    </section>
  </main>;
}
