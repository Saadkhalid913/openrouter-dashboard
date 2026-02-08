# OpenRouter Dashboard

A simple, secure dashboard for monitoring your OpenRouter API usage with token-based authentication. Perfect for embedding in Notion or accessing from anywhere.

![Dashboard Preview](https://via.placeholder.com/800x400/1a1a2e/00d4ff?text=OpenRouter+Dashboard)

## Features

- 🔐 **Token-based authentication** - Secure access via URL parameter
- 📊 **Real-time stats** - Daily, weekly, and monthly usage
- 📈 **Visual charts** - 7-day usage trend with Chart.js
- 🌙 **Dark mode** - Modern dev tools aesthetic
- 📱 **Mobile responsive** - Works on any device
- 🔄 **Auto-refresh** - Updates every 60 seconds

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Saadkhalid913/openrouter-dashboard.git
cd openrouter-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
DASHBOARD_TOKEN=your_secure_dashboard_token_here
PORT=3000
```

**Getting your OpenRouter API Key:**
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create a new API key
3. Copy it to your `.env` file

**Generating a secure dashboard token:**
```bash
openssl rand -base64 32
```

### 4. Start the server

```bash
npm start
```

The dashboard will be available at: `http://localhost:3000/?token=YOUR_DASHBOARD_TOKEN`

## Deployment

### Option 1: Cloudflare Tunnel (Recommended for Notion Embed)

1. Install cloudflared:
```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

2. Authenticate:
```bash
cloudflared tunnel login
```

3. Create a tunnel:
```bash
cloudflared tunnel create dashboard
```

4. Configure the tunnel in `~/.cloudflared/config.yml`:
```yaml
tunnel: <your-tunnel-id>
credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: dash.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

5. Route DNS:
```bash
cloudflared tunnel route dns dashboard dash.yourdomain.com
```

6. Run the tunnel:
```bash
cloudflared tunnel run dashboard
```

7. (Optional) Set up as a systemd service:
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
```

### Option 2: Traditional VPS/Server

Deploy to any VPS (DigitalOcean, AWS, etc.) and use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name dash.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Embedding in Notion

1. Make sure your dashboard is deployed with a public URL (via Cloudflare Tunnel or VPS)
2. In Notion, create a private page (only you can access)
3. Add an **Embed** block
4. Paste your dashboard URL with token:
   ```
   https://dash.yourdomain.com/?token=YOUR_DASHBOARD_TOKEN
   ```
5. The dashboard will load and auto-refresh every 60 seconds

### Mobile Access

Since the dashboard is embedded in your private Notion page, you can access it anywhere:
- **Desktop:** Notion app or web browser
- **Mobile:** Notion mobile app
- **Tablet:** Any device with Notion access

## API Reference

### Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes (token) | Main dashboard page |
| `/api/stats` | GET | Yes (token) | JSON API for OpenRouter stats |
| `/health` | GET | No | Health check endpoint |

### Stats Response Format

```json
{
  "data": {
    "label": "your-key-label",
    "limit": 50.00,
    "limit_remaining": 23.45,
    "usage": 26.55,
    "usage_daily": 1.23,
    "usage_weekly": 5.67,
    "usage_monthly": 12.34,
    "is_free_tier": false
  }
}
```

## Security Considerations

- The dashboard token is passed via URL parameter (`?token=...`)
- Keep your Notion page **private** to prevent token exposure
- Rotate your dashboard token periodically:
  ```bash
  openssl rand -base64 32
  ```
- Use HTTPS (Cloudflare Tunnel provides this automatically)
- The OpenRouter API key is never exposed to the client

## Development

```bash
# Install dev dependencies
npm install

# Run with auto-reload
npm run dev
```

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JavaScript + Chart.js
- **Authentication:** Token-based (URL parameter)
- **Charts:** Chart.js (CDN)

## License

MIT

## Author

[Saad Khalid](https://github.com/Saadkhalid913)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
