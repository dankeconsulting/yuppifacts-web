import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "@/components/public.css";
import "@/components/preregistration.css";
import "@/components/access.css";
import "@/components/form-field-adjustments.css";
import "@/components/wizard.css";
import ConsentLayer from "@/components/consent-layer";

const landingMetadata: Metadata = {
  title: "Promoción | YuppiFacts AI®",
  description: "Ecosistema inteligente para la solicitud y gestión de facturas de negocios y proveedores.",
  openGraph: {
    title: "Promoción | YuppiFacts AI®",
    description: "Ecosistema inteligente para la solicitud y gestión de facturas de negocios y proveedores.",
    url: "https://yuppifacts.com",
    siteName: "YuppiFacts AI®",
    type: "website",
  },
};

const defaultMetadata: Metadata = {
  title: "YuppiFacts AI® | Solicita y organiza tus facturas",
  description: "Gestión segura de solicitudes de factura y documentos fiscales.",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const hostname = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "").split(":")[0].toLowerCase();
  return hostname === "yuppifacts.com" || hostname === "www.yuppifacts.com" ? landingMetadata : defaultMetadata;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const hostname = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
  const isPublicLandingHost = hostname === "yuppifacts.com" || hostname === "www.yuppifacts.com";

  return <html lang="es-MX"><body>{children}<ConsentLayer isPublicLandingHost={isPublicLandingHost} /></body></html>;
}
