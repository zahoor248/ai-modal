import { v4 as uuidv4 } from "uuid";

// Import types from the canonical types/book.ts
import type { 
  BookPage, 
  PageContent, 
  BookData, 
  PageType, 
  PageMetadata, 
  PageStyles,
  PageNavigation,
  PageStatus
} from "@/types/book";

/**
 * Utils
 */
export const updatePageNumbers = (pages: BookPage[]): BookPage[] =>
  pages.map((page, index) => ({
    ...page,
    pageNumber: index + 1,
    navigation: {
      ...page.navigation,
      position: {
        ...page.navigation.position,
        absolute: index + 1
      }
    }
  }));

/**
 * Creates a new page from a template
 */
export function createPageFromTemplate(
  templateId: string,
  pageType: PageType,
  title: string,
  content: any[] = [],
  userId: string = 'system',
  customOptions: any = {}
): BookPage {
  const now = new Date().toISOString();
  const pageId = uuidv4();
  
  // Create default page content
  const defaultContent: PageContent = {
    blocks: content.map(block => ({
      type: block.type || 'paragraph',
      content: block.text || block.content || '',
      level: block.level || undefined
    })),
    version: 1,
    lastModified: now,
    lastModifiedBy: userId,
    title: title,
    ...customOptions.customContent
  };

  // Create default metadata
  const defaultMetadata: PageMetadata = {
    created: now,
    updated: now,
    createdBy: userId,
    updatedBy: userId,
    status: 'draft' as PageStatus,
    tags: customOptions.customMetadata?.tags || [],
    wordCount: 0,
    characterCount: 0,
    readingTime: 0,
    customMetadata: {
      status: 'draft',
      tags: [pageType]
    },
    ...customOptions.customMetadata
  };

  // Create default styles
  const defaultStyles: PageStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
    textAlign: 'left',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    margin: {
      top: '2cm',
      right: '2cm',
      bottom: '2cm',
      left: '2cm'
    },
    padding: '0'
  };

  // Create default navigation
  const defaultNavigation: PageNavigation = {
    parentId: null,
    firstChildId: null,
    lastChildId: null,
    previousSiblingId: null,
    nextSiblingId: null,
    previousPageId: null,
    nextPageId: null,
    depth: 0,
    path: [],
    position: {
      absolute: 1,
      chapter: 1,
      section: 1
    },
    isExpanded: false,
    isVisibleInToc: pageType !== 'blank'
  };

  return {
    id: pageId,
    uuid: pageId,
    templateId,
    type: pageType,
    title,
    subtitle: customOptions.subtitle,
    content: defaultContent,
    layout: customOptions.layout || 'standard',
    styles: defaultStyles,
    metadata: defaultMetadata,
    navigation: defaultNavigation,
    isVisible: true,
    isLocked: false,
    version: 1,
    pageNumber: 1,
    pageNumberStyle: {
      position: 'footer',
      alignment: 'center',
      format: '1',
      startAt: 1,
      showInToc: true
    },
    customFields: customOptions.customFields || {}
  };
}

/**
 * Creates a default book structure
 */
export function createDefaultBook(userId: string = 'system'): BookData {
  const now = new Date().toISOString();
  const bookId = uuidv4();

  // Create cover page
  const coverPage = createPageFromTemplate(
    'standard-cover',
    'cover',
    'Book Title',
    [
      { type: 'heading', text: 'Book Title', level: 1 },
      { type: 'paragraph', text: 'Subtitle' },
      { type: 'paragraph', text: 'Author Name' }
    ],
    userId
  );

  // Create title page
  const titlePage = createPageFromTemplate(
    'title-page',
    'title',
    'Title Page',
    [
      { type: 'heading', text: 'Book Title', level: 1 },
      { type: 'paragraph', text: 'Author Name' }
    ],
    userId
  );

  // Create sample content page
  const contentPage = createPageFromTemplate(
    'chapter',
    'chapter',
    'Chapter 1',
    [
      { type: 'heading', text: 'Chapter 1', level: 1 },
      { type: 'paragraph', text: 'This is your first chapter. Start writing your story here!' }
    ],
    userId
  );

  const defaultBook: BookData = {
    id: bookId,
    uuid: bookId,
    title: 'New Book',
    author_name: 'Author',
    description: 'A new book created with the Book Builder',
    pages: updatePageNumbers([coverPage, titlePage, contentPage]),
    theme_id: 'default',
    status: 'draft',
    created_at: now,
    updated_at: now,
    version: '1.0.0',
    metadata: {
      title: 'New Book',
      author: 'Author',
      description: 'A new book created with the Book Builder',
      language: 'en',
      status: 'draft',
      tags: [],
      categories: [],
      wordCount: 0,
      pageCount: 3
    },
    settings: {
      page_size: 'A4',
      orientation: 'portrait',
      show_page_numbers: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      header: {
        enabled: false,
        content: '',
        height: '1cm'
      },
      footer: {
        enabled: true,
        content: 'Page {pageNumber}',
        height: '1cm'
      }
    },
    collaborators: [
      {
        id: userId,
        role: 'owner',
        name: 'Owner',
        email: '',
        joined_at: now
      }
    ],
    permissions: {
      can_edit: true,
      can_export: true,
      can_share: true,
      can_delete: true
    },
    export_settings: {
      format: 'pdf',
      includeCover: true,
      includeToc: true,
      pageSize: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      printOptions: {
        bleed: '3mm',
        cropMarks: true,
        colorProfile: 'CMYK'
      }
    },
    custom_fields: {}
  };

  return defaultBook;
}

// Helper function to convert old format pages to new format
export function migrateLegacyPage(oldPage: any): BookPage {
  const now = new Date().toISOString();
  const pageId = oldPage.id || uuidv4();
  
  return {
    id: pageId,
    uuid: pageId,
    templateId: oldPage.templateId || 'default',
    type: oldPage.type || 'content',
    title: oldPage.title || 'Untitled',
    subtitle: oldPage.subtitle,
    content: {
      blocks: Array.isArray(oldPage.content) 
        ? oldPage.content.map((block: any) => ({
            type: block.type || 'paragraph',
            content: block.text || block.content || '',
            level: block.level
          }))
        : [{ type: 'paragraph', content: oldPage.content || '' }],
      version: 1,
      lastModified: oldPage.updatedAt || now,
      lastModifiedBy: oldPage.updatedBy || 'system'
    },
    layout: oldPage.layout || 'standard',
    styles: {
      fontFamily: oldPage.style?.fontFamily || 'Inter, sans-serif',
      fontSize: oldPage.style?.fontSize ? `${oldPage.style.fontSize}px` : '16px',
      lineHeight: oldPage.style?.lineHeight || 1.6,
      textAlign: oldPage.style?.alignment || 'left',
      textColor: oldPage.style?.textColor || '#000000',
      backgroundColor: oldPage.style?.backgroundColor || '#ffffff',
      margin: oldPage.style?.margins ? {
        top: `${oldPage.style.margins.top}px`,
        right: `${oldPage.style.margins.right}px`,
        bottom: `${oldPage.style.margins.bottom}px`,
        left: `${oldPage.style.margins.left}px`
      } : {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      }
    },
    metadata: {
      created: oldPage.createdAt || now,
      updated: oldPage.updatedAt || now,
      createdBy: oldPage.createdBy || 'system',
      updatedBy: oldPage.updatedBy || 'system',
      status: oldPage.status || 'draft',
      tags: [],
      wordCount: oldPage.metadata?.wordCount || 0,
      customMetadata: {
        status: 'draft',
        tags: [oldPage.type || 'content']
      }
    },
    navigation: {
      parentId: null,
      firstChildId: null,
      lastChildId: null,
      previousSiblingId: null,
      nextSiblingId: null,
      previousPageId: null,
      nextPageId: null,
      depth: 0,
      path: [],
      position: {
        absolute: oldPage.pageNumber || 1,
        chapter: 1,
        section: 1
      },
      isExpanded: false,
      isVisibleInToc: true
    },
    isVisible: true,
    isLocked: false,
    version: 1,
    pageNumber: oldPage.pageNumber || 1,
    pageNumberStyle: {
      position: 'footer',
      alignment: 'center',
      format: '1',
      startAt: 1,
      showInToc: true
    },
    customFields: {}
  };
}

// Helper function to convert old format book to new format
export function migrateLegacyBook(oldBook: any): BookData {
  const now = new Date().toISOString();
  
  return {
    id: oldBook.id,
    uuid: oldBook.uuid || oldBook.id,
    title: oldBook.title || 'Untitled Book',
    author_name: oldBook.author_name || 'Unknown Author',
    description: oldBook.description,
    pages: oldBook.pages?.map(migrateLegacyPage) || [],
    theme_id: oldBook.theme_id,
    status: oldBook.status || 'draft',
    created_at: oldBook.created_at || now,
    updated_at: oldBook.updated_at || now,
    version: oldBook.version || '1.0.0',
    metadata: {
      title: oldBook.title || 'Untitled Book',
      author: oldBook.author_name || 'Unknown Author',
      description: oldBook.description || '',
      language: oldBook.metadata?.language || 'en',
      status: oldBook.status || 'draft',
      tags: oldBook.metadata?.tags || [],
      categories: oldBook.metadata?.categories || [],
      wordCount: oldBook.metadata?.wordCount || 0,
      pageCount: oldBook.pages?.length || 0
    },
    settings: {
      page_size: oldBook.page_size || 'A4',
      orientation: oldBook.orientation || 'portrait',
      show_page_numbers: oldBook.show_page_numbers !== false,
      margin: oldBook.settings?.margins ? {
        top: `${oldBook.settings.margins.top}px`,
        right: `${oldBook.settings.margins.right}px`,
        bottom: `${oldBook.settings.margins.bottom}px`,
        left: `${oldBook.settings.margins.left}px`
      } : {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      header: {
        enabled: false,
        content: '',
        height: '1cm'
      },
      footer: {
        enabled: true,
        content: 'Page {pageNumber}',
        height: '1cm'
      }
    },
    collaborators: oldBook.collaborators || [],
    permissions: oldBook.permissions || {
      can_edit: true,
      can_export: true,
      can_share: true,
      can_delete: true
    },
    export_settings: oldBook.export_settings || {
      format: 'pdf',
      includeCover: true,
      includeToc: true,
      pageSize: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      }
    },
    custom_fields: oldBook.custom_fields || {}
  };
}