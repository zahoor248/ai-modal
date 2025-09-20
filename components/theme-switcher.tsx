"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"

const themes = [
  {
    name: "light",
    label: "Light",
    color: "bg-white border border-gray-200",
    preview: "oklch(1 0 0)",
  },
  {
    name: "dark",
    label: "Dark",
    color: "bg-gray-900 border border-gray-700",
    preview: "oklch(0.12 0 0)",
  },
  {
    name: "warm",
    label: "Warm",
    color: "bg-gradient-to-r from-amber-200 to-purple-200",
    preview: "linear-gradient(135deg, oklch(0.75 0.15 85), oklch(0.65 0.2 280))",
  },
  {
    name: "ocean",
    label: "Ocean",
    color: "bg-gradient-to-r from-blue-200 to-cyan-200",
    preview: "linear-gradient(135deg, oklch(0.5 0.2 220), oklch(0.6 0.18 180))",
  },
  {
    name: "forest",
    label: "Forest",
    color: "bg-gradient-to-r from-green-200 to-emerald-200",
    preview: "linear-gradient(135deg, oklch(0.45 0.18 140), oklch(0.55 0.2 160))",
  },
  {
    name: "sunset",
    label: "Sunset",
    color: "bg-gradient-to-r from-orange-200 to-pink-200",
    preview: "linear-gradient(135deg, oklch(0.65 0.2 50), oklch(0.7 0.22 70))",
  },
  {
    name: "midnight",
    label: "Midnight",
    color: "bg-gradient-to-r from-indigo-900 to-purple-900",
    preview: "linear-gradient(135deg, oklch(0.08 0.02 240), oklch(0.6 0.2 260))",
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu  >
      <DropdownMenuTrigger asChild className="relative">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 hover:border-primary/30 hover:text-primary transition-all duration-200"
        >
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="absolute w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name)}
            className="flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors duration-200 rounded-md focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${themeOption.color} border border-border`}
                style={{
                  background: themeOption.preview,
                }}
              />
              {themeOption.label}
            </div>
            {theme === themeOption.name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
