"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CountryFlag from "./country-flag";
import "./tax-settings.css";

type CountryCode = "MX" | "CR" | "CO";
type TaxRate = { countryCode: CountryCode; ivaBps: number };
const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const countries: Record<CountryCode, string> = { MX: "México", CR: "Costa Rica", CO: "Colombia" };

export default function TaxSettings() {
  const [taxes, setTaxes] = useState<Record<CountryCode, number>>({ MX: 1600, CR: 0, CO: 0 });
  const [editing, setEditing] = useState<CountryCode | null>(null);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const token = () => sessionStorage.getItem("yuppifacts.access") ?? "";
  const request = async (path: string, init?: RequestInit) => {
    const response = await fetch(`${api}${path}`, { ...init, headers: { "content-type": "application/json", "x-application-token": token(), ...(init?.headers ?? {}) } });
    const body = await response.json().catch(() => null) as { error?: string; taxes?: TaxRate[]; tax?: TaxRate } | null;
    if (!response.ok) throw new Error(body?.error ?? "No fue posible guardar el impuesto.");
    return body;
  };
  const load = async () => {
    const body = await request("/v1/admin/taxes");
    const values = (body?.taxes ?? []).reduce((all, tax) => ({ ...all, [tax.countryCode]: tax.ivaBps }), {} as Partial<Record<CountryCode, number>>);
    setTaxes(current => ({ ...current, ...values }));
  };
  useEffect(() => { void load().catch(error => setMessage(error instanceof Error ? error.message : "No fue posible cargar los impuestos.")); }, []);
  const beginEdit = (countryCode: CountryCode) => { setEditing(countryCode); setDraft((taxes[countryCode] / 100).toFixed(2).replace(/\.00$/, "")); setMessage(""); };
  const save = async (countryCode: CountryCode) => {
    const percentage = Number(draft.replace(",", "."));
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) { setMessage("Ingresa un IVA entre 0 y 100."); return; }
    setBusy(true); setMessage("");
    try { const body = await request(`/v1/admin/taxes/${countryCode}`, { method: "PUT", body: JSON.stringify({ ivaBps: Math.round(percentage * 100) }) }); if (body?.tax) setTaxes(current => ({ ...current, [countryCode]: body.tax!.ivaBps })); setEditing(null); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible guardar el impuesto."); }
    finally { setBusy(false); }
  };
  const remove = async (countryCode: CountryCode) => {
    setBusy(true); setMessage("");
    try { await request(`/v1/admin/taxes/${countryCode}`, { method: "DELETE" }); setTaxes(current => ({ ...current, [countryCode]: 0 })); setEditing(null); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible eliminar el impuesto."); }
    finally { setBusy(false); }
  };
  return <main className="tax-settings-page"><header><p className="eyebrow">ADMINISTRADOR MAESTRO · CONFIGURACIÓN · IMPUESTOS</p><h1>Impuestos</h1><p>Define el IVA aplicable por país. Un valor de 0% o un impuesto eliminado no se agrega al checkout.</p></header><section className="tax-settings-grid">{(Object.keys(countries) as CountryCode[]).map(countryCode => <article className="tax-setting-card" key={countryCode}><header><span><CountryFlag code={countryCode} official /></span><div><h2>IVA {countries[countryCode]}</h2><p>Impuesto aplicable al monto del plan.</p></div></header><div className="tax-setting-row"><span>IVA</span><label><input disabled={editing !== countryCode} value={editing === countryCode ? draft : (taxes[countryCode] / 100).toFixed(2).replace(/\.00$/, "")} onChange={event => setDraft(event.target.value.replace(/[^\d,.]/g, ""))} inputMode="decimal" aria-label={`IVA de ${countries[countryCode]}`} /><em>%</em></label><div className="tax-setting-actions">{editing === countryCode ? <button className="tax-save" type="button" disabled={busy} onClick={() => void save(countryCode)} aria-label="Guardar IVA"><Check size={18} /></button> : <button type="button" onClick={() => beginEdit(countryCode)} aria-label="Editar IVA"><Pencil size={18} /></button>}<button className="tax-delete" type="button" disabled={busy} onClick={() => void remove(countryCode)} aria-label="Eliminar impuesto"><Trash2 size={18} /></button></div></div></article>)}</section>{message && <p className="tax-settings-message">{message}</p>}</main>;
}
