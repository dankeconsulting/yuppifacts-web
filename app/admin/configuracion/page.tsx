import Link from "next/link";
import { ArrowRight, CreditCard, LayoutPanelTop, ReceiptText, TicketCheck } from "lucide-react";
import "@/components/admin-settings.css";

export default function AdminConfigurationPage() {
  return <main className="admin-settings-page">
    <header><p className="eyebrow">ADMINISTRADOR MAESTRO · CONFIGURACIÓN</p><h1>Configuración</h1><p>Administra los cobros y la oferta promocional de YuppiFacts.</p></header>
    <section className="admin-settings-row"><div><h2>Mercado Pago</h2><p>Credenciales cifradas, ambientes de prueba y producción, y estado de conexión.</p></div><article className="admin-settings-card"><span className="admin-settings-icon"><CreditCard size={21} /></span><div><b>Mercado Pago</b><p>Configura Public Key y Access Token para cobrar suscripciones promocionales.</p></div><Link href="/admin/configuracion/pagos">Ir a Mercado Pago <ArrowRight size={16} /></Link></article></section>
    <section className="admin-settings-row"><div><h2>Planes YuppiFacts</h2><p>Define los catálogos que utiliza promo.yuppifacts.com.</p></div><div className="admin-settings-choice-grid"><Link href="/admin/configuracion/promocion" className="admin-settings-choice"><span><TicketCheck size={20} /></span><b>Planes Promo</b><p>Configura cupo, vigencia, fechas y la matriz de la promoción activa.</p><small>Configurar Planes Promo <ArrowRight size={14} /></small></Link><Link href="/admin/configuracion/planes" className="admin-settings-choice"><span><ReceiptText size={20} /></span><b>Planes Regulares</b><p>Administra nombres, precios y periodicidades de los planes regulares.</p><small>Ver Planes Regulares <ArrowRight size={14} /></small></Link></div></section>
    <section className="admin-settings-row"><div><h2>Planes Landing</h2><p>Controla exclusivamente los precios públicos que se muestran en yuppifacts.com.</p></div><article className="admin-settings-card"><span className="admin-settings-icon"><LayoutPanelTop size={21} /></span><div><b>Planes Landing</b><p>Configura cinco tarjetas, sus importes y las periodicidades que verá la página principal.</p></div><Link href="/admin/configuracion/landing">Configurar Planes Landing <ArrowRight size={16} /></Link></article></section>
  </main>;
}
