import OnboardingFlow from "@/components/onboarding-flow";
export default async function OnboardingPage({searchParams}:{searchParams:Promise<{folio?:string}>}){const{folio}=await searchParams;return <OnboardingFlow folio={folio??""}/>}
