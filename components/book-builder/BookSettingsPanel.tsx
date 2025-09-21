"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Palette, 
  Ruler, 
  User, 
  Hash,
  ImageIcon,
  Settings,
  Wand2
} from "lucide-react";

interface BookSettingsPanelProps {
  bookData: any;
  onBookDataChange: (data: any) => void;
  themes: any[];
}

export function BookSettingsPanel({ bookData, onBookDataChange, themes }: BookSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'design' | 'advanced'>('basic');

  const dimensionOptions = [
    { value: 'A4', label: 'A4 (210 × 297 mm)', description: 'Standard book size' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)', description: 'US standard' },
    { value: '6x9', label: '6" × 9"', description: 'Popular novel size' },
    { value: '8.5x11', label: '8.5" × 11"', description: 'Large format' },
    { value: '5x8', label: '5" × 8"', description: 'Compact book' },
    { value: '7x10', label: '7" × 10"', description: 'Medium format' }
  ];

  const coverThemes = themes.filter(theme => 
    theme.category === 'cover' || theme.category === 'complete'
  );

  const pageThemes = themes.filter(theme => 
    theme.category === 'page' || theme.category === 'complete'
  );

  const handleInputChange = (field: string, value: any) => {
    onBookDataChange({
      ...bookData,
      [field]: value
    });
  };

  const generateISBN = () => {
    // Generate a mock ISBN for demonstration
    const isbn = `978-${Math.floor(Math.random() * 10000000000)}`;
    handleInputChange('isbn', isbn);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Tab Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'basic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('basic')}
            className="flex items-center space-x-1"
          >
            <Book className="w-4 h-4" />
            <span>Basic</span>
          </Button>
          <Button
            variant={activeTab === 'design' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('design')}
            className="flex items-center space-x-1"
          >
            <Palette className="w-4 h-4" />
            <span>Design</span>
          </Button>
          <Button
            variant={activeTab === 'advanced' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('advanced')}
            className="flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>Advanced</span>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Settings */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Book className="w-5 h-5" />
                  <span>Book Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    value={bookData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your book title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={bookData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Optional subtitle"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={bookData.author_name}
                    onChange={(e) => handleInputChange('author_name', e.target.value)}
                    placeholder="Author name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="isbn" className="flex items-center space-x-2">
                    <span>ISBN</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateISBN}
                      className="ml-2"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                  </Label>
                  <Input
                    id="isbn"
                    value={bookData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="ISBN number"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Ruler className="w-5 h-5" />
                  <span>Book Dimensions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Page Size</Label>
                  <Select 
                    value={bookData.dimensions} 
                    onValueChange={(value) => handleInputChange('dimensions', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      {dimensionOptions.map((option) => (
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Design Settings */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <ImageIcon className="w-5 h-5" />
                  <span>Cover Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {coverThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-all
                        ${bookData.cover_theme_id === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleInputChange('cover_theme_id', theme.id)}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Palette className="w-5 h-5" />
                  <span>Page Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {pageThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-all
                        ${bookData.theme_id === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleInputChange('theme_id', theme.id)}
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Settings className="w-5 h-5" />
                  <span>Publishing Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={bookData.metadata?.publisher || ''}
                    onChange={(e) => handleInputChange('metadata', {
                      ...bookData.metadata,
                      publisher: e.target.value
                    })}
                    placeholder="Publisher name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="copyright">Copyright Year</Label>
                  <Input
                    id="copyright"
                    value={bookData.metadata?.copyright || new Date().getFullYear()}
                    onChange={(e) => handleInputChange('metadata', {
                      ...bookData.metadata,
                      copyright: e.target.value
                    })}
                    placeholder="2024"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={bookData.metadata?.description || ''}
                    onChange={(e) => handleInputChange('metadata', {
                      ...bookData.metadata,
                      description: e.target.value
                    })}
                    placeholder="Book description for back cover"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Hash className="w-5 h-5" />
                  <span>Barcode & ISBN</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeBarcode"
                    checked={bookData.metadata?.include_barcode || true}
                    onChange={(e) => handleInputChange('metadata', {
                      ...bookData.metadata,
                      include_barcode: e.target.checked
                    })}
                  />
                  <Label htmlFor="includeBarcode">Include barcode on back cover</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includePrice"
                    checked={bookData.metadata?.include_price || false}
                    onChange={(e) => handleInputChange('metadata', {
                      ...bookData.metadata,
                      include_price: e.target.checked
                    })}
                  />
                  <Label htmlFor="includePrice">Include price on cover</Label>
                </div>

                {bookData.metadata?.include_price && (
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={bookData.metadata?.price || ''}
                      onChange={(e) => handleInputChange('metadata', {
                        ...bookData.metadata,
                        price: e.target.value
                      })}
                      placeholder="$9.99"
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}