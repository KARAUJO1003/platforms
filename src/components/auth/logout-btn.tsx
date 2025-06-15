"use client";
import { useAuthUser } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export const LogoutButton = () => {
  const { signOut, isLogged } = useAuthUser();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Button
        loading={true}
        disabled={true}
        size="sm"
        variant="ghost"
      >
        Aguarde
      </Button>
    );

  if (!isLogged)
    return (
      <Link
        href="/login"
        className={buttonVariants({ size: "sm", variant: "default" })}
      >
        Entrar
        <LogInIcon className="size-4" />
      </Link>
    );
  return (
    <Button
      loading={mounted ? false : true}
      disabled={mounted ? false : true}
      size="sm"
      onClick={signOut}
      variant="ghost"
    >
      Sair
      <LogInIcon className="size-4" />
    </Button>
  );
};
