import { z } from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const logoutSchema = z.object({}).strict();

export const meSchema = z.object({}).strict();

// RSS validation schemas
export const rssSourceSchema = z.object({
  url: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required").max(100),
  tags: z.array(z.string()).optional().default([]),
});

export const rssFetchSchema = z.object({
  force: z.boolean().optional().default(false),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

// Cron validation schemas
export const cronProcessSchema = z.object({
  token: z.string().optional(),
  type: z.enum(["rss", "ai", "facebook", "cleanup"]).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RssSourceInput = z.infer<typeof rssSourceSchema>;
export type RssFetchInput = z.infer<typeof rssFetchSchema>;
export type CronProcessInput = z.infer<typeof cronProcessSchema>;

// Validation helper with proper typing
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: true; data: T; error?: undefined } | { valid: false; data?: undefined; error: string } {
  try {
    const validatedData = schema.parse(data) as T;
    return { valid: true, data: validatedData };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue: z.ZodIssue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        })
        .join(", ");
      return { valid: false, error: message };
    }
    return { valid: false, error: "Validation failed" };
  }
}