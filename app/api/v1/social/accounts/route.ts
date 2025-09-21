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

    // Get all social accounts for the user
    const { data: accounts, error } = await supabase
      .from('social_accounts')
      .select(`
        id,
        platform,
        platform_user_id,
        platform_username,
        status,
        scopes,
        token_expires_at,
        metadata,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform accounts to include connection status
    const accountsWithStatus = accounts?.map(account => ({
      ...account,
      isExpired: account.token_expires_at ? 
        new Date(account.token_expires_at) < new Date() : false,
      needsReconnection: account.status !== 'active',
    })) || [];

    return NextResponse.json({ accounts: accountsWithStatus });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId');
    const platform = searchParams.get('platform');

    if (!accountId && !platform) {
      return NextResponse.json({ 
        error: "Either accountId or platform is required" 
      }, { status: 400 });
    }

    let query = supabase
      .from('social_accounts')
      .delete()
      .eq('user_id', user.id);

    if (accountId) {
      query = query.eq('id', accountId);
    } else if (platform) {
      query = query.eq('platform', platform);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: `Social account${platform ? ` for ${platform}` : ''} disconnected successfully` 
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}