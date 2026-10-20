type Props = { className?: string };

/** Official YuppiFacts mark; reuse it for every branded surface. */
export default function YuppiFactsLogo({ className = "" }: Props) {
  return <span className={`yuppifacts-logo-mark ${className}`} aria-hidden="true"><img src="/brand/yuppifacts-y.svg" alt="" /></span>;
}
