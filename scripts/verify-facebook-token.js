#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Verify Facebook Access Token
 * Usage: node scripts/verify-facebook-token.js
 */

require('dotenv').config({ path: '.env.local' })

const axios = require('axios')

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0'

const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const pageId = process.env.FACEBOOK_PAGE_ID

if (!pageAccessToken || !pageId) {
  console.error('❌ Facebook credentials not found in .env.local')
  process.exit(1)
}

async function verifyToken() {
  try {
    console.log('🔍 Verifying Facebook Access Token...\n')

    // Test the token by getting page info
    const response = await axios.get(`${FACEBOOK_GRAPH_API}/${pageId}`, {
      params: {
        fields: 'id,name,picture,category',
        access_token: pageAccessToken,
      },
    })

    console.log('✅ Token is valid!\n')
    console.log('Page Information:')
    console.log(`  ID: ${response.data.id}`)
    console.log(`  Name: ${response.data.name}`)
    console.log(`  Category: ${response.data.category}`)

    return true
  } catch (error) {
    console.error('❌ Token verification failed!\n')
    if (error.response?.data?.error) {
      const err = error.response.data.error
      console.error(`Error: ${err.message}`)
      console.error(`Type: ${err.type}`)
      console.error(`Code: ${err.code}`)
      if (err.error_subcode === 463) {
        console.error('\n⚠️  Your access token has EXPIRED!')
        console.error('You need to generate a new token from Facebook Developer Console.')
      }
    } else {
      console.error(error.message)
    }
    return false
  }
}

verifyToken().then((valid) => {
  if (valid) {
    console.log('\n✅ Ready to post to Facebook!')
  } else {
    console.log('\n❌ Please update FACEBOOK_PAGE_ACCESS_TOKEN in .env.local')
    process.exit(1)
  }
})
