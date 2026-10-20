"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, FilePenLine, FileText, QrCode, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./consent-layer.css";
import "./consent-layer-adjustments.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const promoUrl = process.env.NEXT_PUBLIC_PROMO_URL ?? "https://promo.yuppifacts.com";

type LandingModal = {
  isEnabled: boolean;
  titleEs: string;
  bodyEs: string;
  ctaEs: string;
  titleEn: string;
  bodyEn: string;
  ctaEn: string;
};

const defaultLandingModal: LandingModal = {
  isEnabled: true,
  titleEs: "Contrata YuppiFacts IA y agiliza la solicitud de tus facturas.",
  bodyEs: "",
  ctaEs: "Quiero agilizar solicitudes de facturas",
  titleEn: "Subscribe to YuppiFacts AI and streamline your invoice requests.",
  bodyEn: "",
  ctaEn: "I want to speed up invoice requests"
};

export default function ConsentLayer({ isPublicLandingHost }: { isPublicLandingHost: boolean }) {
  const pathname = usePathname();
  // Host is resolved by the server, so other subdomains never receive the
  // landing campaign shell while the public landing stays instantaneous.
  const isLanding = isPublicLandingHost && pathname === "/";
  const [consent, setConsent] = useState<null | boolean>(null);
  const [consentReady, setConsentReady] = useState(false);
  const [modal, setModal] = useState<LandingModal | null>(() => isPublicLandingHost ? defaultLandingModal : null);
  const [modalClosed, setModalClosed] = useState(false);
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [remainingSpots, setRemainingSpots] = useState(100);

  useEffect(() => {
    if (!isLanding) return;
    // Restore the immediate shell when returning to the landing in the same
    // session; its remote configuration refreshes below without blocking it.
    setModal(defaultLandingModal);
    const storedConsent = localStorage.getItem("yf-cookie-consent");
    setConsent(storedConsent === "accepted" ? true : storedConsent === "rejected" ? false : null);
    setConsentReady(true);

    const syncLocale = () => setLocale(localStorage.getItem("yf-language") === "en" ? "en" : "es");
    syncLocale();
    window.addEventListener("yf-language-change", syncLocale);

    // Start the image request at the same time as the API calls.  Previously the
    // image was only requested after the modal configuration arrived.
    const modalImage = new window.Image();
    modalImage.src = "/landing-modal-fiscal-flow.png";

    const dismissed = Boolean(sessionStorage.getItem("yf-landing-modal-dismissed"));
    setModalClosed(dismissed);

    fetch(`${api}/v1/public/promotion`).then((response) => response.ok ? response.json() : null).then((data: { remaining?: number } | null) => { if (typeof data?.remaining === "number") setRemainingSpots(data.remaining); }).catch(() => null);
    fetch(`${api}/v1/public/landing-modal`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: LandingModal | null) => setModal(data?.isEnabled ? data : null))
      .catch(() => null);

    return () => window.removeEventListener("yf-language-change", syncLocale);
  }, [isLanding]);

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
  const cta = english ? modal?.ctaEn : modal?.ctaEs;

  return (
    <>
      {isLanding && consentReady && consent === null && (
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

      {isLanding && modal && !modalClosed && (
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
              <button
                className="landing-modal-close"
                onClick={closeModal}
                aria-label={english ? "Close" : "Cerrar"}
              >
                <span>{english ? "CLOSE" : "CERRAR"}</span>
                <X />
              </button>
              <p className="landing-modal-label">
                {english ? "FROM $899 MXN" : "DESDE $899 MXN"}
              </p>
              <h2>{english ? title : <><span className="modal-title-desktop">Contrata YuppiFacts IA y<br />agiliza la solicitud de tus facturas.</span><span className="modal-title-mobile">Contrata YuppiFacts<br />IA y agiliza la solicitud<br />de tus facturas.</span></>}</h2>
              <p className="landing-modal-highlight">
                {english
                  ? "Speed up invoice requests for your company or clients if you are an accountant or accounting firm in Mexico. YuppiFacts AI does it for you."
                  : <>Impulsa la agilidad de solicitar tus facturas de tu<br />empresa o clientes si eres contador o despacho<br />contable en México. YuppiFacts AI lo hace por ti.</>}
              </p>
              <p className="landing-modal-intro">
                {english
                  ? "Leave repetitive forms behind: YuppiFacts turns your tickets into clear, organized invoice requests."
                  : "Deja atrás los formularios repetitivos: YuppiFacts convierte tus tickets en solicitudes de factura claras y ordenadas."}
              </p>
              <ol className="landing-modal-steps">
                <li><QrCode aria-hidden="true" /><span>{english ? <>Scan your ticket<br />or QR code.</> : <>Escanea tu ticket<br />o código QR.</>}</span></li>
                <li><FilePenLine aria-hidden="true" /><span>{english ? <>YuppiFacts prepares<br />the request.</> : <>YuppiFacts prepara<br />la solicitud.</>}</span></li>
                <li><FileText aria-hidden="true" /><span>{english ? <>Receive and organize<br />your invoices.</> : <>Recibe y organiza<br />tus facturas.</>}</span></li>
              </ol>
              <div className="landing-modal-spots">
                <b>{english ? <>Only <em>{remainingSpots}</em> spots remain</> : <>Solo quedan <em>{remainingSpots}</em> espacios disponibles</>}</b>
                <span>{english ? "Day of the Dead special price for\naccountants, accounting firms,\nbusinesses and corporations\nFor new subscriptions." : "Precio especial por Día de Muertos para\ncontadores, despachos contables,\nempresas y corporativos\nAplica para nuevas contrataciones."}</span>
              </div>
              <Link className="landing-modal-cta" href={promoUrl} onClick={closeModal}>
                {english ? "I want to speed up invoice requests" : "Quiero agilizar solicitudes de facturas"}
                <Rocket size={21} />
              </Link>
            </div>
          </section>
        </div>
      )}

      {isLanding && modal && modalClosed && (
        <button className="landing-modal-tab" onClick={openModal} aria-label={english ? "Open YuppiFacts promotion" : "Abrir promoción de YuppiFacts"}>
          <span>{english ? "PROMOTION" : "PROMOCIÓN"}</span>
          <b>{english ? "ACCOUNTANTS" : "CONTADORES"}</b>
          <b>{english ? "AND BUSINESSES" : "Y EMPRESAS"}</b>
          <em>{english ? "FROM $899 MXN" : "DESDE $899 MXN"}</em>
        </button>
      )}
    </>
  );
}
