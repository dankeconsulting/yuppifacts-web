"use client";

import { ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import "./promotion-plan-matrix.css";

export default function PlanDeleteModal({name,busy,onClose,onConfirm}:{name:string;busy:boolean;onClose:()=>void;onConfirm:(pin:string)=>Promise<void>}){
  const [pin,setPin]=useState(""); const [error,setError]=useState("");
  const submit=async()=>{if(pin.length!==4)return;setError("");try{await onConfirm(pin);}catch(reason){setError(reason instanceof Error?reason.message:"No fue posible eliminar este registro.");}};
  return <div className="catalog-delete-backdrop" role="presentation"><section className="catalog-delete-modal" role="dialog" aria-modal="true" aria-labelledby="plan-delete-title"><button className="catalog-delete-close" onClick={onClose} disabled={busy} aria-label="Cerrar"><X size={20}/></button><span className="catalog-delete-warning"><ShieldAlert size={23}/></span><h2 id="plan-delete-title">¿Eliminar {name}?</h2><p>Se eliminará esta tarjeta y toda su información. Esta acción no se puede recuperar.</p><label><span>PIN del Administrador Maestro</span><input autoFocus type="password" maxLength={4} value={pin} onChange={event=>setPin(event.target.value.replace(/\D/g,"").slice(0,4))} inputMode="numeric" placeholder="••••"/></label>{error?<em>{error}</em>:null}<footer><button onClick={onClose} disabled={busy}>Cancelar</button><button className="catalog-delete-confirm" disabled={busy||pin.length!==4} onClick={()=>void submit()}>{busy?"Eliminando…":"Eliminar"}</button></footer></section></div>;
}
