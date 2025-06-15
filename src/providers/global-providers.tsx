"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalProvider } from "./modal-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ProgressBarProvider } from "@/contexts/progress-bar-context";
import { ProgressBar } from "@/components/extensions/progress-bar";
import { AuthProvider } from "@/contexts/auth-context";
import { AbilityProvider } from "@/contexts/abilities";

export const queryClient = new QueryClient();

export const GlobalProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AbilityProvider>
            <NuqsAdapter>
              <ModalProvider>
                <ProgressBarProvider>
                  <ProgressBar />
                  {children}
                </ProgressBarProvider>
              </ModalProvider>
              <ReactQueryDevtools
                initialIsOpen={process.env.APP_ENV === "development"}
              />
            </NuqsAdapter>
          </AbilityProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster
        richColors
        visibleToasts={3}
        expand={true}
      />
    </ThemeProvider>
  );
};
