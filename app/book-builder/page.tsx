"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { v4 as uuidv4 } from "uuid";
import {
  Download,
  Save,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Settings,
  BookOpen,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Bookmark,
  List,
  FileArchive,
  FileCheck,
  FileCode,
  FileX,
  FileSearch,
  FileSpreadsheet,
  FileType2,
  FileWarning,
  FileQuestion,
  FileJson,
  FileOutput,
  FileInput as FileInputIcon,
  FileVideo,
  FileImage,
  FileUp,
  FileDown,
  FileTerminal,
  FileType,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  LayoutDashboard,
  Type as TypeIcon,
  Palette,
  BookOpenCheck,
  BookText,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import our enhanced book components
import { EnhancedSidebar } from "@/components/book-builder/EnhancedSidebar";
import { EnhancedPageEditor } from "@/components/book-builder/EnhancedPageEditor";
import { EnhancedBookPreview } from "@/components/book-builder/EnhancedBookPreview";

// Import our types and utilities
import { BookData, BookPage, BookTheme, PageType } from "@/types/book";
import { PAGE_TEMPLATES, getTemplateById } from "@/lib/book-templates";
import {
  createDefaultBook,
  createPageFromTemplate,
  migrateLegacyBook,
} from "@/lib/book-utils";

// Define the type for our active section
type ActiveSection = "pages" | "settings" | "preview";

export default function BookBuilderPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const previewRef = useRef<HTMLDivElement>(null);

  // State for the book builder
  const [user, setUser] = useState<any>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [bookData, setBookData] = useState<BookData>(() => {
    return createDefaultBook("system");
  });

  // UI State
  const [activeSection, setActiveSection] = useState<ActiveSection>("pages");
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [themes, setThemes] = useState<BookTheme[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Preview settings
  const [previewScale, setPreviewScale] = useState(0.8);
  const [showGuides, setShowGuides] = useState(true);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get the current page
  const currentPage = bookData.pages[selectedPageIndex] || bookData.pages[0];

  // Create a stable reference to the current page
  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Load user and initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Load themes
      const { data: themesData } = await supabase
        .from("book_themes")
        .select("*")
        .order("sort_order");

      if (themesData) {
        setThemes(themesData);
        if (themesData.length > 0) {
          setBookData((prev) => ({
            ...prev,
            theme_id: themesData[0].id,
            cover_theme_id: themesData[0].id,
          }));
        }
      }

      // Load user stories
      const { data: storiesData } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (storiesData) {
        setStories(storiesData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorySelect = async (storyId: string) => {
    if (!storyId) return;

    try {
      setIsLoading(true);
      const { data: story } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();

      if (story) {
        setSelectedStoryId(storyId);

        // Create a new book with the story content
        const newBook = createDefaultBook();
        const now = new Date().toISOString();

        // Create cover page
        const coverPage = createPageFromTemplate(
          "standard-cover",
          "cover",
          story.story_title || "Untitled Story",
          [
            {
              type: "heading",
              text: story.story_title || "Untitled Story",
              level: 1,
            },
            {
              type: "paragraph",
              text: story.subtitle || "",
            },
            {
              type: "paragraph",
              text: `By ${user?.user_metadata?.name || "Author"}`,
            },
          ],
          user?.id
        );

        // Create content page
        const contentPage = createPageFromTemplate(
          "chapter",
          "chapter",
          "Chapter 1",
          [
            {
              type: "heading",
              text: "The Beginning",
              level: 1,
            },
            {
              type: "paragraph",
              text: story.content || "Start writing your story here...",
            },
          ],
          user?.id
        );

        // Create end page
        const endPage = createPageFromTemplate(
          "epilogue",
          "epilogue",
          "The End",
          [
            {
              type: "paragraph",
              text: "Thank you for reading!",
            },
          ],
          user?.id
        );

        // Update the book data
        setBookData({
          ...newBook,
          title: story.story_title,
          author_name: user?.user_metadata?.name || "Author",
          pages: [coverPage, contentPage, endPage],
          updated_at: now,
        });

        toast.success("Story loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading story:", error);
      toast.error("Failed to load story");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBook = async () => {
    if (!user) {
      toast.error("You must be logged in to save a book");
      return;
    }

    try {
      setIsSaving(true);

      // Prepare book data
      const now = new Date().toISOString();
      const bookToSave = {
        ...bookData,
        user_id: user.id,
        status: "draft",
        total_pages: bookData.pages.length,
        updated_at: now,
        created_at: bookData.created_at || now,
      };

      // Remove any client-side only properties before saving
      delete (bookToSave as any).id;

      // Save book
      const { data: savedBook, error: bookError } = await supabase
        .from("books")
        .upsert({
          ...bookToSave,
          ...(bookData.id && { id: bookData.id }), // Only include ID if it exists
          story_id: selectedStoryId || null,
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Save pages
      const pagePromises = bookData.pages.map(async (page, index) => {
        const pageToSave = {
          ...page,
          book_id: savedBook.id,
          page_number: index + 1,
          updated_at: now,
        };

        // Remove any client-side only properties
        delete (pageToSave as any).id;

        const { error: pageError } = await supabase.from("book_pages").upsert({
          ...pageToSave,
          ...(page.id && { id: page.id }), // Only include ID if it exists
        });

        if (pageError) throw pageError;
      });

      await Promise.all(pagePromises);

      // Update local state with saved data
      setBookData((prev) => ({
        ...prev,
        id: savedBook.id,
        updated_at: now,
        created_at: savedBook.created_at || now,
      }));

      toast.success("Book saved successfully!");

      // Refresh the stories list to show the updated book
      if (selectedStoryId) {
        const { data: updatedStories } = await supabase
          .from("stories")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (updatedStories) {
          setStories(updatedStories);
        }
      }

      return savedBook;
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("Failed to save book");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!bookData.title) {
      toast.error("Please add a book title first");
      return;
    }

    try {
      setIsExporting(true);

      // First, save the book to ensure we have the latest version
      const savedBook = await handleSaveBook();

      if (!savedBook) {
        throw new Error("Failed to save book before export");
      }

      // Show a loading toast with a progress indicator
      const toastId = toast.loading("Preparing your book for export...");

      // Call the export API
      const response = await fetch("/api/v1/books/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (
              await supabase.auth.getSession()
            ).data.session?.access_token
          }`,
        },
        body: JSON.stringify({
          bookId: savedBook.id,
          format: "pdf",
          includeCover: true,
          includeToc: true,
          pageSize: "A4",
          margin: {
            top: "2cm",
            right: "2.5cm",
            bottom: "2cm",
            left: "2.5cm",
          },
          printOptions: {
            bleed: "3mm",
            cropMarks: true,
            colorProfile: "CMYK",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Export failed");
      }

      // Get the blob and create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bookData.title.replace(/[^a-zA-Z0-9]/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Book exported successfully!", { id: toastId });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to export PDF"
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Handler for adding a new page
  const handleAddPage = (type: string) => {
    const pageType = type as PageType;
    const title =
      pageType === "chapter"
        ? `Chapter ${
            bookData.pages.filter((p) => p.type === "chapter").length + 1
          }`
        : pageType === "toc"
        ? "Table of Contents"
        : pageType === "cover"
        ? bookData.title
        : `Page ${bookData.pages.length + 1}`;

    const content =
      pageType === "toc"
        ? []
        : pageType === "cover"
        ? []
        : [
            {
              type: "paragraph",
              text: `This is a new ${pageType} page. Start writing here...`,
            },
          ];

    const newPage = createPageFromTemplate(
      `${pageType}-template`,
      pageType,
      title,
      content,
      user?.id || "system",
      {
        customMetadata: {
          status: "draft",
          tags: [pageType, "new"],
        },
      }
    );

    setBookData((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));

    // Select the new page
    setSelectedPageIndex(bookData.pages.length);

    // Scroll to the new page in the preview
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  // Handler for deleting a page
  const handleDeletePage = (index: number) => {
    if (bookData.pages.length <= 1) {
      toast.error("Cannot delete the last page");
      return;
    }

    const newPages = [...bookData.pages];
    newPages.splice(index, 1);

    // Update page numbers
    const updatedPages = newPages.map((page, i) => ({
      ...page,
      pageNumber: i + 1,
    }));

    setBookData((prev) => ({
      ...prev,
      pages: updatedPages,
    }));

    // Adjust selected index if needed
    if (selectedPageIndex >= index) {
      setSelectedPageIndex(Math.max(0, selectedPageIndex - 1));
    }

    toast.success("Page deleted");
  };

  // Handler for reordering pages
  const handlePageReorder = (oldIndex: number, newIndex: number) => {
    const newPages = [...bookData.pages];
    const [movedPage] = newPages.splice(oldIndex, 1);
    newPages.splice(newIndex, 0, movedPage);

    // Update page numbers
    const updatedPages = newPages.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }));

    setBookData((prev) => ({
      ...prev,
      pages: updatedPages,
    }));

    // Update selected index
    setSelectedPageIndex(newIndex);
  };

  // Handler for updating a page
  const handlePageUpdate = (updatedPage: BookPage) => {
    const newPages = [...bookData.pages];
    newPages[selectedPageIndex] = updatedPage;

    setBookData((prev) => ({
      ...prev,
      pages: newPages,
      updated_at: new Date().toISOString(),
    }));
  };

  // Handler for updating the entire book data
  const handleBookDataUpdate = (updates: Partial<BookData>) => {
    setBookData((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  // Loading state
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">
            Loading Book Builder
          </h2>
          <p className="text-muted-foreground">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Book Builder
              </h1>
            </div>

            <div className="relative w-64">
              <Select
                value={selectedStoryId || "null"}
                onValueChange={handleStorySelect}
                disabled={isLoading || isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a story..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="e">Create New Book</SelectItem>
                    <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      Your Stories
                    </SelectLabel>
                    {stories.length > 0 ? (
                      stories.map((story) => (
                        <SelectItem key={story.id} value={story.id}>
                          <div className="flex items-center space-x-2">
                            <BookText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">
                              {story.story_title}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-stories" disabled>
                        <span className="px-1 py-1 text-sm text-muted-foreground">
                          No stories found
                        </span>
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {bookData.title && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Editing:</span>
                <span className="text-sm font-medium text-foreground truncate max-w-xs">
                  {bookData.title}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveBook}
              disabled={isSaving || !bookData.title}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleExportPDF}
              disabled={
                isExporting || !bookData.title || bookData.pages.length === 0
              }
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "Export"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden md:flex"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Sidebar */}
        <EnhancedSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection as any}
          pages={bookData.pages.map((page) => ({
            id: page.id,
            title: page.title,
            type: page.type,
            pageNumber: page.pageNumber || 1,
          }))}
          selectedPageIndex={selectedPageIndex}
          onPageSelect={setSelectedPageIndex}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onPageReorder={handlePageReorder}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Editor Panel */}
          {activeSection === "pages" && (
            <div
              className={cn(
                "w-full md:w-96 lg:w-[28rem] border-r border-border bg-background overflow-y-auto",
                isFullscreen && "hidden md:block"
              )}
            >
              {currentPage && (
                <EnhancedPageEditor
                  page={{
                    id: currentPage.id,
                    type: currentPage.type as any,
                    title: currentPage.title,
                    content: currentPage.content,
                    pageNumber: currentPage.pageNumber || 1,
                    layout: currentPage.layout,
                    style: currentPage.styles,
                  }}
                  onPageChange={handlePageUpdate}
                  themes={themes}
                  className="h-full"
                />
              )}
            </div>
          )}

          {/* Settings Panel */}
          {activeSection === "settings" && (
            <div className="w-full md:w-96 lg:w-[28rem] border-r border-border bg-background overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-6 text-foreground">
                Book Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="book-title">Book Title</Label>
                  <Input
                    id="book-title"
                    value={bookData.title}
                    onChange={(e) =>
                      handleBookDataUpdate({ title: e.target.value })
                    }
                    placeholder="Enter book title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="book-author">Author Name</Label>
                  <Input
                    id="book-author"
                    value={bookData.author_name}
                    onChange={(e) =>
                      handleBookDataUpdate({ author_name: e.target.value })
                    }
                    placeholder="Enter author name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Book Description</Label>
                  <Textarea
                    value={bookData.description || ""}
                    onChange={(e) =>
                      handleBookDataUpdate({ description: e.target.value })
                    }
                    placeholder="Enter a short description of your book"
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Theme</Label>
                  <Select
                    value={bookData.theme_id || "24378"}
                    onValueChange={(value) =>
                      handleBookDataUpdate({ theme_id: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes && themes.length > 0 ? (
                        themes.map((theme) => {
                          const themeId = String(theme?.id || "").trim();
                          const themeName = String(
                            theme?.name || "Untitled Theme"
                          ).trim();
                          return (
                            <SelectItem
                              key={
                                themeId ||
                                `theme-${Math.random()
                                  .toString(36)
                                  .substr(2, 9)}`
                              }
                              value={themeId || "default"}
                            >
                              {themeName}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem value="no-themes" disabled>
                          No themes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">
                    Export Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Page Size</Label>
                      <Select
                        value={bookData.settings?.page_size || "A4"}
                        onValueChange={(value) =>
                          handleBookDataUpdate({
                            settings: {
                              ...bookData.settings,
                              page_size: value as any,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                          <SelectItem value="Letter">
                            Letter (8.5 × 11 in)
                          </SelectItem>
                          <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
                          <SelectItem value="B5">B5 (176 × 250 mm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Orientation</Label>
                        <Select
                          value={bookData.settings?.orientation || "portrait"}
                          onValueChange={(value) =>
                            handleBookDataUpdate({
                              settings: {
                                ...bookData.settings,
                                orientation: value as any,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Page Numbers</Label>
                        <Select
                          value={
                            bookData.settings?.show_page_numbers
                              ? "show"
                              : "hide"
                          }
                          onValueChange={(value) =>
                            handleBookDataUpdate({
                              settings: {
                                ...bookData.settings,
                                show_page_numbers: value === "show",
                              },
                            })
                          }
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="show">Show</SelectItem>
                            <SelectItem value="hide">Hide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? "Exporting..." : "Export Book"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          <div
            className={cn(
              "flex-1 bg-muted/30 overflow-hidden",
              activeSection === "preview" ? "block" : "hidden md:block"
            )}
          >
            <EnhancedBookPreview
              book={{
                title: bookData.title || "Untitled Book",
                pages: bookData.pages,
                theme_id: bookData.theme_id,
                // Pass the full theme object if available
                theme: themes.find((t) => t.id === bookData.theme_id) || null,
              }}
              currentPageIndex={selectedPageIndex}
              onPageChange={setSelectedPageIndex}
              scale={previewScale}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center py-2 px-4 z-10">
        <button
          onClick={() => setActiveSection("pages")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            activeSection === "pages" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <TypeIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Edit</span>
        </button>

        <button
          onClick={() => setActiveSection("preview")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            activeSection === "preview"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Preview</span>
        </button>

        <button
          onClick={() => setActiveSection("settings")}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            activeSection === "settings"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>

      {/* Add some padding to account for the mobile navigation */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
