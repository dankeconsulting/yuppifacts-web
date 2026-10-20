"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import "./pricing-adjustments.css";

type Period = "monthly" | "quarterly" | "annual";

const periods: Record<Period, { label: string; caption: string }> = {
  monthly: { label: "Mensual", caption: "por mes" },
  quarterly: { label: "Trimestral −10%", caption: "por trimestre" },
  annual: { label: "Anual −20%", caption: "por año" },
};

const englishPeriods: Record<Period, { label: string; caption: string }> = {
  monthly: { label: "Monthly", caption: "per month" },
  quarterly: { label: "Quarterly −10%", caption: "per quarter" },
  annual: { label: "Annual −20%", caption: "per year" },
};

const plans = [
  {
    name: "Persona Física / Natural",
    description: "Tus tickets y facturas, organizados en un solo lugar.",
    audience: "Para personas físicas con actividad empresarial, RESICO y pequeños contribuyentes.",
    prices: { monthly: 499, quarterly: 1347, annual: 4790 },
    features: ["1 contribuyente", "Hasta 100 solicitudes al mes", "Escáner QR desde el celular", "Facturas XML y PDF", "Historial y organización mensual", "Conexión de IA propia"],
  },
  {
    name: "Despachos Contables",
    description: "Todos tus contribuyentes desde un solo espacio de trabajo.",
    audience: "Para contadores independientes y despachos contables con cartera de contribuyentes.",
    prices: { monthly: 5000, quarterly: 13500, annual: 48000 },
    features: ["Contribuyentes ilimitados", "Solicitudes sin cuota fija de volumen*", "Hasta 10 usuarios autorizados", "Cambio rápido entre contribuyentes", "Panel contable y escáner móvil", "IA propia y reportes avanzados"],
  },
  {
    name: "Persona Moral / Jurídica",
    description: "Control de facturación para empresas y sus equipos.",
    audience: "Todo tipo de empresas y corporativos con áreas contables propias.",
    prices: { monthly: 2500, quarterly: 6750, annual: 24000 },
    features: ["1 razón social", "Hasta 3,000 solicitudes al mes", "Hasta 5 usuarios autorizados", "Escáner móvil y panel web", "Reportes y exportaciones", "Conexión de IA propia"],
  },
];

const englishPlans = [
  { name: "Individual", description: "Your receipts and invoices, organized in one place.", audience: "For self-employed individuals, RESICO taxpayers and small businesses.", prices: { monthly: 499, quarterly: 1347, annual: 4790 }, features: ["1 taxpayer", "Up to 100 requests per month", "Mobile QR scanner", "XML and PDF invoices", "Monthly history and organization", "Bring your own AI connection"] },
  { name: "Accounting Firms", description: "All your taxpayers from one workspace.", audience: "For independent accountants and accounting firms with taxpayer portfolios.", prices: { monthly: 5000, quarterly: 13500, annual: 48000 }, features: ["Unlimited taxpayers", "Requests with no fixed volume quota*", "Up to 10 authorized users", "Quick taxpayer switching", "Accounting dashboard and mobile scanner", "Bring your own AI and advanced reporting"] },
  { name: "Company", description: "Invoicing control for businesses and their teams.", audience: "For companies and corporations with their own accounting teams.", prices: { monthly: 2500, quarterly: 6750, annual: 24000 }, features: ["1 legal entity", "Up to 3,000 requests per month", "Up to 5 authorized users", "Mobile scanner and web dashboard", "Reports and exports", "Bring your own AI connection"] },
];

const mxn = (value: number) => new Intl.NumberFormat("es-MX").format(value);

export default function PricingSection({ locale = "es" }: { locale?: "es" | "en" }) {
  const [period, setPeriod] = useState<Period>("monthly");
  const english = locale === "en";
  const labels = english ? englishPeriods : periods;
  const localizedPlans = english ? englishPlans : plans;

  return <section id="planes" className="plans">
    <div className="pricing-heading">
      <div><p className="eyebrow">YUPPIFACTS {english ? "PLANS" : "PLANES"}</p><h2>{english ? <>Simple pricing.<br /><span>Intelligent invoicing.</span></> : <>Precios simples.<br /><span>Facturación inteligente.</span></>}</h2><p className="plans-lead">{english ? "Choose your plan. Connect your own AI. We provide the platform." : "Elige tu plan. Conecta tu propia IA. Nosotros ponemos la plataforma."}</p></div>
      <div className="billing-control"><small>{english ? "Save up to 20% with annual billing" : "Ahorra hasta 20% con pago anual"}</small><div role="tablist" aria-label={english ? "Billing period" : "Periodicidad de contratación"}>{(Object.keys(labels) as Period[]).map(key => <button key={key} role="tab" aria-selected={period === key} className={period === key ? "active" : ""} onClick={() => setPeriod(key)}>{labels[key].label}</button>)}</div></div>
    </div>
    <div className="plan-grid">
      {localizedPlans.map(plan => <article key={plan.name} className="plan"><h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-pricing-surface"><div className="plan-price"><strong>${mxn(plan.prices[period])}</strong><span>MXN / {labels[period].caption.replace(english ? "per " : "por ", "")}</span><small className="plan-audience">{plan.audience}</small></div><div className="plan-divider" /><b className="includes">{english ? "Includes" : "Incluye"}</b><ul>{plan.features.map(feature => <li key={feature}><Check /> {feature}</li>)}</ul><Link className="button ghost" href="http://promo.yuppifacts.com">{english ? "Get started" : "Contratar"} <ArrowRight size={16} /></Link></div></article>)}
    </div>
    <p className="plan-note">{english ? "*For Accounting Firms, use is subject to infrastructure and fair-use conditions. AI is separately contracted and paid through the subscriber's API." : "*En Despachos Contables, el uso está sujeto a condiciones de infraestructura y uso justo. La IA se contrata y paga por separado mediante la API del suscriptor."}</p>
  </section>;
}
