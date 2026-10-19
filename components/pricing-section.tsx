"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

type Period = "monthly" | "quarterly" | "annual";

const periods: Record<Period, { label: string; caption: string }> = {
  monthly: { label: "Mensual", caption: "por mes" },
  quarterly: { label: "Trimestral −10%", caption: "por trimestre" },
  annual: { label: "Anual −20%", caption: "por año" },
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

const mxn = (value: number) => new Intl.NumberFormat("es-MX").format(value);

export default function PricingSection() {
  const [period, setPeriod] = useState<Period>("monthly");

  return <section id="planes" className="plans">
    <div className="pricing-heading">
      <div><p className="eyebrow">PLANES YUPPIFACTS</p><h2>Precios simples.<br /><span>Facturación inteligente.</span></h2><p className="plans-lead">Elige tu plan. Conecta tu propia IA. Nosotros ponemos la plataforma.</p></div>
      <div className="billing-control"><small>Ahorra hasta 20% con pago anual</small><div role="tablist" aria-label="Periodicidad de contratación">{(Object.keys(periods) as Period[]).map(key => <button key={key} role="tab" aria-selected={period === key} className={period === key ? "active" : ""} onClick={() => setPeriod(key)}>{periods[key].label}</button>)}</div></div>
    </div>
    <div className="plan-grid">
      {plans.map(plan => <article key={plan.name} className="plan"><h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-pricing-surface"><div className="plan-price"><strong>${mxn(plan.prices[period])}</strong><span>MXN / {periods[period].caption.replace("por ", "")}</span><small className="plan-audience">{plan.audience}</small></div><div className="plan-divider" /><b className="includes">Incluye</b><ul>{plan.features.map(feature => <li key={feature}><Check /> {feature}</li>)}</ul><Link className="button ghost" href="/registro">Contratar <ArrowRight size={16} /></Link></div></article>)}
    </div>
    <p className="plan-note">*En Despachos Contables, el uso está sujeto a condiciones de infraestructura y uso justo. La IA se contrata y paga por separado mediante la API del suscriptor.</p>
  </section>;
}
