import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://serpapi.com/search.json?engine=google_trends_trending_now&hl=en&api_key=${process.env.SERPAPI_KEY}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
