import { NextRequest, NextResponse } from "next/server";
import { processNewArticlesJob } from "@/lib/jobs/processor";
import { createRateLimiter, rateLimitConfigs, handleRateLimitError } from "@/lib/rate-limiter";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout for Vercel

const cronLimiter = createRateLimiter(rateLimitConfigs.strict);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = cronLimiter(request);
    if (!rateLimit.allowed) {
      return handleRateLimitError(rateLimit.remaining);
    }

    // Verify request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {  
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await processNewArticlesJob();

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON ENDPOINT] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = cronLimiter(request);
    if (!rateLimit.allowed) {
      return handleRateLimitError(rateLimit.remaining);
    }

    return NextResponse.json({
      status: "ok",
      endpoint: "/api/cron/process",
      description: "Processes new articles and posts to Facebook",        
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}