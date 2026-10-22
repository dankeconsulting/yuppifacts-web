type Props = { className?: string };

/** Official YuppiFacts mark; reuse it for every branded surface. */
export default function YuppiFactsLogo({ className = "" }: Props) {
  return <span className={`yuppifacts-logo-mark ${className}`} aria-hidden="true"><img className="yuppifacts-logo-dark" src="/brand/yuppifacts-iso-dark.svg" alt="" /><img className="yuppifacts-logo-light" src="/brand/yuppifacts-iso-light.svg" alt="" /></span>;
}
