import Link from "next/link";
import "./public-process-footer.css";

export default function PublicProcessFooter({ variant }: { variant?: "promotion" } = {}){
  if(variant === "promotion") return <footer className="public-process-footer public-process-footer-promotion"><span>©2026 YuppiFacts<sup>®</sup>. Todos los derechos reservados.</span>{" "}<nav><Link href="https://yuppifacts.com/privacidad">Política de Privacidad</Link><span className="promotion-footer-divider" aria-hidden="true"> | </span><Link href="https://yuppifacts.com/terminos">Condiciones de Servicio</Link></nav></footer>;
  return <footer className="public-process-footer"><p><span>©2026 YuppiFacts<sup>®</sup>. Todos los derechos reservados.</span> <span><Link href="https://yuppifacts.com/privacidad">Política de Privacidad</Link><Link href="https://yuppifacts.com/terminos">Condiciones de Servicio</Link></span></p></footer>;
}
