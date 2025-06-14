"use client"; // Error boundaries must be Client Components
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Oops! Algo deu errado (Global)
            </h1>
            <p className="text-xl text-muted-foreground">
              Desculpe, encontramos um problema inesperado. Nossa equipe já foi
              notificada.
            </p>
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Enquanto trabalhamos na solução, você pode tentar:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recarregar a página
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Voltar à página inicial
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-8">
              Se o problema persistir, por favor entre em contato com nosso
              suporte.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
