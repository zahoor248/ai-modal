"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Maximize,
  Download,
  Eye
} from "lucide-react";

interface BookPreviewProps {
  bookData: any;
  currentPageIndex: number;
  themes: any[];
}

export function BookPreview({ bookData, currentPageIndex, themes }: BookPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'single' | 'spread'>('single');
  const [previewPage, setPreviewPage] = useState(currentPageIndex);

  useEffect(() => {
    setPreviewPage(currentPageIndex);
  }, [currentPageIndex]);

  const currentTheme = themes.find(t => t.id === bookData.theme_id);
  const coverTheme = themes.find(t => t.id === bookData.cover_theme_id);
  const page = bookData.pages?.[previewPage];

  const getThemeStyles = (pageType: string, themeOverride?: any) => {
    let theme = currentTheme;
    
    if (pageType === 'cover' && coverTheme) {
      theme = coverTheme;
    }
    
    if (themeOverride?.theme_id) {
      theme = themes.find(t => t.id === themeOverride.theme_id) || theme;
    }

    if (!theme?.template_data) {
      return {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'serif'
      };
    }

    const data = theme.template_data;
    return {
      backgroundColor: data.colors?.background || '#ffffff',
      color: data.colors?.text || data.colors?.primary || '#000000',
      fontFamily: data.fonts?.body || 'serif'
    };
  };

  const renderPageContent = (pageData: any, index: number) => {
    if (!pageData) return null;

    const styles = getThemeStyles(pageData.page_type, pageData.theme_override);
    const isEvenPage = (index + 1) % 2 === 0;

    return (
      <div
        className={`
          relative bg-white shadow-lg mx-auto transition-all duration-300
          ${viewMode === 'spread' && bookData.pages.length > 1 ? 'w-1/2' : 'w-full max-w-2xl'}
        `}
        style={{
          aspectRatio: getAspectRatio(bookData.dimensions),
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center top'
        }}
      >
        {/* Page Background */}
        <div
          className="absolute inset-0 p-8 overflow-hidden"
          style={{
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontFamily: styles.fontFamily
          }}
        >
          {/* Cover Page */}
          {pageData.page_type === 'cover' && (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
              {/* Cover Image */}
              {pageData.images && pageData.images[0] && (
                <div className="w-full h-1/2 mb-4">
                  <img
                    src={pageData.images[0]}
                    alt="Cover"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-4xl font-bold leading-tight">
                {bookData.title || 'Book Title'}
              </h1>
              
              {/* Subtitle */}
              {bookData.subtitle && (
                <h2 className="text-2xl font-light opacity-80">
                  {bookData.subtitle}
                </h2>
              )}
              
              {/* Author */}
              <p className="text-xl font-medium mt-auto">
                by {bookData.author_name || 'Author Name'}
              </p>
            </div>
          )}

          {/* Content Page */}
          {pageData.page_type === 'content' && (
            <div className="h-full">
              {/* Page Title */}
              {pageData.title && (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {pageData.title}
                </h2>
              )}

              {/* Layout: Image Top */}
              {pageData.layout === 'image-top' && pageData.images?.[0] && (
                <div className="mb-6">
                  <img
                    src={pageData.images[0]}
                    alt="Page illustration"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Layout: Two Column */}
              {pageData.layout === 'two-column' ? (
                <div className="grid grid-cols-2 gap-6 h-5/6">
                  <div className="space-y-4">
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                      {pageData.content?.split('\n\n').slice(0, Math.ceil(pageData.content.split('\n\n').length / 2)).join('\n\n')}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                      {pageData.content?.split('\n\n').slice(Math.ceil(pageData.content.split('\n\n').length / 2)).join('\n\n')}
                    </div>
                  </div>
                </div>
              ) : pageData.layout === 'image-left' ? (
                <div className="grid grid-cols-2 gap-6 h-5/6">
                  <div>
                    {pageData.images?.[0] && (
                      <img
                        src={pageData.images[0]}
                        alt="Page illustration"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="text-base leading-relaxed whitespace-pre-wrap">
                    {pageData.content}
                  </div>
                </div>
              ) : pageData.layout === 'image-right' ? (
                <div className="grid grid-cols-2 gap-6 h-5/6">
                  <div className="text-base leading-relaxed whitespace-pre-wrap">
                    {pageData.content}
                  </div>
                  <div>
                    {pageData.images?.[0] && (
                      <img
                        src={pageData.images[0]}
                        alt="Page illustration"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Standard Layout */
                <div className="h-5/6">
                  <div className="text-base leading-relaxed whitespace-pre-wrap h-full overflow-hidden">
                    {pageData.content}
                  </div>
                </div>
              )}

              {/* Layout: Image Bottom */}
              {pageData.layout === 'image-bottom' && pageData.images?.[0] && (
                <div className="mt-6">
                  <img
                    src={pageData.images[0]}
                    alt="Page illustration"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Page Number */}
              <div className={`absolute bottom-4 text-sm opacity-60 ${isEvenPage ? 'left-8' : 'right-8'}`}>
                {pageData.page_number}
              </div>
            </div>
          )}

          {/* End Page */}
          {pageData.page_type === 'end' && (
            <div className="h-full flex flex-col justify-between">
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center text-center space-y-6">
                <h2 className="text-3xl font-bold">{pageData.title || 'The End'}</h2>
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {pageData.content}
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-3 text-sm text-center opacity-75">
                <div>{bookData.title}</div>
                <div>by {bookData.author_name}</div>
                {bookData.isbn && (
                  <div>ISBN: {bookData.isbn}</div>
                )}
                {bookData.metadata?.publisher && (
                  <div>{bookData.metadata.publisher}</div>
                )}
                {bookData.metadata?.copyright && (
                  <div>© {bookData.metadata.copyright}</div>
                )}
              </div>

              {/* Barcode Area */}
              {bookData.metadata?.include_barcode && bookData.isbn && (
                <div className="mt-4 flex justify-center">
                  <div className="bg-black text-white px-4 py-2 text-xs font-mono">
                    ||| ||| ||| {bookData.isbn} ||| ||| |||
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page Border */}
        <div className="absolute inset-0 border border-gray-300 pointer-events-none"></div>
      </div>
    );
  };

  const getAspectRatio = (dimensions: string) => {
    switch (dimensions) {
      case 'A4': return '210/297';
      case 'Letter': return '8.5/11';
      case '6x9': return '6/9';
      case '8.5x11': return '8.5/11';
      case '5x8': return '5/8';
      case '7x10': return '7/10';
      default: return '210/297';
    }
  };

  const nextPage = () => {
    if (previewPage < bookData.pages.length - 1) {
      setPreviewPage(previewPage + 1);
    }
  };

  const prevPage = () => {
    if (previewPage > 0) {
      setPreviewPage(previewPage - 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold">Preview</h3>
            <Badge variant="outline">
              {bookData.dimensions || 'A4'}
            </Badge>
            <Badge variant="outline">
              Page {previewPage + 1} of {bookData.pages?.length || 0}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              disabled={zoom <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(100)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {/* View Mode */}
            <Button
              size="sm"
              variant={viewMode === 'single' ? 'default' : 'outline'}
              onClick={() => setViewMode('single')}
            >
              Single
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'spread' ? 'default' : 'outline'}
              onClick={() => setViewMode('spread')}
            >
              Spread
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="min-h-full flex items-start justify-center">
          {viewMode === 'single' ? (
            renderPageContent(page, previewPage)
          ) : (
            <div className="flex space-x-4 max-w-6xl">
              {/* Left Page */}
              {previewPage > 0 && renderPageContent(bookData.pages[previewPage - 1], previewPage - 1)}
              {/* Right Page */}
              {renderPageContent(page, previewPage)}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <Button
            size="sm"
            variant="outline"
            onClick={prevPage}
            disabled={previewPage === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {bookData.pages?.map((_, index) => (
              <button
                key={index}
                onClick={() => setPreviewPage(index)}
                className={`
                  w-3 h-3 rounded-full transition-all
                  ${previewPage === index 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={nextPage}
            disabled={previewPage === bookData.pages.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}