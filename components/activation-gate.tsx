"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {LockKeyhole} from "lucide-react";
import Workspace from "./workspace";
import {readRegistrations,type Registration} from "@/lib/preregistration";
import "./preregistration.css";
export default function ActivationGate(){const[registration,setRegistration]=useState<Registration|undefined>();const[ready,setReady]=useState(false);useEffect(()=>{setRegistration(readRegistrations().find(item=>item.status==="active"&&item.isOnline));setReady(true)},[]);if(!ready)return null;if(registration)return <Workspace mode="subscriber"/>;return <main className="stage-page"><section className="empty-stage"><LockKeyhole size={34}/><h1>Tu espacio de trabajo aún no está habilitado</h1><p>El acceso operativo sólo se habilita después de verificar el pago, aprobar el prerregistro, completar el expediente, autorizarlo y poner la cuenta en línea.</p><Link className="button" href="/registro">Iniciar prerregistro</Link></section></main>}
