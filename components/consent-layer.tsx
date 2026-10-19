"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Cookie, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./consent-layer.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type LandingModal = {
  isEnabled: boolean;
  titleEs: string;
  bodyEs: string;
  ctaEs: string;
  titleEn: string;
  bodyEn: string;
  ctaEn: string;
};

export default function ConsentLayer() {
  const [consent, setConsent] = useState<null | boolean>(null);
  const [modal, setModal] = useState<LandingModal | null>(null);
  const [modalClosed, setModalClosed] = useState(false);
  const [locale, setLocale] = useState<"es" | "en">("es");

  useEffect(() => {
    const storedConsent = localStorage.getItem("yf-cookie-consent");
    setConsent(storedConsent === "accepted" ? true : storedConsent === "rejected" ? false : null);

    const syncLocale = () => setLocale(localStorage.getItem("yf-language") === "en" ? "en" : "es");
    syncLocale();
    window.addEventListener("yf-language-change", syncLocale);

    fetch(`${api}/v1/public/landing-modal`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: LandingModal | null) => {
        if (!data?.isEnabled) return;

        setModal(data);
        setModalClosed(Boolean(sessionStorage.getItem("yf-landing-modal-dismissed")));
      })
      .catch(() => null);

    return () => window.removeEventListener("yf-language-change", syncLocale);
  }, []);

  const decideCookies = (value: boolean) => {
    localStorage.setItem("yf-cookie-consent", value ? "accepted" : "rejected");
    setConsent(value);
  };

  const closeModal = () => {
    sessionStorage.setItem("yf-landing-modal-dismissed", "1");
    setModalClosed(true);
  };

  const openModal = () => {
    sessionStorage.removeItem("yf-landing-modal-dismissed");
    setModalClosed(false);
  };

  const english = locale === "en";
  const title = english ? modal?.titleEn : modal?.titleEs;
  const body = english ? modal?.bodyEn : modal?.bodyEs;
  const cta = english ? modal?.ctaEn : modal?.ctaEs;

  return (
    <>
      {consent === null && (
        <aside className="cookie-banner" role="dialog" aria-label="Cookies">
          <div className="cookie-banner-content">
            <Cookie className="cookie-banner-icon" aria-hidden="true" />
            <div>
              <b>{english ? "This site uses cookies" : "Este sitio usa cookies"}</b>
              <p>
                {english
                  ? "We use cookies to personalize content, measure our campaigns and offer a better experience. If you reject them, we will not track your information, but we will keep the functional cookies needed for everything to work well."
                  : "Usamos cookies para personalizar el contenido, medir nuestras campañas y ofrecerte una mejor experiencia. Si rechazas, no rastrearemos tu información, pero mantendremos las cookies funcionales para que todo funcione bien."}
              </p>
              <Link href="/cookies">{english ? "Cookie Policy" : "Política de Cookies"}</Link>
            </div>
          </div>
          <div className="cookie-banner-actions">
            <button className="cookie-reject" onClick={() => decideCookies(false)}>
              {english ? "Reject" : "Rechazar"}
            </button>
            <button className="cookie-accept" onClick={() => decideCookies(true)}>
              Okey
            </button>
          </div>
        </aside>
      )}

      {modal && !modalClosed && (
        <div
          className="landing-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={english ? "Day of the Dead offer" : "Oferta de Día de Muertos"}
        >
          <section className="landing-modal">
            <div className="landing-modal-image">
              <Image
                src="/landing-modal-fiscal-flow.png"
                alt={english ? "Person using YuppiFacts while shopping" : "Persona usando YuppiFacts al realizar una compra"}
                fill
                sizes="(max-width: 800px) 0px, 45vw"
                priority
              />
            </div>
            <div className="landing-modal-copy">
              <button className="landing-modal-close" onClick={closeModal}>
                <span>{english ? "CLOSE" : "CERRAR"}</span>
                <X />
              </button>
              <p className="landing-modal-label">
                {english ? "SPECIAL PRICE · DAY OF THE DEAD" : "PRECIO ESPECIAL · DÍA DE MUERTOS"}
              </p>
              <h2>{title}</h2>
              <p className="landing-modal-highlight">
                {english
                  ? "Make invoice requests faster at the places where you shop in Mexico. AI handles the repetitive work."
                  : "Impulsa la agilidad de solicitar tus facturas donde realizas compras en México. La IA lo hace sola."}
              </p>
              <p>{body}</p>
              <ol className="landing-modal-steps">
                <li><Check />{english ? "Scan your ticket or QR" : "Escanea tu ticket o QR"}</li>
                <li><Check />{english ? "YuppiFacts prepares the request" : "YuppiFacts prepara la solicitud"}</li>
                <li><Check />{english ? "Receive and organize your invoice" : "Recibe y organiza tu factura"}</li>
              </ol>
              <div className="landing-modal-spots">
                <b>{english ? <>Only <em>26</em> spots remain.</> : <>Solo quedan <em>26</em> espacios disponibles.</>}</b>
                <span>{english ? "Day of the Dead special price\nFor new subscriptions" : "Precio especial por Día de Muertos\nAplica para nuevas contrataciones"}</span>
              </div>
              <Link className="landing-modal-cta" href="/registro" onClick={closeModal}>
                {cta || (english ? "I want faster invoicing" : "Quiero agilizar mi facturación")}
                <Rocket size={21} />
              </Link>
            </div>
          </section>
        </div>
      )}

      {modal && modalClosed && (
        <button className="landing-modal-tab" onClick={openModal} aria-label={english ? "Open YuppiFacts promotion" : "Abrir promoción de YuppiFacts"}>
          <span>IA</span>
          <b>{english ? "for" : "para"}</b>
          <em>{english ? "Invoices" : "Facturas"}</em>
        </button>
      )}
    </>
  );
}
