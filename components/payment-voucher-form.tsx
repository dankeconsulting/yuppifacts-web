"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, CircleAlert, FileCheck2, FileUp, Mail, Phone, ShieldCheck, TicketCheck, X } from "lucide-react";
import "./payment-voucher.css";
import PublicProcessFooter from "./public-process-footer";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const maxFileSize = 10 * 1024 * 1024;

const countries = {
  MX: { name: "México", dial: "+52", flag: "🇲🇽", states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"] },
  CO: { name: "Colombia", dial: "+57", flag: "🇨🇴", states: ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá, D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"] },
  CR: { name: "Costa Rica", dial: "+506", flag: "🇨🇷", states: ["Alajuela", "Cartago", "Guanacaste", "Heredia", "Limón", "Puntarenas", "San José"] },
} as const;

type CountryCode = keyof typeof countries;
type UploadResponse = { voucherId: string; uploadUrl: string };

function fileIsAllowed(file: File) {
  return ["application/pdf", "image/jpeg", "image/png"].includes(file.type) && file.size <= maxFileSize;
}

async function sha256(file: File) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export default function PaymentVoucherForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [countryCode, setCountryCode] = useState<CountryCode>("MX");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const currentCountry = countries[countryCode];
  const [promotion, setPromotion] = useState<{promotionId:string;promotionToken:string}|null>(null);
  const stateOptions = useMemo(() => currentCountry.states, [currentCountry]);
  useEffect(() => { const value=new URLSearchParams(window.location.hash.slice(1)).get("promo");const [promotionId,promotionToken]=value?.split(".")??[];if(promotionId&&promotionToken)setPromotion({promotionId,promotionToken}); }, []);

  const selectFile = (nextFile?: File) => {
    setError(null);
    setReceiptOpen(false);
    if (!nextFile) return;
    if (!fileIsAllowed(nextFile)) {
      setFile(null);
      setError("Adjunta un PDF, PNG o JPG de hasta 10 MB.");
      return;
    }
    setFile(nextFile);
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReceiptOpen(false);
    const form = new FormData(event.currentTarget);
    if (!file) {
      setError("Adjunta el comprobante de tu pago para continuar.");
      return;
    }
    if (!api) {
      setError("La comprobación no está disponible temporalmente. Inténtalo de nuevo más tarde.");
      return;
    }
    setSubmitting(true);
    try {
      const phone = String(form.get("phone") ?? "").replace(/\D/g, "");
      const payload = {
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        phoneE164: `${currentCountry.dial}${phone}`,
        countryCode,
        stateName: String(form.get("state") ?? ""),
        filename: file.name,
        contentType: file.type,
        byteSize: file.size,
        sha256: await sha256(file),
        ...(promotion ?? {}),
      };
      const created = await fetch(`${api}/v1/promotion-vouchers`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
      });
      const createdBody = await created.json().catch(() => ({}));
      if (!created.ok) throw new Error(createdBody.error ?? "No fue posible preparar tu comprobante.");
      const upload = createdBody as UploadResponse;
      const uploadResponse = await fetch(upload.uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
      if (!uploadResponse.ok) throw new Error("No fue posible cargar el comprobante. Inténtalo de nuevo.");
      const submitted = await fetch(`${api}/v1/promotion-vouchers/${upload.voucherId}/submit`, { method: "POST" });
      const submittedBody = await submitted.json().catch(() => ({}));
      if (!submitted.ok) throw new Error(submittedBody.error ?? "No fue posible registrar tu comprobante.");
      setReceiptOpen(true);
      event.currentTarget.reset();
      setCountryCode("MX");
      setFile(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Ocurrió un error al enviar tu comprobante.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="voucher-page">
      <section className="voucher-shell" aria-labelledby="voucher-title">
        <header className="voucher-header">
          <a className="voucher-brand" href="https://yuppifacts.com" aria-label="Ir a YuppiFacts">
            <span>Y</span> YuppiFacts<sup>®</sup>
          </a>
          <p>Comprobación de pago</p>
        </header>

        <div className="voucher-intro">
          <div className="voucher-icon"><TicketCheck aria-hidden="true" /></div>
          <p className="voucher-eyebrow">PROMOCIÓN YUPPIFACTS</p>
          <h1 id="voucher-title">Confirma tu contratación.</h1>
          <p>Adjunta tu comprobante de pago. Validaremos tu promoción antes de activar tu cuenta.</p>
        </div>

        <form className="voucher-form" onSubmit={submit} noValidate>
          <fieldset>
            <legend>Comprobante de pago</legend>
            <button className={`voucher-dropzone ${isDragging ? "is-dragging" : ""}`} type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop}>
              {file ? <FileCheck2 aria-hidden="true" /> : <FileUp aria-hidden="true" />}
              <span>{file ? file.name : "Selecciona tu comprobante o arrástralo aquí"}</span>
              <small>{file ? `${Math.ceil(file.size / 1024)} KB · listo para enviar` : "PDF, PNG o JPG · máximo 10 MB"}</small>
            </button>
            <input ref={inputRef} className="voucher-file-input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={onFileInput} />
            {file && <button className="voucher-remove-file" type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}><X size={15} /> Quitar comprobante</button>}
          </fieldset>

          <fieldset>
            <legend>Tus datos</legend>
            <label>Nombre completo<input name="fullName" autoComplete="name" placeholder="Tu nombre registrado" required minLength={3} /></label>
            <label>Correo electrónico<span className="field-with-icon"><Mail aria-hidden="true" /><input name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required /></span></label>
            <label>Número de WhatsApp<span className="phone-field"><span>{currentCountry.flag} {currentCountry.dial}<ChevronDown size={15} /></span><Phone aria-hidden="true" /><input name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="Número de WhatsApp" required minLength={8} maxLength={14} /></span></label>
            <div className="voucher-select-grid">
              <label>País<select value={countryCode} onChange={(event) => setCountryCode(event.target.value as CountryCode)} aria-label="País"><option value="MX">🇲🇽 México</option><option value="CO">🇨🇴 Colombia</option><option value="CR">🇨🇷 Costa Rica</option></select></label>
              <label>Estado o departamento<select name="state" defaultValue="" required key={countryCode}><option value="" disabled>Selecciona</option>{stateOptions.map((state) => <option key={state}>{state}</option>)}</select></label>
            </div>
          </fieldset>

          <div className="voucher-security"><ShieldCheck aria-hidden="true" /><span>Tu comprobante se almacena de forma privada y se usa únicamente para validar este pago.</span></div>
          {error && <p className="voucher-message error"><CircleAlert aria-hidden="true" />{error}</p>}
          <button className="voucher-submit" disabled={submitting} type="submit">{submitting ? "Enviando comprobante…" : "Confirmar y enviar"}</button>
        </form>

      </section><PublicProcessFooter />{receiptOpen&&<div className="voucher-receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-receipt-title"><section className="voucher-receipt"><CheckCircle2 aria-hidden="true" /><p>COMPROBANTE RECIBIDO</p><h2 id="voucher-receipt-title">Gracias por tu suscripción.</h2><span>Recibimos tu voucher y revisaremos tu pago. Te enviaremos un correo cuando tengamos una actualización.</span><button type="button" onClick={()=>window.location.assign(`/tickets${window.location.hash}`)}>De acuerdo</button></section></div>}
    </main>
  );
}
