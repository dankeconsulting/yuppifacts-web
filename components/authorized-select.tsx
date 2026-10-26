"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./authorized-select.css";

type Option = { value: string; label: string };

export default function AuthorizedSelect({ value, options, placeholder = "Seleccionar…", onChange, ariaLabel }: { value: string; options: Option[]; placeholder?: string; onChange: (value: string) => void; ariaLabel: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="authorized-select" ref={ref}>
    <button type="button" className={!selected ? "placeholder" : ""} aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{selected?.label ?? placeholder}<ChevronDown size={17} /></button>
    {open && <div role="listbox">{options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}</div>}
  </div>;
}
