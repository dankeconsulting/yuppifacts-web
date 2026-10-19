import Link from "next/link";
import { ArrowRight, Check, FileCheck2, LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import "@/components/access-heading.css";
import "@/components/access-topbar.css";
import "@/components/access-adjustments.css";

const highlights = [
  { icon: QrCode, title: "Tickets y QR en un solo lugar", text: "Captura, relaciona y da seguimiento sin perder contexto." },
  { icon: FileCheck2, title: "Solicitudes con trazabilidad", text: "Conoce el estado de cada documento y lo que falta." },
  { icon: ShieldCheck, title: "Datos fiscales protegidos", text: "Tu información se organiza por cuenta y RFC." },
];

export default function SignInPage() {
  return <main className="access-shell">
    <section className="access-aside">
      <Link className="brand" href="/"><span>Y</span>YuppiFacts</Link>
      <div className="access-pitch"><p className="eyebrow">GESTIÓN FISCAL, SIN COMPLICARTE</p><h1><span>Tu información</span><span>fiscal, <em>en orden</em></span><span><em>y bajo control.</em></span></h1><p>Reúne tickets, solicitudes y facturas en un espacio claro para que siempre sepas qué sigue.</p><div className="access-highlights">{highlights.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={19} /></span><div><b>{title}</b><small>{text}</small></div></article>)}</div></div>
      <p className="access-stack"><Check size={15} /> Sin e.firma ni certificados <Check size={15} /> Datos bajo tu control</p>
    </section>
    <section className="access-form-wrap">
      <header className="access-topbar"><Link href="/">Inicio</Link><Link href="/registro">¿Aún no tienes cuenta? <b>Regístrate</b></Link></header>
      <form className="access-card">
        <p className="eyebrow">ACCESO A YUPPIFACTS</p><h2>Bienvenido de vuelta</h2><p className="access-lead">Entra para continuar organizando tus solicitudes y facturas.</p>
        <label>Correo electrónico<input type="email" autoComplete="email" placeholder="tu@empresa.mx" /></label>
        <label>Contraseña<input type="password" autoComplete="current-password" placeholder="Tu contraseña" /></label>
        <button type="button" className="button full">Entrar a mi cuenta <ArrowRight size={18} /></button>
        <p className="access-privacy"><LockKeyhole size={14} /> Tu acceso y tus documentos se mantienen protegidos.</p>
      </form>
    </section>
  </main>;
}
