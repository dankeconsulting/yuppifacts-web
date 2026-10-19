"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, LockKeyhole, Phone, ShieldCheck, UserPlus, X } from "lucide-react";
import "./access-login.css";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const countries = [
  { code: "CO", dial: "+57", name: "Colombia", digits: 10, placeholder: "300 123 4567" },
  { code: "MX", dial: "+52", name: "México", digits: 10, placeholder: "81 1290 4884" },
  { code: "CR", dial: "+506", name: "Costa Rica", digits: 8, placeholder: "8123 4567" },
] as const;
type Country = typeof countries[number];
type Step = "phone" | "code" | "pin";
type ApiFailure = { error?: string; code?: string };

function Flag({ code }: { code: string }) {
  return <span className={`access-flag access-flag-${code.toLowerCase()}`} aria-hidden="true">{code === "MX" && <svg viewBox="0 0 24 24"><path fill="#765426" d="M12 5.2c1.8.1 2.8 1.1 3.4 2.2l2-.6-1.2 1.8 1.8.8-2 .2c.2 1.4-.4 2.7-1.5 3.5l.2 2.7-1.3-1.1-1.4 1.1.2-2.7c-1.2-.8-1.8-2.1-1.6-3.5l-2-.2 1.8-.8-1.2-1.8 2 .6C9.3 6.3 10.3 5.3 12 5.2Z" /><path fill="none" stroke="#3f6638" strokeWidth="1.3" strokeLinecap="round" d="M8.8 15.5c1.7 1.1 4.7 1.1 6.4 0M10.1 16.6l1.1-1m1.7 1 1.1-1" /></svg>}</span>;
}

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

export default function LoginFlow() {
  const [step, setStep] = useState<Step>("phone");
  const [country, setCountry] = useState<Country>(countries[1]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [pin, setPin] = useState("");
  const [notice, setNotice] = useState("");
  const [missingAccount, setMissingAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = phone.replace(/\D/g, "").slice(0, country.digits);
  const phoneE164 = `${country.dial}${digits}`;
  const validPhone = digits.length === country.digits;

  const sendCode = async () => {
    if (!validPhone) return;
    setBusy(true); setNotice("");
    try {
      const result = await request<{ challengeId: string; displayCode: string }>("/v1/access/code", { method: "POST", body: JSON.stringify({ phoneE164 }) });
      setChallengeId(result.challengeId); setDisplayCode(result.displayCode); setOtp(["", "", "", ""]); setStep("code");
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
      window.location.assign("/panel");
    } catch (error) { setNotice(error instanceof Error ? error.message : "No fue posible entrar."); } finally { setBusy(false); }
  };
  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); const next = [...otp]; next[index] = digit; setOtp(next); setNotice("");
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };
  const goBack = () => { setNotice(""); if (step === "pin") return setStep("code"); if (step === "code") return setStep("phone"); window.history.back(); };

  return <div className="access-login-card">
    {step === "phone" && <>
      <p className="eyebrow">ACCESO A YUPPIFACTS</p><h2>Iniciar sesión</h2><p className="access-lead">Ingresa el número asociado a tu cuenta para generar tu código de acceso.</p>
      <label className="access-login-label">Número de WhatsApp
        <span className="access-phone-field"><span className="access-country"><button type="button" aria-label="Seleccionar país" onClick={() => setCountryOpen(!countryOpen)}><Flag code={country.code} /><b>{country.dial}</b><ChevronDown size={16} /></button>{countryOpen && <span className="access-country-menu">{countries.map((item) => <button key={item.code} type="button" onClick={() => { setCountry(item); setPhone(""); setCountryOpen(false); }}><Flag code={item.code} /><b>{item.name}</b><small>{item.dial}</small></button>)}</span>}</span><input inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))} placeholder={country.placeholder} /><Phone size={19} /></span>
      </label><p className="access-field-note">Formato válido para {country.name}: {country.digits} dígitos. Generamos el código internamente y lo mostramos de forma segura en esta pantalla.</p>
      <button type="button" className="button full" disabled={!validPhone || busy} onClick={sendCode}>{busy ? "Generando…" : "Enviar código"}<ArrowRight size={18} /></button>
    </>}
    {step === "code" && <>
      <p className="eyebrow">VERIFICACIÓN DE ACCESO</p><h2>Confirma tu código</h2><p className="access-lead">Escribe el código de cuatro dígitos generado para {country.dial} {digits}.</p>
      <div className="access-otp" aria-label="Código de verificación">{otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} value={digit} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) otpRefs.current[index - 1]?.focus(); }} />)}</div>
      <div className="access-demo-code"><span>Código de acceso</span><b>{displayCode}</b><small>Vence en 5 minutos.</small></div><button type="button" className="access-resend" disabled={busy} onClick={sendCode}>Generar código nuevo</button>
      <div className="access-login-actions"><button type="button" onClick={goBack}><ArrowLeft size={17} /> Cambiar número</button><button type="button" className="button" disabled={busy || otp.some((digit) => !digit)} onClick={verifyCode}>{busy ? "Validando…" : "Continuar"}<ArrowRight size={18} /></button></div>
    </>}
    {step === "pin" && <>
      <p className="eyebrow">SEGURIDAD DE ACCESO</p><h2>Ingresa tu PIN</h2><p className="access-lead">Tu código fue confirmado. Escribe el PIN de cuatro dígitos que creaste para entrar.</p>
      <label className="access-login-label">PIN de acceso<input className="access-pin-input" type="password" inputMode="numeric" autoComplete="current-password" maxLength={4} value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 4)); setNotice(""); }} placeholder="••••" /></label>
      <div className="access-login-actions"><button type="button" onClick={goBack}><ArrowLeft size={17} /> Regresar</button><button type="button" className="button" disabled={busy || pin.length !== 4} onClick={enter}>{busy ? "Entrando…" : "Entrar"}<ArrowRight size={18} /></button></div>
    </>}
    {notice && <p className="access-login-error" role="alert">{notice}</p>}
    <p className="access-privacy"><LockKeyhole size={14} /> El código y el PIN se validan en el servidor; no se guardan en este dispositivo.</p>
    {missingAccount && <div className="access-missing-backdrop" role="dialog" aria-modal="true" aria-labelledby="access-missing-title"><section className="access-missing-modal"><header><span>CUENTA YUPPIFACTS</span><button type="button" aria-label="Cerrar" onClick={() => setMissingAccount(false)}><X size={25} /></button></header><div><span className="access-missing-icon"><UserPlus size={35} /></span><h3 id="access-missing-title">Aún no tienes una cuenta</h3><p>Puedes crearla ahora o continuar después con tu registro.</p><footer><Link className="button" href="/registro">Registrarme <ArrowRight size={19} /></Link><button type="button" onClick={() => setMissingAccount(false)}>Volver después</button></footer></div></section></div>}
  </div>;
}
