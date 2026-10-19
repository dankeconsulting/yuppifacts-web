"use client";

import { FileText, ListChecks, QrCode, Sparkles } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./how-timeline.module.css";

const steps = [
  { number: "01", icon: QrCode, title: "Carga tu ticket o escanea el QR", description: "Sube un JPG, PNG, PDF o pega el enlace oficial de facturación." },
  { number: "02", icon: ListChecks, title: "Elige tu perfil fiscal", description: "YuppiFacts utiliza solo los datos del RFC que autorizaste para esa solicitud." },
  { number: "03", icon: Sparkles, title: "La IA prepara, tú confirmas", description: "Detectamos requisitos del proveedor, proponemos el llenado y señalamos lo que falta." },
  { number: "04", icon: FileText, title: "Recibe y organiza tus facturas", description: "Vincula XML y PDF al ticket, contribuyente y periodo correcto." },
];

export default function HowTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [lineLength, setLineLength] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const nodes = Array.from(section.querySelectorAll<HTMLElement>(`[data-timeline-step]`));
      const threshold = window.innerHeight * 0.62;
      const rects = nodes.map(node => node.getBoundingClientRect());
      const centers = rects.map(rect => {
        return rect.top + rect.height / 2;
      });
      const start = centers[0];
      const isCompact = window.matchMedia("(max-width: 600px)").matches;
      const lastParagraph = nodes[nodes.length - 1]?.querySelector<HTMLElement>("p");
      const end = isCompact && lastParagraph ? lastParagraph.getBoundingClientRect().bottom : centers[centers.length - 1];
      const nextProgress = Math.min(1, Math.max(0, (threshold - start) / (end - start)));
      const nextStep = centers.reduce((last, center, index) => center <= threshold ? index : last, -1);
      setActiveStep(current => current === nextStep ? current : nextStep);
      setProgress(current => Math.abs(current - nextProgress) < .001 ? current : nextProgress);
      setLineLength(current => Math.abs(current - (end - start)) < 1 ? current : end - start);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section id="como-funciona" className={styles.how} ref={sectionRef}>
    <p className="eyebrow">CÓMO FUNCIONA</p>
    <h2>Lo repetitivo lo hace YuppiFacts.<br />La decisión sigue siendo tuya.</h2>
    <div className={styles.stepList} style={{ "--timeline-progress": progress, "--timeline-length": `${lineLength}px` } as CSSProperties}>
      {steps.map(({ number, icon: Icon, title, description }, index) => <article className={`${styles.step} ${index <= activeStep ? styles.active : ""}`} data-timeline-step key={number}>
        <span className={styles.stepIcon}><Icon size={24} /></span>
        <div className={styles.stepContent}>
          <span className={styles.stepNumber}>Paso&nbsp; {number}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>)}
    </div>
  </section>;
}
