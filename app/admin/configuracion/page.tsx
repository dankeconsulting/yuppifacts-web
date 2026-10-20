import Link from "next/link";
import { ArrowRight, CreditCard, ReceiptText, TicketCheck } from "lucide-react";
import "@/components/admin-settings.css";

export default function AdminConfigurationPage() {
  return <main className="admin-settings-page">
    <header><p className="eyebrow">ADMINISTRADOR MAESTRO · CONFIGURACIÓN</p><h1>Configuración</h1><p>Administra los cobros y la oferta promocional de YuppiFacts.</p></header>
    <section className="admin-settings-row"><div><h2>Mercado Pago</h2><p>Credenciales cifradas, ambientes de prueba y producción, y estado de conexión.</p></div><article className="admin-settings-card"><span className="admin-settings-icon"><CreditCard size={21} /></span><div><b>Mercado Pago</b><p>Configura Public Key y Access Token para cobrar suscripciones promocionales.</p></div><Link href="/admin/configuracion/pagos">Ir a Mercado Pago <ArrowRight size={16} /></Link></article></section>
    <section className="admin-settings-row"><div><h2>Planes YuppiFacts</h2><p>Define qué catálogo estará disponible durante el registro promocional.</p></div><div className="admin-settings-choice-grid"><Link href="/admin/configuracion/promocion" className="admin-settings-choice"><span><TicketCheck size={20} /></span><b>Planes Promo</b><p>Configura cupo, vigencia y fechas de la promoción activa.</p><small>Configurar promoción <ArrowRight size={14} /></small></Link><Link href="/admin/configuracion/planes" className="admin-settings-choice"><span><ReceiptText size={20} /></span><b>Planes oficiales</b><p>Administra nombres, precios y la visibilidad de los planes promocionales.</p><small>Ver matriz de planes <ArrowRight size={14} /></small></Link></div></section>
  </main>;
}
