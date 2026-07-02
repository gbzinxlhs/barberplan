import { Suspense } from "react";
import { SaasUserProvider } from "@/contexts/saas-user";
import CheckoutContent from "./content";

export default function CheckoutPage() {
  return (
    <SaasUserProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-zinc-500 text-sm">Carregando...</div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </SaasUserProvider>
  );
}
