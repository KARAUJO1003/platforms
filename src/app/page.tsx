import Link from "next/link";
import { SubdomainForm } from "../components/subdomain/subdomain-form";
import { rootDomain } from "@/lib/utils";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  p-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground transition-colors"
        >
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight ">
            Domínio {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Crie seu próprio subdomínio com um emoji personalizado
          </p>
        </div>

        <div className="mt-8 bg-card shadow-md rounded-lg p-6">
          <SubdomainForm />
        </div>
      </div>
    </div>
  );
}
