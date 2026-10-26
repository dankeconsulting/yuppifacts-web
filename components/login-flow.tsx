"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ShieldCheck, UserPlus, X } from "lucide-react";
import "./access-login.css";
import CountryFlag from "./country-flag";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const countries = [
  { code: "CO", dial: "+57", name: "Colombia", digits: 10, placeholder: "300 123 4567" },
  { code: "MX", dial: "+52", name: "México", digits: 10, placeholder: "81 1290 4884" },
  { code: "CR", dial: "+506", name: "Costa Rica", digits: 8, placeholder: "8123 4567" },
] as const;
type Country = typeof countries[number];
type Step = "phone" | "code" | "pin";
type ApiFailure = { error?: string; code?: string };

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return <svg className="access-whatsapp-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.2-3.8a8.2 8.2 0 1 1 15-4.5Z"/><path d="M9.2 8.1c.2-.5.5-.5.8-.5h.4c.3 0 .5.1.6.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c.6 1.1 1.5 1.9 2.6 2.5l.6-.5c.2-.2.5-.2.7-.1l1.7.7c.3.1.4.3.4.6v.4c0 .3-.1.6-.5.8-.5.2-1 .3-1.5.2-2.9-.6-5.5-3.2-6.1-6.1-.1-.5 0-1 .2-1.5Z"/></svg>;
}

function Flag({ code }: { code: string }) { return <CountryFlag className="access-flag" code={code} />; }

async function request<T>(path: string, options: RequestInit = {}) {
  if (!apiOrigin) throw new Error("El acceso todavía no está disponible. Intenta de nuevo en unos minutos.");
  const response = await fetch(`${apiOrigin}${path}`, { ...options, headers: { "content-type": "application/json", ...options.headers } });
  const body = await response.json().catch(() => null) as (T & ApiFailure) | null;
  if (!response.ok) {
    const error = new Error(body?.error ?? "No fue posible completar el acceso.") as Error & { code?: string };
    error.code = body?.code;
    throw error;
  }
  return body as T;
}

export default function LoginFlow({ returnTo = "/panel" }: { returnTo?: string }) {
  const [step, setStep] = useState<Step>("phone");
  const [country, setCountry] = useState<Country>(countries[1]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [codeExpiresAt, setCodeExpiresAt] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [verificationToken, setVerificationToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [pin, setPin] = useState("");
  const [notice, setNotice] = useState("");
  const [missingAccount, setMissingAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = phone.replace(/\D/g, "");
  const phoneE164 = `${country.dial}${digits}`;
  const validPhone = digits.length === country.digits;
  const formattedCountdown = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (step !== "code" || !codeExpiresAt) return;
    const updateCountdown = () => setSecondsRemaining(Math.max(0, Math.ceil((new Date(codeExpiresAt).getTime() - Date.now()) / 1000)));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(interval);
  }, [step, codeExpiresAt]);

  const sendCode = async () => {
    if (!validPhone) return;
    setBusy(true); setNotice("");
    try {
      const result = await request<{ challengeId: string; displayCode: string; expiresAt: string }>("/v1/access/code", { method: "POST", body: JSON.stringify({ phoneE164 }) });
      setChallengeId(result.challengeId); setDisplayCode(result.displayCode); setCodeExpiresAt(result.expiresAt); setOtp(["", "", "", ""]); setStep("code");
    } catch (error) {
      const failure = error as Error & { code?: string };
      if (failure.code === "ACCOUNT_NOT_FOUND") setMissingAccount(true);
      else setNotice(failure.message);
    } finally { setBusy(false); }
  };
  const verifyCode = async () => {
    if (otp.some((digit) => !digit)) return;
    setBusy(true); setNotice("");
    try {
      const result = await request<{ verificationToken: string }>("/v1/access/code/verify", { method: "POST", body: JSON.stringify({ challengeId, code: otp.join("") }) });
      setVerificationToken(result.verificationToken); setPin(""); setStep("pin");
    } catch (error) { setNotice(error instanceof Error ? error.message : "No fue posible validar el código."); } finally { setBusy(false); }
  };
  const enter = async () => {
    if (pin.length !== 4) return;
    setBusy(true); setNotice("");
    try {
      const result = await request<{ accessToken: string }>("/v1/access/pin", { method: "POST", body: JSON.stringify({ challengeId, verificationToken, pin }) });
      sessionStorage.setItem("yuppifacts.access", result.accessToken);
      window.location.assign(returnTo);
    } catch (error) { setNotice(error instanceof Error ? error.message : "No fue posible entrar."); } finally { setBusy(false); }
  };
  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); const next = [...otp]; next[index] = digit; setOtp(next); setNotice("");
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };
  const goBack = () => { setNotice(""); if (step === "pin") return setStep("code"); if (step === "code") { setCodeExpiresAt(""); return setStep("phone"); } window.history.back(); };

  return <div className="access-login-card">
    {step === "phone" && <>
      <p className="eyebrow">ACCESO A YUPPIFACTS</p><h2>Iniciar sesión</h2><p className="access-lead">Ingresa el número asociado a tu cuenta para generar tu código de acceso.</p>
      <label className="access-login-label">Número de WhatsApp
        <span className="access-phone-field"><span className="access-country"><button type="button" aria-label="Seleccionar país" onClick={() => setCountryOpen(!countryOpen)}><Flag code={country.code} /><b>{country.dial}</b><ChevronDown size={16} /></button>{countryOpen && <span className="access-country-menu">{countries.map((item) => <button key={item.code} type="button" onClick={() => { setCountry(item); setPhone(""); setCountryOpen(false); }}><Flag code={item.code} /><b>{item.name}</b><small>{item.dial}</small></button>)}</span>}</span><input inputMode="tel" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))} placeholder={country.placeholder} /><WhatsAppIcon size={24} /></span>
      </label>{phone && !validPhone ? <p className="access-field-note is-invalid">Escribe únicamente los {country.digits} dígitos locales; la lada {country.dial} ya está incluida.</p> : null}
      <button type="button" className="button full" disabled={!validPhone || busy} onClick={sendCode}>{busy ? "Generando…" : "Enviar código"}<ArrowRight size={18} /></button>
    </>}
    {step === "code" && <>
      <p className="eyebrow">VERIFICACIÓN DE ACCESO</p><h2>Confirma tu código</h2><p className="access-lead">Escribe el código de cuatro dígitos generado para {country.dial} {digits}.</p>
      <div className="access-otp" aria-label="Código de verificación">{otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} value={digit} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) otpRefs.current[index - 1]?.focus(); }} />)}</div>
      <div className="access-demo-code"><span>Código de acceso</span><b>{displayCode}</b><small>Este código vence en 1 minuto.</small></div>
      <div className="access-code-expiry" aria-live="polite"><span>Duración del código</span><strong>{formattedCountdown}</strong></div>
      {secondsRemaining > 0 ? <p className="access-resend-wait">Podrás solicitar un nuevo código al finalizar la cuenta regresiva.</p> : <button type="button" className="access-resend" disabled={busy} onClick={sendCode}>Solicitar un nuevo código</button>}
      <div className="access-login-actions"><button type="button" onClick={goBack}><ArrowLeft size={17} /> Cambiar número</button><button type="button" className="button" disabled={busy || otp.some((digit) => !digit)} onClick={verifyCode}>{busy ? "Validando…" : "Continuar"}<ArrowRight size={18} /></button></div>
    </>}
    {step === "pin" && <>
      <p className="eyebrow">SEGURIDAD DE ACCESO</p><h2>Ingresa tu PIN</h2><p className="access-lead">Tu código fue confirmado. Escribe el PIN de cuatro dígitos que creaste para entrar.</p>
      <label className="access-login-label">PIN de acceso<input className="access-pin-input" type="password" inputMode="numeric" autoComplete="current-password" maxLength={4} value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 4)); setNotice(""); }} placeholder="••••" /></label>
      <div className="access-login-actions"><button type="button" onClick={goBack}><ArrowLeft size={17} /> Regresar</button><button type="button" className="button" disabled={busy || pin.length !== 4} onClick={enter}>{busy ? "Entrando…" : "Entrar"}<ArrowRight size={18} /></button></div>
    </>}
    {notice && <p className="access-login-error" role="alert">{notice}</p>}
    {missingAccount && <div className="access-missing-backdrop" role="dialog" aria-modal="true" aria-labelledby="access-missing-title"><section className="access-missing-modal"><header><span>CUENTA YUPPIFACTS</span><button type="button" aria-label="Cerrar" onClick={() => setMissingAccount(false)}><X size={25} /></button></header><div><span className="access-missing-icon"><UserPlus size={35} /></span><h3 id="access-missing-title">Aún no tienes una cuenta</h3><p>Puedes suscribirte ahora o volver después a tu registro.</p><footer><a className="button" href="https://promo.yuppifacts.com">Suscribirme <ArrowRight size={19} /></a><button type="button" onClick={() => setMissingAccount(false)}>Volver después</button></footer></div></section></div>}
  </div>;
}
