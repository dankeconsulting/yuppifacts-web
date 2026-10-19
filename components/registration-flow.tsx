"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { createFolio, saveRegistration, type SubscriberType } from "@/lib/preregistration";
import "./registration-flow.css";
import "./registration-fields.css";

const demoOtp = "2468";
const countries = [
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "México" },
  { code: "CO", dial: "+57", flag: "🇨🇴", name: "Colombia" },
];
const plans = [
  { id: "personal", type: "individual" as SubscriberType, name: "Persona Física", price: "$499", caption: "MXN / mes", text: "Para personas físicas con actividad empresarial, RESICO y pequeños contribuyentes." },
  { id: "despacho", type: "accounting_firm" as SubscriberType, name: "Despachos Contables", price: "$5,000", caption: "MXN / mes", text: "Para contadores independientes y despachos con cartera de contribuyentes." },
  { id: "empresa", type: "company" as SubscriberType, name: "Persona Moral", price: "$2,500", caption: "MXN / mes", text: "Para empresas y corporativos con áreas contables propias." },
];
type Step = "plan" | "phone" | "account";

export default function RegistrationFlow() {
  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [country, setCountry] = useState(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [form, setForm] = useState({ holderName: "", email: "", username: "", password: "", pin: "", organizationName: "", accepted: false });
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const numericPhone = phone.replace(/\D/g, "");
  const canSendCode = numericPhone.length >= 10;
  const canContinueAccount = Boolean(form.holderName && form.email && form.username && form.password.length >= 8 && form.pin.length === 4 && form.accepted);
  const activeIndex = step === "plan" ? 0 : step === "phone" ? 1 : 2;

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };
  const verifyOtp = () => {
    if (otp.join("") !== demoOtp) return setOtpError("Revisa el código e inténtalo de nuevo.");
    setStep("account");
  };
  const submit = () => {
    if (!canContinueAccount) return;
    const now = new Date().toISOString();
    const folio = createFolio();
    saveRegistration({ folio, holderName: form.holderName, email: form.email, phone: `${country.dial} ${numericPhone}`, organizationName: form.organizationName, subscriberType: selectedPlan.type, planId: selectedPlan.id, status: "payment_pending", profileProgress: 10, isOnline: false, createdAt: now, updatedAt: now, audit: [{ at: now, action: "payment_pending", detail: "Prerregistro creado; espera pago o comprobante." }] });
    window.location.assign(`/registro/${folio}`);
  };
  const back = () => {
    if (step === "account") return setStep("phone");
    if (step === "phone" && otpSent) { setOtpSent(false); setOtp(["", "", "", ""]); return; }
    if (step === "phone") return setStep("plan");
    window.history.back();
  };

  return <main className="signup-shell">
    <aside className="signup-aside">
      <Link className="brand" href="/"><span>Y</span>YuppiFacts</Link>
      <div className="signup-aside-copy"><p className="eyebrow">CONTRATACIÓN YUPPIFACTS</p><h1>Tu información fiscal,<br /><em>en orden desde el inicio.</em></h1><p>Elige una modalidad, confirma tu WhatsApp y prepara tu cuenta para continuar con el pago seguro.</p><ol className="signup-progress">{["Elige tu plan", "Confirma tu WhatsApp", "Crea tu cuenta", "Pago y activación"].map((label, index) => <li key={label} className={index <= activeIndex ? "active" : ""}><span>{index + 1}</span>{label}</li>)}</ol></div>
      <p className="signup-aside-note"><ShieldCheck size={15} /> Tus datos se revisan antes de habilitar el acceso.</p>
    </aside>
    <section className="signup-workspace">
      <header className="signup-topbar"><Link href="/">Inicio</Link><Link href="/entrar">¿Ya tienes cuenta? <b>Entrar</b></Link></header>
      <div className="signup-panel">
        {step === "plan" && <><p className="eyebrow">PASO 1 DE 4</p><h2>Elige cómo vas a facturar.</h2><p className="signup-lead">Selecciona el plan que corresponde a tu operación. Verás el importe antes de continuar.</p><div className="signup-plan-list">{plans.map((plan) => <button type="button" key={plan.id} onClick={() => setSelectedPlan(plan)} className={`signup-plan ${selectedPlan.id === plan.id ? "selected" : ""}`}><span><b>{plan.name}</b><small>{plan.text}</small></span><strong>{plan.price}<small>{plan.caption}</small></strong>{selectedPlan.id === plan.id && <CheckCircle2 size={19} />}</button>)}</div><div className="signup-summary"><span>Plan seleccionado</span><b>{selectedPlan.name}</b><strong>{selectedPlan.price} <small>{selectedPlan.caption}</small></strong></div><footer className="signup-actions"><button type="button" onClick={back}><ArrowLeft size={17} /> Regresar</button><button type="button" className="button" onClick={() => setStep("phone")}>Continuar <ArrowRight size={18} /></button></footer></>}
        {step === "phone" && <><p className="eyebrow">PASO 2 DE 4</p><div className="signup-identity"><span><MessageCircle size={21} /></span><div><h2>{otpSent ? "Confirma tu código." : "Confirma tu WhatsApp."}</h2><p className="signup-lead">{otpSent ? `Escribe el código de cuatro dígitos enviado a ${country.dial} ${numericPhone}.` : "Usaremos este número para confirmar que eres tú y para avisarte sobre tu contratación."}</p></div></div>{!otpSent ? <><label className="signup-label">Número de WhatsApp<div className="signup-phone"><div className="signup-country"><button type="button" onClick={() => setCountryOpen(!countryOpen)}>{country.flag} <b>{country.dial}</b> <ChevronDown size={15} /></button>{countryOpen && <div className="signup-country-menu">{countries.map((item) => <button type="button" key={item.code} onClick={() => { setCountry(item); setCountryOpen(false); }}>{item.flag} {item.name} <small>{item.dial}</small></button>)}</div>}</div><input inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))} placeholder="81 1290 4884" /></div></label><p className="signup-field-note">Te enviaremos un código de verificación. No usamos tu número para fines publicitarios.</p><footer className="signup-actions"><button type="button" onClick={back}><ArrowLeft size={17} /> Regresar</button><button type="button" className="button" disabled={!canSendCode} onClick={() => setOtpSent(true)}>Enviar código <ArrowRight size={18} /></button></footer></> : <><div className="signup-otp" aria-label="Código de verificación">{otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} inputMode="numeric" autoComplete="one-time-code" maxLength={1} value={digit} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) otpRefs.current[index - 1]?.focus(); }} />)}</div><div className="signup-demo-code"><span>Código de prueba</span><b>{demoOtp}</b></div>{otpError && <p className="signup-error">{otpError}</p>}<button type="button" className="signup-resend" onClick={() => { setOtp(["", "", "", ""]); setOtpError(""); otpRefs.current[0]?.focus(); }}>Reenviar código</button><footer className="signup-actions"><button type="button" onClick={back}><ArrowLeft size={17} /> Cambiar número</button><button type="button" className="button" disabled={otp.some((digit) => !digit)} onClick={verifyOtp}>Continuar <ArrowRight size={18} /></button></footer></>}</>}
        {step === "account" && <><p className="eyebrow">PASO 3 DE 4</p><h2>Crea tu acceso.</h2><p className="signup-lead">Tu contraseña y PIN se usan para entrar al panel cuando tu cuenta sea aprobada y puesta en línea.</p><div className="signup-fields"><label>Nombre completo<input value={form.holderName} onChange={(event) => setForm({ ...form, holderName: event.target.value })} /></label><label>Correo electrónico<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Usuario<input autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label><label>Contraseña<input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo 8 caracteres" /></label><label className="signup-pin-field">PIN de acceso<input type="password" inputMode="numeric" maxLength={4} value={form.pin} onChange={(event) => setForm({ ...form, pin: event.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="••••" /><small>Cuatro dígitos para confirmar tu acceso.</small></label>{selectedPlan.type !== "individual" && <label>Nombre comercial o razón social<input value={form.organizationName} onChange={(event) => setForm({ ...form, organizationName: event.target.value })} /></label>}</div><label className="signup-terms"><input type="checkbox" checked={form.accepted} onChange={(event) => setForm({ ...form, accepted: event.target.checked })} /><span>Acepto los términos de uso y el aviso de privacidad.</span></label><p className="signup-security"><LockKeyhole size={15} /> La contraseña y el PIN no se guardan en esta vista local.</p><footer className="signup-actions"><button type="button" onClick={back}><ArrowLeft size={17} /> Regresar</button><button type="button" className="button" disabled={!canContinueAccount} onClick={submit}>Continuar al pago <ArrowRight size={18} /></button></footer></>}
      </div>
    </section>
  </main>;
}
