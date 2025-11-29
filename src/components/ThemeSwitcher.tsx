import { useTheme, Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes: { name: string; value: Theme; color: string }[] = [
  { name: "Green", value: "theme-green", color: "#0F9D58" },
  { name: "Blue", value: "theme-blue", color: "#4285F4" },
  { name: "Orange", value: "theme-orange", color: "#FF9800" },
  { name: "Purple", value: "theme-purple", color: "#9C27B0" },
  { name: "Red", value: "theme-red", color: "#DB4437" },
  { name: "Teal", value: "theme-teal", color: "#009688" },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Palette className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className="sr-only">Switch Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 glass-card border-none">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            <div
              className={`h-4 w-4 rounded-full border border-white/20 ${
                theme === t.value
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }`}
              style={{ backgroundColor: t.color }}
            />
            <span className={theme === t.value ? "font-bold text-primary" : ""}>
              {t.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
