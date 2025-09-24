import { v4 as uuidv4 } from "uuid";

/**
 * Types
 */
export interface PageContent {
  type: string;
  text?: string;
  level?: number;
  children?: PageContent[];
}

export interface PageMetadata {
  title: string;
  description?: string;
  wordCount: number;
  pageNumber: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PageStyle {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  alignment: "left" | "center" | "right" | "justify";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  backgroundColor: string;
  textColor: string;
}

export interface BookPage {
  id: string;
  uuid: string;
  templateId: string;
  type: "content" | "toc" | "cover";
  title: string;
  content: PageContent[];
  metadata: PageMetadata;
  style: PageStyle;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface BookData {
  id: string;
  uuid: string;
  title: string;
  author_name: string;
  pages: BookPage[];
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  metadata: {
    title: string;
    author: string;
    description: string;
    language: string;
    status: "draft" | "published" | "archived";
    tags: string[];
    wordCount: number;
    pageCount: number;
    categories: string[];
    customFields: Record<string, string>;
  };
  settings: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textColor: string;
    backgroundColor: string;
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    pageNumberStyle: {
      position: "header" | "footer";
      alignment: "left" | "center" | "right";
      fontSize: number;
      showOnFirstPage: boolean;
    };
  };
  collaborators: {
    id: string;
    role: "owner" | "editor" | "viewer";
    permissions: string[];
  }[];
  permissions: {
    canEdit: string[];
    canView: string[];
    canShare: string[];
  };
  export_settings: {
    pdf: {
      pageSize: "A4" | "Letter";
      margins: { top: number; right: number; bottom: number; left: number };
      includeToc: boolean;
      includePageNumbers: boolean;
    };
    epub: { includeMetadata: boolean; compressImages: boolean };
    html: { includeCss: boolean; inlineStyles: boolean };
  };
  custom_fields: Record<string, string>;
}

/**
 * Utils
 */
export const updatePageNumbers = (pages: BookPage[]): BookPage[] =>
  pages.map((page, index) => ({
    ...page,
    metadata: {
      ...page.metadata,
      pageNumber: index + 1,
    },
  }));

export const createPageFromTemplate = (
    templateId: string,
    type: BookPage["type"],
    title: string,
    content: PageContent[],
    userId = "system"
): any => {
  const now = new Date().toISOString();
  return {
    id: `page-${Date.now()}-${Math.random()}`,
    uuid: uuidv4(),
    templateId,
    type,
    title,
    content,
    metadata: {
      title,
      description: "",
      wordCount: content.reduce(
        (acc, c) => acc + (c.text ? c.text.split(/\s+/).length : 0),
        0
      ),
      pageNumber: 0, // assigned later
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    },
    style: {
      fontSize: 12,
      fontFamily: "Times New Roman",
      lineHeight: 1.5,
      alignment: "left",
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  };
};

export function createDefaultBook(): BookData {
  const now = new Date().toISOString();
  const userId = "system";

  const defaultBook: BookData = {
    id: `book-${Date.now()}`,
    uuid: uuidv4(),
    title: "Untitled Book",
    author_name: "Unknown Author",
    pages: [],
    status: "draft",
    created_at: now,
    updated_at: now,
    metadata: {
      title: "Untitled Book",
      author: "Unknown Author",
      description: "A new book created with the book builder",
      language: "en-US",
      status: "draft",
      tags: ["draft"],
      wordCount: 0,
      pageCount: 0,
      categories: ["Uncategorized"],
      customFields: {},
    },
    settings: {
      fontFamily: "Times New Roman",
      fontSize: 12,
      lineHeight: 1.5,
      textColor: "#000000",
      backgroundColor: "#ffffff",
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      pageNumberStyle: {
        position: "footer",
        alignment: "center",
        fontSize: 10,
        showOnFirstPage: false,
      },
    },
    collaborators: [
      {
        id: userId,
        role: "owner",
        permissions: ["edit", "view", "share"],
      },
    ],
    permissions: {
      canEdit: [userId],
      canView: [userId],
      canShare: [userId],
    },
    export_settings: {
      pdf: {
        pageSize: "A4",
        margins: { top: 72, right: 72, bottom: 72, left: 72 },
        includeToc: true,
        includePageNumbers: true,
      },
      epub: { includeMetadata: true, compressImages: true },
      html: { includeCss: true, inlineStyles: true },
    },
    custom_fields: {},
  };

  // Add a sample page
  const samplePage = createPageFromTemplate(
    "default",
    "content",
    "Chapter 1",
    [
      {
        type: "paragraph",
        text: "This is your first page. Start writing your story here!",
      },
    ],
    userId
  );

  defaultBook.pages = updatePageNumbers([samplePage]);

  return defaultBook;
}

/**
 * Table of Contents
 */
export interface TocEntry {
  title: string;
  pageNumber: number;
  level: number;
}

export const generateTableOfContents = (pages: BookPage[]): TocEntry[] =>
  pages
    .filter((p) => p.type === "content" && p.title)
    .map((p) => ({
      title: p.title,
      pageNumber: p.metadata.pageNumber,
      level: 1,
    }));

export const createTocPage = (entries: TocEntry[]): BookPage => {
  const now = new Date().toISOString();
  return {
    id: `toc-${Date.now()}`,
    uuid: uuidv4(),
    templateId: "table-of-contents",
    type: "toc",
    title: "Table of Contents",
    content: entries.map((entry) => ({
      type: "toc-entry",
      text: entry.title,
      children: [
        { type: "page-number", text: entry.pageNumber.toString() },
      ],
    })),
    metadata: {
      title: "Table of Contents",
      description: "Generated automatically",
      wordCount: entries.length,
      pageNumber: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
      updatedBy: "system",
    },
    style: {
      fontSize: 12,
      fontFamily: "Times New Roman",
      lineHeight: 1.5,
      alignment: "left",
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdBy: "system",
    updatedBy: "system",
  };
};

/**
 * Book manipulation
 */
export const addPage = (
  book: BookData,
  page: BookPage,
  position?: number
): BookData => {
  const pages = [...book.pages];
  if (position === undefined || position < 0 || position > pages.length) {
    pages.push(page);
  } else {
    pages.splice(position, 0, page);
  }
  return { ...book, pages: updatePageNumbers(pages) };
};

export const removePage = (book: BookData, pageId: string): BookData => {
  const pages = book.pages.filter((p) => p.id !== pageId);
  return { ...book, pages: updatePageNumbers(pages) };
};

export const movePage = (
  book: BookData,
  fromIndex: number,
  toIndex: number
): BookData => {
  const pages = [...book.pages];
  const [moved] = pages.splice(fromIndex, 1);
  pages.splice(toIndex, 0, moved);
  return { ...book, pages: updatePageNumbers(pages) };
};

/**
 * Metadata Export
 */
export const generateBookMetadata = (book: BookData): string => {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <title>${escapeXml(book.metadata.title)}</title>
  <author>${escapeXml(book.metadata.author)}</author>
  <language>${book.metadata.language}</language>
  <description>${escapeXml(book.metadata.description)}</description>
  <status>${book.metadata.status}</status>
  <wordCount>${book.metadata.wordCount}</wordCount>
  <pageCount>${book.metadata.pageCount}</pageCount>
  <tags>${book.metadata.tags
    .map((tag) => `<tag>${escapeXml(tag)}</tag>`)
    .join("")}</tags>
  <categories>${book.metadata.categories
    .map((cat) => `<category>${escapeXml(cat)}</category>`)
    .join("")}</categories>
</metadata>`;
};
