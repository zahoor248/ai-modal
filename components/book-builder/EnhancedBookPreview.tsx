"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ZoomIn, ZoomOut, ZoomInIcon, ZoomOutIcon, Maximize2, Minimize2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpenCheck, BookText, Bookmark, FileText, Image as ImageIcon, List } from "lucide-react";
import { BookPage, BookTheme, PageContent } from "@/types/book";

// Define a type for content blocks
type ContentBlock = {
  type: string;
  content?: string;
  url?: string;
  alt?: string;
  position?: string;
  width?: number;
  height?: number;
};

// Extend the PageContent type to include style and showPageNumber
interface ExtendedPageContent extends PageContent {
  style?: Record<string, any>;
  showPageNumber?: boolean;
}

interface EnhancedBookPreviewProps {
  book: {
    title: string;
    pages: BookPage[];
    theme_id?: string;
    theme?: any; // Theme object from the parent
  };
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  scale?: number;
  className?: string;
}

const getPageIcon = (pageType: string) => {
  switch (pageType) {
    case 'cover':
      return <BookOpen className="w-4 h-4" />;
    case 'title':
      return <FileText className="w-4 h-4" />;
    case 'toc':
      return <List className="w-4 h-4" />;
    case 'chapter':
      return <Bookmark className="w-4 h-4" />;
    case 'content':
      return <BookText className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export function EnhancedBookPreview({
  book,
  currentPageIndex,
  onPageChange,
  scale: initialScale = 1,
  className = "",
}: EnhancedBookPreviewProps) {
  const [scale, setScale] = useState(initialScale);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const currentPage = book.pages[currentPageIndex] || book.pages[0];
  // Get the content from the current page, ensuring it's properly typed
  const content = useMemo<ExtendedPageContent>(() => {
    const now = new Date().toISOString();
    const defaultContent: ExtendedPageContent = {
      blocks: [],
      version: 1,
      lastModified: now,
      lastModifiedBy: 'system',
      style: {},
      showPageNumber: true
    };

    if (!currentPage?.content) return defaultContent;

    if (typeof currentPage.content === 'string') {
      return {
        ...defaultContent,
        rawHtml: currentPage.content,
        markdown: currentPage.content,
      };
    }

    // Ensure we have a valid PageContent object
    return {
      ...defaultContent,
      ...currentPage.content,
      blocks: Array.isArray(currentPage.content.blocks) ? currentPage.content.blocks : [],
    };
  }, [currentPage]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        // Next page
        e.preventDefault();
        if (currentPageIndex < book.pages.length - 1) {
          onPageChange(currentPageIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        // Previous page
        e.preventDefault();
        if (currentPageIndex > 0) {
          onPageChange(currentPageIndex - 1);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        // Toggle fullscreen
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      } else if (e.key === 't' || e.key === 'T') {
        // Toggle thumbnails
        e.preventDefault();
        setShowThumbnails(!showThumbnails);
      } else if (e.key === '+' || e.key === '=') {
        // Zoom in
        e.preventDefault();
        setScale(prev => Math.min(prev + 0.1, 2));
      } else if (e.key === '-' || e.key === '_') {
        // Zoom out
        e.preventDefault();
        setScale(prev => Math.max(prev - 0.1, 0.5));
      } else if (e.key === '0' || e.key === ')') {
        // Reset zoom
        e.preventDefault();
        setScale(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, book.pages.length, onPageChange, isFullscreen, showThumbnails]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };



  // Render page content based on type
  const renderPageContent = () => {
    if (!content) return null;
    
    // Get page style from content or use defaults
    const pageStyle: React.CSSProperties = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: 1.5,
      textAlign: 'left',
      color: '#333',
      backgroundColor: '#fff',
      padding: '2rem',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    };

    switch (currentPage.type) {
      case 'cover':
        return (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              ...pageStyle
            }}
          >
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            {content.blocks.length > 0 && (
              <div className="text-xl mt-4 max-w-2xl">
                {content.blocks.map((block, i) => (
                  <p key={i}>{block.content}</p>
                ))}
              </div>
            )}
          </div>
        );

      case 'toc':
        return (
          <div className="w-full h-full p-8" style={pageStyle}>
            <h1 className="text-2xl font-bold mb-6">Table of Contents</h1>
            <div className="space-y-2">
              {book.pages
                .filter(page => page.type !== 'cover' && page.type !== 'toc' && page.type !== 'title')
                .map((page, index) => (
                  <div key={page.id} className="flex justify-between items-center">
                    <span className="truncate">{page.title || `Page ${page.pageNumber}`}</span>
                    <span className="ml-4 text-muted-foreground">{page.pageNumber}</span>
                  </div>
                ))}
            </div>
          </div>
        );

      default:
        // For regular content pages, render the content based on what's available
        return (
          <div className="w-full h-full p-8" style={pageStyle}>
            {content.rawHtml ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content.rawHtml }} 
              />
            ) : content.markdown ? (
              <div className="prose max-w-none">
                {content.markdown.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : content.blocks && content.blocks.length > 0 ? (
              <div className="prose max-w-none">
                {(content.blocks as ContentBlock[]).map((block, i: number) => (
                  <div key={i} className="mb-4">
                    {block.type === 'heading' && (
                      <h2 className="text-2xl font-bold">{block.content}</h2>
                    )}
                    {block.type === 'paragraph' && (
                      <p>{block.content}</p>
                    )}
                    {block.type === 'image' && (
                      <div className="my-4">
                        <img 
                          src={block.url} 
                          alt={block.alt || ''} 
                          className="max-w-full h-auto rounded"
                        />
                        {block.alt && (
                          <p className="text-sm text-center text-muted-foreground mt-1">
                            {block.alt}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No content available</p>
            )}
          </div>
        );
    }
  };

  if (!currentPage) return null;

  return (
    <div 
      ref={previewRef}
      className={cn(
        "flex flex-col h-full bg-gray-100 relative",
        isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative',
        className
      )}
    >
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
            title="Zoom Out"
          >
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
            title="Zoom In"
          >
            <ZoomInIcon className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScale(1)}
            className="text-xs"
          >
            Reset
          </Button>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="Toggle Thumbnails"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPageIndex + 1} of {book.pages.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails sidebar */}
        {showThumbnails && (
          <div className="w-48 border-r border-gray-200 bg-white overflow-y-auto p-2">
            <div className="space-y-2">
              {book.pages.map((page, index) => (
                <div 
                  key={page.id}
                  className={cn(
                    "p-2 rounded border cursor-pointer flex items-center space-x-2 text-sm",
                    currentPageIndex === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-transparent hover:bg-gray-50'
                  )}
                  onClick={() => onPageChange(index)}
                >
                  <div className="text-muted-foreground">
                    {getPageIcon(page.type)}
                  </div>
                  <span className="truncate">
                    {page.title || `${page.type.charAt(0).toUpperCase() + page.type.slice(1)} ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main preview */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div 
            className="bg-white shadow-lg"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: '210mm', // A4 width
              minHeight: '297mm', // A4 height
              transition: 'transform 0.2s ease-in-out',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {renderPageContent()}
            
            {/* Page number */}
            {content.showPageNumber !== false && (
              <div 
                className="absolute bottom-4 right-4 text-xs text-gray-500"
              >
                Page {currentPageIndex + 1} of {book.pages.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => currentPageIndex > 0 && onPageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous page</span>
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => currentPageIndex < book.pages.length - 1 && onPageChange(currentPageIndex + 1)}
            disabled={currentPageIndex === book.pages.length - 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
