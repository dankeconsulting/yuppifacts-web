"use client";

import Link from "next/link";
import { ArrowRight, Building2, Check, FileText, LockKeyhole, QrCode, ShieldCheck, Sparkles, TicketCheck, TrendingUp, Users } from "lucide-react";
import PricingSection from "@/components/pricing-section";
import HowTimeline from "@/components/how-timeline";
import LandingFooter from "@/components/landing-footer";
import RevealOnScroll from "@/components/reveal-on-scroll";
import { useLandingLocale } from "@/components/use-landing-locale";
import YuppiFactsLogo from "@/components/yuppifacts-logo";
import "@/components/landing-adjustments.css";

export default function LandingPage() {
  const locale = useLandingLocale();
  const english = locale === "en";
  return <main className="landing">
    <header className="public-nav">
      <Link className="brand" href="/"><YuppiFactsLogo />YuppiFacts</Link>
      <nav><a href="#como-funciona">{english ? "How it works" : "Cómo funciona"}</a><a href="#beneficios">{english ? "Features" : "Funciones"}</a><a href="#planes">{english ? "Plans" : "Planes"}</a><a href="#ia">AI</a></nav>
      <div className="nav-actions"><Link href="/entrar">{english ? "Log in" : "Entrar"}</Link><Link className="button small" href="/registro">{english ? "Get started" : "Contratar"}</Link></div>
    </header>

    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={15} /> {english ? "AI that organizes, suggests and supports you" : "IA que organiza, sugiere y te acompaña"}</p>
        <h1>{english ? <>Request<br />invoices without<br /><em>the headache</em><span className="hero-title-dot">.</span></> : <>Solicita tus<br />facturas sin<br /><em>dolores de cabeza</em><span className="hero-title-dot">.</span></>}</h1>
        <p className="lead">{english ? <>YuppiFacts reads your receipt or QR code, prepares the information each provider requires,<br />and organizes your invoices in one place.<br />You always remain in control.</> : <>YuppiFacts lee tu ticket o QR, prepara los datos que solicita<br />cada proveedor y organiza tus facturas en un solo lugar.<br />Tú mantienes siempre el control.</>}</p>
        <div className="hero-actions"><Link className="button" href="#planes">{english ? "View plans" : "Ver planes"} <ArrowRight size={18} /></Link><Link className="button ghost" href="/entrar">{english ? "Log in" : "Iniciar sesión"}</Link></div>
        <ul className="proof"><li><Check /> {english ? "No e-signature or certificates" : "Sin e.firma ni certificados"}</li><li><Check /> {english ? "Tax data protected" : "Datos fiscales protegidos"}</li><li><Check /> {english ? "People, accountants and companies" : "Personas, contadores y empresas"}</li></ul>
      </div>
      <div className="hero-product">
        <div className="mini-card metric"><small>Facturas organizadas</small><strong>24</strong><span>+8 este mes</span></div>
        <div className="ticket-panel">
          <div className="ticket-head"><span className="avatar">YF</span><div><b>{english ? "Request #YF-2084" : "Solicitud #YF-2084"}</b><small>{english ? "North Market · In progress" : "Supermercado Norte · En proceso"}</small></div><span className="status waiting">{english ? "Review" : "Revisión"}</span></div>
          <div className="ticket-steps"><p><span>✓</span> {english ? "Receipt and QR verified" : "Ticket y QR verificados"}</p><p><span>✓</span> {english ? "Tax profile confirmed" : "Perfil fiscal confirmado"}</p><p className="pending"><span>3</span> {english ? "Waiting for the provider response" : "Esperando la respuesta del proveedor"}</p></div>
          <div className="ticket-footer"><FileText size={17} /> {english ? "PDF/XML will be linked here when received" : "PDF/XML se vincularán aquí al recibirse"}</div>
        </div>
        <div className="hero-brand-badge"><span className="hero-brand-badge-icon"><TicketCheck size={22} /><Sparkles size={12} /></span><p><b>YuppiFacts<sup>®</sup></b><small>{english ? "Built for businesses and accountants" : "Hecho para empresas y contadores"}</small></p></div>
      </div>
    </section>

    <Marquee locale={locale} />
    <HowTimeline locale={locale} />

    <section id="beneficios" className="features">
      <p className="eyebrow">{english ? "FEATURES" : "FUNCIONES"}</p>
      <h2>{english ? <><span>All the power of technology,</span><br /><span className="features-title-accent">with the peace of mind of being protected</span><span className="features-title-dot">.</span></> : <><span>Todo el poder de la tecnología,</span><br /><span className="features-title-accent">toda la tranquilidad de estar protegido</span><span className="features-title-dot">.</span></>}</h2>
      <p className="features-lead">{english ? "Automate your invoicing requests with artificial intelligence, save time and keep your information secure." : "Automatiza tus solicitudes de facturación con inteligencia artificial, ahorra tiempo y mantén tu información segura."}</p>
      <div className="feature-grid">
        <Feature icon={<QrCode />} title={english ? "QR, receipt or link" : "QR, ticket o enlace"} text={english ? "Capture from your phone or attach a PDF, PNG or JPG with preview." : "Captura desde móvil o adjunta PDF, PNG y JPG con vista previa."} />
        <Feature icon={<FileText />} title={english ? "Traceable requests" : "Solicitudes trazables"} text={english ? "Clear statuses: assisted, awaiting user, sent and completed." : "Estados explícitos: asistida, pendiente de usuario, enviada y completada."} />
        <Feature icon={<ShieldCheck />} title={english ? "Data under control" : "Datos bajo control"} text={english ? "Account and RFC isolation, temporary URLs and access audit trails." : "Aislamiento por cuenta y RFC, URLs temporales y auditoría de accesos."} />
        <Feature icon={<TrendingUp />} title={english ? "Built to grow" : "Hecho para crecer"} text={english ? "One RFC for individuals, multiple taxpayers for firms and corporations." : "Un RFC para personas físicas, múltiples contribuyentes para despachos y corporativos."} />
        <Feature icon={<LockKeyhole />} title={english ? "Military-grade security" : "Seguridad grado militar"} text={english ? "Your tax information is protected with encryption, access controls and technology designed to keep data secure." : "Protección de tu información fiscal mediante cifrado, controles de acceso y tecnología diseñada para mantener tus datos seguros."} />
        <Feature icon={<Sparkles />} title={english ? "Next-generation AI" : "IA de última generación"} text={english ? "Simplify information capture, reduce repetitive work and speed up invoice requests with intelligent technology." : "Simplifica la captura de información, reduce tareas repetitivas y agiliza tus solicitudes de facturación con tecnología inteligente."} />
        <Feature icon={<FileText size={24} strokeWidth={2} />} title={english ? "Control and traceability" : "Control y trazabilidad"} text={english ? "Check request status, organize receipts and maintain an operation history in one place." : "Consulta el estado de tus solicitudes, organiza tus comprobantes y mantén un historial de tus operaciones en un solo lugar."} />
        <Feature icon={<Building2 size={24} strokeWidth={2} />} title={english ? "Technology that grows with you" : "Tecnología que crece contigo"} text={english ? "A platform for people, companies and accounting firms that need to manage invoicing efficiently." : "Una plataforma diseñada para personas, empresas y despachos contables que necesitan gestionar su facturación de manera eficiente."} />
      </div>
    </section>

    <PricingSection locale={locale} />

    <section id="ia" className="cta">
      <p className="eyebrow">{english ? "AI AT EVERY STEP" : "IA EN CADA PASO"}</p>
      <h2>{english ? <>YuppiFacts AI does the work,<br /><span className="cta-title-accent">you stay in control</span><span className="cta-title-dot">.</span></> : <>YuppiFacts IA hace el trabajo,<br /><span className="cta-title-accent">tú tienes el control</span><span className="cta-title-dot">.</span></>}</h2>
      <p>{english ? "Turn your purchase receipts into invoices without complications. Our artificial intelligence speeds up your requests, organizes your receipts, and helps you avoid missed tax deductions by forgetting to request an invoice." : "Convierte tus tickets de compra en facturas sin complicaciones. Nuestra inteligencia artificial agiliza tus solicitudes, organiza tus comprobantes y te ayuda a no perder oportunidades de deducción fiscal por olvidar pedir una factura."}</p>
      <Link className="button" href="/registro">{english ? "Get YuppiFacts" : "Contratar YuppiFacts"} <ArrowRight size={18} /></Link>
    </section>

    <LandingFooter />
  </main>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <RevealOnScroll><article className="feature"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article></RevealOnScroll>;
}

function Marquee({ locale }: { locale: "es" | "en" }) {
  const items = locale === "en" ? ["AI for documents", "QR and receipts", "Provider portal", "XML and PDF", "RFC security", "Data under control"] : ["IA para documentos", "QR y tickets", "Portal de proveedores", "XML y PDF", "Seguridad por RFC", "Datos bajo control"];
  const loopItems = [...items, ...items, ...items, ...items];
  return <div className="logo-slider" aria-label="Capacidades de YuppiFacts"><div className="marquee-track">{loopItems.map((item, index) => <span className="marquee-item" key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div></div>;
}
