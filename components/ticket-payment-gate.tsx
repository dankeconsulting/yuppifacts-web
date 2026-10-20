"use client";

import Link from "next/link";
import { CheckCircle2, TicketCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import PublicProcessFooter from "./public-process-footer";
import YuppiFactsLogo from "./yuppifacts-logo";
import "./ticket-payment-gate.css";

export default function TicketPaymentGate() {
  const [hash,setHash]=useState("");
  useEffect(()=>setHash(window.location.hash),[]);
  return <main className="ticket-gate"><section><header><Link href="https://yuppifacts.com" className="ticket-gate-brand"><YuppiFactsLogo />YuppiFacts<sup>®</sup></Link></header><div className="ticket-gate-body"><span className="ticket-gate-icon"><TicketCheck /></span><p className="ticket-gate-eyebrow">VALIDACIÓN DE SUSCRIPCIÓN</p><h1>Confirma tu contratación.</h1><p>Para adjuntar un comprobante, primero realiza tu pago en Mercado Pago. Si ya realizaste tu pago, envíanos tu voucher para revisarlo.</p><div className="ticket-gate-note"><CheckCircle2 />Tu voucher quedará en revisión hasta que el Administrador valide tu pago.</div><Link className="ticket-gate-primary" href="https://promo.yuppifacts.com">Pagar mi suscripción</Link><Link className="ticket-gate-secondary" href={`/tickets/comprobante${hash}`}>Ya pagué: enviar comprobante</Link><Link className="ticket-gate-cancel" href="https://yuppifacts.com"><X size={17} />Salir de aquí</Link></div></section><PublicProcessFooter /></main>;
}
