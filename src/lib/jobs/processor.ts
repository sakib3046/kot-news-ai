import prisma from "@/lib/prisma";
import { enhanceArticleContent } from "@/lib/ai/enhancement";
import { generateNewsImage, saveImageToFile } from "@/lib/image/generator";
import { facebookAPI } from "@/lib/facebook/api";

export async function processNewArticlesJob() {
  const startTime = Date.now();

  try {
    console.log("[CRON] Starting article processing job...");

    // Create job log entry
    const jobLog = await prisma.jobLog.create({
      data: {
        jobType: "PROCESS_ARTICLES",
        status: "running",
        articlesProcessed: 0,
        imagesGenerated: 0,
        postsCreated: 0,
      },
    });

    // Get unprocessed articles (not yet AI enhanced)
    const unprocessedArticles = await prisma.article.findMany({
      where: {
        aiEnhanced: false,
        posted: false,
      },
      take: 10, // Process 10 articles at a time
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `[CRON] Found ${unprocessedArticles.length} unprocessed articles`
    );

    for (const article of unprocessedArticles) {
      try {
        // Enhance article content with AI
        console.log(`[CRON] Enhancing article: ${article.title}`);
        const enhanced = await enhanceArticleContent(
          article.title,
          article.description || ""
        );

        // Update article with enhanced content
        await prisma.article.update({
          where: { id: article.id },
          data: {
            aiTitle: enhanced.title,
            aiSubtitle: enhanced.subtitle,
            aiEnhanced: true,
          },
        });

        // Generate image
        console.log(`[CRON] Generating image for article: ${article.title}`);
        const imageBuffer = await generateNewsImage({
          title: enhanced.title,
          subtitle: enhanced.subtitle,
          imageUrl: article.imageUrl || undefined,
          logoUrl: undefined,
        });

        // Save image and get URL
        const timestamp = Date.now();
        const imageFilename = `article-${article.id}-${timestamp}.png`;
        const imagePath = await saveImageToFile(imageBuffer, imageFilename);

        // Update article with generated image
        await prisma.article.update({
          where: { id: article.id },
          data: {
            generatedImage: imagePath,
          },
        });

        jobLog.imagesGenerated++;
      } catch (error) {
        console.error(
          `[CRON] Error processing article ${article.id}:`,
          error
        );
      }
    }

    // Get ready-to-post articles
    const readyToPost = await prisma.article.findMany({
      where: {
        aiEnhanced: true,
        posted: false,
        generatedImage: { not: null },
      },
      take: 5, // Post 5 articles at a time
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `[CRON] Found ${readyToPost.length} articles ready to post to Facebook`
    );

    for (const article of readyToPost) {
      try {
        console.log(`[CRON] Posting to Facebook: ${article.aiTitle}`);

        const imageUrl = article.generatedImage
          ? `${process.env.VERCEL_URL}${article.generatedImage}`
          : "";

        const facebookResult = await facebookAPI.publishPost(
          `${article.aiTitle}\n\n${article.aiSubtitle}`,
          imageUrl,
          article.originalLink
        );

        if (facebookResult.success && facebookResult.postId) {
          // Create Facebook post record
          await prisma.facebookPost.create({
            data: {
              articleId: article.id,
              facebookPostId: facebookResult.postId,
              pageId: process.env.FACEBOOK_PAGE_ID || "",
              caption: `${article.aiTitle}\n\n${article.aiSubtitle}`,
              imageUrl: imageUrl,
            },
          });

          // Update article as posted
          await prisma.article.update({
            where: { id: article.id },
            data: {
              posted: true,
              facebookPostId: facebookResult.postId,
              postedAt: new Date(),
            },
          });

          jobLog.postsCreated++;
          console.log(
            `[CRON] Successfully posted article ${article.id} to Facebook`
          );
        } else {
          console.warn(
            `[CRON] Failed to post article ${article.id}:`,
            facebookResult.error
          );
        }
      } catch (error) {
        console.error(
          `[CRON] Error posting article ${article.id} to Facebook:`,
          error
        );
      }
    }

    jobLog.articlesProcessed = unprocessedArticles.length;

    // Update job log as completed
    await prisma.jobLog.update({
      where: { id: jobLog.id },
      data: {
        status: "completed",
        message: `Processed ${unprocessedArticles.length} articles, generated ${jobLog.imagesGenerated} images, posted ${jobLog.postsCreated} to Facebook`,
        completedAt: new Date(),
        articlesProcessed: unprocessedArticles.length,
        imagesGenerated: jobLog.imagesGenerated,
        postsCreated: jobLog.postsCreated,
      },
    });

    const duration = (Date.now() - startTime) / 1000;
    console.log(
      `[CRON] Job completed successfully in ${duration.toFixed(2)}s`
    );

    return {
      success: true,
      articlesProcessed: unprocessedArticles.length,
      imagesGenerated: jobLog.imagesGenerated,
      postsCreated: jobLog.postsCreated,
    };
  } catch (error) {
    console.error("[CRON] Job failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
