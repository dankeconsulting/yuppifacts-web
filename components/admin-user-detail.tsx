"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

type Subscriber = {
  id: string;
  userNumber: number | null;
  recordNumber: number;
  isTemporary: boolean;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  state: string | null;
  city: string | null;
  profile: string;
  registeredAt: string;
};

const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const formatDate = (value: string) => new Intl.DateTimeFormat("es-MX", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
}).format(new Date(value));

export default function AdminUserDetail({ id }: { id: string }) {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!api) {
        if (active) { setError("No fue posible conectar con el servicio de usuarios."); setLoading(false); }
        return;
      }
      try {
        const token = sessionStorage.getItem("yuppifacts.access") ?? "";
        const responses = await Promise.all(["new", "review", "active"].map(async stage => {
          const response = await fetch(`${api}/v1/admin/subscribers?stage=${stage}`, { cache: "no-store", headers: { "x-application-token": token } });
          const body = await response.json().catch(() => ({})) as { subscribers?: Subscriber[]; error?: string };
          if (!response.ok) throw new Error(body.error ?? "No fue posible cargar la ficha del usuario.");
          return body.subscribers ?? [];
        }));
        const item = responses.flat().find(candidate => candidate.id === id) ?? null;
        if (active) { setSubscriber(item); setError(item ? "" : "No encontramos este usuario. Puede haber sido eliminado."); }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "No fue posible cargar la ficha del usuario.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <main className="admin-user-detail"><p className="admin-user-detail-status">Cargando ficha del usuario…</p></main>;
  if (!subscriber) return <main className="admin-user-detail"><section className="admin-user-detail-empty"><UserRound size={34}/><h1>Ficha no disponible</h1><p>{error || "No fue posible cargar este usuario."}</p><Link href="/admin/usuarios-nuevos"><ArrowLeft size={17}/>Volver a usuarios nuevos</Link></section></main>;

  const location = subscriber.city ? `${subscriber.city}, ${subscriber.state ?? "México"}` : subscriber.state ?? "México";
  return <main className="admin-user-detail">
    <header className="admin-user-detail-header">
      <div><p className="eyebrow">MÉXICO · ADMINISTRADOR MAESTRO</p><h1>Ficha del usuario</h1><p>Información de la suscripción y datos registrados.</p></div>
      <Link href="/admin/usuarios-nuevos" className="admin-user-back"><ArrowLeft size={17}/>Volver a usuarios</Link>
    </header>
    <section className="admin-user-detail-card">
      <header><span className="admin-user-detail-avatar"><UserRound size={30}/></span><div><h2>{subscriber.fullName || "Usuario sin nombre"}</h2><p>{subscriber.isTemporary ? "Registro temporal" : subscriber.role}</p></div></header>
      <dl>
        <div><dt><Mail size={17}/>Correo electrónico</dt><dd>{subscriber.email || "No registrado"}</dd></div>
        <div><dt><Phone size={17}/>WhatsApp</dt><dd>{subscriber.phone || "No registrado"}</dd></div>
        <div><dt><UserRound size={17}/>Perfil / modo</dt><dd>{subscriber.profile || "No registrado"}</dd></div>
        <div><dt><MapPin size={17}/>Ubicación</dt><dd>{location}</dd></div>
        <div><dt><CalendarDays size={17}/>Fecha de registro</dt><dd>{formatDate(subscriber.registeredAt)}</dd></div>
      </dl>
    </section>
  </main>;
}
