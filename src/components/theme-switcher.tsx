"use client";

import { useId } from "react";

import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./extensions/theme-switcher";

export function ThemeSwitcherToggle() {
  const id = useId();
  const { theme, setTheme } = useTheme();

  return (
    <ThemeSwitcher
      defaultValue="system"
      value={theme as "dark" | "light" | "system"}
      onChange={setTheme}
    />
  );
}
