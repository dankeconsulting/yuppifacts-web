import RegistrationPayment from "@/components/registration-payment";
export default async function RegistrationPaymentPage({params}:{params:Promise<{folio:string}>}){const{folio}=await params;return <RegistrationPayment folio={folio}/>}
