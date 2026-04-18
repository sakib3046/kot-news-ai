import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EnhancedContent {
  title: string;
  subtitle: string;
  hashtags: string[];
  callToAction: string;
}

export async function enhanceArticleContent(
  originalTitle: string,
  originalDescription: string
): Promise<EnhancedContent> {
  try {
    const prompt = `You are a social media expert for a tech news page. 
    
Given this tech news article:
Title: "${originalTitle}"
Description: "${originalDescription}"

Create an engaging post for Facebook that:
1. Has a CATCHY, COMPELLING title (max 80 chars) - make it a question or hook
2. Has a CONCISE subtitle (max 150 chars) - add insights or why it matters
3. Includes 3-5 relevant hashtags
4. Includes a call-to-action (read more, learn more, etc)

Respond in JSON format:
{
  "title": "catchy title",
  "subtitle": "compelling subtitle",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "callToAction": "call to action text"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON response");

    const enhanced = JSON.parse(jsonMatch[0]) as EnhancedContent;
    return enhanced;
  } catch (error) {
    console.error("Error enhancing article content:", error);
    // Return a basic version if AI fails
    return {
      title: originalTitle.substring(0, 80),
      subtitle: originalDescription?.substring(0, 150) || "",
      hashtags: ["#tech", "#news", "#ai"],
      callToAction: "Read more →",
    };
  }
}

export async function generateImageCaption(
  title: string,
  subtitle: string,
  hashtags: string[]
): Promise<string> {
  const caption = `${title}

${subtitle}

${hashtags.join(" ")}`;
  return caption;
}

export async function summarizeContent(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize this in one compelling sentence for social media:\n\n${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0].message.content || content.substring(0, 150);
  } catch (error) {
    console.error("Error summarizing content:", error);
    return content.substring(0, 150);
  }
}
