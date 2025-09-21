import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const status = searchParams.get("status");

    let query = supabase
      .from("books")
      .select(`
        id,
        title,
        subtitle,
        author_name,
        isbn,
        dimensions,
        status,
        total_pages,
        created_at,
        updated_at,
        stories (
          id,
          story_title
        )
      `, { count: "exact" })
      .eq("user_id", user.id);

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Apply sorting and pagination
    query = query.order("updated_at", { ascending: false });
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: books, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      books: books || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      subtitle,
      author_name,
      isbn,
      dimensions,
      theme_id,
      cover_theme_id,
      story_id,
      metadata,
      pages
    } = await req.json();

    // Validate required fields
    if (!title || !author_name) {
      return NextResponse.json({
        error: "Title and author name are required"
      }, { status: 400 });
    }

    // Create book
    const { data: book, error: bookError } = await supabase
      .from("books")
      .insert({
        user_id: user.id,
        story_id: story_id || null,
        title,
        subtitle: subtitle || null,
        author_name,
        isbn: isbn || null,
        dimensions: dimensions || "A4",
        theme_id: theme_id || null,
        cover_theme_id: cover_theme_id || null,
        total_pages: pages ? pages.length : 0,
        status: "draft",
        metadata: metadata || {}
      })
      .select()
      .single();

    if (bookError) {
      return NextResponse.json({ error: bookError.message }, { status: 400 });
    }

    // Create pages if provided
    if (pages && Array.isArray(pages) && pages.length > 0) {
      const pagesData = pages.map((page, index) => ({
        book_id: book.id,
        page_number: page.page_number || index + 1,
        page_type: page.page_type || 'content',
        title: page.title || '',
        content: page.content || '',
        images: page.images || [],
        theme_override: page.theme_override || null,
        layout: page.layout || 'standard'
      }));

      const { error: pagesError } = await supabase
        .from("book_pages")
        .insert(pagesData);

      if (pagesError) {
        console.error("Failed to create pages:", pagesError);
        // Don't fail the book creation, just log the error
      }
    }

    return NextResponse.json({ book }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}