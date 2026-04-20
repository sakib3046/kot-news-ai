"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase().auth.getSession()

      if (session?.user) {
        setUserEmail(session.user.email || null)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase().auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null)
      } else {
        router.push("/admin/login")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase().auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KOT News AI</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow min-h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/rss-feeds"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              RSS Feeds
            </Link>
            <Link
              href="/admin/articles"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Articles
            </Link>
            <Link
              href="/admin/templates"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Image Templates
            </Link>
            <Link
              href="/admin/schedule"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Schedule
            </Link>
            <Link
              href="/admin/analytics"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
