"use client";

import { useEffect, useState } from "react";

export type LandingLocale = "es" | "en";

export function useLandingLocale() {
  const [locale, setLocale] = useState<LandingLocale>("es");

  useEffect(() => {
    const sync = () => setLocale(localStorage.getItem("yf-language") === "en" ? "en" : "es");
    sync();
    window.addEventListener("yf-language-change", sync);
    return () => window.removeEventListener("yf-language-change", sync);
  }, []);

  return locale;
}
