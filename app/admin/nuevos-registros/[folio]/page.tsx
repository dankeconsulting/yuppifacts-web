import AdminRegistrationReview from "@/components/admin-registration-review";
export default async function RegistrationReviewPage({params}:{params:Promise<{folio:string}>}){const{folio}=await params;return <AdminRegistrationReview folio={folio}/>}
