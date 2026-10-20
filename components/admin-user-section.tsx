import { Users } from "lucide-react";

export default function AdminUserSection({ title, description }: { title: string; description: string }) {
  return <main className="admin-user-section"><p className="eyebrow">ADMINISTRADOR MAESTRO · USUARIOS</p><h1>{title}</h1><p>{description}</p><section><Users size={25} /><div><b>Sin datos ficticios</b><p>Cuando existan registros reales en el servidor, aparecerán aquí para su gestión.</p></div></section></main>;
}
