type CountryFlagProps = { code: string; className?: string };

const emoji: Record<string, string> = { co: "🇨🇴", cr: "🇨🇷", es: "🇪🇸", pa: "🇵🇦" };

/** A local rendering keeps the Mexican coat of arms visible on every platform. */
export default function CountryFlag({ code, className = "" }: CountryFlagProps) {
  const country = code.toLowerCase();
  return <span className={`yf-country-flag ${className}`} aria-hidden="true">
    {country === "mx" ? <svg viewBox="0 0 36 24" focusable="false">
      <path fill="#006847" d="M0 0h12v24H0z" /><path fill="#fff" d="M12 0h12v24H12z" /><path fill="#ce1126" d="M24 0h12v24H24z" />
      <g transform="translate(18 12) scale(1.22)"><path fill="#55713e" d="M-4.6 4.8c1.2 1.3 2.9 2 4.6 2s3.4-.7 4.6-2l-.5 1.9C1.5 8.5-1.5 8.5-4.1 6.7z"/><path fill="#986b36" stroke="#6c4728" strokeWidth=".38" d="M-.5-6C2.5-6.2 4.3-4.6 4-2.1c-.1 1.4-1.1 2.7-2.7 3.3l.3 2.2-1.8-1.1-1.5.9.5-2.5c-1.7-.6-2.6-2-2.4-3.5.2-1.8 1.3-2.9 3.1-3z"/><path fill="#d4ad4f" d="M-1.9-4.4 0-5.9l1.8 1.5-1.1 1H-.8z"/><path fill="#b88a3d" d="m2.7-.7 2 .7-2 .7z"/><circle cx=".7" cy="-2.4" r=".48" fill="#17130d"/><path fill="none" stroke="#2f653a" strokeWidth=".85" strokeLinecap="round" d="M-5.1 2.3C-3.3 4.2-1.3 4.8 0 4.6M5.1 2.3C3.3 4.2 1.3 4.8 0 4.6"/></g>
    </svg> : emoji[country] ?? ""}
  </span>;
}
