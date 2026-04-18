'use client'

import { useEffect, useState, useRef } from 'react'
import { getRSSFeeds, createRSSFeed, updateRSSFeed, deleteRSSFeed } from '@/lib/db.js'

interface RSSFeedData {
  id: string
  name: string
  url: string
  category: string
  is_active: boolean
  created_at: string
}

interface FormData {
  name: string
  url: string
  category: string
}

export default function RSSFeedsPage() {
  const [feeds, setFeeds] = useState<RSSFeedData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', url: '', category: 'tech' })
  const [submitting, setSubmitting] = useState(false)
  const dataLoaded = useRef(false)

  const loadFeeds = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRSSFeeds()
      setFeeds(data as RSSFeedData[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feeds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dataLoaded.current) return
    dataLoaded.current = true
    void loadFeeds()
  }, [])

  const handleAddFeed = () => {
    setEditingId(null)
    setFormData({ name: '', url: '', category: 'tech' })
    setShowForm(true)
  }

  const handleEditFeed = (feed: RSSFeedData) => {
    setEditingId(feed.id)
    setFormData({ name: feed.name, url: feed.url, category: feed.category })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        await updateRSSFeed(editingId, {
          name: formData.name,
          url: formData.url,
          category: formData.category,
        })
      } else {
        await createRSSFeed({
          name: formData.name,
          url: formData.url,
          category: formData.category,
        })
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', url: '', category: 'tech' })
      await loadFeeds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save feed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateRSSFeed(id, { is_active: !isActive })
      await loadFeeds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return

    try {
      await deleteRSSFeed(id)
      await loadFeeds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">RSS Feeds</h1>
        <button
          onClick={handleAddFeed}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Feed
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Feed' : 'Add New Feed'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feed Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Hacker News"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feed URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="tech">Technology</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="web">Web Development</option>
                <option value="startup">Startups</option>
                <option value="security">Security</option>
                <option value="science">Science</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Feed'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feeds List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feeds...</p>
          </div>
        </div>
      ) : feeds.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feeds.map((feed) => (
                <tr key={feed.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {feed.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {feed.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-xs block"
                    >
                      {feed.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleActive(feed.id, feed.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        feed.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {feed.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEditFeed(feed)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(feed.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No RSS feeds configured yet</p>
          <button
            onClick={handleAddFeed}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add Your First Feed
          </button>
        </div>
      )}
    </div>
  )
}
