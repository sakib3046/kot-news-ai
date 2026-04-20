'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the /api/auth/me endpoint which can read HTTP-only cookies
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await response.json()

        if (data.user) {
          // User is already authenticated, redirect to dashboard
          router.push('/admin/dashboard')
        } else {
          setCheckingAuth(false)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (response.ok) {
        // Redirect to dashboard
        router.push('/admin/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #ddd', borderTop: '4px solid #0066cc', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#666' }}>Checking authentication...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '40px' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', color: '#333', margin: '0 0 10px 0' }}>KOT News AI</h1>
          <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Admin Dashboard Login</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: '#f0f7ff', border: '1px solid #b3d9ff', color: '#004080', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Demo Credentials:</strong><br/>
          Email: demo@kotai.example.com<br/>
          Password: Demo@1234
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f9f9f9' : '#fff', color: '#333' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f9f9f9' : '#fff', color: '#333' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px', backgroundColor: loading ? '#ccc' : '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>Protected admin area - Authorized users only</p>
        </div>
      </div>
    </div>
  )
}
