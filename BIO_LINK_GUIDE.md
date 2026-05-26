# 🎨 Gun.lol Style Bio Link - Customization Guide

Your bio link page is ready! Here's how to customize it:

## 📍 Quick Start

All customization happens in one file: `/app/frontend/src/components/BioLink.js`

Look for the section marked:
```javascript
// ========================================
// CUSTOMIZE YOUR BIO LINK CONTENT HERE
// ========================================
```

## 🎥 Adding Your Video Background

### Option 1: Local Video File (Recommended)
1. Place your `video.mp4` file in `/app/frontend/public/`
2. In `BioLink.js`, change:
   ```javascript
   videoUrl: "/video.mp4",
   ```

### Option 2: External Video URL
```javascript
videoUrl: "https://your-cdn.com/your-video.mp4",
```

**Note:** Make sure the video has proper CORS headers if hosted externally.

### Option 3: No Video (Gradient Background)
Leave it empty for the animated gradient background:
```javascript
videoUrl: "",
```

## 👤 Customize Your Profile

```javascript
const bioData = {
  // Profile Info
  avatar: "https://your-image-url.com/avatar.jpg",  // Your profile picture
  username: "@yourhandle",                           // Your username
  displayName: "Your Name",                          // Your display name
  bio: "Your bio text here\n✨ Multiple lines supported",
  
  // ... rest of config
};
```

## 🔗 Edit Social Links

### Available Social Platforms:
```javascript
socialLinks: [
  { icon: Instagram, label: "Instagram", url: "https://instagram.com/yourhandle", color: "#E4405F" },
  { icon: Twitter, label: "Twitter/X", url: "https://twitter.com/yourhandle", color: "#1DA1F2" },
  { icon: Youtube, label: "YouTube", url: "https://youtube.com/@yourhandle", color: "#FF0000" },
  { icon: Github, label: "GitHub", url: "https://github.com/yourhandle", color: "#ffffff" },
  { icon: Music2, label: "TikTok", url: "https://tiktok.com/@yourhandle", color: "#00f2ea" },
  { icon: Mail, label: "Email", url: "mailto:your@email.com", color: "#EA4335" },
],
```

**To remove a link:** Simply delete that entire line
**To add more:** Copy a line and change the details

### Available Icons:
Import from `lucide-react`:
- `Instagram`, `Twitter`, `Youtube`, `Github`, `Music2` (TikTok)
- `Mail`, `Linkedin`, `Facebook`, `Twitch`, `Discord`
- `Globe`, `ExternalLink`, `MessageCircle`, `Phone`, `MapPin`

## ➕ Add Custom Links

```javascript
customLinks: [
  { icon: Globe, label: "My Website", url: "https://yourwebsite.com" },
  { icon: ExternalLink, label: "My Portfolio", url: "https://yourportfolio.com" },
  { icon: MessageCircle, label: "Book a Call", url: "https://calendly.com/yourname" },
]
```

## 🎨 Change Colors

Each link has a `color` property:
```javascript
{ icon: Instagram, label: "Instagram", url: "...", color: "#E4405F" }
```

Popular brand colors:
- Instagram: `#E4405F`
- Twitter/X: `#1DA1F2`
- YouTube: `#FF0000`
- TikTok: `#00f2ea`
- LinkedIn: `#0077B5`
- Discord: `#5865F2`
- Spotify: `#1DB954`
- Twitch: `#9146FF`

## 📱 Testing Your Changes

After making changes, the page will automatically reload. View it at:
```
https://bio-link-hub-12.preview.emergentagent.com
```

## 🌐 Custom Domain Setup

To use your custom domain:

1. **Create CNAME file** (if deploying to GitHub Pages):
   - Create a file named `CNAME` in `/app/frontend/public/`
   - Add your domain: `yourdomain.com`

2. **DNS Settings:**
   - Add a CNAME record pointing to your hosting provider
   - Example: `CNAME @ your-hosting.com`

3. **Build for production:**
   ```bash
   cd /app/frontend
   yarn build
   ```

## 🚀 Deployment Options

### GitHub Pages:
1. Push the `/app/frontend` folder to GitHub
2. Enable GitHub Pages in repository settings
3. Add CNAME file with your domain

### Vercel/Netlify:
1. Connect your repository
2. Build command: `yarn build`
3. Publish directory: `build`
4. Add your custom domain in dashboard

### Traditional Hosting:
1. Run `yarn build` in `/app/frontend`
2. Upload the `build` folder contents to your server
3. Configure your domain to point to the server

## 💡 Tips

- **Avatar:** Use square images (512x512px or larger) for best results
- **Bio:** Keep it concise (2-3 lines) for best mobile experience
- **Links:** Order matters - put your most important links first
- **Video:** Keep video file under 10MB for faster loading
- **Colors:** Use hex colors (#RRGGBB) for consistency

## 🆘 Need Help?

- All changes are in: `/app/frontend/src/components/BioLink.js`
- The page auto-reloads when you save changes
- Check browser console for any errors (F12)

---

**Made with ❤️ - Classic gun.lol aesthetic**
