"use client";
import Link from "next/link";
import { CheckCircle2, TicketCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./ticket-payment-gate.css";

export default function TicketPaymentGate() {
  const [hash,setHash]=useState("");useEffect(()=>setHash(window.location.hash),[]);
  return <main className="ticket-gate"><section><header><Link href="https://yuppifacts.com" className="ticket-gate-brand"><span>Y</span>YuppiFacts<sup>®</sup></Link></header><div className="ticket-gate-body"><span className="ticket-gate-icon"><TicketCheck /></span><p className="ticket-gate-eyebrow">VALIDACIÓN DE SUSCRIPCIÓN</p><h1>¿Ya realizaste tu pago?</h1><p>Envía tu comprobante para revisar tu contratación promocional. La activación se realiza después de validar el pago.</p><div className="ticket-gate-note"><CheckCircle2 />Puedes adjuntar un comprobante de Mercado Pago, transferencia u otro método autorizado.</div><Link className="ticket-gate-primary" href={`/tickets/comprobante${hash}`}>Ya pagué: enviar comprobante</Link><Link className="ticket-gate-cancel" href="https://yuppifacts.com"><X size={17} />Cancelar</Link></div><footer>© 2026 YuppiFacts<sup>®</sup> · Para empresas y contadores.</footer></section></main>;
}
