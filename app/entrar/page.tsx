import Link from "next/link";
import { Check, FileCheck2, QrCode, ShieldCheck } from "lucide-react";
import "@/components/access-heading.css";
import "@/components/access-topbar.css";
import "@/components/access-adjustments.css";
import LoginFlow from "@/components/login-flow";
import YuppiFactsLogo from "@/components/yuppifacts-logo";

const highlights = [
  { icon: QrCode, title: "Tickets y QR en un solo lugar", text: "Captura, relaciona y da seguimiento sin perder contexto." },
  { icon: FileCheck2, title: "Solicitudes con trazabilidad", text: "Conoce el estado de cada documento y lo que falta." },
  { icon: ShieldCheck, title: "Datos fiscales protegidos", text: "Tu información se organiza por cuenta y RFC." },
];

export default function SignInPage() {
  return <main className="access-shell">
    <section className="access-aside">
      <Link className="brand" href="/"><YuppiFactsLogo /><span className="yuppifacts-logo-name">YuppiFacts<sup>®</sup></span></Link>
      <div className="access-pitch"><p className="eyebrow">GESTIÓN FISCAL, SIN COMPLICARTE</p><h1><span>Tu información</span><span>fiscal, <em>en orden</em></span><span><em>y bajo control.</em></span></h1><p>Reúne tickets, solicitudes y facturas en un espacio claro para que siempre sepas qué sigue.</p><div className="access-highlights">{highlights.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={19} /></span><div><b>{title}</b><small>{text}</small></div></article>)}</div></div>
      <div className="access-aside-bottom"><p className="access-stack"><span><Check size={15} /> Sin e.firma ni certificados</span><span><Check size={15} /> Datos fiscales protegidos</span><span><Check size={15} /> Personas, contadores y empresas</span></p></div>
    </section>
    <section className="access-form-wrap">
      <header className="access-topbar"><a href="https://yuppifacts.com">Ir a YuppiFacts.com</a><a href="https://promo.yuppifacts.com">¿Aún no tienes una cuenta YuppiFacts? <b>Suscríbete</b></a></header>
      <LoginFlow />
      <footer className="access-form-footer"><span>©2026 YuppiFacts<sup>®</sup>. Todos los derechos reservados.</span>{" "}<nav><Link href="https://yuppifacts.com/privacidad">Política de Privacidad</Link>{" | "}<Link href="https://yuppifacts.com/terminos">Condiciones de Servicio</Link></nav></footer>
    </section>
  </main>;
}
