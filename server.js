/**
 * OpenRouter Dashboard Server
 * A simple, secure dashboard for OpenRouter usage stats
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN;

// Validate environment variables
if (!OPENROUTER_API_KEY) {
  console.error('❌ Error: OPENROUTER_API_KEY is not set');
  console.error('   Please set it in your .env file or environment variables');
  process.exit(1);
}

if (!DASHBOARD_TOKEN) {
  console.error('❌ Error: DASHBOARD_TOKEN is not set');
  console.error('   Please set it in your .env file or environment variables');
  console.error('   Generate a secure token with: openssl rand -base64 32');
  process.exit(1);
}

// Allow iframe embedding
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', 'frame-ancestors *');
  next();
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

// Token authentication middleware
function validateToken(req, res, next) {
  const token = req.query.token;
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized: Token is required',
      message: 'Please provide a token via ?token=YOUR_TOKEN query parameter'
    });
  }
  
  if (token !== DASHBOARD_TOKEN) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token',
      message: 'The provided token is not valid'
    });
  }
  
  next();
}

// API endpoint to fetch all keys
app.get('/api/keys', validateToken, async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'Failed to fetch OpenRouter keys',
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching OpenRouter keys:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// API endpoint to fetch credits
app.get('/api/credits', validateToken, async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'Failed to fetch OpenRouter credits',
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching OpenRouter credits:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Main dashboard route - token validation handled in the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       OpenRouter Dashboard Server                          ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  🚀 Server running on port ${PORT.toString().padEnd(43)}║`);
  console.log(`║  📊 Dashboard: http://localhost:${PORT}/?token=TOKEN${' '.repeat(14 - PORT.toString().length)}║`);
  console.log('║                                                            ║');
  console.log('║  Make sure to:                                             ║');
  console.log('║  1. Set OPENROUTER_API_KEY in .env                        ║');
  console.log('║  2. Set DASHBOARD_TOKEN in .env                           ║');
  console.log('║  3. Access with ?token=YOUR_DASHBOARD_TOKEN               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
});
