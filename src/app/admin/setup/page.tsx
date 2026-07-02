import { Suspense } from "react";
import SetupContent from "./content";

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="text-sm text-zinc-500">Carregando...</div></div>}>
      <SetupContent />
    </Suspense>
  );
}
