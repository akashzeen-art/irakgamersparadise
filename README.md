# Gamers Paradise - Vercel Deployment

## 🚀 Deploy to Vercel

### Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account

### Quick Deploy
1. **Fork/Clone this repository**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   
3. **Configure Build Settings** (Vercel will auto-detect these from vercel.json):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework: `Vite`

4. **Environment Variables** (Optional):
   - Set any required environment variables in Vercel dashboard
   - Copy from `.env.example` if needed

5. **Deploy**: Click Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# For production deployment
vercel --prod
```

### 🔧 Project Structure
```
gamersparadise/
├── client/           # React frontend source
├── public/          # Static assets (logo, images)
├── dist/            # Build output (auto-generated)
├── vercel.json      # Vercel configuration
├── package.json     # Dependencies & scripts
└── README.md        # This file
```

### 🌍 Features
- ✅ React SPA with Vite
- ✅ Multi-language support (English/Arabic)
- ✅ Subscription API integration
- ✅ Game library with 147+ games
- ✅ Responsive design
- ✅ SEO optimized

### 🔗 API Integration
The app integrates with subscription APIs:
- Status Check: `http://142.93.209.116/adpoke/cnt/sub/status`
- Campaign: `http://142.93.209.116/adpoke/cnt/act`
- Account Details: `http://142.93.209.116/adpoke/cnt/sub/detail`
- Unsubscribe: `http://142.93.209.116/adpoke/cnt/dct`

### 🎮 Game Access Flow
1. User clicks game thumbnail
2. Subscription status is checked via API
3. If subscribed (status=1): Game opens
4. If not subscribed (status=0): Redirect to campaign URL

### 📱 Responsive Design
- Mobile-first design
- Works on all devices
- Touch-friendly interface
- Optimized game thumbnails

### 🌐 URL Parameters
The app expects these URL parameters for API calls:
- `subid`: Subscriber ID
- `productcode`: Product code per operator

Example: `https://your-domain.vercel.app?subid=123&productcode=ABC`

### 🎯 Live Demo
Once deployed, your Gamers Paradise portal will be live at:
`https://your-project-name.vercel.app`