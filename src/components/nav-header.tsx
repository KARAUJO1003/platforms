import { SidebarTrigger } from "./ui/sidebar";
import { BreadcrumbMain } from "./breadcrumb-main";
import { ThemeSwitcherToggle } from "./theme-switcher";
import { LogoutButton } from "./auth/logout-btn";

export const NavHeader = () => {
  return (
    <header className="top-0 z-20 border-b  sticky flex items-center gap-2 backdrop-blur-sm px-4 h-[var(--header-size)] shrink-0">
      <SidebarTrigger className="-ml-1" />
      <BreadcrumbMain className="mr-auto ml-3" />
      {/* <NotificationsButton /> */}
      <ThemeSwitcherToggle />
      <LogoutButton />
    </header>
  );
};
