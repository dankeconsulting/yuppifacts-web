type CountryFlagProps = { code: string; className?: string };

const emoji: Record<string, string> = { co: "🇨🇴", cr: "🇨🇷", es: "🇪🇸", pa: "🇵🇦" };

/** A local rendering keeps the Mexican coat of arms visible on every platform. */
export default function CountryFlag({ code, className = "" }: CountryFlagProps) {
  const country = code.toLowerCase();
  return <span className={`yf-country-flag ${className}`} aria-hidden="true">
    {country === "mx" ? <svg viewBox="0 0 36 24" focusable="false">
      <path fill="#006847" d="M0 0h12v24H0z" /><path fill="#fff" d="M12 0h12v24H12z" /><path fill="#ce1126" d="M24 0h12v24H24z" />
      <g transform="translate(18 12)"><path fill="#62743d" d="M-4.7 5.2C-2.7 7.2 2.7 7.2 4.7 5.2l-.6 1.6c-2.7 1.7-5.5 1.7-8.2 0z" /><path fill="#8a6434" d="M-.7-5.8c2.4-.3 4 1.1 3.7 3.1-.1 1.2-1 2.5-2.5 3.1l.3 2.3-1.8-1.1-1.3.8.4-2.4c-1.4-.7-2.1-1.8-2-3.1.1-1.5 1.3-2.7 3.2-2.7z" /><path fill="#c49a4b" d="M-1.7-4.2 0-5.6l1.6 1.3-1 .8H-.7z" /><path fill="none" stroke="#365d34" strokeWidth=".8" strokeLinecap="round" d="M-5.1 2.6c1.7 1.5 3.6 2 5.1 1.8M5.1 2.6C3.4 4.1 1.5 4.6 0 4.4" /><circle cx=".5" cy="-2.2" r=".45" fill="#111" /></g>
    </svg> : emoji[country] ?? ""}
  </span>;
}
