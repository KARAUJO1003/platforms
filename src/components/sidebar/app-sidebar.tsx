"use client";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  PieChart,
  SearchSlashIcon,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { SearchForm } from "@/components/sidebar/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { NavProjects } from "./nav-projects";
import { useAuthUser } from "@/contexts/auth-context";

const data = {
  user: {
    name: "Usuário Ferroeste",
    email: "usuario@ferroeste.com.br",
    avatar: "https://github.com/KARAUJO1003.png",
  },
  teams: [
    {
      // name: `Loja ${getClientSubdomain()}`,
      name: `Loja A&A Soluções`,
      logo: "https://github.com/KARAUJO1003.png",
      plan: "Organização ",
      path: "https://avbn2.ferroeste.com.br",
    },
    {
      name: "SIG AVB",
      logo: "https://github.com/KARAUJO1003.png",
      plan: "Sistema de Gestão a Vista",
      path: "https://avb.ferroeste.com.br",
    },
    {
      name: "Projeto Pirolise",
      logo: "https://github.com/KARAUJO1003.png",
      plan: "Análise de Fornos",
      path: "https://avbn2.ferroeste.com.br",
    },
  ],
  navMain: [
    {
      title: "Vendas",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ultimas vendas",
          url: "/s/aiasolucoes/pdv",
        },
        {
          title: "PDV - Ponto de Venda",
          url: "/pdv",
        },
        {
          title: "Perceiros de vendas",
          url: "/pdv",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Lançamentos",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Estoque",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Análises",
      url: "#",
      icon: Frame,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Loja A&A Soluções",
      url: "https://avb.ferroeste.com.br",
      icon: PieChart,
    },
    {
      name: "Outras soluções",
      url: "https://biocarbono.ferroeste.com.br",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const [newData, setNewData] = React.useState(data);
  const { user, isLogged } = useAuthUser();

  function onSubmitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const search = formData.get("search") as string;

    const filteredData: typeof data.navMain = data.navMain.filter((item) => {
      const title = item.title?.toLowerCase();
      const searchLower = search?.toLowerCase();

      return (
        title.includes(searchLower) ||
        item.items?.some((subItem) => {
          const subTitle = subItem.title?.toLowerCase();
          return subTitle.includes(searchLower);
        })
      );
    });

    if (filteredData.length === 0) {
      setNewData((prevData) => ({
        ...prevData,
        navMain: [
          {
            title: "No results found",
            url: "#",
            icon: SearchSlashIcon, // not found icon,
            items: [],
            // disabled: !isLogged,
          },
        ],
      }));
    } else {
      setNewData((prevData) => ({
        ...prevData,
        navMain: filteredData,
      }));
    }
  }

  const mainData = React.useMemo(() => {
    return newData.navMain.map((item) => {
      return {
        ...item,
        // disabled: !isLogged,
      };
    });
  }, [isLogged, newData.navMain]);

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="bg-muted"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {state === "expanded" && <SearchForm onChange={onSubmitSearch} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainData} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user as {
              username?: string;
              email?: string;
              avatar?: string;
            }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
