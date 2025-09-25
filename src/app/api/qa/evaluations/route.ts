import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// QA Evaluations API Route
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headersList = await headers();
    const cookiesList = await cookies();

    const authHeader = headersList.get("authorization") || "";
    const cookiesString = cookiesList.toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/qa/evaluations?${searchParams}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookiesString,
          Authorization: authHeader,
        },
        cache: "no-store",
      }
    );

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

    const responseJson = await response.json();
    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("QA Evaluation List API error:", error);

    return NextResponse.json(
      {
        error: "Search failed",
        searchType: "qa evaluation",
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
