"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

interface IBreadcrumb {
  name: string;
  path: string;
}
export function BreadcrumbMain({ className }: { className?: string }) {
  const pathName = usePathname();
  const router = useRouter();

  const path = pathName.split("/");
  const currentPath = path[path.length - 1];
  const breadcrumb: IBreadcrumb[] = [];
  path.map((p) => {
    if (p !== "") {
      breadcrumb.push({ name: p, path: p });
    }
  });
  const nextRouter = (name: string) => {
    if (name === "inicio") return router.replace("/");
    return router.replace(path.slice(0, path.indexOf(name) + 1).join("/"));
  };
  return (
    <Breadcrumb className={cn("", className)}>
      <BreadcrumbList>
        {pathName !== "/" && (
          <Fragment>
            {pathName !== "/" && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="capitalize cursor-pointer"
                  onClick={() => nextRouter("inicio")}
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {path.length < 4 ? (
              breadcrumb.map((bred: IBreadcrumb, index: number) => (
                <Fragment key={bred.name}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {currentPath !== bred.name && (
                      <BreadcrumbLink
                        className="capitalize cursor-pointer"
                        onClick={() => nextRouter(bred.name)}
                      >
                        {bred.name}
                      </BreadcrumbLink>
                    )}
                    {currentPath === bred.name && (
                      <BreadcrumbPage className="capitalize">
                        {bred.name}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))
            ) : (
              <Fragment>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="w-4 h-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {breadcrumb.slice(0, -2).map((bred) => (
                        <DropdownMenuItem
                          key={bred.name}
                          className="capitalize cursor-pointer"
                          onClick={() => nextRouter(bred.name)}
                        >
                          {bred.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                {breadcrumb.slice(-2).map((bred) => (
                  <Fragment key={bred.name}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {currentPath !== bred.name && (
                        <BreadcrumbLink
                          className="capitalize cursor-pointer"
                          onClick={() => nextRouter(bred.name)}
                        >
                          {bred.name}
                        </BreadcrumbLink>
                      )}
                      {currentPath === bred.name && (
                        <BreadcrumbPage className="capitalize">
                          {bred.name}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </Fragment>
            )}
          </Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
