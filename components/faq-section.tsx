"use client";

import { ChevronDown, CircleHelp } from "lucide-react";
import { useId, useState } from "react";
import "./faq-section.css";
import "./faq-answer-size-adjustment.css";

type Faq = { question: string; answer: React.ReactNode };

const spanishFaqs: Faq[] = [
  { question: "¿Cómo se contabilizan las solicitudes de facturación?", answer: <> <p>Cada solicitud válida de facturación registrada consume una unidad de la cuota mensual contratada.</p><p>Los archivos ilegibles, las solicitudes no procesadas por errores técnicos y los intentos fallidos no consumen cuota.</p><p>Las solicitudes no utilizadas no son acumulables y vencen al finalizar el periodo mensual correspondiente.</p></> },
  { question: "¿Qué sucede si alcanzo mi límite mensual de solicitudes?", answer: <> <p>Al alcanzar la cuota mensual contratada, no podrás registrar nuevas solicitudes hasta el inicio del siguiente periodo.</p><p>Sin embargo, podrás continuar consultando y descargando las facturas PDF y XML que ya tengas almacenadas en YuppiFacts®.</p></> },
  { question: "¿La inteligencia artificial está incluida en mi membresía?", answer: <> <p>YuppiFacts® permite utilizar inteligencia artificial mediante tu propia API Key.</p><p>El servicio y consumo de inteligencia artificial no están incluidos en el precio de la membresía.</p><p>Cada cliente administra y cubre directamente los costos de su proveedor de inteligencia artificial.</p></> },
  { question: "¿Cuándo comienza a funcionar mi membresía?", answer: <> <p>Después de realizar tu contratación, tu cuenta entra en un proceso de revisión, configuración y activación.</p><p>La activación de tu cuenta puede tardar de 72 horas hábiles a 7 días hábiles, según el alcance de las solicitudes y el proceso de validación.</p><p>La vigencia de tu membresía comenzará únicamente cuando YuppiFacts® confirme la activación de tu cuenta, no desde el momento del pago.</p></> },
  { question: "¿Qué diferencia existe entre los planes?", answer: <><p>Cada membresía está diseñada para un perfil específico.</p><ul><li><strong>Persona Física:</strong> 1 asiento de trabajo; hasta 300 solicitudes mensuales.</li><li><strong>Contador Independiente:</strong> 1 asiento de trabajo; hasta 100 contribuyentes; hasta 200 solicitudes por contribuyente al mes; hasta 20,000 solicitudes mensuales.</li><li><strong>Despacho Contable:</strong> 2 asientos de trabajo; hasta 500 contribuyentes; hasta 300 solicitudes por contribuyente al mes; hasta 150,000 solicitudes mensuales.</li><li><strong>Empresa:</strong> 1 empresa fiscal; 2 asientos de trabajo; hasta 5,000 solicitudes mensuales.</li><li><strong>Corporativo:</strong> 1 empresa fiscal con hasta 2 sucursales adicionales; 1 asiento de trabajo por unidad operativa, incluida la matriz; hasta 12,000 solicitudes mensuales compartidas.</li></ul><p>Todas las cuotas son mensuales y no acumulables.</p></> },
  { question: "¿Puedo consultar y descargar mis facturas?", answer: <p>Sí. YuppiFacts® permite consultar y descargar los archivos PDF y XML de las facturas recibidas desde el panel correspondiente, conforme a los permisos de cada usuario.</p> },
  { question: "¿Puedo cambiar de plan?", answer: <p>La posibilidad de cambiar de membresía y las condiciones aplicables dependerán de las opciones de contratación y actualización habilitadas por YuppiFacts®.</p> },
  { question: "¿Puedo cancelar mi membresía cuando quiera?", answer: <> <p>Sí. Puedes solicitar la cancelación de tu membresía en cualquier momento.</p><p>Si todavía tienes días disponibles de tu periodo contratado, podrás continuar utilizando YuppiFacts® hasta el último día de vigencia.</p><p>La cancelación evita futuras renovaciones, pero no interrumpe el servicio correspondiente al periodo ya pagado.</p></> },
  { question: "¿YuppiFacts® realiza reembolsos?", answer: <> <p>Como regla general, los pagos realizados por membresías no son reembolsables.</p><p>Si decides cancelar antes del vencimiento, podrás continuar utilizando el servicio hasta finalizar el periodo contratado.</p><p>Lo anterior se aplicará sin perjuicio de los derechos de reembolso que correspondan conforme a la legislación vigente.</p></> },
];

const englishFaqs: Faq[] = [
  { question: "How are invoicing requests counted?", answer: <><p>Each valid invoicing request registered consumes one unit of the contracted monthly allowance.</p><p>Unreadable files, requests that are not processed due to technical errors, and failed attempts do not consume the allowance.</p><p>Unused requests do not roll over and expire at the end of the applicable monthly period.</p></> },
  { question: "What happens if I reach my monthly request limit?", answer: <><p>Once you reach your contracted monthly allowance, you will not be able to register new requests until the next period begins.</p><p>You can still view and download the PDF and XML invoices already stored in YuppiFacts®.</p></> },
  { question: "Is artificial intelligence included in my membership?", answer: <><p>YuppiFacts® lets you use artificial intelligence with your own API Key.</p><p>Artificial intelligence service and consumption are not included in the membership price.</p><p>Each customer manages and pays their artificial-intelligence provider directly.</p></> },
  { question: "When does my membership begin to work?", answer: <><p>After contracting, your account enters a review, configuration, and activation process.</p><p>Account activation may take from 72 business hours to 7 business days, depending on the scope of requests and the validation process.</p><p>Your membership term begins only when YuppiFacts® confirms the activation of your account, not from the time of payment.</p></> },
  { question: "What is the difference between plans?", answer: <><p>Each membership is designed for a specific profile.</p><ul><li><strong>Individual:</strong> 1 workspace seat; up to 300 monthly requests.</li><li><strong>Independent Accountant:</strong> 1 workspace seat; up to 100 taxpayers; up to 200 requests per taxpayer per month; up to 20,000 monthly requests.</li><li><strong>Accounting Firm:</strong> 2 workspace seats; up to 500 taxpayers; up to 300 requests per taxpayer per month; up to 150,000 monthly requests.</li><li><strong>Business:</strong> 1 tax entity; 2 workspace seats; up to 5,000 monthly requests.</li><li><strong>Corporate:</strong> 1 tax entity with up to 2 additional branches; 1 workspace seat per operating unit, including headquarters; up to 12,000 shared monthly requests.</li></ul><p>All allowances are monthly and do not roll over.</p></> },
  { question: "Can I view and download my invoices?", answer: <p>Yes. YuppiFacts® lets you view and download PDF and XML files for received invoices from the appropriate panel, according to each user’s permissions.</p> },
  { question: "Can I change plans?", answer: <p>The ability to change membership and the applicable conditions depend on the contracting and upgrade options enabled by YuppiFacts®.</p> },
  { question: "Can I cancel my membership at any time?", answer: <><p>Yes. You may request cancellation of your membership at any time.</p><p>If days remain in your contracted period, you may continue using YuppiFacts® until its final day.</p><p>Cancellation prevents future renewals, but does not interrupt service for the period already paid.</p></> },
  { question: "Does YuppiFacts® issue refunds?", answer: <><p>As a general rule, membership payments are non-refundable.</p><p>If you cancel before expiration, you may continue using the service until the contracted period ends.</p><p>This is without prejudice to any refund rights that apply under current law.</p></> },
];

export default function FaqSection({ locale = "es" }: { locale?: "es" | "en" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingId = useId();
  const faqs = locale === "en" ? englishFaqs : spanishFaqs;

  return <section id="preguntas-frecuentes" className="landing-faq" aria-labelledby={headingId}>
    <div className="landing-faq-heading">
      <p className="eyebrow"><CircleHelp size={15} /> {locale === "en" ? "FREQUENTLY ASKED QUESTIONS" : "PREGUNTAS FRECUENTES"}</p>
      <h2 id={headingId}>{locale === "en" ? <>Questions, <span>answered clearly.</span></> : <>Resolvemos tus <span>preguntas.</span></>}</h2>
      <p>{locale === "en" ? "Learn how memberships, requests, activation and renewals work." : "Conoce cómo funcionan las membresías, solicitudes, activación y renovaciones."}</p>
    </div>
    <div className="landing-faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;
        return <article className={`landing-faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
          <h3>
            <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(current => current === index ? null : index)}>
              <span><i>{String(index + 1).padStart(2, "0")}</i>{faq.question}</span>
              <b aria-hidden="true"><ChevronDown size={20} /></b>
            </button>
          </h3>
          <div id={answerId} className="landing-faq-answer" aria-hidden={!isOpen}>
            <div>{faq.answer}</div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
