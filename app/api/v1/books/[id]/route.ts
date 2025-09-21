import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the book with pages
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select(`
        *,
        stories (
          id,
          story_title,
          content
        ),
        book_pages (
          id,
          page_number,
          page_type,
          title,
          content,
          images,
          theme_override,
          layout
        )
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (bookError) {
      if (bookError.code === "PGRST116") {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      return NextResponse.json({ error: bookError.message }, { status: 400 });
    }

    // Sort pages by page number
    if (book.book_pages) {
      book.book_pages.sort((a, b) => a.page_number - b.page_number);
    }

    return NextResponse.json({ book });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { id } = params;
    const updates = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate allowed fields for updates
    const allowedFields = [
      "title", "subtitle", "author_name", "isbn", "dimensions", 
      "theme_id", "cover_theme_id", "status", "metadata"
    ];
    
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    // Add updated timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    // Update book
    const { data: book, error } = await supabase
      .from("books")
      .update(filteredUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update pages if provided
    if (updates.pages && Array.isArray(updates.pages)) {
      // Delete existing pages
      await supabase
        .from("book_pages")
        .delete()
        .eq("book_id", id);

      // Insert new pages
      const pagesData = updates.pages.map((page, index) => ({
        book_id: id,
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
        console.error("Failed to update pages:", pagesError);
      }

      // Update total pages count
      await supabase
        .from("books")
        .update({ total_pages: updates.pages.length })
        .eq("id", id);
    }

    return NextResponse.json({ book });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete book (pages will be deleted automatically due to foreign key cascade)
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}