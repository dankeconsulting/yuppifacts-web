import TicketPaymentGate from "@/components/ticket-payment-gate";

export const metadata = {
  title: "Comprobación de pago | YuppiFacts®",
  description: "Adjunta tu comprobante para validar tu contratación promocional de YuppiFacts.",
};

export default function TicketsPage() {
  return <TicketPaymentGate />;
}
