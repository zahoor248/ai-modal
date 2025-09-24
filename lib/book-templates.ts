// Book Template Definitions
// These templates define the structure and default content for different types of book pages

import { v4 as uuidv4 } from 'uuid';
import { BookPage, PageStyles, PageType } from "@/types/book";
import { createPageFromTemplate } from './book-utils';

// Define template categories as a const for type safety
const TEMPLATE_CATEGORIES = [
  { id: 'front-matter' as const, name: 'Front Matter', icon: 'FileText' },
  { id: 'body' as const, name: 'Body Content', icon: 'FileText' },
  { id: 'back-matter' as const, name: 'Back Matter', icon: 'FileText' },
  { id: 'special' as const, name: 'Special Pages', icon: 'Star' },
] as const;

// Define template types
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number]['id'];

export type TemplateLayout = 
  | 'cover' 
  | 'title-page' 
  | 'standard' 
  | 'chapter' 
  | 'toc' 
  | 'glossary' 
  | 'bibliography' 
  | 'index' 
  | 'author' 
  | 'section-break' 
  | 'blank' 
  | 'custom' 
  | 'divider' 
  | 'quote';

export interface PageTemplate {
  // Core properties
  id: string;
  name: string;
  description: string;
  type: PageType;
  category: 'front-matter' | 'body' | 'back-matter' | 'special';
  layout: TemplateLayout;
  
  // Content & Styling
  defaultContent: Record<string, any>;
  defaultStyles?: Partial<PageStyles>;
  
  // Metadata
  icon: string;
  previewImage?: string;
  required?: boolean;
  maxPerBook?: number;
  
  // Advanced
  metadata?: {
    version?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    [key: string]: any;
  };
  
  // Deprecated (kept for backward compatibility)
  styles?: Record<string, any>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  // Cover pages
  {
    id: 'standard-cover',
    name: 'Standard Cover',
    description: 'A standard book cover with title, subtitle, and author',
    type: 'cover',
    category: 'front-matter',
    layout: 'cover',
    defaultContent: {
      title: 'Book Title',
      subtitle: 'A Subtitle',
      author: 'Author Name',
      coverImage: '',
      publisher: 'Publisher Name',
      edition: 'First Edition'
    },
    icon: 'book-cover',
    required: true,
    maxPerBook: 1
  },
  
  // Title pages
  {
    id: 'title-page',
    name: 'Title Page',
    description: 'Standard title page with book title, author, and publisher',
    type: 'title',
    category: 'front-matter',
    layout: 'title-page',
    defaultContent: {
      title: 'BOOK TITLE',
      subtitle: 'A Subtitle',
      author: 'Author Name',
      publisher: 'Publisher Name',
      city: 'City',
      year: new Date().getFullYear().toString()
    },
    icon: 'file-text',
    required: true,
    maxPerBook: 1
  },
  
  // Copyright pages
  {
    id: 'copyright-page',
    name: 'Copyright Page',
    description: 'Standard copyright and publication information',
    type: 'copyright',
    category: 'front-matter',
    layout: 'standard',
    defaultContent: {
      copyright: ` ${new Date().getFullYear()} Author Name. All rights reserved.`,
      isbn: '',
      publisher: 'Publisher Name',
      edition: 'First Edition',
      printing: 'First Printing',
      disclaimer: 'This is a work of fiction. Names, characters, businesses, places, events, locales, and incidents are either the products of the author\'s imagination or used in a fictitious manner.'
    },
    icon: 'copyright',
    required: true,
    maxPerBook: 1
  },
  
  // Dedication
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'A page to dedicate the book to someone special',
    type: 'dedication',
    category: 'front-matter',
    layout: 'standard',
    defaultContent: {
      text: 'For [Name]',
      alignment: 'center',
      style: 'italic'
    },
    icon: 'heart',
    required: false,
    maxPerBook: 1
  },
  
  // Table of Contents
  {
    id: 'table-of-contents',
    name: 'Table of Contents',
    description: 'Automatically generated table of contents',
    type: 'toc',
    category: 'front-matter',
    layout: 'toc',
    defaultContent: {
      title: 'Table of Contents',
      showPageNumbers: true,
      showLeaders: true,
      includeChapters: true,
      includeSections: true,
      depth: 2
    },
    icon: 'list',
    required: true,
    maxPerBook: 1
  },
  
  // Chapter
  {
    id: 'chapter',
    name: 'Chapter',
    description: 'A standard chapter page',
    type: 'chapter',
    category: 'body',
    layout: 'chapter',
    defaultContent: {
      title: 'Chapter One',
      subtitle: 'The Beginning',
      content: '[Chapter content goes here]',
      epigraph: {
        text: 'An optional epigraph or quote',
        attribution: '— Author Name',
        alignment: 'right'
      }
    },
    icon: 'book-open',
    required: true,
    maxPerBook: 1000
  },
  
  // Section break
  {
    id: 'section-break',
    name: 'Section Break',
    description: 'A decorative break between sections',
    type: 'section',
    category: 'body',
    layout: 'section-break',
    defaultContent: {
      title: 'Part One',
      subtitle: 'The First Section',
      style: 'ornament',
      customText: '',
      alignment: 'center'
    },
    icon: 'minus',
    required: false,
    maxPerBook: 50
  },
  
  // About the Author
  {
    id: 'about-author',
    name: 'About the Author',
    description: 'A page about the author',
    type: 'about-author',
    category: 'back-matter',
    layout: 'author',
    defaultContent: {
      title: 'About the Author',
      authorName: 'Author Name',
      biography: '[Author biography goes here]',
      photo: '',
      website: '',
      socialMedia: {}
    },
    icon: 'user',
    required: false,
    maxPerBook: 1
  },
  
  // Blank page
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'A blank page for custom content',
    type: 'blank',
    category: 'special',
    layout: 'blank',
    defaultContent: {},
    icon: 'square',
    required: false
  },
  
  // Special Pages
  {
    id: 'divider',
    name: 'Section Divider',
    description: 'A decorative divider between sections',
    type: 'divider',
    category: 'special',
    layout: 'divider',
    defaultContent: {
      style: 'ornament',
      text: '❧',
      alignment: 'center',
      spacing: 'medium'
    },
    icon: 'minus',
    required: false,
    maxPerBook: 50
  },
  {
    id: 'quote',
    name: 'Quote',
    description: 'A block quote with optional attribution',
    type: 'quote',
    category: 'special',
    layout: 'quote',
    defaultContent: {
      text: 'To be, or not to be, that is the question.',
      attribution: 'William Shakespeare',
      alignment: 'center',
      style: 'simple',
      showQuotes: true,
      quoteStyle: 'curly',
      textStyle: 'italic',
      attributionStyle: 'normal'
    },
    icon: 'quote',
    required: false,
    maxPerBook: 100
  },
];

// Helper function to get a template by ID
export function getTemplateById(templateId: string): PageTemplate | null {
  return PAGE_TEMPLATES.find(template => template.id === templateId) || null;
}

// Helper function to get templates by category
export function getTemplatesByCategory(categoryId: string): PageTemplate[] {
  return PAGE_TEMPLATES.filter(template => template.category === categoryId);
}

// Re-export the createPageFromTemplate from book-utils to maintain backward compatibility
export { createPageFromTemplate } from './book-utils';

// Helper function to get the default pages for a new book
export function getDefaultPages(userId?: string): BookPage[] {
  const now = new Date().toISOString();
  
  const coverPage = createPageFromTemplate('cover', 1, {
    createdBy: userId || 'system',
    customMetadata: {
      status: 'draft',
      created: now,
      updated: now,
      tags: ['front-matter', 'cover']
    },
    customContent: {
      title: 'Book Title',
      subtitle: 'A Subtitle',
      author: 'Author Name'
    }
  });
  
  const titlePage = createPageFromTemplate('title', 2, {
    createdBy: userId || 'system',
    customMetadata: {
      status: 'draft',
      created: now,
      updated: now,
      tags: ['front-matter', 'title']
    }
  });
  
  const copyrightPage = createPageFromTemplate('copyright', 3, {
    createdBy: userId || 'system',
    customMetadata: {
      status: 'draft',
      created: now,
      updated: now,
      tags: ['front-matter', 'legal']
    },
    customContent: {
      copyrightText: ` ${new Date().getFullYear()} Author Name. All rights reserved.`,
      isbn: '000-0-0000-0000-0',
      publisher: 'Publisher Name'
    }
  });
  
  const tocPage = createPageFromTemplate('toc', 4, {
    createdBy: userId || 'system',
    customMetadata: {
      status: 'draft',
      created: now,
      updated: now,
      tags: ['front-matter', 'toc']
    },
    customContent: {
      title: 'Table of Contents',
      includePageNumbers: true,
      includeChapterTitles: true
    }
  });
  
  const chapter1Page = createPageFromTemplate('chapter', 5, {
    createdBy: userId || 'system',
    customMetadata: {
      status: 'draft',
      created: now,
      updated: now,
      tags: ['chapter', 'content']
    },
    customContent: {
      title: 'Chapter 1',
      content: 'Begin your story here...'
    }
  });
  
  // Set up navigation between pages
  coverPage.navigation.nextPageId = titlePage.id;
  
  titlePage.navigation.previousPageId = coverPage.id;
  titlePage.navigation.nextPageId = copyrightPage.id;
  
  copyrightPage.navigation.previousPageId = titlePage.id;
  copyrightPage.navigation.nextPageId = tocPage.id;
  
  tocPage.navigation.previousPageId = copyrightPage.id;
  tocPage.navigation.nextPageId = chapter1Page.id;
  
  chapter1Page.navigation.previousPageId = tocPage.id;
  
  return [coverPage, titlePage, copyrightPage, tocPage, chapter1Page];
};
