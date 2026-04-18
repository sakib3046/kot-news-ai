import axios from "axios";

const FACEBOOK_GRAPH_API = "https://graph.facebook.com/v18.0";

export interface FacebookPostParams {
  imageUrl: string;
  caption: string;
  link?: string;
  hashtags?: string;
}

export class FacebookAPI {
  private pageAccessToken: string;
  private pageId: string;

  constructor() {
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "";
    this.pageId = process.env.FACEBOOK_PAGE_ID || "";

    if (!this.pageAccessToken || !this.pageId) {
      console.warn("Facebook credentials not configured");
    }
  }

  async postToPage(params: FacebookPostParams): Promise<{
    success: boolean;
    postId?: string;
    error?: string;
  }> {
    try {
      if (!this.pageAccessToken || !this.pageId) {
        throw new Error("Facebook credentials not configured");
      }

      const response = await axios.post(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/photos`,
        {
          source: params.imageUrl,
          caption: `${params.caption}\n\n${params.link || ""}${params.hashtags ? "\n\n" + params.hashtags : ""}`,
          access_token: this.pageAccessToken,
        }
      );

      return {
        success: true,
        postId: response.data.id,
      };
    } catch (error) {
      console.error("Error posting to Facebook:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async publishPost(
    caption: string,
    imageUrl: string,
    link?: string
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/feed`,
        {
          message: caption,
          link: link,
          picture: imageUrl,
          access_token: this.pageAccessToken,
        }
      );

      return {
        success: true,
        postId: response.data.id,
      };
    } catch (error) {
      console.error("Error publishing post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getPageInsights(): Promise<{
    reach?: number;
    engagement?: number;
    followers?: number;
  }> {
    try {
      const response = await axios.get(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/insights`,
        {
          params: {
            metric:
              "page_engaged_users,page_engaged_fans,page_fans,page_reach",
            access_token: this.pageAccessToken,
          },
        }
      );

      const insights: { reach?: number; engagement?: number; followers?: number } = {};
      response.data.data.forEach(
        (metric: { name: string; values: Array<{ value: number }> }) => {
          if (metric.values && metric.values[0]) {
            if (metric.name === "page_reach")
              insights.reach = metric.values[0].value;
            if (metric.name === "page_engaged_users")
              insights.engagement = metric.values[0].value;
            if (metric.name === "page_fans")
              insights.followers = metric.values[0].value;
          }
        }
      );

      return insights;
    } catch (error) {
      console.error("Error getting page insights:", error);
      return {};
    }
  }

  async uploadMediaToFacebook(
    imageUrl: string
  ): Promise<{ success: boolean; mediaUrl?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/photos`,
        {
          source: imageUrl,
          published: false,
          access_token: this.pageAccessToken,
        }
      );

      return {
        success: true,
        mediaUrl: response.data.id,
      };
    } catch (error) {
      console.error("Error uploading media:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const facebookAPI = new FacebookAPI();
