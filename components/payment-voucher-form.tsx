"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronDown, CircleAlert, Eye, EyeOff, FileCheck2, FileUp, Mail, ShieldCheck, TicketCheck, Trash2, X } from "lucide-react";
import "./payment-voucher.css";
import "./payment-voucher-adjustments.css";
import PublicProcessFooter from "./public-process-footer";
import YuppiFactsLogo from "./yuppifacts-logo";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const maxFileSize = 10 * 1024 * 1024;

const countries = {
  MX: { name: "México", dial: "+52", flag: "🇲🇽", states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"] },
  CO: { name: "Colombia", dial: "+57", flag: "🇨🇴", states: ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá, D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"] },
  CR: { name: "Costa Rica", dial: "+506", flag: "🇨🇷", states: ["Alajuela", "Cartago", "Guanacaste", "Heredia", "Limón", "Puntarenas", "San José"] },
} as const;

type CountryCode = keyof typeof countries;
type UploadResponse = { voucherId: string; uploadUrl: string };
type Picker = "country" | "state" | "city" | null;
const citiesByState: Record<string, string[]> = { "Baja California": ["Tijuana", "Mexicali", "Ensenada", "Tecate", "Playas de Rosarito"], "Ciudad de México": ["Álvaro Obregón", "Benito Juárez", "Coyoacán", "Cuauhtémoc", "Iztapalapa", "Miguel Hidalgo"], Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"], "Nuevo León": ["Monterrey", "San Pedro Garza García", "Guadalupe", "Apodaca", "Santa Catarina"], "Estado de México": ["Ecatepec", "Naucalpan", "Nezahualcóyotl", "Toluca", "Tlalnepantla"], Puebla: ["Puebla", "Tehuacán", "San Martín Texmelucan", "Atlixco"], Querétaro: ["Querétaro", "San Juan del Río", "Corregidora", "El Marqués"], "San José": ["San José", "Escazú", "Desamparados"], Antioquia: ["Medellín", "Bello", "Envigado", "Rionegro"], "Bogotá, D.C.": ["Bogotá"] };

function CountryFlag({ code }: { code: CountryCode }) {
  return <span className={`voucher-country-flag voucher-country-flag-${code.toLowerCase()}`} aria-hidden="true" />;
}

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
  const [phoneDigits, setPhoneDigits] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [showPin, setShowPin] = useState(false); const [showPinConfirmation, setShowPinConfirmation] = useState(false);
  const [picker, setPicker] = useState<Picker>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const currentCountry = countries[countryCode];
  const [promotion, setPromotion] = useState<{promotionId:string;promotionToken:string}|null>(null);
  const stateOptions = useMemo(() => currentCountry.states, [currentCountry]);
  const cityOptions = useMemo(() => citiesByState[stateName] ?? [], [stateName]);
  useEffect(() => { const value=new URLSearchParams(window.location.hash.slice(1)).get("promo");const [promotionId,promotionToken]=value?.split(".")??[];if(promotionId&&promotionToken)setPromotion({promotionId,promotionToken}); }, []);

  const selectFile = (nextFile?: File) => {
    setError(null);
    setReceiptOpen(false);
    setDuplicateOpen(false);
    setAccountNotFound(false);
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
  const chooseCountry = (nextCountry: CountryCode) => { setCountryCode(nextCountry); setPhoneDigits(""); setAccountExists(false); setStateName(""); setCityName(""); setPicker(null); };
  const validateAccount = async () => {
    const phoneE164 = `${currentCountry.dial}${phoneDigits}`;
    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164) || !promotion || !api) return;
    setCheckingAccount(true); setAccountExists(false); setAccountNotFound(false);
    try {
      const response = await fetch(`${api}/v1/promotions/contracts/${promotion.promotionId}/ticket-account`, { method:"POST", headers:{"content-type":"application/json","x-promotion-token":promotion.promotionToken}, body:JSON.stringify({phoneE164}) });
      const body = await response.json().catch(() => ({}));
      if (response.status === 404 && body.code === "SUBSCRIPTION_NOT_FOUND") { setAccountNotFound(true); return; }
      if (!response.ok) throw new Error(body.error ?? "No fue posible validar tu cuenta.");
      setAccountExists(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No fue posible validar tu cuenta."); }
    finally { setCheckingAccount(false); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReceiptOpen(false);
    setDuplicateOpen(false);
    const form = new FormData(event.currentTarget);
    if (!file) {
      setError("Adjunta el comprobante de tu pago para continuar.");
      return;
    }
    if (!stateName || !cityName) {
      setError("Selecciona tu estado o departamento para continuar.");
      return;
    }
    if (!api) {
      setError("La comprobación no está disponible temporalmente. Inténtalo de nuevo más tarde.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        phoneE164: `${currentCountry.dial}${phoneDigits}`,
        countryCode,
        stateName: String(form.get("state") ?? ""),
        cityName: String(form.get("city") ?? ""),
        pin: String(form.get("pin") ?? ""),
        pinConfirmation: String(form.get("pinConfirmation") ?? ""),
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
      if (created.status === 409) {
        setDuplicateOpen(true);
        return;
      }
      if (created.status === 404 && createdBody.code === "SUBSCRIPTION_NOT_FOUND") {
        setAccountNotFound(true);
        return;
      }
      if (!created.ok) throw new Error(createdBody.error ?? "No fue posible preparar tu comprobante.");
      const upload = createdBody as UploadResponse;
      const uploadResponse = await fetch(upload.uploadUrl, { method: "PUT", headers: { "content-type": file.type, "x-amz-server-side-encryption": "AES256" }, body: file });
      if (!uploadResponse.ok) throw new Error("No fue posible cargar el comprobante. Inténtalo de nuevo.");
      const submitted = await fetch(`${api}/v1/promotion-vouchers/${upload.voucherId}/submit`, { method: "POST" });
      const submittedBody = await submitted.json().catch(() => ({}));
      if (!submitted.ok) throw new Error(submittedBody.error ?? "No fue posible registrar tu comprobante.");
      setReceiptOpen(true);
      event.currentTarget.reset();
      setCountryCode("MX");
      setStateName(""); setCityName("");
      setFile(null);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "";
      setError(message && message !== "Failed to fetch" ? message : "No fue posible conectar para enviar tu comprobante. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="voucher-page">
      <section className="voucher-shell" aria-labelledby="voucher-title">
        <header className="voucher-header">
          <a className="voucher-brand" href="https://yuppifacts.com" aria-label="Ir a YuppiFacts">
            <YuppiFactsLogo /> YuppiFacts<sup>®</sup>
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
          <fieldset className="voucher-account-check">
            <legend>Valida tu cuenta</legend>
            <label>Número de WhatsApp<span className="phone-field"><button type="button" className="phone-country-trigger" onClick={() => setPicker("country")} aria-label="Cambiar país y código de WhatsApp"><CountryFlag code={countryCode} /><b>{currentCountry.dial}</b><ChevronDown aria-hidden="true" /></button><input value={phoneDigits} onChange={(event) => { setPhoneDigits(event.target.value.replace(/\D/g, "").slice(0, 14)); setAccountExists(false); setAccountNotFound(false); }} onBlur={()=>void validateAccount()} type="tel" inputMode="numeric" autoComplete="tel" placeholder="Número de WhatsApp" required minLength={8} maxLength={14} /><span className="whatsapp-icon" aria-hidden="true" />{checkingAccount ? <small className="voucher-account-status">Verificando…</small> : accountExists ? <CheckCircle2 className="voucher-account-ok" aria-label="Cuenta encontrada" /> : accountNotFound ? <CircleAlert className="voucher-account-missing" aria-label="Cuenta no encontrada" /> : null}</span><small className="phone-help">Escribe el WhatsApp usado al contratar. Al encontrar tu cuenta se habilitará el formulario.</small></label>
          </fieldset>
          <fieldset disabled={!accountExists}>
            <legend>Comprobante de pago</legend>
            <button className={`voucher-dropzone ${isDragging ? "is-dragging" : ""}`} type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop}>
              {file ? <FileCheck2 aria-hidden="true" /> : <FileUp aria-hidden="true" />}
              <span>{file ? file.name : "Adjunta tu comprobante de pago"}</span>
              <small>{file ? `${Math.ceil(file.size / 1024)} KB · listo para enviar` : "Fotos JPG/PNG o PDF · máximo 10 MB"}</small>
            </button>
            <input ref={inputRef} className="voucher-file-input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={onFileInput} />
            {file && <button className="voucher-remove-file" type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}><Trash2 size={16} /> Quitar comprobante</button>}
          </fieldset>

          <fieldset disabled={!accountExists}>
            <legend>Tu información</legend>
            <label>Nombre completo<input name="fullName" autoComplete="name" placeholder="Tu nombre registrado" required minLength={3} /></label>
            <label>Correo electrónico<span className="field-with-icon"><Mail aria-hidden="true" /><input name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required /></span></label>
            <div className="voucher-select-grid">
              <label>País<span className="select-control"><button type="button" onClick={() => setPicker("country")}><span className="country-option"><CountryFlag code={countryCode} /> {currentCountry.name}</span><ChevronDown aria-hidden="true" /></button></span></label>
              <label>Estado o departamento<span className="select-control"><button type="button" onClick={() => setPicker("state")}><span className={stateName ? "" : "select-placeholder"}>{stateName || "Selecciona estado o departamento"}</span><ChevronDown aria-hidden="true" /></button></span><input type="hidden" name="state" value={stateName} /></label>
               <label>Ciudad / municipio / delegación<input name="city" value={cityName} disabled={!stateName} onChange={(event) => setCityName(event.target.value)} placeholder={stateName ? "Escribe tu ciudad o municipio" : "Selecciona primero un estado"} list="voucher-cities" /><datalist id="voucher-cities">{cityOptions.map((city) => <option key={city} value={city} />)}</datalist></label>
            </div>
          </fieldset>
          <hr className="voucher-divider" />
          <fieldset className="voucher-pin-fields" disabled={!accountExists}><legend>PIN de seguridad</legend><label>PIN de seguridad<span className="voucher-secret"><input name="pin" type={showPin ? "text" : "password"} inputMode="numeric" maxLength={4} placeholder="••••" required onChange={(event)=>event.currentTarget.value=event.currentTarget.value.replace(/\D/g,"").slice(0,4)} /><button type="button" aria-label="Mostrar u ocultar PIN" onClick={()=>setShowPin(value=>!value)}>{showPin?<EyeOff/>:<Eye/>}</button></span></label><label>Confirmar PIN de seguridad<span className="voucher-secret"><input name="pinConfirmation" type={showPinConfirmation ? "text" : "password"} inputMode="numeric" maxLength={4} placeholder="••••" required onChange={(event)=>event.currentTarget.value=event.currentTarget.value.replace(/\D/g,"").slice(0,4)} /><button type="button" aria-label="Mostrar u ocultar confirmación" onClick={()=>setShowPinConfirmation(value=>!value)}>{showPinConfirmation?<EyeOff/>:<Eye/>}</button></span></label></fieldset>
          <div className="voucher-security"><ShieldCheck aria-hidden="true" /><span>Tu comprobante se almacena de forma privada y se usa únicamente para validar este pago.</span></div>
          {error && <p className="voucher-message error"><CircleAlert aria-hidden="true" />{error}</p>}
          <button className="voucher-submit" disabled={submitting || !accountExists} type="submit">{submitting ? "Enviando comprobante…" : "Confirmar y enviar"}</button>
        </form>

      </section><PublicProcessFooter />{receiptOpen&&<div className="voucher-receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-receipt-title"><section className="voucher-receipt"><CheckCircle2 aria-hidden="true" /><p>COMPROBANTE RECIBIDO</p><h2 id="voucher-receipt-title">Gracias por tu suscripción.</h2><span>Recibimos tu voucher y revisaremos tu pago. Te enviaremos un correo cuando tengamos una actualización.</span><button type="button" onClick={()=>window.location.assign(`/tickets${window.location.hash}`)}>De acuerdo</button></section></div>}{duplicateOpen&&<div className="voucher-receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-duplicate-title"><section className="voucher-receipt voucher-duplicate"><CircleAlert aria-hidden="true" /><p>VOUCHER EN REVISIÓN</p><h2 id="voucher-duplicate-title">Ya recibimos tu voucher.</h2><span>Aún estamos procesando tu suscripción. Una vez verificado tu pago procederemos a activar tu cuenta.</span><button type="button" onClick={()=>setDuplicateOpen(false)}>De acuerdo</button></section></div>}{accountNotFound&&<div className="voucher-receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-account-title"><section className="voucher-receipt voucher-duplicate"><CircleAlert aria-hidden="true" /><p>CUENTA NO ENCONTRADA</p><h2 id="voucher-account-title">No existe una cuenta con este WhatsApp.</h2><span>Te invitamos a suscribirte en YuppiFacts para crear tu cuenta y continuar con tu comprobante.</span><div className="voucher-modal-actions"><button type="button" onClick={()=>window.location.assign("https://promo.yuppifacts.com")}>Suscribirme</button><button type="button" onClick={()=>setAccountNotFound(false)}>Cancelar</button></div></section></div>}{picker&&<div className="voucher-picker-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-picker-title"><section className="voucher-picker"><header><div><p>{picker === "country" ? "SELECCIONA TU PAÍS" : "SELECCIONA TU ESTADO"}</p><h2 id="voucher-picker-title">{picker === "country" ? "País y código" : "Estado o departamento"}</h2></div><button type="button" aria-label="Cerrar selector" onClick={() => setPicker(null)}><X aria-hidden="true" /></button></header><div className="voucher-picker-options">{picker === "country" ? (Object.keys(countries) as CountryCode[]).map((code)=><button type="button" key={code} className={countryCode===code?"selected":""} onClick={() => chooseCountry(code)}><CountryFlag code={code} /><b>{countries[code].name}</b><small>{countries[code].dial}</small>{countryCode===code&&<Check aria-hidden="true" />}</button>) : stateOptions.map((state)=><button type="button" key={state} className={stateName===state?"selected":""} onClick={() => { setStateName(state); setPicker(null); }}><b>{state}</b>{stateName===state&&<Check aria-hidden="true" />}</button>)}</div></section></div>}
    </main>
  );
}
