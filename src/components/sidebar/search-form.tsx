import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label
            htmlFor="search"
            className="sr-only"
          >
            Buscar
          </Label>
          <SidebarInput
            id="search"
            name="search"
            placeholder="Buscar por página..."
            className="bg-inherit pl-8 border-muted-foreground/30"
          />
          <Search className="top-1/2 left-2 absolute opacity-50 size-4 -translate-y-1/2 pointer-events-none select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
