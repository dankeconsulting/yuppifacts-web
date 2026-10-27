"use client";
import { CheckCircle2, CircleDotDashed, XCircle } from "lucide-react";
import { useState } from "react";
import "./admin-user-lifecycle.css";

type User={id:string;lifecycleStatus:string};
const api=(process.env.NEXT_PUBLIC_API_URL??"").replace(/\/$/,"");
export default function AdminUserLifecycle({user,onSaved,onError}:{user:User;onSaved:(user:User)=>void;onError:(message:string)=>void}){
  const[busy,setBusy]=useState(false);
  const action=user.lifecycleStatus==="voucher_submitted"?{endpoint:"validate",title:"Validación de pago",body:"Revisa el comprobante adjunto y valida el pago para mover\neste registro a Usuarios en revisión.",label:"Validar pago",icon:CheckCircle2}:user.lifecycleStatus==="payment_verified"?{endpoint:"approve",title:"Activación de cuenta",body:"La cuenta pasará a Usuarios y permanecerá fuera de línea hasta que la habilites con el switch de visibilidad.",label:"Activar cuenta",icon:CircleDotDashed}:null;
  if(!action)return null;
  const Icon=action.icon;
  const submit=async()=>{setBusy(true);onError("");try{const token=sessionStorage.getItem("yuppifacts.access")??"";const r=await fetch(`${api}/v1/admin/subscribers/${user.id}/${action.endpoint}`,{method:"POST",headers:{"x-application-token":token}}),b=await r.json();if(!r.ok)throw Error(b.error);onSaved(b.subscriber)}catch(e){onError(e instanceof Error?e.message:"No fue posible actualizar el registro.")}finally{setBusy(false)}};
  return <section className="admin-user-lifecycle"><span><Icon size={22}/></span><div><h2>{action.title}</h2><p>{action.body.split("\n").map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</p></div><div className="admin-user-lifecycle-actions">{user.lifecycleStatus==="voucher_submitted"&&<button className="admin-user-lifecycle-reject" type="button" disabled={busy} onClick={()=>undefined}><XCircle size={16}/>No válido</button>}<button className="admin-user-lifecycle-approve" disabled={busy} onClick={()=>void submit()}><CheckCircle2 size={16}/>{busy?"Guardando…":action.label}</button></div></section>;
}
