"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import "@/components/admin-login.css";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export default function AdminSignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch(`${apiOrigin}/v1/access/admin-login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json().catch(() => null) as { accessToken?: string; error?: string } | null;
      if (!response.ok || !data?.accessToken) throw new Error(data?.error ?? "No fue posible iniciar sesión.");
      sessionStorage.setItem("yuppifacts.access", data.accessToken);
      window.location.assign("/admin");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible iniciar sesión."); }
    finally { setBusy(false); }
  };
  return <main className="admin-login">
    <section className="admin-login-story"><Link className="admin-login-brand" href="https://yuppifacts.com"><span>Y</span>YuppiFacts</Link><div><p className="eyebrow">ADMINISTRACIÓN YUPPIFACTS</p><h1>Controla la operación <em>con acceso seguro.</em></h1><p>Gestiona usuarios, promociones y la configuración de cobro desde un solo lugar.</p></div><footer><ShieldCheck size={15} /> Acceso auditado <LockKeyhole size={15} /> Validación en servidor</footer></section>
    <section className="admin-login-form-wrap"><form className="admin-login-form" onSubmit={submit}><p className="eyebrow">ACCESO ADMINISTRATIVO</p><h2>Iniciar sesión</h2><p>Usa el usuario y la contraseña que registraste para tu cuenta maestra.</p><label>Usuario<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Escribe tu usuario" required /></label><label>Contraseña<input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Escribe tu contraseña" required /></label>{message ? <p role="alert" className="admin-login-error">{message}</p> : null}<button disabled={busy || !username || password.length < 12}>{busy ? "Validando…" : <>Ingresar al panel <ArrowRight size={17} /></>}</button><small>El PIN administrativo se solicita únicamente al modificar promociones o credenciales de cobro.</small></form></section>
  </main>;
}
