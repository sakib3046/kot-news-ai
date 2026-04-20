#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Demo User Setup Script
 * Creates a demo user account in Supabase for testing
 * 
 * Usage:
 *   node scripts/create-demo-user.js
 * 
 * Or with npm:
 *   npm run setup:demo-user
 * 
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

const https = require('https')

// Configuration
const DEMO_USER = {
  email: 'demo@kotai.example.com',
  password: 'Demo@1234',
  displayName: 'Demo User',
  role: 'admin',
}

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing environment variables')
  console.error('   NEXT_PUBLIC_SUPABASE_URL =', SUPABASE_URL ? '✓' : '✗ NOT SET')
  console.error('   SUPABASE_SERVICE_ROLE_KEY =', SERVICE_ROLE_KEY ? '✓' : '✗ NOT SET')
  console.error('\n📝 Add these to .env.local from your Supabase project:')
  console.error('   https://supabase.com/dashboard → Project Settings → API')
  process.exit(1)
}

// Function to make HTTP request
function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL)
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
          })
        } catch {
          resolve({
            status: res.statusCode,
            data: data,
          })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

// Main function
async function createDemoUser() {
  console.log('\n🔐 Creating Demo User...\n')
  console.log('User Details:')
  console.log(`  Email: ${DEMO_USER.email}`)
  console.log(`  Password: ${DEMO_USER.password}`)
  console.log(`  Name: ${DEMO_USER.displayName}`)
  console.log(`  Role: ${DEMO_USER.role}\n`)

  try {
    // Step 1: Check if user already exists
    console.log('1️⃣  Checking if user already exists...')
    const checkResponse = await makeRequest(
      'GET',
      `/auth/v1/admin/users?email=${encodeURIComponent(DEMO_USER.email)}`
    )

    if (
      checkResponse.status === 200 &&
      checkResponse.data &&
      checkResponse.data.users &&
      checkResponse.data.users.length > 0
    ) {
      console.log('   ℹ️  User already exists!')
      console.log(`   User ID: ${checkResponse.data.users[0].id}`)
      console.log('\n✅ Demo user is ready to use!\n')
      return
    }

    // Step 2: Create new user
    console.log('2️⃣  Creating new user...')
    const createResponse = await makeRequest('POST', '/auth/v1/admin/users', {
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      email_confirm: true,
      user_metadata: {
        name: DEMO_USER.displayName,
        role: DEMO_USER.role,
      },
    })

    if (createResponse.status !== 201) {
      console.error('   ❌ Failed to create user')
      console.error('   Status:', createResponse.status)
      console.error('   Error:', createResponse.data?.message || createResponse.data)
      process.exit(1)
    }

    const userId = createResponse.data.id
    console.log('   ✅ User created successfully!')
    console.log(`   User ID: ${userId}\n`)

    // Step 3: Verify user was created
    console.log('3️⃣  Verifying user...')
    const verifyResponse = await makeRequest(
      'GET',
      `/auth/v1/admin/users/${userId}`
    )

    if (verifyResponse.status === 200) {
      console.log('   ✅ User verified!')
      console.log(`   Email: ${verifyResponse.data.email}`)
      console.log(`   Email Confirmed: ${verifyResponse.data.email_confirmed_at ? '✓' : '✗'}\n`)
    }

    console.log('✅ Demo user created successfully!\n')
    console.log('📝 Next Steps:')
    console.log('   1. Start the development server:')
    console.log('      npm run dev')
    console.log('   2. Go to: http://localhost:3000/admin/login')
    console.log('   3. Use these credentials:')
    console.log(`      Email: ${DEMO_USER.email}`)
    console.log(`      Password: ${DEMO_USER.password}`)
    console.log('   4. Click "Sign In" or "Use Demo Credentials"\n')
  } catch (error) {
    console.error('❌ Error creating demo user:')
    console.error(error.message)
    console.error('\n📝 Troubleshooting:')
    console.error('   - Verify SUPABASE_SERVICE_ROLE_KEY is correct')
    console.error('   - Check Supabase project is active')
    console.error('   - Ensure environment variables are set in .env.local')
    process.exit(1)
  }
}

// Run the script
createDemoUser()
