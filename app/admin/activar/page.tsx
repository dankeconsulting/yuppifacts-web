"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import YuppiFactsLogo from "@/components/yuppifacts-logo";
import "./setup.css";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type FormState = {
  bootstrapToken: string;
  fullName: string;
  email: string;
  phoneE164: string;
  username: string;
  password: string;
  pin: string;
};

const initialForm: FormState = { bootstrapToken: "", fullName: "", email: "", phoneE164: "+52", username: "", password: "", pin: "" };

export default function ActivateMasterAdministratorPage() {
  const [form, setForm] = useState(initialForm);
  const [ready, setReady] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!apiOrigin) { setReady(false); setNotice("La API de YuppiFacts aún no está configurada en esta instalación."); return; }
    fetch(`${apiOrigin}/v1/bootstrap/status`)
      .then(async (response) => response.ok ? response.json() : Promise.reject(new Error("No fue posible consultar la activación.")))
      .then((data: { enabled: boolean }) => setReady(data.enabled))
      .catch((error: Error) => { setReady(false); setNotice(error.message); });
  }, []);

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!apiOrigin || busy) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch(`${apiOrigin}/v1/bootstrap/master-administrator`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? "No fue posible crear el administrador.");
      setReady(false);
      setNotice("Administrador maestro creado. Guarda tus credenciales en un lugar seguro; esta activación ya quedó cerrada.");
      setForm(initialForm);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No fue posible completar la activación.");
    } finally { setBusy(false); }
  };

  return <main className="admin-setup-shell">
    <section className="admin-setup-context"><Link href="/" className="brand"><YuppiFactsLogo /><span className="yuppifacts-logo-name">YuppiFacts<sup>®</sup></span></Link><div><p className="eyebrow">ACTIVACIÓN ÚNICA</p><h1>Configura el acceso que administra tu operación.</h1><p>Este usuario controla altas, pagos, planes, aprobaciones y disponibilidad del panel. Al terminar, esta pantalla queda deshabilitada.</p></div><p><ShieldCheck size={16} /> Contraseña y PIN se protegen con hash y nunca se almacenan en el navegador.</p></section>
    <section className="admin-setup-workspace"><Link href="/" className="admin-setup-back">Volver a la landing</Link><form className="admin-setup-panel" onSubmit={submit}><p className="eyebrow">ADMINISTRADOR MAESTRO</p><h2>{ready ? "Crea tu acceso principal." : "Activación no disponible."}</h2><p>{ready ? "Completa estos datos una sola vez. Después ingresarás con tus propias credenciales y PIN." : notice || "Esta instancia ya tiene un administrador maestro o aún requiere configuración segura."}</p>{ready && <div className="admin-setup-fields"><label>Código de activación<input required type="password" value={form.bootstrapToken} onChange={(event) => update("bootstrapToken", event.target.value)} autoComplete="one-time-code" /></label><label>Nombre completo<input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} autoComplete="name" /></label><label>Correo electrónico<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" /></label><label>WhatsApp con lada<input required inputMode="tel" value={form.phoneE164} onChange={(event) => update("phoneE164", event.target.value.replace(/[^+\d]/g, ""))} placeholder="+528112904884" /></label><label>Usuario<input required value={form.username} onChange={(event) => update("username", event.target.value.toLowerCase().replace(/\s/g, ""))} autoComplete="username" /></label><label>Contraseña<input required type="password" minLength={12} value={form.password} onChange={(event) => update("password", event.target.value)} autoComplete="new-password" /><small>Al menos 12 caracteres.</small></label><label>PIN de cuatro dígitos<input required type="password" inputMode="numeric" maxLength={4} value={form.pin} onChange={(event) => update("pin", event.target.value.replace(/\D/g, "").slice(0, 4))} autoComplete="new-password" /><small>Se solicita para cambios sensibles.</small></label></div>}{notice && ready && <p className="admin-setup-notice" role="status">{notice}</p>}{ready && <button className="button" disabled={busy || form.pin.length !== 4} type="submit"><KeyRound size={17} />{busy ? "Creando acceso…" : "Crear administrador maestro"}<ArrowRight size={18} /></button>}{!ready && <div className="admin-setup-locked"><LockKeyhole size={21} /><span>{notice || "La activación se abre únicamente cuando aún no existe un administrador."}</span></div>}</form></section>
  </main>;
}
