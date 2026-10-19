"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import "./landing-footer.css";

type Locale = "es" | "en";

const copy = {
  es: {
    statement: "Facturación organizada, sin fricción.",
    description:
      "YuppiFacts reúne tickets, solicitudes y facturas para que tu información fiscal siempre esté en orden.",
    office: "OFICINA COMERCIAL",
    address: [
      "Calz. Gral. Mariano Escobedo 476, Piso 12,",
      "Verónica Anzures, 11590, Miguel Hidalgo,",
      "Ciudad de México, México",
    ],
    contact: "Comenzar ahora",
    explore: "EXPLORAR",
    account: "TU CUENTA",
    resources: "RECURSOS",
    links: {
      home: "Inicio",
      how: "Cómo funciona",
      features: "Funciones",
      plans: "Planes",
      ai: "IA",
      register: "Regístrate",
      login: "Entrar",
      privacy: "Privacidad",
      terms: "Términos",
      payment: "Pagos y contratación",
      data: "Protección de datos",
      access: "Acceso al panel",
    },
    copyright: "© 2024 – 2026 YuppiFacts®. Todos los derechos reservados.",
    top: "Volver arriba",
  },
  en: {
    statement: "Organized invoicing, without friction.",
    description:
      "YuppiFacts brings together tickets, requests and invoices so your tax information stays in order.",
    office: "COMMERCIAL OFFICE",
    address: [
      "476 Calz. Gral. Mariano Escobedo, Floor 12,",
      "Verónica Anzures, 11590, Miguel Hidalgo,",
      "Mexico City, Mexico",
    ],
    contact: "Get started",
    explore: "EXPLORE",
    account: "YOUR ACCOUNT",
    resources: "RESOURCES",
    links: {
      home: "Home",
      how: "How it works",
      features: "Features",
      plans: "Plans",
      ai: "AI",
      register: "Register",
      login: "Sign in",
      privacy: "Privacy",
      terms: "Terms",
      payment: "Payments and plans",
      data: "Data protection",
      access: "Panel access",
    },
    copyright: "© 2024 – 2026 YuppiFacts®. All rights reserved.",
    top: "Back to top",
  },
} as const;

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="landing-footer-link">
      <span>{children}</span>
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

export default function LandingFooter() {
  const [locale, setLocale] = useState<Locale>("es");
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("MX");
  const text = copy[locale];
  const countries = [
    { code: "MX", name: "México" },
    { code: "CO", name: "Colombia" },
    { code: "ES", name: "España" },
    { code: "CR", name: "Costa Rica" },
    { code: "PA", name: "Panamá" },
  ];
  const selectedCountry = countries.find((item) => item.code === country) ?? countries[0];
  useEffect(() => { setLocale(localStorage.getItem("yf-language") === "en" ? "en" : "es"); }, []);
  const chooseLocale = (nextLocale: Locale) => { localStorage.setItem("yf-language", nextLocale); setLocale(nextLocale); window.dispatchEvent(new Event("yf-language-change")); };

  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-top">
          <div className="landing-footer-intro">
            <Link className="brand landing-footer-brand" href="/" aria-label="YuppiFacts">
              <span>Y</span>YuppiFacts
            </Link>
            <h2>{text.statement}</h2>
            <p>{text.description}</p>

            <div className="landing-footer-office">
              <p className="landing-footer-label">{text.office}</p>
              <address>
                {text.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>

            <Link className="landing-footer-cta" href="/registro">
              <MapPin size={18} aria-hidden="true" />
              {text.contact}
            </Link>
          </div>

          <div className="landing-footer-nav" aria-label={text.explore}>
            <div className="landing-footer-column">
              <p className="landing-footer-label">{text.explore}</p>
              <FooterLink href="/">{text.links.home}</FooterLink>
              <FooterLink href="#como-funciona">{text.links.how}</FooterLink>
              <FooterLink href="#beneficios">{text.links.features}</FooterLink>
              <FooterLink href="#planes">{text.links.plans}</FooterLink>
              <FooterLink href="#ia">{text.links.ai}</FooterLink>
            </div>
            <div className="landing-footer-column">
              <p className="landing-footer-label">{text.account}</p>
              <FooterLink href="/registro">{text.links.register}</FooterLink>
              <FooterLink href="/entrar">{text.links.login}</FooterLink>
              <FooterLink href="/entrar">{text.links.access}</FooterLink>
            </div>
            <div className="landing-footer-column">
              <p className="landing-footer-label">{text.resources}</p>
              <FooterLink href="#planes">{text.links.payment}</FooterLink>
              <FooterLink href="/privacidad">{text.links.data}</FooterLink>
              <FooterLink href="/privacidad">{text.links.privacy}</FooterLink>
              <FooterLink href="/terminos">{text.links.terms}</FooterLink>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <div className="landing-footer-controls">
            <div className="landing-footer-country">
              <button type="button" className="landing-footer-country-trigger" onClick={() => setCountryOpen((open) => !open)} aria-expanded={countryOpen}>
                <span className="country-code">{selectedCountry.code}</span>
                <span>{selectedCountry.name}</span>
                <i aria-hidden="true" />
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {countryOpen && (
                <div className="landing-footer-country-menu" role="menu" aria-label="País">
                  {countries.map((item) => (
                    <button key={item.code} type="button" role="menuitem" className={item.code === country ? "active" : ""} onClick={() => { setCountry(item.code); setCountryOpen(false); }}>
                      <span className="country-code">{item.code}</span><span>{item.name}</span><i aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="landing-footer-language" aria-label="Language">
              <button type="button" className={locale === "es" ? "active" : ""} onClick={() => chooseLocale("es")} aria-pressed={locale === "es"}>ES</button>
              <button type="button" className={locale === "en" ? "active" : ""} onClick={() => chooseLocale("en")} aria-pressed={locale === "en"}>EN</button>
            </div>
          </div>
          <p className="landing-footer-legal">{text.copyright} <Link href="/privacidad">| {text.links.privacy}</Link> <Link href="/terminos">| {text.links.terms}</Link></p>
          <button type="button" className="landing-footer-top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={text.top}>
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
