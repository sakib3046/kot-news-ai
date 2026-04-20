#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Test Facebook posting functionality
 * Usage: node scripts/test-facebook-post.js
 */

require('dotenv').config({ path: '.env.local' })

const axios = require('axios')

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0'

const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const pageId = process.env.FACEBOOK_PAGE_ID

if (!pageAccessToken || !pageId) {
  console.error('❌ Facebook credentials not found in .env.local')
  console.error('Required: FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID')
  process.exit(1)
}

async function postDemoMessage() {
  try {
    console.log('📱 Posting demo message to Facebook Page...')
    console.log(`Page ID: ${pageId}`)

    const demoCaption = `🎉 Demo Post from KOT News AI\n\nThis is a test post to verify the Facebook integration is working correctly.\n\n#KOTNews #AI #Testing`

    const response = await axios.post(
      `${FACEBOOK_GRAPH_API}/${pageId}/feed`,
      {
        message: demoCaption,
        access_token: pageAccessToken,
      }
    )

    console.log('✅ Post successful!')
    console.log(`Post ID: ${response.data.id}`)
    console.log(`View post: https://facebook.com/${response.data.id}`)
  } catch (error) {
    console.error('❌ Error posting to Facebook:')
    if (error.response?.data) {
      console.error('API Error:', error.response.data)
    } else {
      console.error(error.message)
    }
    process.exit(1)
  }
}

async function postDemoWithImage() {
  try {
    console.log('📸 Posting demo message with image to Facebook Page...')

    // Using a sample image URL
    const demoImageUrl = 'https://via.placeholder.com/1200x628?text=KOT+News+AI+Demo'
    const demoCaption = `🎉 Demo Post with Image from KOT News AI\n\nThis is a test post with an image to verify the Facebook integration is working correctly.\n\n#KOTNews #AI #Testing`

    const response = await axios.post(
      `${FACEBOOK_GRAPH_API}/${pageId}/feed`,
      {
        message: demoCaption,
        picture: demoImageUrl,
        access_token: pageAccessToken,
      }
    )

    console.log('✅ Post with image successful!')
    console.log(`Post ID: ${response.data.id}`)
    console.log(`View post: https://facebook.com/${response.data.id}`)
  } catch (error) {
    console.error('❌ Error posting to Facebook:')
    if (error.response?.data) {
      console.error('API Error:', error.response.data)
    } else {
      console.error(error.message)
    }
    process.exit(1)
  }
}

// Run both tests
async function main() {
  console.log('🚀 Starting Facebook Integration Test\n')
  console.log('=' * 50)

  // Test 1: Simple text post
  await postDemoMessage()
  console.log()

  // Test 2: Post with image
  await postDemoWithImage()

  console.log('\n' + '=' * 50)
  console.log('✅ All tests completed!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
