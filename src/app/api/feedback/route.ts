import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Feedback List API Route
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headersList = await headers();
    const cookiesList = await cookies();

    const authHeader = headersList.get("authorization") || "";
    const cookiesString = cookiesList.toString();

    const feedbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/feedback?${searchParams}`;
    const response = await fetch(feedbackUrl, {
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

    const feedbackListResponse = await response.json();

    return NextResponse.json(feedbackListResponse);
  } catch (error: any) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      {
        error: "Search failed",
        searchType: "feedback",
        query: "",
        results: [],
        totalCount: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      { status: error?.status || 500 }
    );
  }
}
