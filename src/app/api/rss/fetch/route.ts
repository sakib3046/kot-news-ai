import { NextRequest, NextResponse } from "next/server";
import {
  fetchAllTechNews,
  deduplicateAndSaveArticles,
  initializeRSSFeeds,
} from "@/lib/rss/parser";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[RSS ENDPOINT] Starting RSS feed fetch...");

    // Initialize RSS feeds if not already done
    await initializeRSSFeeds();

    // Fetch all RSS feeds
    const articles = await fetchAllTechNews();

    console.log(
      `[RSS ENDPOINT] Fetched articles from ${articles.size} sources`
    );

    // Deduplicate and save articles
    const savedArticles = await deduplicateAndSaveArticles(articles);

    console.log(`[RSS ENDPOINT] Saved ${savedArticles.length} new articles`);

    // Get statistics
    const stats = await prisma.article.groupBy({
      by: ["source"],
      _count: true,
    });

    return NextResponse.json({
      success: true,
      newArticles: savedArticles.length,
      sourcesCount: articles.size,
      statistics: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[RSS ENDPOINT] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await prisma.article.groupBy({
      by: ["source"],
      _count: true,
    });

    const totalArticles = await prisma.article.count();
    const processedArticles = await prisma.article.count({
      where: { aiEnhanced: true },
    });
    const postedArticles = await prisma.article.count({
      where: { posted: true },
    });

    return NextResponse.json({
      status: "ok",
      endpoint: "/api/rss/fetch",
      totalArticles,
      processedArticles,
      postedArticles,
      bySource: stats,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
