import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Transcript Search API Route
 * Bridges frontend search requests to the C# backend search API
 * Transforms query parameters into the backend's TranscriptSearchRequest format
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headersList = await headers();
    const cookiesList = await cookies();

    const authHeader = headersList.get("authorization") || "";
    const cookiesString = cookiesList.toString();

    // Call the backend search API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transcripts?${searchParams}`;
    console.log("Calling backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookiesString,
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend search failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Backend search failed: ${response.status} - ${errorText}`
      );
    }

    const searchResponse = await response.json();

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      {
        error: "Search failed",
        searchType: "transcript",
        query: "",
        results: [],
        totalCount: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      { status: 500 }
    );
  }
}
