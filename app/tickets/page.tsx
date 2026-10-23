import TicketPaymentGate from "@/components/ticket-payment-gate";

export const metadata = {
  title: "Comprobación de pago | YuppiFacts AI®",
  description: "Adjunta tu comprobante para validar tu contratación promocional de YuppiFacts AI®.",
};

export default function TicketsPage() {
  return <TicketPaymentGate />;
}
