import { PageTemplate } from "@/lib/book-templates";

export interface BookMetadata {
  title?: string;
  subtitle?: string;
  author?: string;
  description?: string;
  language?: string;
  publisher?: string;
  publishedDate?: string;
  isbn?: string;
  version?: string;
  updated?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  categories?: string[];
  coverImage?: string;
  wordCount?: number;
  pageCount?: number;
  customFields?: Record<string, any>;
}

// Define possible page types
export type PageType = 
  // Front Matter
  'cover' | 'title' | 'copyright' | 'dedication' | 'toc' | 'foreword' | 'preface' | 'acknowledgments' | 'introduction' | 'prologue' |
  // Main Content
  'chapter' | 'section' | 'subchapter' | 'part' | 'act' | 'scene' |
  // Back Matter
  'epilogue' | 'afterword' | 'appendix' | 'glossary' | 'bibliography' | 'index' | 'colophon' | 'back-cover' |
  // Special Pages
  'blank' | 'divider' | 'quote' | 'about-author' | 'testimonials' |
  // Custom
  'custom';

// Define page statuses
export type PageStatus = 'draft' | 'in-review' | 'approved' | 'published' | 'archived';

// Define page content types
export interface PageContent {
  // Core content
  blocks?: any[]; // Rich text editor blocks
  rawHtml?: string; // Raw HTML content
  markdown?: string; // Markdown content
  
  // Versioning
  version: number;
  lastModified: string;
  lastModifiedBy: string;
  
  // Page-specific content
  title?: string;
  subtitle?: string;
  author?: string;
  chapterNumber?: number | string;
  chapterTitle?: string;
  
  // Special content types
  copyrightText?: string;
  isbn?: string;
  publisher?: string;
  
  // TOC specific
  includePageNumbers?: boolean;
  includeChapterTitles?: boolean;
  
  // Custom fields
  customFields?: Record<string, any>;
}

export interface PageMetadata {
  created: string;
  updated: string;
  createdBy?: string;
  updatedBy?: string;
  status: PageStatus;
  tags: string[];
  wordCount?: number;
  characterCount?: number;
  readingTime?: number; // in minutes
  seo?: {
    description?: string;
    keywords?: string[];
    slug?: string;
  };
  customFields?: Record<string, any>;
  customMetadata: {
    status: 'draft',
    tags: ['cover']
  }
}

export interface PageStyles {
  // Layout
  width?: string;
  height?: string;
  margin?: string | {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  padding?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: number | string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  backgroundColor?: string;
  
  // Advanced
  columns?: number;
  columnGap?: string;
  breakBefore?: 'auto' | 'always' | 'avoid' | 'left' | 'right';
  breakAfter?: 'auto' | 'always' | 'avoid' | 'left' | 'right';
  breakInside?: 'auto' | 'avoid';
  
  // Print-specific
  printBackground?: boolean;
  printMargins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export interface PageNavigation {
  // Hierarchical navigation
  parentId: string | null;
  firstChildId: string | null;
  lastChildId: string | null;
  previousSiblingId: string | null;
  nextSiblingId: string | null;
  
  // Flat navigation (for sequential reading)
  previousPageId: string | null;
  nextPageId: string | null;
  
  // Structural information
  depth: number;
  path: string[]; // Array of ancestor IDs
  
  // Position in the book
  position: {
    absolute: number; // Absolute position in the book
    chapter: number; // Position within the current chapter
    section: number; // Position within the current section
  };
  
  // Navigation state
  isExpanded?: boolean;
  isVisibleInToc?: boolean;
  
  // Custom navigation properties
  customNavProperties?: Record<string, any>;
}

export interface BookPage {
  // Core properties
  id: string;
  uuid: string;
  templateId: string;
  type: PageType;
  title: string;
  subtitle?: string;
  
  // Content
  content: PageContent;
  
  // Layout & Styling
  layout: string;
  styles: PageStyles;
  
  // Metadata
  metadata: PageMetadata;
  
  // Navigation & Structure
  navigation: PageNavigation;
  
  // Visibility & State
  isVisible: boolean;
  isLocked?: boolean;
  lockedBy?: string;
  lockedAt?: string;
  
  // Versioning
  version: number;
  history?: Array<{
    version: number;
    timestamp: string;
    author: string;
    changes: string[];
  }>;
  
  // Page numbering
  pageNumber?: number | string; // Can be a number or Roman numerals for front matter
  pageNumberStyle?: {
    position?: 'header' | 'footer' | 'none';
    alignment?: 'left' | 'center' | 'right';
    format?: '1' | 'i' | 'I' | 'a' | 'A';
    startAt?: number;
    showInToc?: boolean;
  };
  
  // Advanced
  customFields?: Record<string, any>;
  permissions?: {
    view?: string[];
    edit?: string[];
    delete?: string[];
  };
}

export interface BookTheme {
  id: string;
  name: string;
  styles: {
    fontFamily: string;
    fontSize: string;
    lineHeight: number;
    textColor: string;
    backgroundColor: string;
    linkColor: string;
    headingFont: string;
    headingColor: string;
    paragraphSpacing: number;
    // Add more theme properties as needed
  };
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookData {
  id?: string;
  uuid?: string;
  title: string;
  author_name: string;
  description?: string;
  pages: BookPage[];
  theme_id?: string;
  status?: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  version?: string;
  metadata?: BookMetadata;
  settings?: {
    page_size?: 'A4' | 'Letter' | 'A5' | 'B5' | 'Executive' | 'Legal' | 'Tabloid';
    orientation?: 'portrait' | 'landscape';
    show_page_numbers?: boolean;
    margin?: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    header?: {
      enabled: boolean;
      content?: string;
      height?: string;
    };
    footer?: {
      enabled: boolean;
      content?: string;
      height?: string;
    };
  };
  collaborators?: Array<{
    id: string;
    role: 'owner' | 'editor' | 'viewer';
    name: string;
    email: string;
    avatar?: string;
    joined_at: string;
    last_active?: string;
  }>;
  permissions?: {
    can_edit?: boolean;
    can_export?: boolean;
    can_share?: boolean;
    can_delete?: boolean;
  };
  export_settings?: BookExportOptions;
  custom_fields?: Record<string, any>;
}

export interface BookExportOptions {
  format: 'pdf' | 'epub' | 'mobi' | 'docx' | 'html' | 'print';
  includeCover: boolean;
  includeToc: boolean;
  pageSize: 'A4' | 'Letter' | 'A5' | 'B5' | 'Executive' | 'Legal' | 'Tabloid';
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  printOptions?: {
    bleed?: string;
    cropMarks?: boolean;
    colorProfile?: string;
  };
  customCss?: string;
  customJs?: string;
}
