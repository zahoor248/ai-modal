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

    // Twitter OAuth 2.0 configuration
    const clientId = process.env.TWITTER_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: "Twitter integration not configured" }, { status: 500 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/twitter/callback`;
    const scope = "tweet.read,tweet.write,users.read,offline.access";
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    const codeChallenge = generateCodeChallenge();

    // Store code verifier for PKCE
    await supabase
      .from('oauth_states')
      .insert({
        user_id: user.id,
        platform: 'twitter',
        state,
        code_verifier: codeChallenge.verifier,
        expires_at: new Date(Date.now() + 600000).toISOString() // 10 minutes
      });

    const authUrl = `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge.challenge}&` +
      `code_challenge_method=S256`;

    return NextResponse.json({ authUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function generateCodeChallenge() {
  const crypto = require('crypto');
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}