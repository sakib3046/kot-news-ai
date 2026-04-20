import Parser from "rss-parser";
import { techRSSFeeds } from "./feedConfig";
import prisma from "@/lib/prisma";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

export interface ParsedArticle {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  image?: string;
  source: string;
  guid?: string;
}

export async function fetchAndParseRSSFeed(feedUrl: string, feedName: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const articles: ParsedArticle[] = [];

    feed.items.forEach((item) => {
      const image = getItemImage(item);

      articles.push({
        title: item.title || "Untitled",
        description: item.contentSnippet || item.content,
        link: item.link || "",
        pubDate: item.pubDate,
        image,
        source: feedName,
        guid: item.guid || item.link,
      });
    });

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedName}:`, error);
    return [];
  }
}

function getItemImage(item: Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  const itunes = item.itunes as { image?: string } | undefined;
  const media = (item as Record<string, { url?: string }>)["media:content"];

  return enclosure?.url || itunes?.image || media?.url;
}

export async function fetchAllTechNews(): Promise<
  Map<string, ParsedArticle[]>
> {
  const allArticles = new Map<string, ParsedArticle[]>();

  for (const feed of techRSSFeeds) {
    const articles = await fetchAndParseRSSFeed(feed.url, feed.name);
    allArticles.set(feed.name, articles);

    // Add delay to be respectful to servers
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return allArticles;
}

export async function initializeRSSFeeds() {
  // Initialize database with RSS feeds if they don't exist
  for (const feed of techRSSFeeds) {
    const existingFeed = await prisma.rSSFeed.findUnique({
      where: { url: feed.url },
    });

    if (!existingFeed) {
      await prisma.rSSFeed.create({
        data: {
          name: feed.name,
          url: feed.url,
          category: feed.category,
          isActive: true,
        },
      });
      console.log(`Initialized RSS feed: ${feed.name}`);
    }
  }
}

export async function deduplicateAndSaveArticles(
  articles: Map<string, ParsedArticle[]>
) {
  const seenGuids = new Set<string>();
  const articlesToSave = [];

  for (const [source, sourceArticles] of articles) {
    for (const article of sourceArticles) {
      const guid = article.guid || article.link;

      // Check for duplicates
      if (seenGuids.has(guid)) {
        continue;
      }

      // Check if article already exists in database
      const existingArticle = await prisma.article.findUnique({
        where: { originalLink: article.link },
      });

      if (!existingArticle && guid) {
        seenGuids.add(guid);
        articlesToSave.push({
          title: article.title,
          description: article.description,
          originalLink: article.link,
          imageUrl: article.image,
          pubDate: article.pubDate ? new Date(article.pubDate) : null,
          guid: guid,
          source: source,
        });
      }
    }
  }

  // Get the first feed to associate articles with
  const defaultFeed = await prisma.rSSFeed.findFirst({
    where: { isActive: true },
  });

  if (!defaultFeed) {
    console.error("No active RSS feeds found");
    return [];
  }

  // Save articles in batches
  const savedArticles = [];
  for (const article of articlesToSave) {
    try {
      const saved = await prisma.article.create({
        data: {
          feedId: defaultFeed.id,
          ...article,
        },
      });
      savedArticles.push(saved);
    } catch (error) {
      console.error(`Error saving article ${article.title}:`, error);
    }
  }

  return savedArticles;
}
