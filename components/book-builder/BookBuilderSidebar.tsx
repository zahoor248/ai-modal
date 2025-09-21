"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  FileText, 
  Eye, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronRight,
  Book,
  Image,
  Type
} from "lucide-react";

interface BookBuilderSidebarProps {
  activeSection: 'settings' | 'pages' | 'preview';
  onSectionChange: (section: 'settings' | 'pages' | 'preview') => void;
  pages: any[];
  selectedPageIndex: number;
  onPageSelect: (index: number) => void;
}

export function BookBuilderSidebar({
  activeSection,
  onSectionChange,
  pages,
  selectedPageIndex,
  onPageSelect
}: BookBuilderSidebarProps) {
  const [isPagesExpanded, setIsPagesExpanded] = useState(true);

  const getPageIcon = (pageType: string) => {
    switch (pageType) {
      case 'cover':
        return <Book className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'end':
        return <Type className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPageTypeLabel = (pageType: string) => {
    switch (pageType) {
      case 'cover':
        return 'Cover';
      case 'content':
        return 'Content';
      case 'end':
        return 'End Page';
      default:
        return 'Page';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-1">
          <Button
            variant={activeSection === 'settings' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSectionChange('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Book Settings
          </Button>
          
          <Button
            variant={activeSection === 'pages' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSectionChange('pages')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Pages
          </Button>
          
          <Button
            variant={activeSection === 'preview' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSectionChange('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Pages List */}
      {activeSection === 'pages' && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {isPagesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span>Pages ({pages.length})</span>
              </button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Add new page logic
                  const newPage = {
                    page_number: pages.length + 1,
                    page_type: 'content',
                    title: `Page ${pages.length + 1}`,
                    content: '',
                    images: [],
                    layout: 'standard'
                  };
                  // This would need to be passed up to parent component
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {isPagesExpanded && (
              <div className="space-y-1">
                {pages.map((page, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                      ${selectedPageIndex === index 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                    onClick={() => onPageSelect(index)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getPageIcon(page.page_type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {page.title || `Page ${page.page_number}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getPageTypeLabel(page.page_type)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {page.images && page.images.length > 0 && (
                        <Image className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        {page.page_number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Image className="w-4 h-4 mr-2" />
            Add Images
          </Button>
        </div>
      </div>
    </div>
  );
}