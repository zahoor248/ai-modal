"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BookBuilderSidebar } from "@/components/book-builder/BookBuilderSidebar";
import { BookPreview } from "@/components/book-builder/BookPreview";
import { BookSettingsPanel } from "@/components/book-builder/BookSettingsPanel";
import { PageEditor } from "@/components/book-builder/PageEditor";
import { Button } from "@/components/ui/button";
import { Download, Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface BookData {
  id?: string;
  title: string;
  subtitle: string;
  author_name: string;
  isbn: string;
  dimensions: string;
  theme_id: string;
  cover_theme_id: string;
  pages: BookPage[];
  metadata: any;
}

interface BookPage {
  id?: string;
  page_number: number;
  page_type: 'cover' | 'content' | 'end';
  title: string;
  content: string;
  images: string[];
  theme_override?: any;
  layout: string;
}

export default function BookBuilderPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [bookData, setBookData] = useState<BookData>({
    title: "",
    subtitle: "",
    author_name: "",
    isbn: "",
    dimensions: "A4",
    theme_id: "",
    cover_theme_id: "",
    pages: [],
    metadata: {}
  });
  
  const [activeSection, setActiveSection] = useState<'settings' | 'pages' | 'preview'>('settings');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [themes, setThemes] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user and initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load themes
      const { data: themesData } = await supabase
        .from('book_themes')
        .select('*')
        .order('sort_order');
      
      if (themesData) {
        setThemes(themesData);
        if (themesData.length > 0) {
          setBookData(prev => ({
            ...prev,
            theme_id: themesData[0].id,
            cover_theme_id: themesData[0].id
          }));
        }
      }

      // Load user stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (storiesData) {
        setStories(storiesData);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorySelect = async (storyId: string) => {
    if (!storyId) return;
    
    try {
      const { data: story } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (story) {
        setSelectedStoryId(storyId);
        setBookData(prev => ({
          ...prev,
          title: story.story_title,
          author_name: user?.user_metadata?.name || "Author",
          pages: [
            {
              page_number: 1,
              page_type: 'cover',
              title: story.story_title,
              content: '',
              images: [],
              layout: 'cover'
            },
            {
              page_number: 2,
              page_type: 'content',
              title: 'Chapter 1',
              content: story.content,
              images: [],
              layout: 'standard'
            },
            {
              page_number: 3,
              page_type: 'end',
              title: 'The End',
              content: 'Thank you for reading!',
              images: [],
              layout: 'end'
            }
          ]
        }));
      }
    } catch (error) {
      console.error('Error loading story:', error);
      toast.error('Failed to load story');
    }
  };

  const handleSaveBook = async () => {
    if (!user || !selectedStoryId) return;
    
    try {
      setIsSaving(true);
      
      // Save book
      const { data: savedBook, error: bookError } = await supabase
        .from('books')
        .upsert({
          ...bookData,
          user_id: user.id,
          story_id: selectedStoryId,
          status: 'draft',
          total_pages: bookData.pages.length,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Save pages
      for (const page of bookData.pages) {
        const { error: pageError } = await supabase
          .from('book_pages')
          .upsert({
            ...page,
            book_id: savedBook.id,
            updated_at: new Date().toISOString()
          });
        
        if (pageError) throw pageError;
      }

      toast.success('Book saved successfully!');
      
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!bookData.title) {
      toast.error('Please add a book title first');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/v1/books/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookData,
          storyId: selectedStoryId
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Book exported successfully!');
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Book Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Book Builder</h1>
            <div className="flex items-center space-x-2">
              <select
                value={selectedStoryId}
                onChange={(e) => handleStorySelect(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select a story...</option>
                {stories.map((story: any) => (
                  <option key={story.id} value={story.id}>
                    {story.story_title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleSaveBook}
              disabled={isSaving || !selectedStoryId}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isLoading || !bookData.title}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <BookBuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          pages={bookData.pages}
          selectedPageIndex={selectedPageIndex}
          onPageSelect={setSelectedPageIndex}
        />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Settings/Editor Panel */}
          <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
            {activeSection === 'settings' && (
              <BookSettingsPanel
                bookData={bookData}
                onBookDataChange={setBookData}
                themes={themes}
              />
            )}
            
            {activeSection === 'pages' && (
              <PageEditor
                page={bookData.pages[selectedPageIndex]}
                pageIndex={selectedPageIndex}
                onPageChange={(updatedPage) => {
                  const newPages = [...bookData.pages];
                  newPages[selectedPageIndex] = updatedPage;
                  setBookData(prev => ({ ...prev, pages: newPages }));
                }}
                themes={themes}
              />
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 bg-gray-100">
            <BookPreview
              bookData={bookData}
              currentPageIndex={selectedPageIndex}
              themes={themes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}