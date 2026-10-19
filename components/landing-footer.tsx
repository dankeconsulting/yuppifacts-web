"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, ChevronDown, Instagram, Linkedin, Mail, Phone, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import "./landing-footer.css";
import "./landing-footer-adjustments.css";

type Locale = "es" | "en";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.477-.883-.787-1.48-1.76-1.653-2.057-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51a12.72 12.72 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.49.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.375a9.87 9.87 0 0 1-1.51-5.26c.001-5.446 4.43-9.876 9.879-9.876a9.87 9.87 0 0 1 6.985 2.893 9.87 9.87 0 0 1 2.893 6.985c-.002 5.447-4.43 9.878-9.877 9.878M12.047 0C5.486 0 .15 5.336.147 11.897a11.84 11.84 0 0 0 1.6 5.988L0 24l6.335-1.662a11.87 11.87 0 0 0 5.709 1.455h.005c6.56 0 11.894-5.336 11.897-11.897A11.88 11.88 0 0 0 12.047 0" /></svg>;
}

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
    contact: "Hablemos ahora",
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
      privacy: "Política de Privacidad",
      terms: "Condiciones de Servicio",
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
    contact: "Let's talk now",
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
      privacy: "Privacy Policy",
      terms: "Terms of Service",
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
            <h2>
              {locale === "es" ? <><span>Facturación organizada,</span><br /><em>sin fricción</em><i>.</i></> : <><span>Organized invoicing,</span><br /><em>without friction</em><i>.</i></>}
            </h2>
            <p>{text.description}</p>

            <div className="landing-footer-office">
              <p className="landing-footer-label">{text.office}</p>
              <address>
                {text.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>

            <div className="landing-footer-contact-lines">
              <a href="tel:+525592624328"><Phone size={18} aria-hidden="true" />(+52) 55 926 243 28</a>
              <a href="mailto:ai@yuppifacts.com"><Mail size={18} aria-hidden="true" />ai@yuppifacts.com</a>
            </div>

            <Link className="landing-footer-cta" href="/registro">
              <WhatsAppIcon />
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
          <div className="landing-footer-social" aria-label="Social media">
            <a href="https://instagram.com/yuppifacts" aria-label="Instagram"><Instagram size={18} aria-hidden="true" /></a>
            <a href="https://linkedin.com/company/yuppifacts" aria-label="LinkedIn"><Linkedin size={18} aria-hidden="true" /></a>
            <a href="https://youtube.com/@yuppifacts" aria-label="YouTube"><Youtube size={18} aria-hidden="true" /></a>
          </div>
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
        </div>
      </div>
      <button type="button" className="landing-footer-top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={text.top}>
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </footer>
  );
}
