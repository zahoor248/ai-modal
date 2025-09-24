"use client";

import { useState, useEffect, useCallback } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link2, Quote, Code, Undo, Redo, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@radix-ui/react-slider'
import { cn } from "@/lib/utils";

type PageType = 'cover' | 'title' | 'copyright' | 'toc' | 'chapter' | 'content' | 'image' | 'default';

interface PageContent {
  title?: string;
  content?: string;
  style?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    backgroundColor?: string;
  };
  images?: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    position?: 'left' | 'right' | 'center' | 'full';
  }>;
  layout?: string;
  pageNumber?: number | string;
  showPageNumber?: boolean;
}

interface EnhancedPageEditorProps {
  page: {
    id: string;
    type: PageType;
    title: string;
    content: PageContent | string;
    pageNumber: number;
    layout?: string;
    style?: Record<string, any>;
  };
  onPageChange: (updatedPage: any) => void;
  themes?: Array<{ id: string; name: string; styles: Record<string, any> }>;
  className?: string;
}

export function EnhancedPageEditor({
  page,
  onPageChange,
  themes = [],
  className = "",
}: EnhancedPageEditorProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<PageContent>(
    typeof page.content === 'string' 
      ? { content: page.content } 
      : page.content || {}
  );

  // Update local content when page prop changes
  useEffect(() => {
    setContent(
      typeof page.content === 'string' 
        ? { content: page.content } 
        : page.content || {}
    );
  }, [page.id, page.content]);

  const handleContentChange = useCallback((updates: Partial<PageContent>) => {
    setContent(prev => {
      const newContent = { ...prev, ...updates };
      
      // Notify parent of changes
      setTimeout(() => {
        onPageChange({
          ...page,
          content: newContent,
          title: newContent.title || page.title
        });
      }, 0);
      
      return newContent;
    });
  }, [onPageChange, page]);

  const handleStyleChange = (property: string, value: any) => {
    handleContentChange({
      style: {
        ...content.style,
        [property]: value
      }
    });
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker and upload the image
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const newImage = {
        url: imageUrl,
        alt: 'Image ' + (content.images?.length || 0 + 1),
        position: 'center' as const
      };
      
      handleContentChange({
        images: [...(content.images || []), newImage]
      });
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="content" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="style" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Style
          </TabsTrigger>
          <TabsTrigger 
            value="layout" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Layout
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="content" className="m-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={content.title || ''}
                  onChange={(e) => handleContentChange({ title: e.target.value })}
                  placeholder="Enter page title"
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Content</Label>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAddImage}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={typeof content.content === 'string' ? content.content : ''}
                  onChange={(e) => handleContentChange({ content: e.target.value })}
                  placeholder="Type your content here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {content.images && content.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="space-y-2">
                    {content.images.map((img, index) => (
                      <div key={index} className="border rounded p-2 flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                          <img 
                            src={img.url} 
                            alt={img.alt} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{img.alt}</div>
                          <div className="text-xs text-muted-foreground truncate">{img.url}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="m-0">
            <div className="space-y-4">
              <div>
                <Label>Font Family</Label>
                <Select
                  value={content.style?.fontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) => handleStyleChange('fontFamily', value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                    <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label>Font Size: {content.style?.fontSize || '16px'}</Label>
                  <span className="text-sm text-muted-foreground">
                    {parseInt(content.style?.fontSize || '16')}px
                  </span>
                </div>
                <Slider
                  value={[parseInt(content.style?.fontSize || '16')]}
                  onValueChange={([value]) => handleStyleChange('fontSize', `${value}px`)}
                  min={8}
                  max={72}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label>Line Height: {content.style?.lineHeight || 1.5}</Label>
                  <span className="text-sm text-muted-foreground">
                    {content.style?.lineHeight || 1.5}
                  </span>
                </div>
                <Slider
                  value={[content.style?.lineHeight || 1.5]}
                  onValueChange={([value]) => handleStyleChange('lineHeight', value)}
                  min={1}
                  max={3}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Text Alignment</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <Button
                      key={align}
                      variant={content.style?.textAlign === align ? 'default' : 'outline'}
                      size="sm"
                      className="capitalize"
                      onClick={() => handleStyleChange('textAlign', align as any)}
                    >
                      {align}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="m-0">
            <div className="space-y-4">
              <div>
                <Label>Page Layout</Label>
                <Select
                  value={page.layout || 'standard'}
                  onValueChange={(value) => onPageChange({ ...page, layout: value })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="sidebar">With Sidebar</SelectItem>
                    <SelectItem value="two-column">Two Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-page-number"
                    checked={content.showPageNumber !== false}
                    onChange={(e) => handleContentChange({ showPageNumber: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="show-page-number" className="text-sm font-medium">
                    Show page number
                  </Label>
                </div>
              </div>

              {themes.length > 0 && (
                <div>
                  <Label>Theme</Label>
                  <Select
                    value={page.style?.themeId || themes[0]?.id}
                    onValueChange={(value) => 
                      onPageChange({ 
                        ...page, 
                        style: { 
                          ...page.style, 
                          themeId: value 
                        } 
                      })
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
