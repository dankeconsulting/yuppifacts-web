import type { Metadata } from "next";
import "./globals.css";
import "@/components/public.css";
import "@/components/preregistration.css";
import "@/components/access.css";
import "@/components/wizard.css";

export const metadata: Metadata = {
  title: "YuppiFacts | Solicita y organiza tus facturas",
  description: "Gestión segura de solicitudes de factura y documentos fiscales."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
