import { NextResponse, NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// Store for tracking requests (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function createRateLimiter(config: RateLimitConfig) {
  return (request: NextRequest): { allowed: boolean; remaining: number } => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const key = ip;
    const now = Date.now();

    let record = requestCounts.get(key);

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + config.windowMs };
      requestCounts.set(key, record);
    }

    const allowed = record.count < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - record.count - 1);

    if (allowed) {
      record.count++;
    }

    return { allowed, remaining };
  };
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // Login: 5 attempts per 15 minutes
  login: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  // API: 60 requests per minute
  api: {
    windowMs: 60 * 1000,
    maxRequests: 60,
  },
  // Strict: 10 requests per minute (for sensitive operations)
  strict: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
};

export function handleRateLimitError(remaining: number = 0) {
  return NextResponse.json(
    {
      error: 'Too many requests. Please try again later.',
      retryAfter: 60,
      remaining,
    },
    { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Remaining': remaining.toString(),
      },
    }
  );
}