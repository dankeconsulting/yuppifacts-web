import PromotionFlow from "@/components/promotion-flow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promoción | YuppiFacts AI®",
  description: "Ecosistema inteligente para la solicitud y gestión de facturas de negocios y proveedores.",
  openGraph: {
    title: "Promoción | YuppiFacts AI®",
    description: "Ecosistema inteligente para la solicitud y gestión de facturas de negocios y proveedores.",
    url: "https://promo.yuppifacts.com",
    siteName: "YuppiFacts AI®",
    type: "website",
  },
};
export default function PromotionPage() { return <PromotionFlow />; }
