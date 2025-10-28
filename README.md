# ⭐ Google Reviews Widget

Beautiful, customizable Google Reviews widget for your website. Easy to integrate, fully responsive, and production-ready.

## ✨ Features

- 🎨 **Beautiful Design** - Google-style modern interface
- ⚡ **Fast & Lightweight** - Pure JavaScript, no dependencies
- 📱 **Fully Responsive** - Works on all devices
- ⚙️ **Easy Configuration** - Visual admin panel
- 🔄 **Auto GitHub Sync** - Save configs directly to repository
- 🌙 **Dark Mode Support** - Light and dark themes
- 🚀 **Production Ready** - Hosted on Cloudflare Pages

## 🚀 Quick Start

### 1. Embed the Widget

Add this code to your website:

```html
<script src="https://google-reviews.pages.dev/embed.js" data-id="demo"></script>
```

### 2. Customize Your Widget

Visit the admin panel to create your custom configuration:

👉 **https://google-reviews.pages.dev/admin.html**

### 3. Save & Deploy

Click "Save to GitHub" and your widget will be automatically deployed!

## 📖 Configuration

### Basic Example

```json
{
  "widgetTitle": "Italian Restaurant 'Bella Vista'",
  "widgetDescription": "Reviews from our guests",
  "businessInfo": {
    "name": "Italian Restaurant 'Bella Vista'",
    "emoji": "🍕",
    "address": "Václavské nám. 47/47, 110 00",
    "phone": "+420 777 625 450",
    "website": "https://bella-vista-moscow.ru",
    "rating": 4.7,
    "totalReviews": 1847,
    "googleMapsUrl": "https://goo.gl/maps/restaurant-example"
  },
  "maxReviews": 6,
  "reviews": [
    {
      "author": "Alexandra Volkova",
      "rating": 5,
      "date": "1 week ago",
      "text": "Amazing place!",
      "avatar": "https://example.com/avatar.jpg",
      "isLocalGuide": true
    }
  ]
}
```

## 🎨 Customization

### Embed Options

```html
<!-- Default theme -->
<script src="https://google-reviews.pages.dev/embed.js" data-id="your-config-id"></script>

<!-- Dark theme -->
<script src="https://google-reviews.pages.dev/embed.js" data-id="your-config-id" data-theme="dark"></script>
```

### Config Options

| Option | Type | Description |
|--------|------|-------------|
| `widgetTitle` | string | Title displayed at the top |
| `widgetDescription` | string | Subtitle/description text |
| `businessInfo` | object | Business details and contact info |
| `maxReviews` | number | Maximum reviews to display (1-12) |
| `showActions` | boolean | Show "Write Review" buttons |
| `reviews` | array | Array of review objects |

### Review Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | string | ✅ | Reviewer name |
| `rating` | number | ✅ | Rating (1-5) |
| `date` | string | ✅ | Relative date (e.g., "1 week ago") |
| `text` | string | ✅ | Review text |
| `avatar` | string | ❌ | Avatar URL |
| `isLocalGuide` | boolean | ❌ | Show "Local Guide" badge |

## 🛠️ Admin Panel

The admin panel provides a visual interface for:

- ✏️ **Edit Business Info** - Name, address, contact details
- ⭐ **Manage Reviews** - Add, edit, remove reviews
- 🎯 **Live Preview** - See changes in real-time
- 💾 **GitHub Integration** - Save configs automatically
- 📋 **Copy Embed Code** - One-click embed code copy

Access: **https://google-reviews.pages.dev/admin.html**

## 🔧 Setup (For Developers)

### Environment Variables

To enable automatic GitHub saving, configure these variables in Cloudflare Pages:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=TFWidgets/google-rewies
```

#### Get GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `repo` (Full control)
4. Copy the token

#### Add to Cloudflare

1. Dashboard → Workers & Pages → google-reviews
2. Settings → Environment variables
3. Add `GITHUB_TOKEN` and `GITHUB_REPO`
4. Redeploy the project

### API Endpoints

#### Save Config
```javascript
POST /api/save-to-github
Content-Type: application/json

{
  "configId": "my-restaurant",
  "config": { /* configuration object */ }
}
```

#### Get Config
```javascript
GET /api/get-config?id=my-restaurant
```

## 📁 Project Structure

```
google-reviews/
├── admin.html              # Admin panel interface
├── embed.js                # Widget script
├── index.html              # Landing page
├── configs/                # Configuration files
│   └── demo.json           # Demo configuration
└── functions/              # Cloudflare Functions (API)
    └── api/
        ├── save-to-github.js
        └── get-config.js
```

## 🌐 Deployment

This widget is deployed on **Cloudflare Pages** with automatic deployments from GitHub.

### Production URL
```
https://google-reviews.pages.dev/
```

### Custom Domain
You can add your own custom domain in Cloudflare Pages settings.

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use in your projects!

## 🆘 Support

- 📧 **Email**: support@tfwidgets.com
- 💬 **Issues**: [GitHub Issues](https://github.com/TFWidgets/google-rewies/issues)
- 📚 **Documentation**: This README

## 🎯 Examples

### Restaurant
```html
<script src="https://google-reviews.pages.dev/embed.js" data-id="restaurant-demo"></script>
```

### Hotel
```html
<script src="https://google-reviews.pages.dev/embed.js" data-id="hotel-reviews"></script>
```

### Retail Store
```html
<script src="https://google-reviews.pages.dev/embed.js" data-id="store-feedback"></script>
```

---

**Made with ❤️ by TFWidgets**

🌐 Website: [tfwidgets.com](https://tfwidgets.com)  
🐙 GitHub: [@TFWidgets](https://github.com/TFWidgets)
