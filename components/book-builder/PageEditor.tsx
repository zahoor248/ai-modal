"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image, 
  Trash2, 
  Move, 
  Type, 
  Layout,
  Palette,
  Wand2,
  Plus,
  X
} from "lucide-react";
import { toast } from "sonner";

interface PageEditorProps {
  page: any;
  pageIndex: number;
  onPageChange: (page: any) => void;
  themes: any[];
}

export function PageEditor({ page, pageIndex, onPageChange, themes }: PageEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'images' | 'theme'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const layoutOptions = [
    { value: 'standard', label: 'Standard', description: 'Basic single column layout' },
    { value: 'two-column', label: 'Two Column', description: 'Split content into two columns' },
    { value: 'image-left', label: 'Image Left', description: 'Image on left, text on right' },
    { value: 'image-right', label: 'Image Right', description: 'Image on right, text on left' },
    { value: 'image-top', label: 'Image Top', description: 'Image above text' },
    { value: 'image-bottom', label: 'Image Bottom', description: 'Image below text' },
    { value: 'full-image', label: 'Full Image', description: 'Full page image with overlay text' },
    { value: 'cover', label: 'Cover Layout', description: 'Cover page specific layout' },
    { value: 'end', label: 'End Page', description: 'Final page with credits and info' }
  ];

  const pageTypeOptions = [
    { value: 'content', label: 'Content Page', description: 'Regular story content' },
    { value: 'cover', label: 'Cover Page', description: 'Front cover of the book' },
    { value: 'end', label: 'End Page', description: 'Back matter with credits' }
  ];

  const handlePageUpdate = (field: string, value: any) => {
    onPageChange({
      ...page,
      [field]: value
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'book-page');

        const response = await fetch('/api/v1/media/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        uploadedImages.push(result.url);
      }

      // Add uploaded images to page
      const currentImages = page.images || [];
      handlePageUpdate('images', [...currentImages, ...uploadedImages]);
      
      toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the image');
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch('/api/v1/media/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio: '16:9',
          style: 'book-illustration'
        })
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();
      
      // Add generated image to page
      const currentImages = page.images || [];
      handlePageUpdate('images', [...currentImages, result.url]);
      
      toast.success('Image generated successfully!');
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = page.images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    handlePageUpdate('images', newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const currentImages = page.images || [];
    const newImages = [...currentImages];
    
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    
    handlePageUpdate('images', newImages);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Page {page.page_number}: {page.title || 'Untitled'}
            </h3>
            <p className="text-sm text-gray-500">
              {pageTypeOptions.find(opt => opt.value === page.page_type)?.label}
            </p>
          </div>
          <Badge variant="outline">
            {layoutOptions.find(opt => opt.value === page.layout)?.label}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          <Button
            variant={activeTab === 'content' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('content')}
            className="flex items-center space-x-1"
          >
            <Type className="w-4 h-4" />
            <span>Content</span>
          </Button>
          <Button
            variant={activeTab === 'layout' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('layout')}
            className="flex items-center space-x-1"
          >
            <Layout className="w-4 h-4" />
            <span>Layout</span>
          </Button>
          <Button
            variant={activeTab === 'images' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('images')}
            className="flex items-center space-x-1"
          >
            <Image className="w-4 h-4" />
            <span>Images</span>
          </Button>
          <Button
            variant={activeTab === 'theme' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('theme')}
            className="flex items-center space-x-1"
          >
            <Palette className="w-4 h-4" />
            <span>Theme</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                value={page.title || ''}
                onChange={(e) => handlePageUpdate('title', e.target.value)}
                placeholder="Enter page title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pageType">Page Type</Label>
              <Select 
                value={page.page_type} 
                onValueChange={(value) => handlePageUpdate('page_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  {pageTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pageContent">Content</Label>
              <Textarea
                id="pageContent"
                value={page.content || ''}
                onChange={(e) => handlePageUpdate('content', e.target.value)}
                placeholder="Enter page content..."
                rows={12}
                className="mt-1 font-serif leading-relaxed"
              />
              <p className="text-sm text-gray-500 mt-1">
                {page.content ? page.content.length : 0} characters
              </p>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <Label>Layout Style</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {layoutOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-all
                      ${page.layout === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handlePageUpdate('layout', option.value)}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Generate with AI</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Describe the image you want..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerateImage(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleGenerateImage(input.value);
                        input.value = '';
                      }}
                      disabled={isUploading}
                    >
                      <Wand2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Images */}
            {page.images && page.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Page Images ({page.images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {page.images.map((imageUrl: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={imageUrl}
                          alt={`Page image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Image {index + 1}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">{imageUrl}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === page.images.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <Label>Override Theme (Optional)</Label>
              <p className="text-sm text-gray-500 mb-3">
                Apply a different theme to this page only
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <div
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-all
                    ${!page.theme_override ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  onClick={() => handlePageUpdate('theme_override', null)}
                >
                  <div className="font-medium">Use Book Theme</div>
                  <div className="text-sm text-gray-500">Follow the main book theme</div>
                </div>
                
                {themes
                  .filter(theme => theme.category === 'page' || theme.category === 'complete')
                  .map((theme) => (
                    <div
                      key={theme.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-all
                        ${page.theme_override?.theme_id === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handlePageUpdate('theme_override', { theme_id: theme.id })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{theme.display_name}</div>
                          <div className="text-sm text-gray-500">{theme.category}</div>
                        </div>
                        {theme.is_premium && (
                          <Badge variant="secondary">Premium</Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}