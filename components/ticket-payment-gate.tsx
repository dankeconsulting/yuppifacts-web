"use client";
import Link from "next/link";
import { CheckCircle2, TicketCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./ticket-payment-gate.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export default function TicketPaymentGate() {
  const [hash,setHash]=useState("");const [verified,setVerified]=useState(false);const [checking,setChecking]=useState(true);
  useEffect(()=>{const nextHash=window.location.hash;setHash(nextHash);const value=new URLSearchParams(nextHash.slice(1)).get("promo");const [promotionId,promotionToken]=value?.split(".")??[];if(!promotionId||!promotionToken||!api){setChecking(false);return;}fetch(`${api}/v1/promotions/contracts/${promotionId}/payment-status`,{headers:{"x-promotion-token":promotionToken}}).then(response=>response.ok?response.json():null).then((body:{canSubmitVoucher?:boolean}|null)=>setVerified(body?.canSubmitVoucher===true)).finally(()=>setChecking(false));},[]);
  return <main className="ticket-gate"><section><header><Link href="https://yuppifacts.com" className="ticket-gate-brand"><span>Y</span>YuppiFacts<sup>®</sup></Link></header><div className="ticket-gate-body"><span className="ticket-gate-icon"><TicketCheck /></span><p className="ticket-gate-eyebrow">VALIDACIÓN DE SUSCRIPCIÓN</p><h1>{verified?"Tu pago fue validado.":"Estamos validando tu pago."}</h1><p>{verified?"Ya puedes enviar el comprobante de tu contratación promocional.":"Esperamos la confirmación de Mercado Pago. Esta pantalla se actualizará cuando el pago quede validado."}</p><div className="ticket-gate-note"><CheckCircle2 />El envío de comprobante se habilita únicamente después de validar el pago.</div>{verified?<Link className="ticket-gate-primary" href={`/tickets/comprobante${hash}`}>Ya pagué: enviar comprobante</Link>:<span className="ticket-gate-primary disabled">{checking?"Validando pago…":"Pago pendiente de validación"}</span>}<Link className="ticket-gate-cancel" href="https://yuppifacts.com"><X size={17} />Cancelar</Link></div></section><footer className="ticket-page-footer">© 2024 – 2026 YuppiFacts<sup>®</sup>. Todos los derechos reservados. <Link href="/privacidad">| Política de Privacidad</Link> <Link href="/terminos">| Condiciones de Servicio</Link></footer></main>;
}
