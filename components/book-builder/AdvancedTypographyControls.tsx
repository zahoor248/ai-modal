"use client";

import { useState } from "react";
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Palette,
  LineChart,
  Columns,
  Settings,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedTypographyControlsProps {
  styles: any;
  onStyleChange: (styles: any) => void;
  className?: string;
}

const FONT_FAMILIES = [
  { name: "Inter", value: "Inter, sans-serif", category: "Sans Serif" },
  { name: "Roboto", value: "Roboto, sans-serif", category: "Sans Serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif", category: "Sans Serif" },
  { name: "Lato", value: "Lato, sans-serif", category: "Sans Serif" },
  { name: "Poppins", value: "Poppins, sans-serif", category: "Sans Serif" },
  { name: "Times New Roman", value: "Times New Roman, serif", category: "Serif" },
  { name: "Georgia", value: "Georgia, serif", category: "Serif" },
  { name: "Playfair Display", value: "Playfair Display, serif", category: "Serif" },
  { name: "Crimson Text", value: "Crimson Text, serif", category: "Serif" },
  { name: "Libre Baskerville", value: "Libre Baskerville, serif", category: "Serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono, monospace", category: "Monospace" },
  { name: "Fira Code", value: "Fira Code, monospace", category: "Monospace" },
  { name: "Source Code Pro", value: "Source Code Pro, monospace", category: "Monospace" }
];

const FONT_SIZES = [
  { name: "Small", value: "12px" },
  { name: "Normal", value: "14px" },
  { name: "Medium", value: "16px" },
  { name: "Large", value: "18px" },
  { name: "Extra Large", value: "20px" },
  { name: "Huge", value: "24px" }
];

export function AdvancedTypographyControls({
  styles,
  onStyleChange,
  className = ""
}: AdvancedTypographyControlsProps) {
  const [activeTab, setActiveTab] = useState("typography");

  const handleStyleUpdate = (updates: Partial<any>) => {
    onStyleChange({
      ...styles,
      ...updates
    });
  };

  const getCurrentFontSize = () => {
    const fontSize = styles?.fontSize || "16px";
    return parseInt(fontSize.replace("px", ""));
  };

  const setFontSize = (size: number) => {
    handleStyleUpdate({ fontSize: `${size}px` });
  };

  const getCurrentLineHeight = () => {
    return styles?.lineHeight || 1.6;
  };

  const setLineHeight = (height: number) => {
    handleStyleUpdate({ lineHeight: height });
  };

  const getCurrentLetterSpacing = () => {
    const spacing = styles?.letterSpacing || "0px";
    return parseFloat(spacing.replace("px", ""));
  };

  const setLetterSpacing = (spacing: number) => {
    handleStyleUpdate({ letterSpacing: `${spacing}px` });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Type className="w-4 h-4" />
          <span>Advanced Typography</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
            <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-4 mt-4">
            {/* Font Family */}
            <div>
              <Label className="text-xs font-medium">Font Family</Label>
              <Select
                value={styles?.fontFamily || "Inter, sans-serif"}
                onValueChange={(value) => handleStyleUpdate({ fontFamily: value })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Sans Serif", "Serif", "Monospace"].map(category => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {category}
                      </div>
                      {FONT_FAMILIES.filter(font => font.category === category).map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-xs font-medium">Font Size</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[getCurrentFontSize()]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={8}
                  max={72}
                  step={1}
                  className="flex-1"
                />
                <div className="w-12 text-xs text-center">
                  {getCurrentFontSize()}px
                </div>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <Label className="text-xs font-medium">Line Height</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[getCurrentLineHeight()]}
                  onValueChange={([value]) => setLineHeight(value)}
                  min={0.8}
                  max={3.0}
                  step={0.1}
                  className="flex-1"
                />
                <div className="w-12 text-xs text-center">
                  {getCurrentLineHeight().toFixed(1)}
                </div>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <Label className="text-xs font-medium">Letter Spacing</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[getCurrentLetterSpacing()]}
                  onValueChange={([value]) => setLetterSpacing(value)}
                  min={-2}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <div className="w-12 text-xs text-center">
                  {getCurrentLetterSpacing().toFixed(1)}px
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <Label className="text-xs font-medium">Text Alignment</Label>
              <div className="flex space-x-1 mt-1">
                {[
                  { icon: AlignLeft, value: "left", label: "Left" },
                  { icon: AlignCenter, value: "center", label: "Center" },
                  { icon: AlignRight, value: "right", label: "Right" },
                  { icon: AlignJustify, value: "justify", label: "Justify" }
                ].map(({ icon: Icon, value, label }) => (
                  <Button
                    key={value}
                    variant={styles?.textAlign === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleUpdate({ textAlign: value })}
                    className="flex-1"
                    title={label}
                  >
                    <Icon className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Text Decoration */}
            <div>
              <Label className="text-xs font-medium">Text Style</Label>
              <div className="flex space-x-1 mt-1">
                <Button
                  variant={styles?.fontWeight === "bold" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStyleUpdate({ 
                    fontWeight: styles?.fontWeight === "bold" ? "normal" : "bold" 
                  })}
                  title="Bold"
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button
                  variant={styles?.fontStyle === "italic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStyleUpdate({ 
                    fontStyle: styles?.fontStyle === "italic" ? "normal" : "italic" 
                  })}
                  title="Italic"
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button
                  variant={styles?.textDecoration === "underline" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStyleUpdate({ 
                    textDecoration: styles?.textDecoration === "underline" ? "none" : "underline" 
                  })}
                  title="Underline"
                >
                  <Underline className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={styles?.textColor || "#000000"}
                    onChange={(e) => handleStyleUpdate({ textColor: e.target.value })}
                    className="w-12 h-8 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={styles?.textColor || "#000000"}
                    onChange={(e) => handleStyleUpdate({ textColor: e.target.value })}
                    className="flex-1 text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-xs font-medium">Background Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={styles?.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
                    className="w-12 h-8 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={styles?.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
                    className="flex-1 text-xs"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            {/* Columns */}
            <div>
              <Label className="text-xs font-medium">Columns</Label>
              <Select
                value={String(styles?.columns || 1)}
                onValueChange={(value) => handleStyleUpdate({ 
                  columns: parseInt(value),
                  columnGap: parseInt(value) > 1 ? "2em" : undefined
                })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Column Gap */}
            {(styles?.columns || 1) > 1 && (
              <div>
                <Label className="text-xs font-medium">Column Gap</Label>
                <Select
                  value={styles?.columnGap || "2em"}
                  onValueChange={(value) => handleStyleUpdate({ columnGap: value })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1em">Small (1em)</SelectItem>
                    <SelectItem value="2em">Medium (2em)</SelectItem>
                    <SelectItem value="3em">Large (3em)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Page Breaks */}
            <div>
              <Label className="text-xs font-medium">Page Break Before</Label>
              <Select
                value={styles?.breakBefore || "auto"}
                onValueChange={(value) => handleStyleUpdate({ breakBefore: value })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="avoid">Avoid</SelectItem>
                  <SelectItem value="left">Left Page</SelectItem>
                  <SelectItem value="right">Right Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4 mt-4">
            {/* Margin */}
            <div>
              <Label className="text-xs font-medium">Margin</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs text-muted-foreground">Top</Label>
                  <Input
                    type="text"
                    value={typeof styles?.margin === "object" ? styles.margin.top : styles?.margin || "2cm"}
                    onChange={(e) => {
                      const currentMargin = typeof styles?.margin === "object" ? styles.margin : {
                        top: "2cm", right: "2cm", bottom: "2cm", left: "2cm"
                      };
                      handleStyleUpdate({ 
                        margin: { ...currentMargin, top: e.target.value }
                      });
                    }}
                    className="text-xs"
                    placeholder="2cm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Right</Label>
                  <Input
                    type="text"
                    value={typeof styles?.margin === "object" ? styles.margin.right : styles?.margin || "2cm"}
                    onChange={(e) => {
                      const currentMargin = typeof styles?.margin === "object" ? styles.margin : {
                        top: "2cm", right: "2cm", bottom: "2cm", left: "2cm"
                      };
                      handleStyleUpdate({ 
                        margin: { ...currentMargin, right: e.target.value }
                      });
                    }}
                    className="text-xs"
                    placeholder="2cm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Bottom</Label>
                  <Input
                    type="text"
                    value={typeof styles?.margin === "object" ? styles.margin.bottom : styles?.margin || "2cm"}
                    onChange={(e) => {
                      const currentMargin = typeof styles?.margin === "object" ? styles.margin : {
                        top: "2cm", right: "2cm", bottom: "2cm", left: "2cm"
                      };
                      handleStyleUpdate({ 
                        margin: { ...currentMargin, bottom: e.target.value }
                      });
                    }}
                    className="text-xs"
                    placeholder="2cm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Left</Label>
                  <Input
                    type="text"
                    value={typeof styles?.margin === "object" ? styles.margin.left : styles?.margin || "2cm"}
                    onChange={(e) => {
                      const currentMargin = typeof styles?.margin === "object" ? styles.margin : {
                        top: "2cm", right: "2cm", bottom: "2cm", left: "2cm"
                      };
                      handleStyleUpdate({ 
                        margin: { ...currentMargin, left: e.target.value }
                      });
                    }}
                    className="text-xs"
                    placeholder="2cm"
                  />
                </div>
              </div>
            </div>

            {/* Padding */}
            <div>
              <Label className="text-xs font-medium">Padding</Label>
              <Input
                type="text"
                value={styles?.padding || "0"}
                onChange={(e) => handleStyleUpdate({ padding: e.target.value })}
                className="w-full mt-1 text-xs"
                placeholder="0"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        
        {/* Quick Presets */}
        <div>
          <Label className="text-xs font-medium">Typography Presets</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStyleUpdate({
                fontFamily: "Times New Roman, serif",
                fontSize: "12px",
                lineHeight: 1.5,
                textAlign: "justify"
              })}
              className="text-xs"
            >
              Classic Book
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStyleUpdate({
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                lineHeight: 1.6,
                textAlign: "left"
              })}
              className="text-xs"
            >
              Modern
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStyleUpdate({
                fontFamily: "Georgia, serif",
                fontSize: "14px",
                lineHeight: 1.8,
                textAlign: "justify"
              })}
              className="text-xs"
            >
              Readable
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStyleUpdate({
                fontFamily: "Playfair Display, serif",
                fontSize: "18px",
                lineHeight: 1.4,
                textAlign: "center"
              })}
              className="text-xs"
            >
              Elegant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}