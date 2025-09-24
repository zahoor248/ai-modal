"use client";

import { useState, useCallback } from "react";
import { GripVertical, Plus, Trash2, FileText, Image as ImageIcon, Settings, Eye, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
interface Page {
  id: string;
  title: string;
  type: string;
  pageNumber: number;
}

interface EnhancedSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  pages: Page[];
  selectedPageIndex: number;
  onPageSelect: (index: number) => void;
  onAddPage: (type: string) => void;
  onDeletePage: (index: number) => void;
  onPageReorder: (oldIndex: number, newIndex: number) => void;
}

const pageTypeIcons: Record<string, React.ReactNode> = {
  cover: <FileText className="w-4 h-4" />,
  title: <FileText className="w-4 h-4" />,
  copyright: <FileText className="w-4 h-4" />,
  toc: <List className="w-4 h-4" />,
  chapter: <FileText className="w-4 h-4" />,
  content: <FileText className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  default: <FileText className="w-4 h-4" />
};

export function EnhancedSidebar({
  activeSection,
  onSectionChange,
  pages,
  selectedPageIndex,
  onPageSelect,
  onAddPage,
  onDeletePage,
  onPageReorder
}: EnhancedSidebarProps) {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = pages.findIndex(page => page.id === active.id);
      const newIndex = pages.findIndex(page => page.id === over.id);
      onPageReorder(oldIndex, newIndex);
    }
  }, [pages, onPageReorder]);

  const navItems = [
    { id: 'pages', label: 'Pages', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2",
              activeSection === item.id 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Pages</h3>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setIsAddingPage(!isAddingPage)}
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Add</span>
              </Button>
              
              {isAddingPage && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onAddPage('content');
                        setIsAddingPage(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Text Page</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddPage('image');
                        setIsAddingPage(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Image Page</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        onAddPage('cover');
                        setIsAddingPage(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cover Page
                    </button>
                    <button
                      onClick={() => {
                        onAddPage('toc');
                        setIsAddingPage(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Table of Contents
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pages.map(page => page.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-2 space-y-1">
                {pages.map((page, index) => (
                  <div key={page.id} id={page.id}>
                    <div
                      className={cn(
                        "group flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer",
                        selectedPageIndex === index ? "bg-blue-50 border border-blue-200" : "border border-transparent"
                      )}
                      onClick={() => onPageSelect(index)}
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-shrink-0 text-xs text-gray-500 w-5">
                          {page.pageNumber}
                        </div>
                        <div className="truncate text-sm">
                          {page.title || `Page ${page.pageNumber}`}
                        </div>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(index);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
