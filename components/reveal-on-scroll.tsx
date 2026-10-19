"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./reveal-on-scroll.module.css";

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
};

export default function RevealOnScroll({ children, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`${styles.reveal} ${visible ? styles.visible : ""}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
