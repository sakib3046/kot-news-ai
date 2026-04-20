import { NextResponse, NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { loginSchema, validateRequest } from "@/lib/validation"
import { createRateLimiter, rateLimitConfigs, handleRateLimitError } from "@/lib/rate-limiter"

const loginLimiter = createRateLimiter(rateLimitConfigs.login)

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = loginLimiter(request)
    if (!rateLimit.allowed) {
      return handleRateLimitError(rateLimit.remaining)
    }

    // Validate request body
    const body = await request.json()
    const validation = validateRequest(loginSchema, body)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { email, password } = validation.data!

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, "", { ...options, maxAge: 0 })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Create response with success message
    const response = NextResponse.json(
      { success: true, user: data.user },
      { status: 200 }
    )

    // Copy Supabase cookies from the server-side cookie store to the response
    // The createServerClient sets cookies via the handler, but we need to also set them on the response
    const cookies_list = cookieStore.getAll()
    cookies_list.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 500 }
    )
  }
}
