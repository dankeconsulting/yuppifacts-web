import Link from "next/link";
import { ChevronDown, Instagram, Linkedin, MapPin, Youtube } from "lucide-react";
import "./public-process-footer.css";

export default function PublicProcessFooter(){return <footer className="public-process-footer"><div className="public-process-footer-tools"><a href="https://instagram.com/yuppifacts" aria-label="Instagram"><Instagram /></a><a href="https://linkedin.com/company/yuppifacts" aria-label="LinkedIn"><Linkedin /></a><a href="https://youtube.com/@yuppifacts" aria-label="YouTube"><Youtube /></a><label><MapPin /><select aria-label="País"><option>MX · México</option><option>CO · Colombia</option><option>CR · Costa Rica</option></select><ChevronDown /></label></div><p>© 2024 – 2026 YuppiFacts<sup>®</sup>. Todos los derechos reservados. <Link href="https://yuppifacts.com/privacidad">| Política de Privacidad</Link> <Link href="https://yuppifacts.com/terminos">| Condiciones de Servicio</Link></p></footer>}
