"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Check,
  Palette,
  Sun,
  Moon,
  Cloud,
  Droplet,

  Star,
  TreePalm,
  FireExtinguisher,
} from "lucide-react";
import clsx from "clsx";

const themes = [
  {
    name: "light",
    label: "Light",
    preview: "oklch(1 0 0)",
    icon: <Sun className="h-5 w-5 text-yellow-500" />,
  },
  {
    name: "dark",
    label: "Dark",
    preview: "oklch(0.12 0 0)",
    icon: <Moon className="h-5 w-5 text-gray-300" />,
  },
  {
    name: "warm",
    label: "Warm",
    preview:
      "linear-gradient(135deg, oklch(0.75 0.15 85), oklch(0.65 0.2 280))",
    icon: <FireExtinguisher className="h-5 w-5 text-orange-400" />,
  },
  {
    name: "ocean",
    label: "Ocean",
    preview: "linear-gradient(135deg, oklch(0.5 0.2 220), oklch(0.6 0.18 180))",
    icon: <Droplet className="h-5 w-5 text-blue-400" />,
  },
  {
    name: "forest",
    label: "Forest",
    preview:
      "linear-gradient(135deg, oklch(0.45 0.18 140), oklch(0.55 0.2 160))",
    icon: <TreePalm className="h-5 w-5 text-green-500" />,
  },
  {
    name: "sunset",
    label: "Sunset",
    preview: "linear-gradient(135deg, oklch(0.65 0.2 50), oklch(0.7 0.22 70))",
    icon: <Cloud className="h-5 w-5 text-pink-400" />,
  },
  {
    name: "midnight",
    label: "Midnight",
    preview:
      "linear-gradient(135deg, oklch(0.08 0.02 240), oklch(0.6 0.2 260))",
    icon: <Star className="h-5 w-5 text-indigo-400" />,
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 p-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Select Theme
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto">
          {themes.map((themeOption) => {
            const isActive = theme === themeOption.name;
            return (
              <div
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className={clsx(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-background/50"
                )}
                style={{
                  background: isActive ? themeOption.preview : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {themeOption.icon}
                  <span className="text-sm font-medium text-foreground">
                    {themeOption.label}
                  </span>
                </div>
                {isActive && <Check className="h-5 w-5 text-primary" />}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
