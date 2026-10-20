import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MercadoPagoSettings from "@/components/mercado-pago-settings";
import "@/components/admin-payment-return.css";
import "@/components/admin-payment-dark.css";
export default function PaymentConfigurationPage(){return <><div className="mp-return"><Link href="/admin/configuracion"><ArrowLeft size={16}/> Volver a Configuración</Link></div><MercadoPagoSettings/></>}
