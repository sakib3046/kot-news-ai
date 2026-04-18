'use client'

import { useEffect, useState, useRef } from 'react'
import { getRSSFeeds, getArticles, getFacebookPosts, getJobLogs } from '@/lib/db.js'

interface RSSFeed {
  id: string
  is_active: boolean
}

interface Article {
  id: string
  posted: boolean
}

interface FacebookPost {
  id: string
  engagement?: number
}

interface JobLog {
  id: string
  job_type: string
  status: string
  articles_processed: number
  images_generated: number
  posts_created: number
  started_at: string
  error?: string | null
}

interface DashboardStats {
  totalFeeds: number
  activeFeeds: number
  totalArticles: number
  postedArticles: number
  unpostedArticles: number
  totalPosts: number
  totalEngagement: number
}

interface RecentJob {
  id: string
  jobType: string
  status: string
  articlesProcessed: number
  imagesGenerated: number
  postsCreated: number
  startedAt: string
  error?: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dataLoaded = useRef(false)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [feedsData, articlesData, postsData, jobsData] = await Promise.all([
        getRSSFeeds(),
        getArticles({ limit: 1000 }),
        getFacebookPosts(1000),
        getJobLogs(50),
      ])

      const activeFeeds = (feedsData as RSSFeed[]).filter((f) => f.is_active).length
      const { articles } = articlesData
      const postedCount = (articles as Article[]).filter((a) => a.posted).length
      const totalEngagement = (postsData as FacebookPost[]).reduce(
        (sum: number, post) => sum + (post.engagement || 0),
        0
      )

      setStats({
        totalFeeds: feedsData.length,
        activeFeeds,
        totalArticles: articles.length,
        postedArticles: postedCount,
        unpostedArticles: articles.length - postedCount,
        totalPosts: postsData.length,
        totalEngagement,
      })

      setRecentJobs(
        (jobsData as JobLog[]).map((job) => ({
          id: job.id,
          jobType: job.job_type,
          status: job.status,
          articlesProcessed: job.articles_processed,
          imagesGenerated: job.images_generated,
          postsCreated: job.posts_created,
          startedAt: new Date(job.started_at).toLocaleString(),
          error: job.error,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dataLoaded.current) return
    dataLoaded.current = true
    void loadDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="RSS Feeds"
            value={stats.totalFeeds}
            subtitle={`${stats.activeFeeds} active`}
            icon="📡"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard
            title="Total Articles"
            value={stats.totalArticles}
            subtitle={`${stats.unpostedArticles} pending`}
            icon="📰"
            color="bg-purple-100 text-purple-800"
          />
          <StatCard
            title="Posted to Facebook"
            value={stats.totalPosts}
            subtitle={`${stats.postedArticles} articles`}
            icon="👍"
            color="bg-green-100 text-green-800"
          />
          <StatCard
            title="Total Engagement"
            value={stats.totalEngagement}
            subtitle="All reactions & shares"
            icon="📈"
            color="bg-orange-100 text-orange-800"
          />
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Job Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Posts
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Started
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{job.jobType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                      {job.error && (
                        <div className="text-xs text-red-600 mt-1">{job.error}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {job.articlesProcessed}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {job.imagesGenerated}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.postsCreated}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.startedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-gray-900">Fetch RSS</div>
            <div className="text-xs text-gray-600">Get new articles</div>
          </button>
          <button className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition text-center">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-semibold text-gray-900">Generate Images</div>
            <div className="text-xs text-gray-600">For pending articles</div>
          </button>
          <button className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition text-center">
            <div className="text-2xl mb-2">📤</div>
            <div className="font-semibold text-gray-900">Post to Facebook</div>
            <div className="text-xs text-gray-600">Publish ready articles</div>
          </button>
          <button className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">Update Metrics</div>
            <div className="text-xs text-gray-600">Refresh engagement data</div>
          </button>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  subtitle: string
  icon: string
  color: string
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <div className={`${color} rounded-lg p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold my-1">{value}</p>
      <p className="text-xs opacity-70">{subtitle}</p>
    </div>
  )
}
